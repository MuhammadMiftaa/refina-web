import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/FormElements";
import { verifyOtpApi } from "@/lib/api";
import type { ApiError } from "@/lib/api";
import toast from "react-hot-toast";

const OTP_LENGTH = 6;

export function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    email?: string;
    flow?: "register" | "forgot-password";
  } | null;
  const email = state?.email ?? "";
  const flow = state?.flow ?? "register";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError("");
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(""));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyOtpApi(email, code);
      toast.success("OTP verified");

      if (flow === "register") {
        navigate("/complete-profile", {
          state: { email, tempToken: res.data.tempToken },
        });
      } else {
        navigate("/set-password", {
          state: { email, tempToken: res.data.tempToken },
        });
      }
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Invalid OTP");
      toast.error(apiErr.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-1 text-center">
        <h2 className="font-heading text-2xl font-semibold text-[var(--foreground)]">
          Verify your email
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-[var(--foreground)]">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* OTP Inputs */}
        <div
          className="flex items-center justify-center gap-2 sm:gap-3"
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`h-12 w-10 rounded-lg border bg-[var(--input)] text-center text-lg font-semibold text-[var(--foreground)] transition-colors sm:h-14 sm:w-12 sm:text-xl
                ${error ? "border-[var(--destructive)]" : "border-[var(--border)]"}
                focus:border-[var(--ring)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-xs text-[var(--destructive)]">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Verify
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          className="font-medium text-[var(--primary)] hover:underline"
          onClick={() => {
            toast.success("Please go back and re-submit your email");
            navigate(-1);
          }}
        >
          Go back
        </button>
      </p>
    </AuthLayout>
  );
}
