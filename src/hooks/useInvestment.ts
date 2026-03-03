import { useState, useEffect, useCallback, useRef } from "react";
import type {
  InvestmentListResponse,
  InvestmentListParams,
  InvestmentSummary,
  AssetCode,
} from "@/types/investment";
import {
  getDummyInvestmentList,
  getDummyInvestmentSummary,
  DUMMY_ASSET_CODES,
} from "@/lib/dummy-data";

// TODO: Replace dummy data calls with real API calls when backend is ready
// import { fetchInvestments, fetchInvestmentSummary, fetchAssetCodes } from "@/lib/investment-api";
// import { useAuth } from "@/contexts/AuthContext";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useInvestmentList(params: InvestmentListParams) {
  const [state, setState] = useState<AsyncState<InvestmentListResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const refetch = useCallback(() => {
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    setTimeout(() => {
      if (id === fetchRef.current) {
        const result = getDummyInvestmentList(paramsRef.current);
        setState({ data: result, loading: false, error: null });
      }
    }, 500);
  }, []);

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
  const [state, setState] = useState<AsyncState<InvestmentSummary>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setTimeout(() => {
      setState({
        data: getDummyInvestmentSummary(),
        loading: false,
        error: null,
      });
    }, 400);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

export function useAssetCodes() {
  const [state, setState] = useState<AsyncState<AssetCode[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    setTimeout(() => {
      setState({ data: DUMMY_ASSET_CODES, loading: false, error: null });
    }, 300);
  }, []);

  return state;
}
