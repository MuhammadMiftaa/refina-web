import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getDummyCategoryBreakdown,
  DUMMY_DASHBOARD_WALLETS,
  type CategoryBreakdownItem,
} from "@/lib/dummy-data";

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
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString("id-ID");
}

// ════════════════════════════════════════════
// SORT HEADER
// ════════════════════════════════════════════

function SortHeader({
  label,
  field,
  currentSort,
  currentOrder,
  onSort,
  className,
}: {
  label: string;
  field: string;
  currentSort: string;
  currentOrder: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
}) {
  const isActive = currentSort === field;
  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        "flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-(--muted-foreground) transition hover:text-(--foreground)",
        isActive && "text-gold-400",
        className,
      )}
    >
      {label}
      {isActive ? (
        currentOrder === "asc" ? (
          <ArrowUp size={12} />
        ) : (
          <ArrowDown size={12} />
        )
      ) : (
        <ArrowUpDown size={12} className="opacity-40" />
      )}
    </button>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function CategoriesPage() {
  const { theme, toggleTheme } = useTheme();

  // Filters
  const [categoryTab, setCategoryTab] = useState<"expense" | "income">(
    "expense",
  );
  const [walletFilter, setWalletFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Sorting
  const [sortBy, setSortBy] = useState("total_amount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Data
  const allCategories = useMemo(
    () => getDummyCategoryBreakdown(categoryTab),
    [categoryTab],
  );

  // Sort
  const sorted = useMemo(() => {
    const data = [...allCategories];
    data.sort((a, b) => {
      const aVal =
        sortBy === "total_transactions"
          ? a.total_transactions
          : a.total_amount;
      const bVal =
        sortBy === "total_transactions"
          ? b.total_transactions
          : b.total_amount;
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
    return data;
  }, [allCategories, sortBy, sortOrder]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  // Summary
  const totalAmount = allCategories.reduce((s, c) => s + c.total_amount, 0);
  const totalTx = allCategories.reduce((s, c) => s + c.total_transactions, 0);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  // Reset page when tab changes
  const handleTabChange = (tab: "expense" | "income") => {
    setCategoryTab(tab);
    setPage(1);
    setSortBy("total_amount");
    setSortOrder("desc");
  };

  const maxAmount = sorted.length > 0 ? sorted[0].total_amount : 1;

  return (
    <MainLayout>
      {/* ════════ HEADER ════════ */}
      <header className="sticky top-0 z-40 flex flex-col gap-3 border-b border-(--border) bg-(--card) px-4 py-3 sm:px-6 sm:py-3.5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between sm:inline">
          <div>
            <div className="text-sm font-bold tracking-wide text-(--foreground)">
              Categories
            </div>
            <div className="text-[10px] text-(--muted-foreground)">
              Complete breakdown of income & expense categories
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

        <div className="inline-grid grid-flow-col auto-cols-max grid-rows-2 sm:grid-rows-1 items-center gap-2 sm:gap-3">
          <span className="mr-1 hidden text-[10px] uppercase tracking-widest text-(--muted-foreground) sm:inline">
            Filter
          </span>

          <select
            value={walletFilter}
            onChange={(e) => setWalletFilter(e.target.value)}
            className="row-start-2 col-start-1 sm:col-start-2 sm:row-start-1 min-w-0 w-full flex-1 rounded-lg border border-(--border) bg-(--input) px-2.5 py-1.5 text-xs text-(--foreground) outline-none focus:border-(--ring) sm:flex-none"
          >
            <option value="">All Wallets</option>
            {DUMMY_DASHBOARD_WALLETS.map((w) => (
              <option key={w.wallet_id} value={w.wallet_id}>
                {w.wallet_name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 sm:gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, start: e.target.value }))
              }
              className="w-30 rounded-lg border border-(--border) bg-(--input) px-2 py-1.5 text-xs text-(--foreground) outline-none focus:border-(--ring) sm:w-auto sm:px-2.5"
            />
            <span className="text-xs text-(--muted-foreground)">→</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, end: e.target.value }))
              }
              className="w-30 rounded-lg border border-(--border) bg-(--input) px-2 py-1.5 text-xs text-(--foreground) outline-none focus:border-(--ring) sm:w-auto sm:px-2.5"
            />
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
        {/* Toggle + Summary */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Tab Toggle */}
          <div className="flex gap-1">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-semibold capitalize transition",
                  categoryTab === t
                    ? t === "expense"
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
                      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                    : "border-(--border) text-(--muted-foreground) hover:text-(--foreground)",
                )}
              >
                {t === "expense" ? (
                  <ArrowUpCircle size={14} />
                ) : (
                  <ArrowDownCircle size={14} />
                )}
                {t}
              </button>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
                Total {categoryTab === "expense" ? "Expense" : "Income"}
              </div>
              <div
                className={cn(
                  "font-mono text-sm font-bold",
                  categoryTab === "expense"
                    ? "text-rose-500"
                    : "text-emerald-500",
                )}
              >
                {fmtCurrency(totalAmount)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
                Categories
              </div>
              <div className="font-mono text-sm font-bold text-(--foreground)">
                {allCategories.length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
                Transactions
              </div>
              <div className="font-mono text-sm font-bold text-(--foreground)">
                {totalTx}
              </div>
            </div>
          </div>
        </div>

        {/* ── Table (Desktop) ── */}
        <div className="hidden md:block rounded-xl border border-(--border) bg-(--card) overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--border) bg-(--secondary)/30">
                <th className="px-4 py-3 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
                    Category
                  </span>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
                    Group
                  </span>
                </th>
                <th className="px-4 py-3 text-right">
                  <SortHeader
                    label="Amount"
                    field="total_amount"
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    onSort={handleSort}
                    className="justify-end"
                  />
                </th>
                <th className="px-4 py-3 text-right">
                  <SortHeader
                    label="Transactions"
                    field="total_transactions"
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    onSort={handleSort}
                    className="justify-end"
                  />
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
                    Share
                  </span>
                </th>
                <th className="px-4 py-3 w-40">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
                    Distribution
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((cat) => (
                <CategoryTableRow
                  key={cat.category_id}
                  category={cat}
                  type={categoryTab}
                  maxAmount={maxAmount}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Cards (Mobile) ── */}
        <div className="flex flex-col gap-2 md:hidden">
          {paginated.map((cat) => (
            <CategoryCard
              key={cat.category_id}
              category={cat}
              type={categoryTab}
              maxAmount={maxAmount}
            />
          ))}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-xl border border-(--border) bg-(--card) px-4 py-3">
            <div className="text-[11px] text-(--muted-foreground)">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, sorted.length)} of {sorted.length}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="rounded-lg p-1.5 text-(--muted-foreground) transition hover:text-(--foreground) disabled:opacity-30"
              >
                <ChevronsLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg p-1.5 text-(--muted-foreground) transition hover:text-(--foreground) disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-3 text-xs font-medium text-(--foreground)">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg p-1.5 text-(--muted-foreground) transition hover:text-(--foreground) disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="rounded-lg p-1.5 text-(--muted-foreground) transition hover:text-(--foreground) disabled:opacity-30"
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
}

// ════════════════════════════════════════════
// TABLE ROW (Desktop)
// ════════════════════════════════════════════

function CategoryTableRow({
  category,
  type,
  maxAmount,
}: {
  category: CategoryBreakdownItem;
  type: "expense" | "income";
  maxAmount: number;
}) {
  const barColor = type === "expense" ? "#f43f5e" : "#10b981";
  const pct = maxAmount > 0 ? (category.total_amount / maxAmount) * 100 : 0;

  return (
    <tr className="border-b border-(--border) transition hover:bg-(--muted)/30">
      <td className="px-4 py-3">
        <div className="text-xs font-semibold text-(--foreground)">
          {category.category_name}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="rounded-md border border-(--border) bg-(--secondary)/30 px-2 py-0.5 text-[10px] font-medium text-(--muted-foreground)">
          {category.group_name}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span
          className={cn(
            "font-mono text-xs font-semibold",
            type === "expense" ? "text-rose-500" : "text-emerald-500",
          )}
        >
          {fmtCurrency(category.total_amount)}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-xs text-(--foreground)">
          {category.total_transactions}x
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-xs text-(--muted-foreground)">
          {category.percentage.toFixed(1)}%
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-(--muted)">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: barColor, opacity: 0.7 }}
          />
        </div>
      </td>
    </tr>
  );
}

// ════════════════════════════════════════════
// CARD (Mobile)
// ════════════════════════════════════════════

function CategoryCard({
  category,
  type,
  maxAmount,
}: {
  category: CategoryBreakdownItem;
  type: "expense" | "income";
  maxAmount: number;
}) {
  const barColor = type === "expense" ? "#f43f5e" : "#10b981";
  const pct = maxAmount > 0 ? (category.total_amount / maxAmount) * 100 : 0;

  return (
    <div className="rounded-xl border border-(--border) bg-(--card) p-4 transition hover:border-gold-400/20">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-xs font-semibold text-(--foreground)">
            {category.category_name}
          </div>
          <span className="text-[10px] text-(--muted-foreground)">
            {category.group_name}
          </span>
        </div>
        <div className="text-right">
          <span
            className={cn(
              "font-mono text-sm font-bold",
              type === "expense" ? "text-rose-500" : "text-emerald-500",
            )}
          >
            {fmtShort(category.total_amount)}
          </span>
          <div className="text-[10px] text-(--muted-foreground)">
            {category.total_transactions}x · {category.percentage.toFixed(1)}%
          </div>
        </div>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-(--muted)">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: barColor, opacity: 0.7 }}
        />
      </div>
    </div>
  );
}
