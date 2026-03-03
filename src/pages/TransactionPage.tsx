import { useState, useMemo } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeftRight,
  Search,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sun,
  Moon,
  Paperclip,
  Upload,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { useTransactionList, useCategories } from "@/hooks/useTransaction";
import { useWalletList } from "@/hooks/useWallet";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button, Input } from "@/components/ui/FormElements";
import type {
  Transaction,
  CreateTransactionPayload,
  CreateTransferPayload,
} from "@/types/transaction";
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

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCategoryTypeColor(type: string) {
  switch (type) {
    case "income":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-500",
        border: "border-emerald-500/30",
      };
    case "expense":
      return {
        bg: "bg-rose-500/10",
        text: "text-rose-500",
        border: "border-rose-500/30",
      };
    case "fund_transfer":
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-500",
        border: "border-blue-500/30",
      };
    default:
      return {
        bg: "bg-gray-500/10",
        text: "text-gray-500",
        border: "border-gray-500/30",
      };
  }
}

function getCategoryTypeIcon(type: string) {
  switch (type) {
    case "income":
      return <ArrowDownCircle size={16} className="text-emerald-500" />;
    case "expense":
      return <ArrowUpCircle size={16} className="text-rose-500" />;
    case "fund_transfer":
      return <ArrowLeftRight size={16} className="text-blue-500" />;
    default:
      return null;
  }
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
// TRANSACTION ROW (Desktop)
// ════════════════════════════════════════════

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const typeColors = getCategoryTypeColor(
    transaction.category_type ?? "expense",
  );

  return (
    <tr className="border-b border-(--border) transition hover:bg-(--muted)/30">
      {/* Date */}
      <td className="whitespace-nowrap px-4 py-3 text-xs text-(--foreground)">
        {fmtDate(transaction.transaction_date)}
      </td>
      {/* Description */}
      <td className="max-w-50 truncate px-4 py-3 text-xs text-(--foreground)">
        {transaction.description || "—"}
      </td>
      {/* Category */}
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
            typeColors.bg,
            typeColors.text,
            typeColors.border,
          )}
        >
          {getCategoryTypeIcon(transaction.category_type ?? "expense")}
          {transaction.category_name}
        </span>
      </td>
      {/* Wallet */}
      <td className="whitespace-nowrap px-4 py-3 text-xs text-(--muted-foreground)">
        {transaction.wallet_name}
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        <span
          className={cn(
            "font-mono text-xs font-semibold",
            transaction.category_type === "income"
              ? "text-emerald-500"
              : transaction.category_type === "expense"
                ? "text-rose-500"
                : "text-blue-500",
          )}
        >
          {transaction.category_type === "income"
            ? "+"
            : transaction.category_type === "expense"
              ? "-"
              : ""}
          {fmtCurrency(transaction.amount)}
        </span>
      </td>
      {/* Attachments */}
      <td className="px-4 py-3 text-center">
        {(transaction.attachments?.length ?? 0) > 0 ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-gold-400">
            <Paperclip size={12} />
            {transaction.attachments?.length}
          </span>
        ) : (
          <span className="text-[11px] text-(--muted-foreground)">—</span>
        )}
      </td>
    </tr>
  );
}

