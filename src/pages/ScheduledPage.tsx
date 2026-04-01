import { useState, useMemo } from "react";
import {
  Sun,
  Moon,
  Plus,
  Pause,
  Play,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  TrendingUp,
  CalendarClock,
  Repeat,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Wallet,
  Tag,
  Calendar,
  Timer,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getDummyScheduledJobs,
  type ScheduledJob,
  type ScheduledJobLog,
} from "@/lib/dummy-data";
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

function fmtShortCurrency(n: number): string {
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `Rp${(n / 1_000).toFixed(0)}K`;
  return `Rp${n.toLocaleString("id-ID")}`;
}

function getStatusStyle(status: ScheduledJob["status"]) {
  switch (status) {
    case "active":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-500",
        border: "border-emerald-500/30",
        dot: "bg-emerald-500",
        label: "Active",
      };
    case "paused":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-500",
        border: "border-amber-500/30",
        dot: "bg-amber-500",
        label: "Paused",
      };
    case "completed":
      return {
        bg: "bg-(--muted)",
        text: "text-(--muted-foreground)",
        border: "border-(--border)",
        dot: "bg-(--muted-foreground)",
        label: "Completed",
      };
  }
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
// EXECUTION LOG TABLE
// ════════════════════════════════════════════

function ExecutionLogTable({ logs }: { logs: ScheduledJobLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-(--border) bg-(--secondary)/20 px-4 py-6 text-center">
        <Clock size={20} className="mx-auto mb-2 text-(--muted-foreground) opacity-40" />
        <div className="text-xs text-(--muted-foreground)">
          No execution history yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-(--border) bg-(--secondary)/10 overflow-hidden">
      {/* Mobile-friendly log items */}
      <div className="divide-y divide-(--border)">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
            {log.status === "success" ? (
              <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
            ) : (
              <XCircle size={14} className="shrink-0 text-rose-500" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-(--foreground) truncate">
                {fmtDateTime(log.executed_at)}
              </div>
              {log.reason && (
                <div className="text-[10px] text-rose-400 truncate">
                  {log.reason}
                </div>
              )}
            </div>
            <span
              className={cn(
                "shrink-0 text-[10px] font-semibold",
                log.status === "success" ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {log.status === "success" ? "Success" : "Failed"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// SCHEDULE CARD (Redesigned)
// ════════════════════════════════════════════

function ScheduleCard({
  job,
  onOpenModal,
}: {
  job: ScheduledJob;
  onOpenModal: (title: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = getStatusStyle(job.status);

  const successCount = job.execution_logs.filter(
    (l) => l.status === "success",
  ).length;
  const failedCount = job.execution_logs.filter(
    (l) => l.status === "failed",
  ).length;

  return (
    <div
      className={cn(
        "group rounded-xl border bg-(--card) overflow-hidden transition",
        job.status === "active"
          ? "border-(--border) hover:border-gold-400/20"
          : "border-(--border) opacity-85 hover:opacity-100",
      )}
    >
      {/* Status color bar at top */}
      <div
        className="h-0.5"
        style={{
          background:
            job.status === "active"
              ? "#10b981"
              : job.status === "paused"
                ? "#f59e0b"
                : "transparent",
        }}
      />

      <div className="p-4">
        {/* Row 1: Title + Amount */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Type icon */}
            <div
              className={cn(
                "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition",
                job.job_type === "transaction"
                  ? "bg-blue-500/5 border-blue-500/20"
                  : "bg-gold-400/5 border-gold-400/20",
              )}
            >
              {job.job_type === "transaction" ? (
                <ArrowLeftRight size={16} className="text-blue-400" />
              ) : (
                <TrendingUp size={16} className="text-gold-400" />
              )}
            </div>

            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-(--foreground) truncate mb-1">
                {job.description}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Status badge with dot */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                    statusStyle.bg,
                    statusStyle.text,
                    statusStyle.border,
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", statusStyle.dot)} />
                  {statusStyle.label}
                </span>

                {/* Schedule Type */}
                <span className="inline-flex items-center gap-1 rounded-full border border-(--border) bg-(--secondary)/30 px-2 py-0.5 text-[10px] font-medium text-(--muted-foreground)">
                  {job.schedule_type === "repeat" ? (
                    <Repeat size={9} />
                  ) : (
                    <Zap size={9} />
                  )}
                  {job.schedule_type === "repeat" ? "Recurring" : "One-time"}
                </span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="text-right shrink-0">
            <div className="font-mono text-sm font-bold text-(--foreground)">
              {fmtShortCurrency(job.amount)}
            </div>
            <div className="text-[10px] text-(--muted-foreground)">
              {job.repeat_interval ? `/${job.repeat_interval.slice(0, 2)}` : "once"}
            </div>
          </div>
        </div>

        {/* Row 2: Details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 ml-0 sm:ml-[52px]">
          {job.repeat_detail && (
            <div className="flex items-center gap-1.5 rounded-lg bg-(--secondary)/30 px-2.5 py-1.5">
              <Timer size={11} className="shrink-0 text-(--muted-foreground)" />
              <span className="text-[11px] text-(--foreground) truncate">
                {job.repeat_detail}
              </span>
            </div>
          )}

          {(job.category_name || job.asset_code) && (
            <div className="flex items-center gap-1.5 rounded-lg bg-(--secondary)/30 px-2.5 py-1.5">
              <Tag size={11} className="shrink-0 text-(--muted-foreground)" />
              <span className="text-[11px] text-(--foreground) truncate">
                {job.category_name || job.asset_code}
              </span>
            </div>
          )}

          {job.wallet_name && (
            <div className="flex items-center gap-1.5 rounded-lg bg-(--secondary)/30 px-2.5 py-1.5">
              <Wallet size={11} className="shrink-0 text-(--muted-foreground)" />
              <span className="text-[11px] text-(--foreground) truncate">
                {job.wallet_name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-lg bg-(--secondary)/30 px-2.5 py-1.5">
            <Calendar size={11} className="shrink-0 text-(--muted-foreground)" />
            <span className="text-[11px] text-(--foreground) truncate">
              {job.end_date ? fmtDate(job.end_date) : "Forever"}
            </span>
          </div>
        </div>

        {/* Row 3: Next/Last execution + stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 ml-0 sm:ml-[52px]">
          {job.next_execution && (
            <div className="text-[11px]">
              <span className="text-(--muted-foreground)">Next → </span>
              <span className="font-medium text-gold-400">
                {fmtDate(job.next_execution)}
              </span>
            </div>
          )}
          {job.last_execution && (
            <div className="text-[11px]">
              <span className="text-(--muted-foreground)">Last → </span>
              <span className="font-medium text-(--foreground)">
                {fmtDate(job.last_execution)}
              </span>
            </div>
          )}
          {job.execution_logs.length > 0 && (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-500">
                <CheckCircle2 size={10} /> {successCount}
              </span>
              {failedCount > 0 && (
                <span className="flex items-center gap-1 text-rose-500">
                  <XCircle size={10} /> {failedCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Row 4: Actions & Expand */}
        <div className="flex items-center justify-between ml-0 sm:ml-[52px]">
          <div className="flex gap-2">
            {job.status === "active" && (
              <button
                onClick={() => onOpenModal(`Pause: ${job.description}`)}
                className="flex items-center gap-1 rounded-lg border border-(--border) px-2.5 py-1 text-[10px] font-medium text-(--muted-foreground) transition hover:text-(--foreground) hover:border-(--ring)"
              >
                <Pause size={10} /> Pause
              </button>
            )}
            {job.status === "paused" && (
              <button
                onClick={() => onOpenModal(`Resume: ${job.description}`)}
                className="flex items-center gap-1 rounded-lg border border-emerald-500/30 px-2.5 py-1 text-[10px] font-medium text-emerald-400 transition hover:bg-emerald-500/10"
              >
                <Play size={10} /> Resume
              </button>
            )}
            <button
              onClick={() => onOpenModal(`Delete: ${job.description}`)}
              className="flex items-center gap-1 rounded-lg border border-rose-500/30 px-2.5 py-1 text-[10px] font-medium text-rose-400/80 transition hover:text-rose-400 hover:bg-rose-500/10"
            >
              <Trash2 size={10} /> Delete
            </button>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-(--muted-foreground) transition hover:text-(--foreground) hover:bg-(--secondary)/30"
          >
            <Activity size={10} />
            {expanded ? (
              <>
                Hide <ChevronUp size={11} />
              </>
            ) : (
              <>
                Logs ({job.execution_logs.length}) <ChevronDown size={11} />
              </>
            )}
          </button>
        </div>

        {/* Expanded: Execution Logs */}
        {expanded && (
          <div className="mt-3 ml-0 sm:ml-[52px]">
            <ExecutionLogTable logs={job.execution_logs} />
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function ScheduledPage() {
  const { theme, toggleTheme } = useTheme();

  // Filter
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "paused" | "completed"
  >("all");

  // Demo modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const allJobs = useMemo(() => getDummyScheduledJobs(), []);

  const filteredJobs = useMemo(() => {
    if (statusFilter === "all") return allJobs;
    return allJobs.filter((j) => j.status === statusFilter);
  }, [allJobs, statusFilter]);

  // KPI stats
  const totalActive = allJobs.filter((j) => j.status === "active").length;
  const totalPaused = allJobs.filter((j) => j.status === "paused").length;
  const nextExec = allJobs
    .filter((j) => j.next_execution)
    .sort(
      (a, b) =>
        new Date(a.next_execution!).getTime() -
        new Date(b.next_execution!).getTime(),
    )[0]?.next_execution;
  const totalExecuted = allJobs.reduce(
    (s, j) => s + j.execution_logs.length,
    0,
  );
  const totalMonthlyAmount = allJobs
    .filter((j) => j.status === "active")
    .reduce((s, j) => {
      if (j.repeat_interval === "monthly") return s + j.amount;
      if (j.repeat_interval === "weekly") return s + j.amount * 4;
      if (j.repeat_interval === "daily") return s + j.amount * 30;
      return s;
    }, 0);

  const openDemoModal = (title: string) => {
    setModalTitle(title);
    setModalOpen(true);
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
              Scheduled
            </div>
            <div className="text-[10px] text-(--muted-foreground)">
              Automated transactions & investments
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
          {/* Status filter */}
          <div className="flex gap-1 overflow-x-auto">
            {(["all", "active", "paused", "completed"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold capitalize transition",
                    statusFilter === status
                      ? "border-gold-400/40 bg-gold-400/10 text-gold-400"
                      : "border-(--border) text-(--muted-foreground) hover:text-(--foreground)",
                  )}
                >
                  {status}
                </button>
              ),
            )}
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
        {/* ── KPI Cards (4 cards) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="relative flex flex-col gap-1 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-4 py-3">
            <div
              className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl"
              style={{ background: "linear-gradient(90deg, #10b981, #4ade80)" }}
            />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
              Active
            </span>
            <div className="flex items-end gap-1.5">
              <span className="font-mono text-xl font-bold text-(--foreground)">
                {totalActive}
              </span>
              {totalPaused > 0 && (
                <span className="text-[10px] text-amber-500 mb-0.5">
                  +{totalPaused} paused
                </span>
              )}
            </div>
          </div>

          <div className="relative flex flex-col gap-1 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-4 py-3">
            <div
              className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl"
              style={{ background: "linear-gradient(90deg, #daa520, #ffd700)" }}
            />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
              Next Run
            </span>
            <span className="font-mono text-sm font-bold text-gold-400">
              {nextExec ? fmtDate(nextExec) : "—"}
            </span>
          </div>

          <div className="relative flex flex-col gap-1 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-4 py-3">
            <div
              className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl"
              style={{ background: "linear-gradient(90deg, #3b82f6, #60a5fa)" }}
            />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
              Executed
            </span>
            <span className="font-mono text-xl font-bold text-(--foreground)">
              {totalExecuted}
            </span>
          </div>

          <div className="relative flex flex-col gap-1 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-4 py-3">
            <div
              className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl"
              style={{ background: "linear-gradient(90deg, #8b5cf6, #a78bfa)" }}
            />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
              Monthly Auto
            </span>
            <span className="font-mono text-sm font-bold text-(--foreground)">
              {fmtShortCurrency(totalMonthlyAmount)}
            </span>
          </div>
        </div>

        {/* ── Action Bar ── */}
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-bold tracking-wide text-(--foreground)">
            Scheduled Jobs
            <span className="ml-2 text-[11px] font-normal text-(--muted-foreground)">
              ({filteredJobs.length})
            </span>
          </div>
          <button
            onClick={() => openDemoModal("Create Schedule")}
            className="flex items-center gap-1.5 rounded-lg border border-(--border) px-3 py-1.5 text-xs font-medium text-(--muted-foreground) transition hover:text-(--foreground) hover:border-(--ring)"
          >
            <Plus size={14} /> Create Schedule
          </button>
        </div>

        {/* ── Schedule List ── */}
        {filteredJobs.length === 0 ? (
          <div className="rounded-xl border border-(--border) bg-(--card) px-6 py-12 text-center">
            <CalendarClock
              size={36}
              className="mx-auto mb-3 text-(--muted-foreground) opacity-30"
            />
            <div className="text-sm font-semibold text-(--foreground) mb-1">
              No scheduled jobs
            </div>
            <div className="text-xs text-(--muted-foreground)">
              {statusFilter !== "all"
                ? `No ${statusFilter} schedules found. Try a different filter.`
                : "Create your first scheduled transaction or investment."}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredJobs.map((job) => (
              <ScheduleCard
                key={job.id}
                job={job}
                onOpenModal={openDemoModal}
              />
            ))}
          </div>
        )}
      </main>
    </MainLayout>
  );
}
