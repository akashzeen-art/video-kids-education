import type { VasDeactivateResponse, VasDetailResponse, VasStatusResponse } from "@shared/api";

const SUBID_KEY = "vas_subid";
const MSISDN_KEY = "vas_msisdn";
const PRODUCTCODE_KEY = "vas_productcode";
const PENDING_VIDEO_KEY = "vas_pending_video_id";

export const VAS_PRODUCT_CODE =
  import.meta.env.VITE_VAS_PRODUCT_CODE ?? "AMVKE";

export const VAS_CAMPAIGN_URL =
  import.meta.env.VITE_VAS_CAMPAIGN_URL ??
  "http://68.183.88.91/adpoke/cnt/act";

export function normalizeSubid(value: string | null | undefined): string {
  if (!value || value.trim() === "" || value === "0") return "0";
  return value.trim();
}

export function hasSubid(subid: string): boolean {
  return normalizeSubid(subid) !== "0";
}

export function getStoredMsisdn(): string {
  return sessionStorage.getItem(MSISDN_KEY) ?? localStorage.getItem(MSISDN_KEY) ?? "";
}

export function storeMsisdn(msisdn: string) {
  if (!msisdn) return;
  sessionStorage.setItem(MSISDN_KEY, msisdn);
  localStorage.setItem(MSISDN_KEY, msisdn);
}

/** Parse input → local 10 digits (0585695151) or null */
export function parseLocalPhoneDigits(input: string): string | null {
  const cleaned = input.replace(/\D/g, "");
  if (!cleaned) return null;

  let local: string;
  if (cleaned.startsWith("225")) {
    local = cleaned.slice(3);
  } else {
    local = cleaned;
  }

  if (local.length !== 10 || !local.startsWith("0")) return null;
  return local;
}

/** Parse phone input → MSISDN (2250585695151) or null */
export function parsePhoneToMsisdn(input: string): string | null {
  const local = parseLocalPhoneDigits(input);
  if (!local) return null;
  return `225${local}`;
}

/** +225: 0585695151 → 2250585695151 */
export function formatMsisdn(digits: string): string {
  return parsePhoneToMsisdn(digits) ?? "";
}

export function getStoredSubid(): string {
  return normalizeSubid(
    sessionStorage.getItem(SUBID_KEY) ?? localStorage.getItem(SUBID_KEY),
  );
}

export function getStoredProductcode(): string {
  return (
    sessionStorage.getItem(PRODUCTCODE_KEY) ??
    localStorage.getItem(PRODUCTCODE_KEY) ??
    VAS_PRODUCT_CODE
  );
}

export function storeVasParams(subid: string, productcode: string) {
  const cleanSubid = normalizeSubid(subid);
  sessionStorage.setItem(SUBID_KEY, cleanSubid);
  localStorage.setItem(SUBID_KEY, cleanSubid);
  const code = productcode || VAS_PRODUCT_CODE;
  sessionStorage.setItem(PRODUCTCODE_KEY, code);
  localStorage.setItem(PRODUCTCODE_KEY, code);
}

/** Portal: ?subid={subid}&productcode={productcode} */
export function initVasParamsFromUrl(): { subid: string; productcode: string } {
  const params = new URLSearchParams(window.location.search);
  const subid = normalizeSubid(params.get("subid") ?? getStoredSubid());
  const productcode = params.get("productcode") ?? getStoredProductcode();
  storeVasParams(subid, productcode);
  return { subid, productcode };
}

/** status "1" or 1 = subscribed, status "0" or 0 = not subscribed */
export function isSubscribedStatus(
  status: VasStatusResponse["status"] | VasDetailResponse["status"] | string | number | undefined | null,
): boolean {
  return status === 1 || status === "1";
}

export function normalizeStatusResponse(
  data: VasStatusResponse | null | undefined,
): VasStatusResponse {
  if (!data || data.status === undefined || data.status === null) {
    return { status: 0 };
  }
  return data;
}

export function normalizeDetailResponse(
  data: VasDetailResponse | null | undefined,
  fallback?: { msisdn?: string; status?: VasDetailResponse["status"] },
): VasDetailResponse {
  if (!data || typeof data !== "object") {
    return {
      status: fallback?.status ?? 0,
      msisdn: fallback?.msisdn,
    };
  }
  if (data.status === undefined || data.status === null) {
    return { ...data, status: fallback?.status ?? 0 };
  }
  return data;
}

async function parseVasJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text || text.trim() === "" || text.trim() === "null") {
    return { status: 0 } as T;
  }
  const data = JSON.parse(text) as T | null;
  if (data === null || typeof data !== "object") {
    return { status: 0 } as T;
  }
  return data;
}

function apiParams(subid: string, productcode: string) {
  return new URLSearchParams({
    subid: normalizeSubid(subid),
    productcode: productcode || VAS_PRODUCT_CODE,
  });
}

