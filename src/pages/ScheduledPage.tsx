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

function getStatusStyle(status: ScheduledJob["status"]) {
  switch (status) {
    case "active":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-500",
        border: "border-emerald-500/30",
        label: "Active",
      };
    case "paused":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-500",
        border: "border-amber-500/30",
        label: "Paused",
      };
    case "completed":
      return {
        bg: "bg-(--muted)",
        text: "text-(--muted-foreground)",
        border: "border-(--border)",
        label: "Completed",
      };
  }
}

function getJobTypeIcon(type: ScheduledJob["job_type"]) {
  return type === "transaction" ? (
    <ArrowLeftRight size={14} className="text-blue-400" />
  ) : (
    <TrendingUp size={14} className="text-gold-400" />
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
    <div className="rounded-lg border border-(--border) overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-(--border) bg-(--secondary)/30">
            <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
              Date
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
              Status
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-(--muted-foreground)">
              Reason
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-b border-(--border) last:border-0"
            >
              <td className="whitespace-nowrap px-3 py-2 text-[11px] text-(--foreground)">
                {fmtDateTime(log.executed_at)}
              </td>
              <td className="px-3 py-2">
                {log.status === "success" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                    <CheckCircle2 size={12} /> Success
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                    <XCircle size={12} /> Failed
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-[11px] text-(--muted-foreground)">
                {log.reason ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ════════════════════════════════════════════
// SCHEDULE CARD
// ════════════════════════════════════════════

function ScheduleCard({
  job,
  onDemo,
}: {
  job: ScheduledJob;
  onDemo: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = getStatusStyle(job.status);

  return (
    <div
      className={cn(
        "rounded-xl border bg-(--card) p-4 transition",
        job.status === "active"
          ? "border-(--border) hover:border-gold-400/20"
          : "border-(--border) opacity-80",
      )}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--secondary)/50 border border-(--border)">
            {getJobTypeIcon(job.job_type)}
          </div>

          <div className="min-w-0">
            <div className="text-xs font-semibold text-(--foreground) truncate">
              {job.description}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {/* Job Type Badge */}
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  job.job_type === "transaction"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    : "bg-gold-400/10 text-gold-400 border-gold-400/30",
                )}
              >
                {job.job_type === "transaction" ? (
                  <ArrowLeftRight size={10} />
                ) : (
                  <TrendingUp size={10} />
                )}
                {job.job_type === "transaction" ? "Transaction" : "Investment"}
              </span>

              {/* Schedule Type Badge */}
              <span className="inline-flex items-center gap-1 rounded-full border border-(--border) bg-(--secondary)/30 px-2 py-0.5 text-[10px] font-medium text-(--muted-foreground)">
                {job.schedule_type === "repeat" ? (
                  <Repeat size={10} />
                ) : (
                  <Zap size={10} />
                )}
                {job.schedule_type === "repeat" ? "Repeat" : "One-time"}
              </span>

              {/* Status Badge */}
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  statusStyle.bg,
                  statusStyle.text,
                  statusStyle.border,
                )}
              >
                {statusStyle.label}
              </span>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right shrink-0">
          <div className="font-mono text-sm font-bold text-(--foreground)">
            {fmtCurrency(job.amount)}
          </div>
          <div className="text-[10px] text-(--muted-foreground)">
            {job.wallet_name}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 pl-12">
        {/* Schedule detail */}
        {job.repeat_detail && (
          <div className="flex items-center gap-1.5">
            <CalendarClock size={11} className="text-(--muted-foreground)" />
            <span className="text-[11px] text-(--muted-foreground)">
              {job.repeat_detail}
            </span>
          </div>
        )}

        {/* Category or Asset */}
        {job.category_name && (
          <div className="text-[11px] text-(--muted-foreground)">
            Category: <span className="text-(--foreground)">{job.category_name}</span>
          </div>
        )}
        {job.asset_code && (
          <div className="text-[11px] text-(--muted-foreground)">
            Asset: <span className="text-(--foreground)">{job.asset_code}</span>
          </div>
        )}

        {/* Duration */}
        <div className="text-[11px] text-(--muted-foreground)">
          {fmtDate(job.start_date)} — {job.end_date ? fmtDate(job.end_date) : "Forever"}
        </div>
      </div>

      {/* Next & Last Execution */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pl-12 mb-3">
        {job.next_execution && (
          <div className="text-[11px]">
            <span className="text-(--muted-foreground)">Next: </span>
            <span className="font-medium text-gold-400">
              {fmtDate(job.next_execution)}
            </span>
          </div>
        )}
        {job.last_execution && (
          <div className="text-[11px]">
            <span className="text-(--muted-foreground)">Last: </span>
            <span className="font-medium text-(--foreground)">
              {fmtDate(job.last_execution)}
            </span>
          </div>
        )}
      </div>

      {/* Actions & Expand */}
      <div className="flex items-center justify-between pl-12">
        <div className="flex gap-2">
          {job.status === "active" && (
            <button
              onClick={onDemo}
              className="flex items-center gap-1 rounded-lg border border-(--border) px-2 py-1 text-[10px] font-medium text-(--muted-foreground) transition hover:text-(--foreground) hover:border-(--ring)"
            >
              <Pause size={10} /> Pause
            </button>
          )}
          {job.status === "paused" && (
            <button
              onClick={onDemo}
              className="flex items-center gap-1 rounded-lg border border-emerald-500/30 px-2 py-1 text-[10px] font-medium text-emerald-400 transition hover:bg-emerald-500/10"
            >
              <Play size={10} /> Resume
            </button>
          )}
          <button
            onClick={onDemo}
            className="flex items-center gap-1 rounded-lg border border-rose-500/30 px-2 py-1 text-[10px] font-medium text-rose-400/80 transition hover:text-rose-400 hover:bg-rose-500/10"
          >
            <Trash2 size={10} /> Delete
          </button>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[10px] font-medium text-(--muted-foreground) transition hover:text-(--foreground)"
        >
          {expanded ? (
            <>
              Hide Logs <ChevronUp size={12} />
            </>
          ) : (
            <>
              Execution Logs ({job.execution_logs.length}){" "}
              <ChevronDown size={12} />
            </>
          )}
        </button>
      </div>

      {/* Expanded: Execution Logs */}
      {expanded && (
        <div className="mt-3 pl-12">
          <ExecutionLogTable logs={job.execution_logs} />
        </div>
      )}
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

  const allJobs = useMemo(() => getDummyScheduledJobs(), []);

  const filteredJobs = useMemo(() => {
    if (statusFilter === "all") return allJobs;
    return allJobs.filter((j) => j.status === statusFilter);
  }, [allJobs, statusFilter]);

  // KPI stats
  const totalActive = allJobs.filter((j) => j.status === "active").length;
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
          <div className="flex gap-1">
            {(["all", "active", "paused", "completed"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold capitalize transition",
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
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-4 py-3 sm:px-5 sm:py-4">
            <div
              className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl opacity-70"
              style={{ background: "#10b981" }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
              Active
            </span>
            <span className="font-mono text-xl font-bold text-(--foreground)">
              {totalActive}
            </span>
            <span className="text-[10px] text-(--muted-foreground)">
              schedules
            </span>
          </div>

          <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-4 py-3 sm:px-5 sm:py-4">
            <div
              className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl opacity-70"
              style={{ background: "#daa520" }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
              Next Execution
            </span>
            <span className="font-mono text-sm font-bold text-gold-400 sm:text-base">
              {nextExec ? fmtDate(nextExec) : "—"}
            </span>
            <span className="text-[10px] text-(--muted-foreground)">
              upcoming
            </span>
          </div>

          <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-4 py-3 sm:px-5 sm:py-4">
            <div
              className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl opacity-70"
              style={{ background: "#3b82f6" }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
              Total Executed
            </span>
            <span className="font-mono text-xl font-bold text-(--foreground)">
              {totalExecuted}
            </span>
            <span className="text-[10px] text-(--muted-foreground)">
              all time
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
            onClick={demoAction}
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
              <ScheduleCard key={job.id} job={job} onDemo={demoAction} />
            ))}
          </div>
        )}
      </main>
    </MainLayout>
  );
}
