import { useState, useMemo } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import {
  useWallets,
  useFinancialSummary,
  useBalance,
  useTransactions,
  useNetWorthComposition,
  type GlobalFilter,
} from "@/hooks/useDashboard";
import {
  fmtShort,
  fmtPct,
  snapshotLabel,
  healthColor,
} from "@/lib/dashboard-helpers";
import { cn } from "@/lib/utils";
import type { FinancialSummary } from "@/types/dashboard";

// ── Chart Color Tokens ──
const CHART = {
  green: "#10b981",
  red: "#f43f5e",
  gold: "#daa520",
  accent: "#ffd700",
  blue: "#3b82f6",
  amber: "#f59e0b",
  pie: ["#daa520", "#10b981"],
};

// ════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════

function GrowthBadge({ value }: { value: number }) {
  const isPos = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        isPos
          ? "bg-emerald-500/10 text-emerald-500"
          : "bg-rose-500/10 text-rose-500",
      )}
    >
      {isPos ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function KPICard({
  label,
  value,
  growth,
  accent,
  sub,
}: {
  label: string;
  value: string;
  growth?: number;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="relative flex flex-1 flex-col gap-2 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-5 py-4">
      <div
        className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl opacity-70"
        style={{ background: accent }}
      />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
        {label}
      </span>
      <span className="font-mono text-xl font-bold text-(--foreground)">
        {value}
      </span>
      <div className="flex items-center gap-2">
        {growth !== undefined && <GrowthBadge value={growth} />}
        {sub && (
          <span className="text-[11px] text-(--muted-foreground)">{sub}</span>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <div className="text-[13px] font-bold tracking-wide text-(--foreground)">
        {title}
      </div>
      {subtitle && (
        <div className="mt-0.5 text-[11px] text-(--muted-foreground)">
          {subtitle}
        </div>
      )}
    </div>
  );
}

function Card({
  children,
  className: cls,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-xl border border-(--border) bg-(--card) p-5", cls)}
    >
      {children}
    </div>
  );
}

function HealthBar({
  label,
  value,
  max,
  color,
  suffix = "",
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] text-(--muted-foreground)">{label}</span>
        <span className="font-mono text-xs font-semibold" style={{ color }}>
          {typeof value === "number" && value > 999 ? fmtShort(value) : value}
          {suffix}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-(--muted)">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function CategoryRow({
  name,
  amount,
  pct,
  count,
  color,
}: {
  name: string;
  amount: number;
  pct: number;
  count: number;
  color: string;
}) {
  return (
    <div className="mb-2.5">
      <div className="mb-1 flex items-center justify-between">
        <span className="flex-1 truncate text-xs text-(--foreground) opacity-80">
          {name}
        </span>
        <span className="mr-2 text-[11px] text-(--muted-foreground)">
          {count}x
        </span>
        <span className="font-mono text-xs font-semibold text-(--foreground)">
          {fmtShort(amount)}
        </span>
      </div>
      <div className="h-0.75 overflow-hidden rounded-full bg-(--muted)">
        <div
          className="h-full rounded-full opacity-80"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-(--border) bg-(--card) px-3.5 py-2.5 text-xs shadow-lg">
      <div className="mb-1.5 font-semibold text-(--muted-foreground)">
        {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }} className="mb-0.5">
          {p.name}: <strong>{fmtShort(p.value)}</strong>
        </div>
      ))}
    </div>
  );
}

function Skeleton({ className: cls }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-(--muted)", cls)} />;
}

// ════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════

