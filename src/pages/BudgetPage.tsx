import { useState, useMemo } from "react";
import { Sun, Moon, Plus, RotateCcw, Trash2, Flame, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { getDummyBudgets, type BudgetItem } from "@/lib/dummy-data";
import toast from "react-hot-toast";

// ════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtShort(n: number): string {
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `Rp${(n / 1_000).toFixed(0)}K`;
  return `Rp${n.toLocaleString("id-ID")}`;
}

function getMonthLabel(period: string): string {
  const [year, month] = period.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// ════════════════════════════════════════════
// CUSTOM GREEN FIRE SVG
// ════════════════════════════════════════════

function GreenFire({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 2C12 2 4.5 10 4.5 14.5C4.5 18.64 7.86 22 12 22C16.14 22 19.5 18.64 19.5 14.5C19.5 10 12 2 12 2Z"
        fill="url(#greenFireGrad1)"
        opacity="0.8"
      />
      <path
        d="M12 6C12 6 7.5 12 7.5 15C7.5 17.49 9.51 19.5 12 19.5C14.49 19.5 16.5 17.49 16.5 15C16.5 12 12 6 12 6Z"
        fill="url(#greenFireGrad2)"
      />
      <path
        d="M12 10C12 10 9.5 13.5 9.5 15.5C9.5 16.88 10.62 18 12 18C13.38 18 14.5 16.88 14.5 15.5C14.5 13.5 12 10 12 10Z"
        fill="url(#greenFireGrad3)"
      />
      <defs>
        <linearGradient id="greenFireGrad1" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ade80" stopOpacity="0.6" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="greenFireGrad2" x1="12" y1="6" x2="12" y2="19.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#86efac" />
          <stop offset="1" stopColor="#4ade80" />
        </linearGradient>
        <linearGradient id="greenFireGrad3" x1="12" y1="10" x2="12" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#bbf7d0" />
          <stop offset="1" stopColor="#86efac" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ════════════════════════════════════════════
// DEMO MODAL
// ════════════════════════════════════════════

function DemoModal({
  open,
  title,
  onClose,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-(--border) bg-(--card)"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            "0 0 40px rgba(218,165,32,0.1), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between border-b border-(--border) px-5 py-3">
          <h3 className="text-sm font-bold text-(--foreground)">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-(--muted-foreground) transition hover:text-(--foreground)"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <div className="text-center py-4">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-xl">
              🔒
            </div>
            <div className="text-sm font-semibold text-(--foreground) mb-1">
              Demo Mode
            </div>
            <div className="text-xs text-(--muted-foreground) mb-4">
              This action is not available in demo mode. Data is read-only.
            </div>
            <button
              onClick={onClose}
              className="rounded-lg bg-gold-btn px-6 py-2 text-sm font-semibold text-dark transition hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// PROGRESS BAR
// ════════════════════════════════════════════

function BudgetProgressBar({
  spent,
  limit,
  overBudget,
  height = "h-2.5",
}: {
  spent: number;
  limit: number;
  overBudget: boolean;
  height?: string;
}) {
  const pct = Math.min((spent / limit) * 100, 100);

  return (
    <div className={cn("relative overflow-hidden rounded-full bg-(--muted)", height)}>
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: overBudget
            ? "linear-gradient(90deg, #f43f5e, #ef4444)"
            : pct > 90
              ? "linear-gradient(90deg, #daa520, #f59e0b)"
              : "linear-gradient(90deg, #daa520, #ffd700)",
        }}
      />
    </div>
  );
}

// ════════════════════════════════════════════
// STREAK PANEL (Right side, larger)
// ════════════════════════════════════════════

function StreakPanel({ budget }: { budget: BudgetItem }) {
  if (!budget.streak_active || budget.streak_count === 0) {
    return (
      <div className="rounded-xl border border-(--border) bg-(--card) p-5 flex flex-col items-center justify-center text-center h-full min-h-[180px]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--muted) text-2xl mb-3">
          💤
        </div>
        <div className="text-xs font-semibold text-(--muted-foreground) mb-1">
          No active streak
        </div>
        <div className="text-[10px] text-(--muted-foreground) max-w-[200px]">
          Stay under budget this month to start building your streak!
        </div>
      </div>
    );
  }

  return (
    <div className="streak-active rounded-xl border-2 bg-(--card) p-5 relative overflow-hidden flex flex-col items-center justify-center text-center h-full min-h-[180px]">
      {/* Subtle green background glow */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(134,239,172,1) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Custom green fire icon */}
        <div className="mb-2 streak-fire-icon">
          <GreenFire size={48} />
        </div>

        {/* Streak count */}
        <div className="font-mono text-4xl font-bold text-emerald-400 mb-1">
          {budget.streak_count}
        </div>
        <div className="text-sm font-semibold text-emerald-400/80 mb-2">
          {budget.streak_count === 1 ? "month" : "months"} streak!
        </div>

        {/* On Track badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 mb-2">
          <Flame size={12} className="text-emerald-400" />
          <span className="text-[11px] font-semibold text-emerald-400">
            On Track
          </span>
        </div>

        <div className="text-[10px] text-(--muted-foreground) max-w-[200px]">
          Under budget for {budget.streak_count} consecutive months. Keep going! 🎯
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// BUDGET CATEGORY CARD
// ════════════════════════════════════════════

function BudgetCategoryCard({ budget }: { budget: BudgetItem }) {
  const spent = budget.current_spent;
  const limit = budget.monthly_limit;
  const remaining = limit - spent;
  const overBudget = spent > limit;
  const pct = (spent / limit) * 100;

  return (
    <div
      className={cn(
        "rounded-xl border bg-(--card) p-4 transition hover:border-gold-400/20",
        overBudget ? "border-rose-500/30" : "border-(--border)",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-semibold text-(--foreground)">
            {budget.category_name}
          </div>
          <div className="text-[10px] text-(--muted-foreground)">
            {budget.wallet_scope === "all"
              ? "All Wallets"
              : budget.wallet_name}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {budget.streak_count > 0 && budget.streak_active && (
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <Flame size={10} /> {budget.streak_count}
            </span>
          )}
          {overBudget && (
            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500">
              Over Budget
            </span>
          )}
        </div>
      </div>

      <BudgetProgressBar spent={spent} limit={limit} overBudget={overBudget} />

      <div className="mt-2 flex items-center justify-between">
        <div className="text-[10px] text-(--muted-foreground)">
          <span
            className={cn(
              "font-mono font-semibold",
              overBudget ? "text-rose-500" : "text-(--foreground)",
            )}
          >
            {fmtShort(spent)}
          </span>{" "}
          / {fmtShort(limit)}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] font-semibold",
              overBudget ? "text-rose-500" : "text-(--muted-foreground)",
            )}
          >
            {pct.toFixed(0)}%
          </span>
          <span
            className={cn(
              "text-[10px]",
              overBudget ? "text-rose-400" : "text-emerald-400",
            )}
          >
            {overBudget
              ? `${fmtShort(Math.abs(remaining))} over`
              : `${fmtShort(remaining)} left`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function BudgetPage() {
  const { theme, toggleTheme } = useTheme();

  // Month selector (demo: only March 2026)
  const [selectedPeriod] = useState("2026-03");

  // Demo modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const budgets = useMemo(() => getDummyBudgets(), []);

  const overallBudget = budgets.find((b) => b.scope === "overall");
  const categoryBudgets = budgets.filter((b) => b.scope === "category");

  const openDemoModal = (title: string) => {
    setModalTitle(title);
    setModalOpen(true);
  };

  const demoSubmit = () => {
    toast("Demo mode — data is read-only", { icon: "🔒" });
  };

  return (
    <MainLayout>
      {/* Demo Modal */}
      <DemoModal
        open={modalOpen}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
      />

      {/* ════════ HEADER ════════ */}
      <header className="sticky top-0 z-40 flex flex-col gap-3 border-b border-(--border) bg-(--card) px-4 py-3 sm:px-6 sm:py-3.5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between sm:inline">
          <div>
            <div className="text-sm font-bold tracking-wide text-(--foreground)">
              Budget
            </div>
            <div className="text-[10px] text-(--muted-foreground)">
              Monthly spending goals & streak tracking
            </div>
          </div>
          <button
            onClick={toggleTheme}
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            className="flex sm:hidden h-8 w-8 items-center justify-center rounded-lg border border-(--border) text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-[10px] uppercase tracking-widest text-(--muted-foreground) sm:inline">
            Period
          </span>
          <div className="rounded-lg border border-(--border) bg-(--input) px-3 py-1.5 text-xs font-medium text-(--foreground)">
            {getMonthLabel(selectedPeriod)}
          </div>

          <button
            onClick={toggleTheme}
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border border-(--border) text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* ════════ CONTENT ════════ */}
      <main className="mx-auto flex max-w-350 flex-col gap-4 p-3 sm:p-5">
        {/* ── Overall Budget + Streak (7:3 layout) ── */}
        {overallBudget && (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
            {/* Left: Overall Budget Card (7/10) */}
            <div className="lg:col-span-7 rounded-xl border border-(--border) bg-(--card) p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div>
                  <div className="text-[13px] font-bold tracking-wide text-(--foreground)">
                    Overall Monthly Budget
                  </div>
                  <div className="text-[10px] text-(--muted-foreground)">
                    {getMonthLabel(overallBudget.period)} · All Wallets
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openDemoModal("Set Budget")}
                    className="flex items-center gap-1 rounded-lg border border-(--border) px-2.5 py-1.5 text-[11px] font-medium text-(--muted-foreground) transition hover:text-(--foreground) hover:border-(--ring)"
                  >
                    <Plus size={12} /> Set Budget
                  </button>
                  <button
                    onClick={() => openDemoModal("Reset Budget")}
                    className="flex items-center gap-1 rounded-lg border border-(--border) px-2.5 py-1.5 text-[11px] font-medium text-(--muted-foreground) transition hover:text-(--foreground) hover:border-(--ring)"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                  <button
                    onClick={() => openDemoModal("Delete Budget")}
                    className="flex items-center gap-1 rounded-lg border border-rose-500/30 px-2.5 py-1.5 text-[11px] font-medium text-rose-400/80 transition hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {/* Big number */}
              <div className="flex flex-wrap items-end gap-3 mb-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
                    Spent
                  </div>
                  <div
                    className={cn(
                      "font-mono text-xl sm:text-2xl font-bold",
                      overallBudget.current_spent > overallBudget.monthly_limit
                        ? "text-rose-500"
                        : "text-(--foreground)",
                    )}
                  >
                    {fmtCurrency(overallBudget.current_spent)}
                  </div>
                </div>
                <div className="text-[11px] text-(--muted-foreground) pb-1">
                  of {fmtCurrency(overallBudget.monthly_limit)}
                </div>
                <div className="ml-auto text-right pb-1">
                  <span
                    className={cn(
                      "font-mono text-lg font-bold",
                      overallBudget.current_spent > overallBudget.monthly_limit
                        ? "text-rose-500"
                        : overallBudget.current_spent / overallBudget.monthly_limit > 0.9
                          ? "text-amber-400"
                          : "text-emerald-400",
                    )}
                  >
                    {((overallBudget.current_spent / overallBudget.monthly_limit) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <BudgetProgressBar
                spent={overallBudget.current_spent}
                limit={overallBudget.monthly_limit}
                overBudget={overallBudget.current_spent > overallBudget.monthly_limit}
                height="h-3"
              />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-(--muted-foreground)">
                  {fmtCurrency(
                    Math.max(
                      0,
                      overallBudget.monthly_limit - overallBudget.current_spent,
                    ),
                  )}{" "}
                  remaining
                </span>
                <span className="text-[11px] text-(--muted-foreground)">
                  ~{fmtShort(Math.max(0, Math.round((overallBudget.monthly_limit - overallBudget.current_spent) / 30)))}/day left
                </span>
              </div>
            </div>

            {/* Right: Streak Panel (3/10) */}
            <div className="lg:col-span-3">
              <StreakPanel budget={overallBudget} />
            </div>
          </div>
        )}

        {/* ── Category Budgets ── */}
        <div>
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-[13px] font-bold tracking-wide text-(--foreground)">
                Category Budgets
              </div>
              <div className="text-[10px] text-(--muted-foreground)">
                Per-category spending limits
              </div>
            </div>
            <button
              onClick={() => openDemoModal("Add Category Budget")}
              className="flex items-center gap-1 rounded-lg border border-(--border) px-2.5 py-1.5 text-[11px] font-medium text-(--muted-foreground) transition hover:text-(--foreground) hover:border-(--ring) w-fit"
            >
              <Plus size={12} /> Add Category Budget
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryBudgets.map((b) => (
              <BudgetCategoryCard key={b.id} budget={b} />
            ))}
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
