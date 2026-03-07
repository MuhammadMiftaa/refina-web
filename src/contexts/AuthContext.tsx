import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { parseJwt } from "@/lib/utils";
import { useDemo } from "@/contexts/DemoContext";
import type { JwtPayload } from "@/types/auth";

// ============================================
// TYPES
// ============================================

interface User {
  id: string;
  email: string;
  provider: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "aurify_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDemo, stopDemo } = useDemo();

  const processToken = useCallback((jwt: string | null) => {
    if (!jwt) {
      setUser(null);
      setTokenState(null);
      localStorage.removeItem(TOKEN_KEY);
      return;
    }

    const payload = parseJwt<JwtPayload>(jwt);
    if (!payload) {
      setUser(null);
      setTokenState(null);
      localStorage.removeItem(TOKEN_KEY);
      return;
    }

    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      setUser(null);
      setTokenState(null);
      localStorage.removeItem(TOKEN_KEY);
      return;
    }

    setUser({
      id: payload.id,
      email: payload.email,
      provider: payload.userAuthProvider?.provider ?? "local",
    });
    setTokenState(jwt);
    localStorage.setItem(TOKEN_KEY, jwt);
  }, []);

  // On mount, restore token from localStorage or URL hash (OAuth redirect)
  useEffect(() => {
    // Check URL hash for OAuth token (#aurify_token=xxx)
    const hash = window.location.hash;
    if (hash.includes("aurify_token=")) {
      const params = new URLSearchParams(hash.substring(1));
      const hashToken = params.get("aurify_token");
      if (hashToken) {
        processToken(hashToken);
        // Clean hash from URL
        window.history.replaceState(null, "", window.location.pathname);
        setIsLoading(false);
        return;
      }
    }

    // Restore from localStorage
    const stored = localStorage.getItem(TOKEN_KEY);
    processToken(stored);
    setIsLoading(false);
  }, [processToken]);

  const setToken = useCallback(
    (jwt: string) => {
      processToken(jwt);
    },
    [processToken],
  );

  const logout = useCallback(() => {
    processToken(null);
    if (isDemo) stopDemo();
  }, [processToken, isDemo, stopDemo]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
