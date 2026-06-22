import { useCallback, useEffect, useRef, useState } from "react";
import type { Video } from "@/data/videos";
import { videos } from "@/data/videos";
import { useVas } from "@/contexts/VasContext";
import {
  checkSubscriptionStatus,
  checkSubscriptionStatusByMsisdn,
  clearPendingVideoId,
  getPendingVideoId,
  hasSubid,
  isSubscribedStatus,
  normalizeSubid,
  parsePhoneToMsisdn,
  redirectToCampaignForVideo,
  storeMsisdn,
} from "@/lib/vas";

/**
 * Thumbnail click → MSISDN popup → status check by msisdn
 * status=1 → play | status=0 → campaign (subid from portal or 0)
 * Portal return with subid → auto-play via subid check
 */
export function useVideoAccess(
  setSelectedVideo: (video: Video | null) => void,
) {
  const { subid, productcode, refreshStatus } = useVas();
  const [pendingVideo, setPendingVideo] = useState<Video | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const returnHandled = useRef(false);

  const verifyByMsisdn = useCallback(
    async (video: Video, msisdn: string) => {
      setAccessError(null);
      setIsChecking(true);
      storeMsisdn(msisdn);

      try {
        const result = await checkSubscriptionStatusByMsisdn(msisdn, productcode);

        if (isSubscribedStatus(result.status)) {
          clearPendingVideoId();
          setPendingVideo(null);
          setSelectedVideo(video);
          await refreshStatus();
        } else {
          redirectToCampaignForVideo(
            "0",
            productcode,
            video.id,
            result.msisdn ?? undefined,
          );
        }
      } catch {
        setAccessError(
          "Impossible de vérifier l'abonnement. Vérifiez votre connexion et réessayez.",
        );
      } finally {
        setIsChecking(false);
      }
    },
    [productcode, setSelectedVideo, refreshStatus],
  );

  const verifyBySubid = useCallback(
    async (video: Video) => {
      setAccessError(null);
      setIsChecking(true);

      const checkSubid = normalizeSubid(subid);
      const campaignSubid = checkSubid || "0";

      try {
        const result = await checkSubscriptionStatus(checkSubid, productcode);

        if (isSubscribedStatus(result.status)) {
          clearPendingVideoId();
          setPendingVideo(null);
          setSelectedVideo(video);
          await refreshStatus();
        } else {
          redirectToCampaignForVideo(campaignSubid, productcode, video.id);
        }
      } catch {
        setAccessError(
          "Impossible de vérifier l'abonnement. Vérifiez votre connexion et réessayez.",
        );
      } finally {
        setIsChecking(false);
      }
    },
    [subid, productcode, setSelectedVideo, refreshStatus],
  );

  // After payment: portal returns ?subid= → auto-play pending video
  useEffect(() => {
    if (returnHandled.current) return;
    if (!hasSubid(subid)) return;

    const pendingId = getPendingVideoId();
    if (!pendingId) return;

    const video = videos.find((v) => v.id === pendingId);
    if (!video) return;

    returnHandled.current = true;
    verifyBySubid(video);
  }, [subid, verifyBySubid]);

  const handleVideoClick = useCallback((video: Video) => {
    setAccessError(null);
    setPendingVideo(video);
  }, []);

  const closePhonePopup = useCallback(() => {
    if (!isChecking) {
      setPendingVideo(null);
      setAccessError(null);
    }
  }, [isChecking]);

  const handlePhoneSubmit = useCallback(
    async (phoneDigits: string) => {
      const video = pendingVideo;
      if (!video) return;

      const msisdn = parsePhoneToMsisdn(phoneDigits);
      if (!msisdn) {
        setAccessError(
          "Veuillez entrer un numéro valide (10 chiffres, ex. 0585695151).",
        );
        return;
      }

      await verifyByMsisdn(video, msisdn);
    },
    [pendingVideo, verifyByMsisdn],
  );

  return {
    handleVideoClick,
    isChecking,
    pendingVideo,
    closePhonePopup,
    handlePhoneSubmit,
    accessError,
  };
}
