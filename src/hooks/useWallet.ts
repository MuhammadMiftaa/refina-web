import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Wallet, WalletType, WalletSummary } from "@/types/wallet";
import {
  fetchWallets,
  fetchWalletTypes,
  fetchWalletSummary,
} from "@/lib/wallet-transaction-api";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useWalletList() {
  const { token } = useAuth();
  const [state, setState] = useState<AsyncState<Wallet[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    if (!token) return;
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWallets(token)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (id === fetchRef.current) {
          setState({ data: null, loading: false, error: err.message });
        }
      });
  }, [token]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

export function useWalletTypes() {
  const { token } = useAuth();
  const [state, setState] = useState<AsyncState<WalletType[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!token) return;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWalletTypes(token)
      .then((res) => {
        setState({ data: res.data, loading: false, error: null });
      })
      .catch((err) => {
        setState({ data: null, loading: false, error: err.message });
      });
  }, [token]);

  return state;
}

export function useWalletSummary() {
  const { token } = useAuth();
  const [state, setState] = useState<AsyncState<WalletSummary>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(() => {
    if (!token) return;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWalletSummary(token)
      .then((res) => {
        setState({ data: res.data, loading: false, error: null });
      })
      .catch((err) => {
        setState({ data: null, loading: false, error: err.message });
      });
  }, [token]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
