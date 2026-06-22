/**
 * Shared types for VAS APIs
 */

export interface DemoResponse {
  message: string;
}

/** GET /adpoke/cnt/sub/status */
export interface VasStatusResponse {
  status: 0 | 1 | "0" | "1";
  msisdn?: string | null;
  validityfrom?: string;
  validityto?: string;
}

/** GET /adpoke/cnt/sub/detail */
export interface VasDetailResponse {
  msisdn?: string;
  valid_from?: string;
  valid_to?: string;
  status: 0 | 1 | "0" | "1";
  service_name?: string;
}

/** GET /adpoke/cnt/dct */
export interface VasDeactivateResponse {
  status?: 0 | 1 | "0" | "1";
  message?: string;
}
