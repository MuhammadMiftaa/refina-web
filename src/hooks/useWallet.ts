import { useState, useEffect, useCallback, useRef } from "react";
import type { Wallet, WalletType, WalletSummary } from "@/types/wallet";
import {
  DUMMY_WALLETS,
  DUMMY_WALLET_TYPES,
  DUMMY_WALLET_SUMMARY,
} from "@/lib/dummy-data";

// TODO: Replace dummy data calls with real API calls when backend is ready
// import { fetchWallets, fetchWalletTypes, fetchWalletSummary, ... } from "@/lib/wallet-transaction-api";
// import { useAuth } from "@/contexts/AuthContext";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useWalletList() {
  const [state, setState] = useState<AsyncState<Wallet[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    // Simulate API call with dummy data
    setTimeout(() => {
      if (id === fetchRef.current) {
        setState({ data: DUMMY_WALLETS, loading: false, error: null });
      }
    }, 600);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

export function useWalletTypes() {
  const [state, setState] = useState<AsyncState<WalletType[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    setTimeout(() => {
      setState({ data: DUMMY_WALLET_TYPES, loading: false, error: null });
    }, 400);
  }, []);

  return state;
}

export function useWalletSummary() {
  const [state, setState] = useState<AsyncState<WalletSummary>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setTimeout(() => {
      setState({ data: DUMMY_WALLET_SUMMARY, loading: false, error: null });
    }, 500);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
