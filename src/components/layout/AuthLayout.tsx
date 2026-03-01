import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ui/FormElements";

/**
 * Auth layout — centered card with branding.
 * Logo placeholder uses a gold "A" monogram.
 */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:py-12">
      {/* Subtle radial glow behind card */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(218,165,32,0.06)_0%,transparent_70%)]" />
      </div>

      {/* Theme toggle — top-right */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          {/* 
            ── Logo placeholder ──
            Replace the div below with an <img> tag pointing to your Aurify logo.
            Recommended size: 48×48 or 56×56.
          */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-btn shadow-lg">
            <span className="font-heading text-2xl font-bold text-dark">A</span>
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-gold-gradient sm:text-4xl">
            Aurify
          </h1>
        </div>

        {/* Content card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl sm:p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} Aurify. All rights reserved.
        </p>
      </div>
    </div>
  );
}
