import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, User } from "lucide-react";
import Header from "@/components/header";
import AnimatedBackground from "@/components/animated-background";
import PhoneNumberForm from "@/components/phone-number-form";
import { Button } from "@/components/ui/button";
import { useVas } from "@/contexts/VasContext";
import {
  checkSubscriptionStatus,
  checkSubscriptionStatusByMsisdn,
  deactivateSubscription,
  deactivateSubscriptionByMsisdn,
  fetchSubscriptionDetail,
  fetchSubscriptionDetailByMsisdn,
  getStoredMsisdn,
  hasSubid,
  isSubscribedStatus,
  normalizeDetailResponse,
  normalizeSubid,
  parsePhoneToMsisdn,
  redirectToCampaign,
  storeMsisdn,
} from "@/lib/vas";
import type { VasDetailResponse } from "@shared/api";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-primary/10 gap-4">
      <span className="text-foreground/60 font-medium shrink-0">{label}</span>
      <span className="font-bold text-foreground text-right break-all">{value || "—"}</span>
    </div>
  );
}


export default function Account() {
  const { subid, productcode } = useVas();
  const [detail, setDetail] = useState<VasDetailResponse | null>(null);
  const [activeMsisdn, setActiveMsisdn] = useState("");
  const [lookupMode, setLookupMode] = useState<"msisdn" | "subid">("msisdn");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPhoneForm, setShowPhoneForm] = useState(true);

  const checkSubid = normalizeSubid(subid);
  const campaignSubid = checkSubid || "0";
  const subscribed = detail ? isSubscribedStatus(detail.status) : false;

  const loadByMsisdn = useCallback(
    async (msisdn: string) => {
      setLoading(true);
      setError(null);
      setLookupMode("msisdn");
      setActiveMsisdn(msisdn);
      storeMsisdn(msisdn);

      try {
        const status = await checkSubscriptionStatusByMsisdn(msisdn, productcode);

        if (isSubscribedStatus(status.status)) {
          const data = await fetchSubscriptionDetailByMsisdn(msisdn, productcode);
          setDetail(normalizeDetailResponse(data, { msisdn, status: status.status }));
        } else {
          setDetail({
            status: 0,
            msisdn: status.msisdn ?? msisdn,
            valid_from: status.validityfrom,
            valid_to: status.validityto,
          });
        }
        setShowPhoneForm(false);
      } catch {
        setError("Impossible de charger les informations du compte.");
        setDetail(null);
      } finally {
        setLoading(false);
      }
    },
    [productcode],
  );

  const loadBySubid = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLookupMode("subid");

    try {
      const status = await checkSubscriptionStatus(checkSubid, productcode);

      if (isSubscribedStatus(status.status)) {
        const data = await fetchSubscriptionDetail(checkSubid, productcode);
        setDetail(normalizeDetailResponse(data, { status: status.status }));
        if (data.msisdn) {
          setActiveMsisdn(data.msisdn);
          storeMsisdn(data.msisdn);
        }
      } else {
        setDetail({
          status: 0,
          msisdn: status.msisdn ?? undefined,
          valid_from: status.validityfrom,
          valid_to: status.validityto,
        });
        if (status.msisdn) {
          setActiveMsisdn(status.msisdn);
          storeMsisdn(status.msisdn);
        }
      }
      setShowPhoneForm(false);
    } catch {
      setError("Impossible de charger les informations du compte.");
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [checkSubid, productcode]);

  useEffect(() => {
    if (hasSubid(checkSubid)) {
      loadBySubid();
      return;
    }

    const stored = getStoredMsisdn();
    if (stored) {
      loadByMsisdn(stored);
    }
  }, [checkSubid, loadBySubid, loadByMsisdn]);

  const handlePhoneSubmit = useCallback(
    async (phoneDigits: string) => {
      const msisdn = parsePhoneToMsisdn(phoneDigits);
      if (!msisdn) {
        setError("Veuillez entrer un numéro valide (10 chiffres, ex. 0585695151).");
        return;
      }
      await loadByMsisdn(msisdn);
    },
    [loadByMsisdn],
  );

  const handleRefresh = useCallback(() => {
    if (lookupMode === "subid" && hasSubid(checkSubid)) {
      loadBySubid();
    } else if (activeMsisdn) {
      loadByMsisdn(activeMsisdn);
    } else {
      setShowPhoneForm(true);
    }
  }, [lookupMode, checkSubid, activeMsisdn, loadBySubid, loadByMsisdn]);

  const handleSubscribe = () => {
    redirectToCampaign(campaignSubid, productcode, activeMsisdn || undefined);
  };

  const handleUnsubscribe = async () => {
    setActionLoading(true);
    setError(null);
    try {
      if (lookupMode === "subid" && hasSubid(checkSubid)) {
        await deactivateSubscription(campaignSubid, productcode);
      } else if (activeMsisdn) {
        await deactivateSubscriptionByMsisdn(activeMsisdn, productcode);
      }
      await handleRefresh();
    } catch {
      setError("La désinscription a échoué. Veuillez réessayer.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/60 to-pink-50/50 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-foreground mb-3">Mon compte</h1>
            <p className="text-foreground/60 font-medium">Éducation vidéo pour enfants</p>
          </div>

          <div className="rounded-3xl glass-card border-2 border-primary/20 p-6 sm:p-8 shadow-lg">
            {(showPhoneForm || !detail) && !loading && (
              <div className="mb-8">
                <PhoneNumberForm
                  onSubmit={handlePhoneSubmit}
                  isLoading={loading}
                  error={error}
                  submitLabel="Vérifier le compte"
                  title="Entrez votre numéro"
                  description="Saisissez votre numéro (+225) pour voir les détails de votre abonnement"
                />
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-foreground/60 font-medium">Chargement...</p>
              </div>
            ) : error && !showPhoneForm ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-destructive font-medium">{error}</p>
                <Button variant="outline" onClick={handleRefresh} className="rounded-full font-bold">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            ) : detail ? (
              <div className="space-y-6">
                <div className="grid gap-0">
                  <DetailRow label="Service" value={detail.service_name ?? ""} />
                  <DetailRow label="Numéro" value={detail.msisdn ?? activeMsisdn} />
                  <DetailRow label="Valide du" value={detail.valid_from ?? ""} />
                  <DetailRow label="Valide jusqu'au" value={detail.valid_to ?? ""} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  {subscribed ? (
                    <Button
                      variant="destructive"
                      onClick={handleUnsubscribe}
                      disabled={actionLoading}
                      className="rounded-full font-bold px-8"
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Désinscription...
                        </>
                      ) : (
                        "Se désabonner"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubscribe}
                      className="rounded-full font-bold px-8 bg-gradient-to-r from-primary to-secondary"
                    >
                      S'abonner
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={loading || actionLoading}
                    className="rounded-full font-bold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
