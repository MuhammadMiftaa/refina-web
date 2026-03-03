import type {
  Investment,
  InvestmentSold,
  InvestmentSummary,
  InvestmentListResponse,
  InvestmentListParams,
  CreateInvestmentPayload,
  SellInvestmentPayload,
  AssetCode,
} from "@/types/investment";
import type { ApiResponse, ApiError } from "./api";
import { BFF_BASE_URL } from "./const";

/** Fetch wrapper targeting the BFF */
async function bffCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BFF_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.status === false) {
    const error: ApiError = {
      statusCode: data.statusCode || response.status,
      message: data.message || "Something went wrong",
    };
    throw error;
  }

  return data as ApiResponse<T>;
}

// ════════════════════════════════════════════
// INVESTMENT API
// ════════════════════════════════════════════

/** GET /investments — List investments with pagination */
export async function fetchInvestments(
  token: string,
  params: InvestmentListParams,
) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.sort_by) query.set("sort_by", params.sort_by);
  if (params.sort_order) query.set("sort_order", params.sort_order);
  if (params.search) query.set("search", params.search);
  if (params.code) query.set("code", params.code);

  return bffCall<InvestmentListResponse>(`/investments?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /investments/:id — Single investment detail */
export async function fetchInvestmentById(token: string, id: string) {
  return bffCall<Investment>(`/investments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /investments — Create investment */
export async function createInvestment(
  token: string,
  payload: CreateInvestmentPayload,
) {
  return bffCall<Investment>("/investments", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /investments/:id — Delete investment */
export async function deleteInvestment(token: string, id: string) {
  return bffCall<{ message: string }>(`/investments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /investments/summary — Investment summary stats */
export async function fetchInvestmentSummary(token: string) {
  return bffCall<InvestmentSummary>("/investments/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// INVESTMENT SOLD API
// ════════════════════════════════════════════

/** POST /investments/sell — Sell investment */
export async function sellInvestment(
  token: string,
  payload: SellInvestmentPayload,
) {
  return bffCall<InvestmentSold>("/investments/sell", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** GET /investments/:id/sold — List sold records for an investment */
export async function fetchSoldRecords(token: string, investmentId: string) {
  return bffCall<InvestmentSold[]>(`/investments/${investmentId}/sold`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// ASSET CODE API
// ════════════════════════════════════════════

/** GET /asset-codes — List available asset codes */
export async function fetchAssetCodes(token: string) {
  return bffCall<AssetCode[]>("/asset-codes", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /asset-codes/:code — Single asset code */
export async function fetchAssetCodeByCode(token: string, code: string) {
  return bffCall<AssetCode>(`/asset-codes/${code}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