/** GET /adpoke/cnt/sub/status?subid=&productcode= */
export async function checkSubscriptionStatus(
  subid: string,
  productcode: string,
): Promise<VasStatusResponse> {
  const response = await fetch(`/api/vas/status?${apiParams(subid, productcode)}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Status check failed");
  return normalizeStatusResponse(await parseVasJson<VasStatusResponse>(response));
}

/** GET /adpoke/cnt/sub/status?msisdn=&productcode= */
export async function checkSubscriptionStatusByMsisdn(
  msisdn: string,
  productcode: string,
): Promise<VasStatusResponse> {
  const params = new URLSearchParams({
    msisdn,
    productcode: productcode || VAS_PRODUCT_CODE,
  });
  const response = await fetch(`/api/vas/status?${params}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Status check failed");
  return normalizeStatusResponse(await parseVasJson<VasStatusResponse>(response));
}

/** GET /adpoke/cnt/sub/detail?subid=&productcode= */
export async function fetchSubscriptionDetail(
  subid: string,
  productcode: string,
): Promise<VasDetailResponse> {
  const response = await fetch(`/api/vas/detail?${apiParams(subid, productcode)}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Detail fetch failed");
  return normalizeDetailResponse(await parseVasJson<VasDetailResponse>(response));
}

/** GET /adpoke/cnt/sub/detail?msisdn=&productcode= */
export async function fetchSubscriptionDetailByMsisdn(
  msisdn: string,
  productcode: string,
): Promise<VasDetailResponse> {
  const params = new URLSearchParams({
    msisdn,
    productcode: productcode || VAS_PRODUCT_CODE,
  });
  const response = await fetch(`/api/vas/detail?${params}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Detail fetch failed");
  return normalizeDetailResponse(await parseVasJson<VasDetailResponse>(response), {
    msisdn,
  });
}

/** GET /adpoke/cnt/dct?subid=&productcode= */
export async function deactivateSubscription(
  subid: string,
  productcode: string,
): Promise<VasDeactivateResponse> {
  const response = await fetch(`/api/vas/deactivate?${apiParams(subid, productcode)}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Deactivation failed");
  return response.json();
}

/** GET /adpoke/cnt/dct?msisdn=&productcode= */
export async function deactivateSubscriptionByMsisdn(
  msisdn: string,
  productcode: string,
): Promise<VasDeactivateResponse> {
  const params = new URLSearchParams({
    msisdn,
    productcode: productcode || VAS_PRODUCT_CODE,
  });
  const response = await fetch(`/api/vas/deactivate?${params}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Deactivation failed");
  return response.json();
}

/** Ivory Coast mobile: 225 + 10 digits starting with 05 or 07 */
export function isValidCampaignMsisdn(msisdn: string): boolean {
  if (!msisdn.startsWith("225")) return false;
  const local = msisdn.slice(3);
  return local.length === 10 && local.startsWith("0");
}

/** Campaign: portal subid OR subid=0 + valid msisdn (never both) */
export function getCampaignUrl(
  subid: string,
  productcode: string,
  msisdn?: string | null,
): string {
  const url = new URL(VAS_CAMPAIGN_URL);
  url.searchParams.set("productcode", productcode || VAS_PRODUCT_CODE);
  const cleanSubid = normalizeSubid(subid);

  if (hasSubid(cleanSubid)) {
    url.searchParams.set("subid", cleanSubid);
    return url.toString();
  }

  url.searchParams.set("subid", "0");
  if (msisdn && isValidCampaignMsisdn(msisdn)) {
    url.searchParams.set("msisdn", msisdn);
  }
  return url.toString();
}

export function redirectToCampaign(
  subid: string,
  productcode: string,
  msisdn?: string | null,
) {
  window.location.href = getCampaignUrl(subid, productcode, msisdn);
}

/** status=0 → campaign per operator spec */
export function redirectToCampaignFromStatus(
  status: VasStatusResponse,
  subid: string,
  productcode: string,
) {
  const cleanSubid = normalizeSubid(subid);

  if (hasSubid(cleanSubid)) {
    redirectToCampaign(cleanSubid, productcode);
    return;
  }

  const msisdn =
    status.msisdn && isValidCampaignMsisdn(status.msisdn)
      ? status.msisdn
      : undefined;
  redirectToCampaign("0", productcode, msisdn);
}

export function storePendingVideoId(id: number) {
  sessionStorage.setItem(PENDING_VIDEO_KEY, String(id));
}

export function getPendingVideoId(): number | null {
  const value = sessionStorage.getItem(PENDING_VIDEO_KEY);
  return value ? Number(value) : null;
}

export function clearPendingVideoId() {
  sessionStorage.removeItem(PENDING_VIDEO_KEY);
}

/** Save video id then redirect to campaign (not subscribed) */
export function redirectToCampaignForVideo(
  subid: string,
  productcode: string,
  videoId: number,
  msisdn?: string | null,
) {
  storePendingVideoId(videoId);
  if (msisdn && isValidCampaignMsisdn(msisdn)) storeMsisdn(msisdn);
  redirectToCampaign(subid, productcode, msisdn);
}
