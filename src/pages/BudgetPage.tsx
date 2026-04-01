import { useState, useMemo } from "react";
import { Sun, Moon, Plus, RotateCcw, Trash2, Flame } from "lucide-react";
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
// PROGRESS BAR
// ════════════════════════════════════════════

function BudgetProgressBar({
  spent,
  limit,
  overBudget,
}: {
  spent: number;
  limit: number;
  overBudget: boolean;
}) {
  const pct = Math.min((spent / limit) * 100, 100);
  const overPct = spent > limit ? Math.min(((spent - limit) / limit) * 100, 20) : 0;

  return (
    <div className="relative h-2.5 overflow-hidden rounded-full bg-(--muted)">
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
      {overPct > 0 && (
        <div
          className="absolute top-0 h-full rounded-r-full opacity-50"
          style={{
            left: "100%",
            width: `${overPct}%`,
            background: "#ef4444",
            marginLeft: `-${overPct}%`,
          }}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// STREAK CARD
// ════════════════════════════════════════════

function StreakHighlight({ budget }: { budget: BudgetItem }) {
  if (!budget.streak_active || budget.streak_count === 0) {
    return (
      <div className="rounded-xl border border-(--border) bg-(--card) p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--muted) text-lg">
            💤
          </div>
          <div>
            <div className="text-xs font-semibold text-(--muted-foreground)">
              No active streak
            </div>
            <div className="text-[10px] text-(--muted-foreground)">
              Stay under budget this month to start a streak!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="streak-active rounded-xl border-2 bg-(--card) p-5 relative overflow-hidden">
      {/* Subtle green background glow */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(134,239,172,1) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
            <span className="streak-fire-icon">🔥</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                {budget.streak_count}
              </span>
              <span className="text-sm font-semibold text-emerald-400/80">
                {budget.streak_count === 1 ? "month" : "months"} streak!
              </span>
            </div>
            <div className="text-[11px] text-(--muted-foreground) mt-0.5">
              You've been under budget for {budget.streak_count} consecutive{" "}
              {budget.streak_count === 1 ? "month" : "months"}. Keep it up! 🎯
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
          <Flame size={14} className="text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">
            On Track
          </span>
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

  const budgets = useMemo(() => getDummyBudgets(), []);

  const overallBudget = budgets.find((b) => b.scope === "overall");
  const categoryBudgets = budgets.filter((b) => b.scope === "category");

  const demoAction = () => {
    toast("Demo mode — data is read-only", { icon: "🔒" });
  };

  return (
    <MainLayout>
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
        {/* ── Streak Highlight ── */}
        {overallBudget && <StreakHighlight budget={overallBudget} />}

        {/* ── Overall Budget Card ── */}
        {overallBudget && (
          <div className="rounded-xl border border-(--border) bg-(--card) p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[13px] font-bold tracking-wide text-(--foreground)">
                  Overall Monthly Budget
                </div>
                <div className="text-[10px] text-(--muted-foreground)">
                  {getMonthLabel(overallBudget.period)} · All Wallets
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={demoAction}
                  className="flex items-center gap-1 rounded-lg border border-(--border) px-2.5 py-1.5 text-[11px] font-medium text-(--muted-foreground) transition hover:text-(--foreground) hover:border-(--ring)"
                >
                  <Plus size={12} /> Set Budget
                </button>
                <button
                  onClick={demoAction}
                  className="flex items-center gap-1 rounded-lg border border-(--border) px-2.5 py-1.5 text-[11px] font-medium text-(--muted-foreground) transition hover:text-(--foreground) hover:border-(--ring)"
                >
                  <RotateCcw size={12} /> Reset
                </button>
                <button
                  onClick={demoAction}
                  className="flex items-center gap-1 rounded-lg border border-rose-500/30 px-2.5 py-1.5 text-[11px] font-medium text-rose-400/80 transition hover:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>

            {/* Big number */}
            <div className="flex items-end gap-3 mb-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
                  Spent
                </div>
                <div
                  className={cn(
                    "font-mono text-2xl font-bold",
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
            />

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-(--muted-foreground)">
                {fmtCurrency(
                  Math.max(
                    0,
                    overallBudget.monthly_limit - overallBudget.current_spent,
                  ),
                )}{" "}
                remaining
              </span>
              <span className="text-[10px] text-(--muted-foreground)">
                ~{fmtShort(Math.round((overallBudget.monthly_limit - overallBudget.current_spent) / 30))}/day left
              </span>
            </div>
          </div>
        )}

        {/* ── Category Budgets ── */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[13px] font-bold tracking-wide text-(--foreground)">
                Category Budgets
              </div>
              <div className="text-[10px] text-(--muted-foreground)">
                Per-category spending limits
              </div>
            </div>
            <button
              onClick={demoAction}
              className="flex items-center gap-1 rounded-lg border border-(--border) px-2.5 py-1.5 text-[11px] font-medium text-(--muted-foreground) transition hover:text-(--foreground) hover:border-(--ring)"
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
