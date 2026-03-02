// ── Dashboard API Types ──

export interface DateRange {
  start: string;
  end: string;
}

export interface DateOption {
  date?: string;
  year?: number;
  month?: number;
  day?: number;
  range?: DateRange;
}

// ── Wallet ──

export interface Wallet {
  id: string;
  userId: string;
  walletTypeId: string;
  walletType: string;
  walletTypeName: string;
  name: string;
  number: string;
  balance: number;
}

// ── Financial Summary ──

export interface InvestmentSummary {
  TotalInvested: number;
  TotalCurrentValuation: number;
  TotalSoldAmount: number;
  TotalDeficit: number;
  UnrealizedGain: number;
  RealizedGain: number;
  InvestmentGrowthPct: number;
  BuyCount: number;
  SellCount: number;
  ActivePositions: number;
}

export interface NetWorth {
  Total: number;
  WalletPortion: number;
  InvestmentPortion: number;
  NetWorthPrev: number;
  NetWorthGrowthPct: number;
}

export interface FinancialSummary {
  UserID: string;
  PeriodType: string;
  PeriodKey: string;
  PeriodStart: string;
  PeriodEnd: string;

  IncomeNow: number;
  ExpenseNow: number;
  ProfitNow: number;
  BalanceNow: number;

  IncomePrev: number;
  ExpensePrev: number;
  ProfitPrev: number;
  BalancePrev: number;

  IncomeGrowthPct: number;
  ExpenseGrowthPct: number;
  ProfitGrowthPct: number;
  BalanceGrowthPct: number;

  SavingsRate: number;
  ExpenseToIncomeRatio: number;
  BurnRateDaily: number;
  AvgIncomeDaily: number;
  AvgExpenseDaily: number;
  RunwayDays: number;

  TotalTransactions: number;
  IncomeTransactionCount: number;
  ExpenseTransactionCount: number;
  AvgTransactionAmount: number;
  LargestIncome: number;
  LargestExpense: number;

  InvestmentSummary: InvestmentSummary;
  NetWorth: NetWorth;
}

// ── Balance Snapshot ──

export interface BalanceSnapshot {
  Year: number;
  Month: number;
  Day?: number;
  Week?: number;
  WalletID?: string;
  WalletName?: string;
  OpeningBalance: number;
  ClosingBalance: number;
  TotalIncome: number;
  TotalExpense: number;
  NetChange: number;
  TransactionCount?: number;
  TotalTransactions?: number;
  Date?: string;
}

// ── Transaction Category ──

export interface TransactionCategory {
  CategoryID: string;
  CategoryName: string;
  CategoryType: "income" | "expense";
  TotalAmount: number;
  TotalTransactions: number;
}

// ── Net Worth Composition ──

export interface NetWorthSlice {
  Label: string;
  Amount: number;
  Percentage: number;
  Details?: {
    ItemCount: number;
    Description: string;
    UnrealizedGain: number;
  };
}

export interface NetWorthComposition {
  UserID: string;
  Total: number;
  Slices: NetWorthSlice[];
}