// ════════════════════════════════════════════
// TRANSACTION CARD (Mobile)
// ════════════════════════════════════════════

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const typeColors = getCategoryTypeColor(
    transaction.category_type ?? "expense",
  );

  return (
    <div className="rounded-xl border border-(--border) bg-(--card) p-4 transition hover:border-gold-400/20">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getCategoryTypeIcon(transaction.category_type ?? "expense")}
          <div>
            <div className="text-xs font-semibold text-(--foreground)">
              {transaction.description || "No description"}
            </div>
            <div className="text-[10px] text-(--muted-foreground)">
              {fmtDateTime(transaction.transaction_date)}
            </div>
          </div>
        </div>
        <span
          className={cn(
            "font-mono text-sm font-bold",
            transaction.category_type === "income"
              ? "text-emerald-500"
              : transaction.category_type === "expense"
                ? "text-rose-500"
                : "text-blue-500",
          )}
        >
          {transaction.category_type === "income"
            ? "+"
            : transaction.category_type === "expense"
              ? "-"
              : ""}
          {fmtCurrency(transaction.amount)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
            typeColors.bg,
            typeColors.text,
            typeColors.border,
          )}
        >
          {transaction.category_name}
        </span>
        <span className="text-[10px] text-(--muted-foreground)">
          {transaction.wallet_name}
        </span>
        {(transaction.attachments?.length ?? 0) > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-gold-400">
            <Paperclip size={10} /> {transaction.attachments?.length}
          </span>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// ADD TRANSACTION MODAL
// ════════════════════════════════════════════

type TransactionFormTab = "income" | "expense" | "transfer";

function AddTransactionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TransactionFormTab>("expense");
  const categories = useCategories();
  const wallets = useWalletList();

  const [walletId, setWalletId] = useState("");
  const [fromWalletId, setFromWalletId] = useState("");
  const [toWalletId, setToWalletId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Filtered categories for the selected tab
  const filteredCategories = useMemo(() => {
    if (!categories.data) return [];
    return categories.data.filter((c) => c.type === tab);
  }, [categories.data, tab]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (tab === "transfer") {
      const payload: CreateTransferPayload = {
        from_wallet_id: fromWalletId,
        to_wallet_id: toWalletId,
        amount: parseFloat(amount) || 0,
        transaction_date: new Date(date).toISOString(),
        description: description || undefined,
      };
      // TODO: Call createTransfer API
      void payload;
      toast.success("Transfer created successfully!");
    } else {
      const payload: CreateTransactionPayload = {
        wallet_id: walletId,
        category_id: categoryId,
        amount: parseFloat(amount) || 0,
        transaction_date: new Date(date).toISOString(),
        description: description || undefined,
      };
      // TODO: Call createTransaction API
      // If attachment, also call createAttachment API
      void payload;
      toast.success(
        `${tab === "income" ? "Income" : "Expense"} transaction created successfully!`,
      );
    }

    setLoading(false);
    onClose();
    // Reset
    setWalletId("");
    setFromWalletId("");
    setToWalletId("");
    setCategoryId("");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setDescription("");
    setAttachment(null);
  };

  const tabs: {
    key: TransactionFormTab;
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      key: "income",
      label: "Income",
      icon: <ArrowDownCircle size={14} />,
      color: "text-emerald-500",
    },
    {
      key: "expense",
      label: "Expense",
      icon: <ArrowUpCircle size={14} />,
      color: "text-rose-500",
    },
    {
      key: "transfer",
      label: "Transfer",
      icon: <ArrowLeftRight size={14} />,
      color: "text-blue-500",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-(--border) bg-(--card)"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow:
            "0 0 40px rgba(218,165,32,0.1), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--border) px-6 py-4">
          <h3 className="font-bold text-(--foreground)">
            Add Transaction
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-(--muted-foreground) transition hover:text-(--foreground)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-(--border)">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold transition",
                tab === t.key
                  ? `${t.color} border-b-2`
                  : "text-(--muted-foreground) hover:text-(--foreground)",
              )}
              style={
                tab === t.key
                  ? {
                      borderColor:
                        t.key === "income"
                          ? "#10b981"
                          : t.key === "expense"
                            ? "#f43f5e"
                            : "#3b82f6",
                    }
                  : undefined
              }
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {tab === "transfer" ? (
            <>
              {/* From Wallet */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-(--foreground) opacity-80">
                  From Wallet
                </label>
                <div className="relative">
                  <select
                    value={fromWalletId}
                    onChange={(e) => setFromWalletId(e.target.value)}
                    required
                    className="w-full appearance-none rounded-lg border border-(--border) bg-(--input) px-4 py-2.5 text-sm text-(--foreground) outline-none transition-colors focus:border-(--ring) focus:ring-1 focus:ring-(--ring)"
                  >
                    <option value="">Select source wallet...</option>
                    {wallets.data?.map((w) => (
                      <option
                        key={w.id}
                        value={w.id}
                        disabled={w.id === toWalletId}
                      >
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
                  />
                </div>
              </div>

              {/* To Wallet */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-(--foreground) opacity-80">
                  To Wallet
                </label>
                <div className="relative">
                  <select
                    value={toWalletId}
                    onChange={(e) => setToWalletId(e.target.value)}
                    required
                    className="w-full appearance-none rounded-lg border border-(--border) bg-(--input) px-4 py-2.5 text-sm text-(--foreground) outline-none transition-colors focus:border-(--ring) focus:ring-1 focus:ring-(--ring)"
                  >
                    <option value="">Select destination wallet...</option>
                    {wallets.data?.map((w) => (
                      <option
                        key={w.id}
                        value={w.id}
                        disabled={w.id === fromWalletId}
                      >
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Wallet */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-(--foreground) opacity-80">
                  Wallet
                </label>
                <div className="relative">
                  <select
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    required
                    className="w-full appearance-none rounded-lg border border-(--border) bg-(--input) px-4 py-2.5 text-sm text-(--foreground) outline-none transition-colors focus:border-(--ring) focus:ring-1 focus:ring-(--ring)"
                  >
                    <option value="">Select wallet...</option>
                    {wallets.data?.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-(--foreground) opacity-80">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full appearance-none rounded-lg border border-(--border) bg-(--input) px-4 py-2.5 text-sm text-(--foreground) outline-none transition-colors focus:border-(--ring) focus:ring-1 focus:ring-(--ring)"
                  >
                    <option value="">Select category...</option>
                    {filteredCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
                  />
                </div>
              </div>
            </>
          )}

          {/* Amount */}
          <Input
            label="Amount (IDR)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="1"
            required
          />

          {/* Date */}
          <Input
            label="Transaction Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-(--foreground) opacity-80">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note..."
              rows={2}
              className="w-full rounded-lg border border-(--border) bg-(--input) px-4 py-2.5 text-sm text-(--foreground) outline-none transition-colors focus:border-(--ring) focus:ring-1 focus:ring-(--ring) placeholder:text-(--muted-foreground)"
            />
          </div>

          {/* Attachment (not for transfer) */}
          {tab !== "transfer" && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-(--foreground) opacity-80">
                Attachment
              </label>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-xs transition",
                  attachment
                    ? "border-gold-400/40 bg-gold-400/5 text-gold-400"
                    : "border-(--border) text-(--muted-foreground) hover:border-(--ring)",
                )}
              >
                <Upload size={14} />
                <span>
                  {attachment ? attachment.name : "Upload receipt or proof"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                />
                {attachment && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setAttachment(null);
                    }}
                    className="ml-auto"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="flex-1">
              Create Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// PAGINATION
// ════════════════════════════════════════════

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, -1] as const;

function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-(--border) px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-[11px] text-(--muted-foreground)">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="rounded-md border border-(--border) bg-(--input) px-2 py-1 text-[11px] text-(--foreground) outline-none focus:border-(--ring)"
        >
          {PAGE_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === -1 ? "All" : s}
            </option>
          ))}
        </select>
        <span>of {total} entries</span>
      </div>

      {pageSize !== -1 && totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="rounded-md border border-(--border) p-1.5 text-(--muted-foreground) transition hover:text-(--foreground) disabled:opacity-30"
          >
            <ChevronsLeft size={14} />
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="rounded-md border border-(--border) p-1.5 text-(--muted-foreground) transition hover:text-(--foreground) disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-semibold transition",
                  page === pageNum
                    ? "border border-gold-400/40 bg-gold-400/10 text-gold-400"
                    : "border border-(--border) text-(--muted-foreground) hover:text-(--foreground)",
                )}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="rounded-md border border-(--border) p-1.5 text-(--muted-foreground) transition hover:text-(--foreground) disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="rounded-md border border-(--border) p-1.5 text-(--muted-foreground) transition hover:text-(--foreground) disabled:opacity-30"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN TRANSACTION PAGE
// ════════════════════════════════════════════

export function TransactionPage() {
  const { theme, toggleTheme } = useTheme();

  // Pagination & sort state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("transaction_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Fetch transactions
  const txnList = useTransactionList({
    page,
    page_size: pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
    search: searchQuery,
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return (
    <MainLayout>
      {/* Header */}
      <header className="sticky top-0 z-40 flex gap-3 border-b border-(--border) bg-(--card) px-4 py-3 sm:px-6 sm:py-3.5 flex-row items-center justify-between">
        <div>
          <div className="text-sm font-bold tracking-wide text-(--foreground)">
            Transactions
          </div>
          <div className="text-[10px] text-(--muted-foreground)">
            View and manage all your transactions
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus size={14} />
            <span className="hidden sm:inline">Add Transaction</span>
          </Button>
          <button
            onClick={toggleTheme}
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--border) text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-350 p-3 sm:p-5">
        {/* Search Bar */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search by description, wallet, category, or amount..."
              className="w-full rounded-lg border border-(--border) bg-(--input) py-2 pl-9 pr-9 text-xs text-(--foreground) outline-none transition focus:border-(--ring)"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground) hover:text-(--foreground)"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <Button size="sm" variant="secondary" onClick={handleSearch}>
            <Search size={14} /> Search
          </Button>
        </div>

        {/* Table (Desktop) */}
        <div className="hidden overflow-hidden rounded-xl border border-(--border) bg-(--card) md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border) bg-(--secondary)">
                  <th className="px-4 py-3 text-left">
                    <SortHeader
                      label="Date"
                      field="transaction_date"
                      currentSort={sortBy}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortHeader
                      label="Description"
                      field="description"
                      currentSort={sortBy}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortHeader
                      label="Category"
                      field="category_name"
                      currentSort={sortBy}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <SortHeader
                      label="Wallet"
                      field="wallet_name"
                      currentSort={sortBy}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </th>
                  <th className="px-4 py-3 text-right">
                    <SortHeader
                      label="Amount"
                      field="amount"
                      currentSort={sortBy}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                      className="justify-end"
                    />
                  </th>
                  <th className="px-4 py-3 text-center">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
                      Attachments
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {txnList.loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-(--border)">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : txnList.data?.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <ArrowLeftRight
                        size={32}
                        className="mx-auto mb-3 text-(--muted-foreground) opacity-40"
                      />
                      <div className="text-xs font-semibold text-(--foreground)">
                        No transactions found
                      </div>
                      <div className="mt-1 text-[11px] text-(--muted-foreground)">
                        {searchQuery
                          ? "Try adjusting your search"
                          : "Add your first transaction to get started"}
                      </div>
                    </td>
                  </tr>
                ) : (
                  txnList.data?.transactions.map((txn) => (
                    <TransactionRow key={txn.id} transaction={txn} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {txnList.data && (
            <Pagination
              page={txnList.data.page}
              totalPages={txnList.data.total_pages}
              total={txnList.data.total}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>

        {/* Cards (Mobile) */}
        <div className="flex flex-col gap-3 md:hidden">
          {txnList.loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : txnList.data?.transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ArrowLeftRight
                size={32}
                className="mb-3 text-(--muted-foreground) opacity-40"
              />
              <div className="text-xs font-semibold text-(--foreground)">
                No transactions found
              </div>
              <div className="mt-1 text-[11px] text-(--muted-foreground)">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Add your first transaction"}
              </div>
            </div>
          ) : (
            txnList.data?.transactions.map((txn) => (
              <TransactionCard key={txn.id} transaction={txn} />
            ))
          )}

          {/* Mobile Pagination */}
          {txnList.data && (
            <Pagination
              page={txnList.data.page}
              totalPages={txnList.data.total_pages}
              total={txnList.data.total}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </MainLayout>
  );
}
