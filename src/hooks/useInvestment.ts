import { useState, useEffect, useCallback, useRef } from "react";
import type {
  InvestmentListResponse,
  InvestmentListParams,
  InvestmentSummary,
  AssetCode,
} from "@/types/investment";
import {
  fetchInvestments,
  fetchInvestmentSummary,
  fetchAssetCodes,
} from "@/lib/investment-api";
import { useAuth } from "@/contexts/AuthContext";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useInvestmentList(params: InvestmentListParams) {
  const { token } = useAuth();
  const [state, setState] = useState<AsyncState<InvestmentListResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const refetch = useCallback(async () => {
    if (!token) return;

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const result = await fetchInvestments(token, paramsRef.current);
      if (id === fetchRef.current) {
        setState({
          data: result.data as InvestmentListResponse,
          loading: false,
          error: null,
        });
      }
    } catch (err: unknown) {
      if (id === fetchRef.current) {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Failed to fetch investments";
        setState({ data: null, loading: false, error: message });
      }
    }
  }, [token]);

  useEffect(() => {
    refetch();
  }, [
    params.page,
    params.page_size,
    params.sort_by,
    params.sort_order,
    params.search,
    params.code,
    refetch,
  ]);

  return { ...state, refetch };
}

export function useInvestmentSummary() {
  const { token } = useAuth();
  const [state, setState] = useState<AsyncState<InvestmentSummary>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!token) return;

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const result = await fetchInvestmentSummary(token);
      setState({
        data: result.data as InvestmentSummary,
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Failed to fetch investment summary";
      setState({ data: null, loading: false, error: message });
    }
  }, [token]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

export function useAssetCodes() {
  const { token } = useAuth();
  const [state, setState] = useState<AsyncState<AssetCode[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const result = await fetchAssetCodes(token);
        const data = result.data as { asset_codes: AssetCode[] };
        setState({
          data: data.asset_codes ?? [],
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Failed to fetch asset codes";
        setState({ data: null, loading: false, error: message });
      }
    })();
  }, [token]);

  return state;
}
