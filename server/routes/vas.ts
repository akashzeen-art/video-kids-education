import { RequestHandler } from "express";
import {
  VasDeactivateResponse,
  VasDetailResponse,
  VasStatusResponse,
} from "@shared/api";

const VAS_BASE_URL =
  process.env.VAS_API_BASE_URL ?? "http://68.183.88.91/adpoke/cnt";

const PRODUCT_CODE = process.env.VAS_PRODUCT_CODE ?? "AMVKE";

function queryParam(req: { query: Record<string, unknown> }, key: string, fallback = ""): string {
  const value = req.query[key];
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

async function callVasApi<T>(
  path: string,
  productcode: string,
  options: { subid?: string; msisdn?: string },
): Promise<T> {
  const url = new URL(`${VAS_BASE_URL}${path}`);
  url.searchParams.set("productcode", productcode || PRODUCT_CODE);
  if (options.msisdn) {
    url.searchParams.set("msisdn", options.msisdn);
  } else {
    url.searchParams.set("subid", options.subid || "0");
  }

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`VAS API ${path} failed: ${response.status}`);
  }

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

/** Status: GET /adpoke/cnt/sub/status?subid=&productcode= OR ?msisdn=&productcode= */
export const handleVasStatus: RequestHandler = async (req, res) => {
  try {
    const subid = queryParam(req, "subid", "0");
    const msisdn = queryParam(req, "msisdn");
    const productcode = queryParam(req, "productcode", PRODUCT_CODE);

    const data = await callVasApi<VasStatusResponse>("/sub/status", productcode, {
      subid,
      msisdn: msisdn || undefined,
    });
    res.json(data);
  } catch (error) {
    console.error("VAS status error:", error);
    res.status(502).json({ error: "Failed to check subscription status" });
  }
};

/** Detail: GET /adpoke/cnt/sub/detail?subid=&productcode= OR ?msisdn=&productcode= */
export const handleVasDetail: RequestHandler = async (req, res) => {
  try {
    const subid = queryParam(req, "subid", "0");
    const msisdn = queryParam(req, "msisdn");
    const productcode = queryParam(req, "productcode", PRODUCT_CODE);

    const data = await callVasApi<VasDetailResponse>("/sub/detail", productcode, {
      subid,
      msisdn: msisdn || undefined,
    });
    res.json(data);
  } catch (error) {
    console.error("VAS detail error:", error);
    res.status(502).json({ error: "Failed to fetch subscription details" });
  }
};

/** Deactivate: GET /adpoke/cnt/dct?subid=&productcode= OR ?msisdn=&productcode= */
export const handleVasDeactivate: RequestHandler = async (req, res) => {
  try {
    const subid = queryParam(req, "subid", "0");
    const msisdn = queryParam(req, "msisdn");
    const productcode = queryParam(req, "productcode", PRODUCT_CODE);

    const data = await callVasApi<VasDeactivateResponse>("/dct", productcode, {
      subid,
      msisdn: msisdn || undefined,
    });
    res.json(data);
  } catch (error) {
    console.error("VAS deactivate error:", error);
    res.status(502).json({ error: "Failed to deactivate subscription" });
  }
};
