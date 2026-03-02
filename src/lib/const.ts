/**
 * Runtime environment configuration
 * Read from window.__ENV__ injected at container startup.
 * Falls back to localhost for local development.
 */
declare global {
  interface Window {
    __ENV__: {
      API_URL: string;
      BFF_URL: string;
    };
  }
}

export {};

const env = typeof window !== "undefined" ? window.__ENV__ : undefined;

export const API_BASE_URL: string =
  env?.API_URL && env.API_URL !== "$API_URL"
    ? env.API_URL
    : import.meta.env.VITE_API_URL || "http://localhost:8080";

export const BFF_BASE_URL: string =
  env?.BFF_URL && env.BFF_URL !== "$BFF_URL"
    ? env.BFF_URL
    : import.meta.env.VITE_BFF_URL || "http://localhost:3001";