export function DashboardPage() {
  const { user, logout } = useAuth();

  // ── Global filter state ──
  const [walletID, setWalletID] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const globalFilter: GlobalFilter = useMemo(
    () => ({
      walletID,
      range:
        dateRange.start && dateRange.end
          ? { start: dateRange.start, end: dateRange.end }
          : undefined,
    }),
    [walletID, dateRange],
  );

  // ── Local filter state ──
  const [aggregation, setAggregation] = useState<
    "daily" | "weekly" | "monthly"
  >("monthly");
  const [categoryTab, setCategoryTab] = useState<"expense" | "income">(
    "expense",
  );

  // ── Data hooks ──
  const wallets = useWallets();
  const financialSummary = useFinancialSummary(globalFilter);
  const balance = useBalance(globalFilter, aggregation);
  const transactions = useTransactions(globalFilter, categoryTab);
  const netWorth = useNetWorthComposition();

  // ── Derived: latest financial summary ──
  const latest: FinancialSummary | null = useMemo(() => {
    if (!financialSummary.data?.length) return null;
    return financialSummary.data[financialSummary.data.length - 1];
  }, [financialSummary.data]);

  // ── Derived: balance chart data ──
  const balanceChartData = useMemo(() => {
    if (!balance.data) return [];
    return balance.data.map((s) => ({
      label: snapshotLabel(s),
      closing: s.ClosingBalance,
      income: s.TotalIncome,
      expense: s.TotalExpense,
    }));
  }, [balance.data]);

  // ── Derived: income vs expense chart data ──
  const incomeExpenseData = useMemo(() => {
    if (!financialSummary.data) return [];
    return financialSummary.data.map((s) => ({
      period: s.PeriodKey,
      income: s.IncomeNow,
      expense: s.ExpenseNow,
      profit: s.ProfitNow,
    }));
  }, [financialSummary.data]);

  // ── Derived: top categories ──
  const topCategories = useMemo(() => {
    if (!transactions.data?.length) return [];
    const total = transactions.data.reduce((s, c) => s + c.TotalAmount, 0);
    return transactions.data.slice(0, 5).map((c) => ({
      name: c.CategoryName,
      amount: c.TotalAmount,
      pct: total > 0 ? (c.TotalAmount / total) * 100 : 0,
      count: c.TotalTransactions,
    }));
  }, [transactions.data]);

  const axisStyle = {
    fill: "var(--muted-foreground)",
    fontSize: 11,
  };

  return (
    <div className="min-h-screen bg-(--background) font-body text-(--foreground)">
      {/* ════════ HEADER — Sticky Global Filter ════════ */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-(--border) bg-(--card) px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-btn text-sm font-extrabold text-dark">
            R
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide">
              Refina Analytics
            </div>
            <div className="text-[10px] text-(--muted-foreground)">
              Financial Dashboard
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="mr-1 text-[10px] uppercase tracking-widest text-(--muted-foreground)">
            Filter
          </span>

          {/* Wallet selector */}
          <select
            value={walletID}
            onChange={(e) => setWalletID(e.target.value)}
            className="rounded-lg border border-(--border) bg-(--input) px-2.5 py-1.5 text-xs text-(--foreground) outline-none focus:border-(--ring)"
          >
            <option value="">All Wallets</option>
            {wallets.data?.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Date range */}
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((p) => ({ ...p, start: e.target.value }))
            }
            className="rounded-lg border border-(--border) bg-(--input) px-2.5 py-1.5 text-xs text-(--foreground) outline-none focus:border-(--ring)"
          />
          <span className="text-xs text-(--muted-foreground)">→</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((p) => ({ ...p, end: e.target.value }))
            }
            className="rounded-lg border border-(--border) bg-(--input) px-2.5 py-1.5 text-xs text-(--foreground) outline-none focus:border-(--ring)"
          />

          {/* User info / logout */}
          {user && (
            <div className="ml-2 flex items-center gap-2">
              <span className="text-[11px] text-(--muted-foreground)">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="rounded-md border border-(--border) px-2 py-1 text-[10px] font-semibold text-(--muted-foreground) transition hover:text-(--foreground)"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ════════ CONTENT ════════ */}
      <main className="mx-auto flex max-w-350 flex-col gap-4 p-5">
        {/* ── TIER 1: KPI Cards ── */}
        {financialSummary.loading ? (
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 flex-1" />
            ))}
          </div>
        ) : latest ? (
          <div className="flex gap-3">
            <KPICard
              label="Total Income"
              value={fmtShort(latest.IncomeNow)}
              growth={latest.IncomeGrowthPct}
              accent={CHART.green}
              sub={`Largest: ${fmtShort(latest.LargestIncome)}`}
            />
            <KPICard
              label="Total Expense"
              value={fmtShort(latest.ExpenseNow)}
              growth={latest.ExpenseGrowthPct}
              accent={CHART.red}
              sub={`Largest: ${fmtShort(latest.LargestExpense)}`}
            />
            <KPICard
              label="Net Profit"
              value={fmtShort(latest.ProfitNow)}
              growth={latest.ProfitGrowthPct}
              accent={CHART.gold}
              sub={`Savings: ${latest.SavingsRate?.toFixed(1) ?? 0}%`}
            />
            <KPICard
              label="Balance"
              value={fmtShort(latest.BalanceNow)}
              growth={latest.BalanceGrowthPct}
              accent={CHART.amber}
              sub={`Runway: ${latest.RunwayDays ?? 0} days`}
            />
          </div>
        ) : (
          <div className="text-center text-sm text-(--muted-foreground)">
            No financial data available
          </div>
        )}

        {/* ── TIER 2: Balance Trend (Full Width) ── */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <SectionHeader
              title="Balance Trend"
              subtitle={
                wallets.data?.find((w) => w.id === walletID)?.name ??
                "All Wallets"
              }
            />
            <div className="flex gap-1">
              {(["daily", "weekly", "monthly"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAggregation(a)}
                  className={cn(
                    "rounded-lg border px-3 py-1 text-[11px] font-semibold capitalize transition",
                    aggregation === a
                      ? "border-gold-400/40 bg-gold-400/10 text-gold-400"
                      : "border-(--border) text-(--muted-foreground) hover:text-(--foreground)",
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {balance.loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart
                data={balanceChartData}
                margin={{ top: 4, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={CHART.gold}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="100%"
                      stopColor={CHART.gold}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={fmtShort}
                  tick={axisStyle}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="closing"
                  name="Balance"
                  fill="url(#balGrad)"
                  stroke={CHART.gold}
                  strokeWidth={2.5}
                  dot={false}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill={CHART.green}
                  opacity={0.5}
                  radius={[3, 3, 0, 0]}
                  barSize={14}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill={CHART.red}
                  opacity={0.5}
                  radius={[3, 3, 0, 0]}
                  barSize={14}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: 11,
                    paddingTop: 8,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* ── TIER 3: Detail Breakdown (3 columns) ── */}
        <div className="grid grid-cols-3 gap-4">
          {/* Col 1: Income vs Expense Bar Chart */}
          <Card>
            <SectionHeader
              title="Income vs Expense"
              subtitle="Monthly comparison"
            />
            {financialSummary.loading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={incomeExpenseData}
                  barGap={2}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="period"
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={fmtShort}
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    width={42}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill={CHART.green}
                    radius={[3, 3, 0, 0]}
                    barSize={10}
                    opacity={0.85}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill={CHART.red}
                    radius={[3, 3, 0, 0]}
                    barSize={10}
                    opacity={0.85}
                  />
                  <Bar
                    dataKey="profit"
                    name="Profit"
                    fill={CHART.blue}
                    radius={[3, 3, 0, 0]}
                    barSize={10}
                    opacity={0.85}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Col 2: Top Categories */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <SectionHeader
                title="Top Categories"
                subtitle={
                  categoryTab === "expense" ? "By spending" : "By income source"
                }
              />
              <div className="flex gap-1">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCategoryTab(t)}
                    className={cn(
                      "rounded-md border px-2.5 py-0.5 text-[10px] font-semibold capitalize transition",
                      categoryTab === t
                        ? t === "expense"
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
                          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                        : "border-(--border) text-(--muted-foreground)",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {transactions.loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : topCategories.length > 0 ? (
              topCategories.map((c, i) => (
                <CategoryRow
                  key={i}
                  name={c.name}
                  amount={c.amount}
                  pct={c.pct}
                  count={c.count}
                  color={categoryTab === "expense" ? CHART.red : CHART.green}
                />
              ))
            ) : (
              <div className="py-8 text-center text-xs text-(--muted-foreground)">
                No category data
              </div>
            )}
          </Card>

          {/* Col 3: Financial Health Indicators */}
          <Card>
            <SectionHeader
              title="Financial Health"
              subtitle="Current period indicators"
            />
            {financialSummary.loading || !latest ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <>
                <HealthBar
                  label="Expense / Income Ratio"
                  value={latest.ExpenseToIncomeRatio ?? 0}
                  max={100}
                  color={healthColor(
                    latest.ExpenseToIncomeRatio ?? 0,
                    { green: 60, yellow: 80 },
                    true,
                  )}
                  suffix="%"
                />
                <HealthBar
                  label="Savings Rate"
                  value={latest.SavingsRate ?? 0}
                  max={100}
                  color={healthColor(latest.SavingsRate ?? 0, {
                    green: 20,
                    yellow: 10,
                  })}
                  suffix="%"
                />
                <HealthBar
                  label="Daily Burn Rate"
                  value={latest.BurnRateDaily ?? 0}
                  max={1000000}
                  color={CHART.amber}
                />
                <HealthBar
                  label="Runway Days"
                  value={latest.RunwayDays ?? 0}
                  max={365}
                  color={
                    (latest.RunwayDays ?? 0) > 90 ? CHART.green : CHART.red
                  }
                  suffix=" d"
                />
                <div className="mt-1 flex justify-between border-t border-(--border) pt-2.5">
                  <div>
                    <div className="text-[10px] text-(--muted-foreground)">
                      Avg Transaction
                    </div>
                    <div className="font-mono text-[13px] font-semibold text-(--foreground)">
                      {fmtShort(latest.AvgTransactionAmount ?? 0)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-(--muted-foreground)">
                      Largest Expense
                    </div>
                    <div className="font-mono text-[13px] font-semibold text-rose-500">
                      {fmtShort(latest.LargestExpense ?? 0)}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* ── TIER 4: Net Worth (40%) + Investment (60%) ── */}
        <div className="grid grid-cols-5 gap-4">
          {/* Net Worth Composition — 2/5 */}
          <Card className="col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <SectionHeader
                title="Net Worth Composition"
                subtitle="Asset allocation"
              />
              {latest?.NetWorth?.NetWorthGrowthPct !== undefined && (
                <GrowthBadge value={latest.NetWorth.NetWorthGrowthPct} />
              )}
            </div>

            {netWorth.loading ? (
              <Skeleton className="mx-auto h-40 w-40 rounded-full" />
            ) : netWorth.data ? (
              <div className="flex items-center gap-6">
                {/* Donut */}
                <div className="relative h-40 w-40 shrink-0">
                  <PieChart width={160} height={160}>
                    <Pie
                      data={netWorth.data.Slices}
                      cx={75}
                      cy={75}
                      innerRadius={52}
                      outerRadius={72}
                      dataKey="Amount"
                      strokeWidth={0}
                      paddingAngle={3}
                    >
                      {netWorth.data.Slices?.map((_, i) => (
                        <Cell key={i} fill={CHART.pie[i] ?? CHART.gold} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-[10px] uppercase tracking-widest text-(--muted-foreground)">
                      Total
                    </div>
                    <div className="font-mono text-sm font-bold text-(--foreground)">
                      {fmtShort(netWorth.data.Total)}
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="flex flex-1 flex-col gap-2.5">
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-widest text-(--muted-foreground)">
                      Total Net Worth
                    </div>
                    <div className="font-mono text-xl font-bold text-(--foreground)">
                      {fmtShort(netWorth.data.Total)}
                    </div>
                  </div>
                  {netWorth.data.Slices?.map((s, i) => (
                    <div key={i}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px] text-(--muted-foreground)">
                          <span
                            className="inline-block h-1.75 w-1.75 rounded-sm"
                            style={{
                              background: CHART.pie[i] ?? CHART.gold,
                            }}
                          />
                          {s.Label}
                        </span>
                        <span
                          className="font-mono text-[11px] font-semibold"
                          style={{ color: CHART.pie[i] ?? CHART.gold }}
                        >
                          {fmtShort(s.Amount)}
                        </span>
                      </div>
                      <div className="h-0.75 overflow-hidden rounded-full bg-(--muted)">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.Percentage}%`,
                            background: CHART.pie[i] ?? CHART.gold,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-(--muted-foreground)">
                No net worth data
              </div>
            )}
          </Card>

          {/* Investment Summary — 3/5 */}
          <Card className="col-span-3">
            <SectionHeader
              title="Investment Summary"
              subtitle="Portfolio overview"
            />
            {financialSummary.loading || !latest?.InvestmentSummary ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Left: financial rows */}
                <div className="flex flex-col gap-2.5">
                  {[
                    {
                      label: "Total Invested",
                      value: fmtShort(latest.InvestmentSummary.TotalInvested),
                      color: "var(--foreground)",
                    },
                    {
                      label: "Current Valuation",
                      value: fmtShort(
                        latest.InvestmentSummary.TotalCurrentValuation,
                      ),
                      color: CHART.gold,
                    },
                    {
                      label: "Unrealized Gain",
                      value: `+${fmtShort(latest.InvestmentSummary.UnrealizedGain)}`,
                      color: CHART.green,
                    },
                    {
                      label: "Realized Gain",
                      value: `+${fmtShort(latest.InvestmentSummary.RealizedGain)}`,
                      color: CHART.green,
                    },
                    {
                      label: "Total Sold",
                      value: fmtShort(latest.InvestmentSummary.TotalSoldAmount),
                      color: "var(--foreground)",
                    },
                    {
                      label: "Total Deficit",
                      value: fmtShort(latest.InvestmentSummary.TotalDeficit),
                      color: CHART.red,
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-(--border) pb-2"
                    >
                      <span className="text-[11px] text-(--muted-foreground)">
                        {row.label}
                      </span>
                      <span
                        className="font-mono text-[13px] font-bold"
                        style={{ color: row.color }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right: progress + stats grid */}
                <div className="flex flex-col gap-3.5">
                  {/* Invested vs Current progress */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[11px] text-(--muted-foreground)">
                        Invested → Current
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-500">
                        +
                        {latest.InvestmentSummary.InvestmentGrowthPct?.toFixed(
                          1,
                        )}
                        %
                      </span>
                    </div>
                    <div className="mb-0.5 h-2 overflow-hidden rounded bg-(--muted)">
                      <div className="h-full w-full rounded bg-(--muted-foreground) opacity-30" />
                    </div>
                    <div className="h-2 overflow-hidden rounded bg-(--muted)">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${Math.min((latest.InvestmentSummary.TotalCurrentValuation / Math.max(latest.InvestmentSummary.TotalInvested, 1)) * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${CHART.gold}, ${CHART.green})`,
                        }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-[10px] text-(--muted-foreground)">
                        Invested
                      </span>
                      <span className="text-[10px] text-emerald-500">
                        Current
                      </span>
                    </div>
                  </div>

                  {/* Stats grid 2x2 */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: "Active Positions",
                        value: latest.InvestmentSummary.ActivePositions,
                        color: CHART.gold,
                      },
                      {
                        label: "Investment Growth",
                        value: fmtPct(
                          latest.InvestmentSummary.InvestmentGrowthPct ?? 0,
                        ),
                        color: CHART.green,
                      },
                      {
                        label: "Total Buys",
                        value: latest.InvestmentSummary.BuyCount,
                        color: CHART.green,
                      },
                      {
                        label: "Total Sells",
                        value: latest.InvestmentSummary.SellCount,
                        color: CHART.red,
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-(--border) bg-(--secondary) p-3"
                      >
                        <div
                          className="font-mono text-lg font-bold"
                          style={{ color: stat.color }}
                        >
                          {stat.value}
                        </div>
                        <div className="mt-0.5 text-[10px] text-(--muted-foreground)">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
