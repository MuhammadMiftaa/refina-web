import { useState, useEffect, useCallback, useRef } from "react";
import type {
  TransactionListResponse,
  TransactionListParams,
  Category,
} from "@/types/transaction";
import { getDummyTransactionList, DUMMY_CATEGORIES } from "@/lib/dummy-data";

// TODO: Replace dummy data calls with real API calls when backend is ready
// import { fetchTransactions, fetchCategories, ... } from "@/lib/wallet-transaction-api";
// import { useAuth } from "@/contexts/AuthContext";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useTransactionList(params: TransactionListParams) {
  const [state, setState] = useState<AsyncState<TransactionListResponse>>({
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

    // Simulate API call with dummy data
    setTimeout(() => {
      if (id === fetchRef.current) {
        const result = getDummyTransactionList(paramsRef.current);
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
    refetch,
  ]);

  return { ...state, refetch };
}

export function useCategories() {
  const [state, setState] = useState<AsyncState<Category[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    setTimeout(() => {
      setState({ data: DUMMY_CATEGORIES, loading: false, error: null });
    }, 400);
  }, []);

  return state;
}
