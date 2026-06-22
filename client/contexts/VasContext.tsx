import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import {
  checkSubscriptionStatus,
  getStoredProductcode,
  hasSubid,
  initVasParamsFromUrl,
  isSubscribedStatus,
  normalizeSubid,
  redirectToCampaignFromStatus,
  storeMsisdn,
  storeVasParams,
} from "@/lib/vas";

interface VasContextValue {
  subid: string;
  productcode: string;
  isSubscribed: boolean | null;
  isCheckingStatus: boolean;
  refreshStatus: () => Promise<boolean>;
  updateParams: (subid: string, productcode?: string) => void;
}

const VasContext = createContext<VasContextValue | null>(null);

export function VasProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [subid, setSubid] = useState("0");
  const [productcode, setProductcode] = useState(getStoredProductcode());
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Portal URL params: ?subid=&productcode=
  useEffect(() => {
    const params = initVasParamsFromUrl();
    setSubid(params.subid);
    setProductcode(params.productcode);
  }, [location.search]);

  const refreshStatus = useCallback(async (): Promise<boolean> => {
    const checkSubid = normalizeSubid(subid);
    const code = productcode || getStoredProductcode();
    setIsCheckingStatus(true);
    try {
      const result = await checkSubscriptionStatus(checkSubid, code);
      const active = isSubscribedStatus(result.status);
      setIsSubscribed(active);

      if (result.msisdn) storeMsisdn(result.msisdn);

      // status=0 → campaign with msisdn from status API (portal subid or msisdn in response)
      if (
        !active &&
        location.pathname !== "/account" &&
        (hasSubid(checkSubid) || result.msisdn)
      ) {
        redirectToCampaignFromStatus(result, checkSubid, code);
      }

      return active;
    } catch {
      setIsSubscribed(null);
      return false;
    } finally {
      setIsCheckingStatus(false);
    }
  }, [subid, productcode, location.pathname]);

  // Status check on every content page load (when subid/productcode change)
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const updateParams = useCallback(
    (newSubid: string, newProductcode?: string) => {
      const code = newProductcode ?? productcode;
      storeVasParams(newSubid, code);
      setSubid(normalizeSubid(newSubid));
      if (newProductcode) setProductcode(newProductcode);
    },
    [productcode],
  );

  const value = useMemo(
    () => ({
      subid,
      productcode,
      isSubscribed,
      isCheckingStatus,
      refreshStatus,
      updateParams,
    }),
    [subid, productcode, isSubscribed, isCheckingStatus, refreshStatus, updateParams],
  );

  return <VasContext.Provider value={value}>{children}</VasContext.Provider>;
}

export function useVas() {
  const context = useContext(VasContext);
  if (!context) {
    throw new Error("useVas must be used within VasProvider");
  }
  return context;
}
