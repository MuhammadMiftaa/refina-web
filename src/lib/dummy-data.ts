import type { Wallet, WalletType, WalletSummary } from "@/types/wallet";
import type {
  Transaction,
  TransactionListResponse,
  Category,
} from "@/types/transaction";
import type {
  Investment,
  InvestmentSold,
  InvestmentSummary,
  AssetCode,
  InvestmentListResponse,
} from "@/types/investment";
import type {
  FinancialSummary,
  BalanceSnapshot,
  TransactionCategory,
  NetWorthComposition,
  Wallet as DashboardWallet,
} from "@/types/dashboard";

// ════════════════════════════════════════════
// WALLET TYPES (DUMMY)
// ════════════════════════════════════════════

export const DUMMY_WALLET_TYPES: WalletType[] = [
  {
    id: "wt-001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "BCA (Bank Central Asia)",
    type: "bank",
    description: "Bank Central Asia",
  },
  {
    id: "wt-002",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "Mandiri",
    type: "bank",
    description: "Bank Mandiri",
  },
  {
    id: "wt-003",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "GoPay (Gojek)",
    type: "e-wallet",
    description: "GoPay Digital Wallet",
  },
  {
    id: "wt-004",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "OVO (Grab)",
    type: "e-wallet",
    description: "OVO Digital Wallet",
  },
  {
    id: "wt-005",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "Dompet Fisik (Cash)",
    type: "cash",
    description: "Cash on hand",
  },
  {
    id: "wt-006",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "BNI (Bank Negara Indonesia)",
    type: "bank",
    description: "Bank Negara Indonesia",
  },
  {
    id: "wt-007",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "DANA",
    type: "e-wallet",
    description: "DANA Digital Wallet",
  },
];

// ════════════════════════════════════════════
// WALLETS (DUMMY)
// ════════════════════════════════════════════

export const DUMMY_WALLETS: Wallet[] = [
  {
    id: "w-001",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2026-02-28T12:00:00Z",
    deleted_at: null,
    user_id: "user-001",
    wallet_type_id: "wt-001",
    name: "BCA Primary",
    balance: 15750000,
    number: "8901234567",
    wallet_type_detail: DUMMY_WALLET_TYPES[0],
    transaction_count: 142,
  },
  {
    id: "w-002",
    created_at: "2024-03-01T08:00:00Z",
    updated_at: "2026-02-28T12:00:00Z",
    deleted_at: null,
    user_id: "user-001",
    wallet_type_id: "wt-002",
    name: "Mandiri Savings",
    balance: 8250000,
    number: "1234567890",
    wallet_type_detail: DUMMY_WALLET_TYPES[1],
    transaction_count: 67,
  },
  {
    id: "w-003",
    created_at: "2024-06-10T14:00:00Z",
    updated_at: "2026-02-28T12:00:00Z",
    deleted_at: null,
    user_id: "user-001",
    wallet_type_id: "wt-003",
    name: "GoPay Daily",
    balance: 450000,
    number: "081234567890",
    wallet_type_detail: DUMMY_WALLET_TYPES[2],
    transaction_count: 89,
  },
  {
    id: "w-004",
    created_at: "2024-09-20T10:00:00Z",
    updated_at: "2026-02-28T12:00:00Z",
    deleted_at: null,
    user_id: "user-001",
    wallet_type_id: "wt-004",
    name: "OVO Cashback",
    balance: 125000,
    number: "081234567891",
    wallet_type_detail: DUMMY_WALLET_TYPES[3],
    transaction_count: 34,
  },
  {
    id: "w-005",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-02-28T12:00:00Z",
    deleted_at: null,
    user_id: "user-001",
    wallet_type_id: "wt-005",
    name: "Cash Wallet",
    balance: 0,
    number: "-",
    wallet_type_detail: DUMMY_WALLET_TYPES[4],
    transaction_count: 12,
  },
  {
    id: "w-006",
    created_at: "2025-01-05T08:30:00Z",
    updated_at: "2026-02-28T12:00:00Z",
    deleted_at: null,
    user_id: "user-001",
    wallet_type_id: "wt-006",
    name: "BNI Payroll",
    balance: 22300000,
    number: "0987654321",
    wallet_type_detail: DUMMY_WALLET_TYPES[5],
    transaction_count: 24,
  },
];

// ════════════════════════════════════════════
// WALLET SUMMARY (DUMMY)
// ════════════════════════════════════════════

export const DUMMY_WALLET_SUMMARY: WalletSummary = {
  total_wallets: DUMMY_WALLETS.length,
  total_balance: DUMMY_WALLETS.reduce((sum, w) => sum + w.balance, 0),
  total_transactions: DUMMY_WALLETS.reduce(
    (sum, w) => sum + (w.transaction_count ?? 0),
    0,
  ),
};

// ════════════════════════════════════════════
// CATEGORIES (DUMMY)
// ════════════════════════════════════════════

export const DUMMY_CATEGORIES: Category[] = [
  // Income
  {
    id: "cat-001",
    name: "Salary",
    type: "income",
    group_name: "Employment",
  },
  {
    id: "cat-002",
    name: "Freelance",
    type: "income",
    group_name: "Employment",
  },
  {
    id: "cat-003",
    name: "Investment Return",
    type: "income",
    group_name: "Passive Income",
  },
  // Expense
  {
    id: "cat-010",
    name: "Food & Beverage",
    type: "expense",
    group_name: "Daily Needs",
  },
  {
    id: "cat-011",
    name: "Transportation",
    type: "expense",
    group_name: "Daily Needs",
  },
  {
    id: "cat-012",
    name: "Utilities",
    type: "expense",
    group_name: "Bills",
  },
  {
    id: "cat-013",
    name: "Entertainment",
    type: "expense",
    group_name: "Lifestyle",
  },
  {
    id: "cat-014",
    name: "Shopping",
    type: "expense",
    group_name: "Lifestyle",
  },
  {
    id: "cat-015",
    name: "Health",
    type: "expense",
    group_name: "Essentials",
  },
  // Fund Transfer
  {
    id: "cat-020",
    name: "Transfer",
    type: "fund_transfer",
    group_name: "Transfer",
  },
];

// ════════════════════════════════════════════
// TRANSACTIONS (DUMMY)
// ════════════════════════════════════════════

export const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-001",
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-03-01T09:00:00Z",
    deleted_at: null,
    wallet_id: "w-001",
    category_id: "cat-001",
    amount: 12500000,
    transaction_date: "2026-03-01T09:00:00Z",
    description: "Monthly salary - March 2026",
    wallet_name: "BCA Primary",
    category_name: "Salary",
    category_type: "income",
    attachments: [],
  },
  {
    id: "txn-002",
    created_at: "2026-03-01T12:30:00Z",
    updated_at: "2026-03-01T12:30:00Z",
    deleted_at: null,
    wallet_id: "w-003",
    category_id: "cat-010",
    amount: 85000,
    transaction_date: "2026-03-01T12:30:00Z",
    description: "Lunch at Japanese restaurant",
    wallet_name: "GoPay Daily",
    category_name: "Food & Beverage",
    category_type: "expense",
    attachments: [
      {
        id: "att-001",
        created_at: "2026-03-01T12:30:00Z",
        updated_at: "2026-03-01T12:30:00Z",
        deleted_at: null,
        transaction_id: "txn-002",
        image: null,
        format: "image/jpeg",
        size: 245000,
      },
    ],
  },
  {
    id: "txn-003",
    created_at: "2026-03-02T07:15:00Z",
    updated_at: "2026-03-02T07:15:00Z",
    deleted_at: null,
    wallet_id: "w-004",
    category_id: "cat-011",
    amount: 25000,
    transaction_date: "2026-03-02T07:15:00Z",
    description: "Grab ride to office",
    wallet_name: "OVO Cashback",
    category_name: "Transportation",
    category_type: "expense",
    attachments: [],
  },
  {
    id: "txn-004",
    created_at: "2026-03-02T14:00:00Z",
    updated_at: "2026-03-02T14:00:00Z",
    deleted_at: null,
    wallet_id: "w-001",
    category_id: "cat-002",
    amount: 3500000,
    transaction_date: "2026-03-02T14:00:00Z",
    description: "Freelance project - UI/UX Design",
    wallet_name: "BCA Primary",
    category_name: "Freelance",
    category_type: "income",
    attachments: [],
  },
  {
    id: "txn-005",
    created_at: "2026-03-03T10:00:00Z",
    updated_at: "2026-03-03T10:00:00Z",
    deleted_at: null,
    wallet_id: "w-002",
    category_id: "cat-012",
    amount: 750000,
    transaction_date: "2026-03-03T10:00:00Z",
    description: "Monthly electricity bill",
    wallet_name: "Mandiri Savings",
    category_name: "Utilities",
    category_type: "expense",
    attachments: [
      {
        id: "att-002",
        created_at: "2026-03-03T10:00:00Z",
        updated_at: "2026-03-03T10:00:00Z",
        deleted_at: null,
        transaction_id: "txn-005",
        image: null,
        format: "image/png",
        size: 180000,
      },
    ],
  },
  {
    id: "txn-006",
    created_at: "2026-02-28T16:00:00Z",
    updated_at: "2026-02-28T16:00:00Z",
    deleted_at: null,
    wallet_id: "w-001",
    category_id: "cat-020",
    amount: 500000,
    transaction_date: "2026-02-28T16:00:00Z",
    description: "Transfer to GoPay for daily spending",
    wallet_name: "BCA Primary",
    category_name: "Transfer",
    category_type: "fund_transfer",
    attachments: [],
  },
  {
    id: "txn-007",
    created_at: "2026-02-27T11:00:00Z",
    updated_at: "2026-02-27T11:00:00Z",
    deleted_at: null,
    wallet_id: "w-003",
    category_id: "cat-013",
    amount: 150000,
    transaction_date: "2026-02-27T11:00:00Z",
    description: "Netflix monthly subscription",
    wallet_name: "GoPay Daily",
    category_name: "Entertainment",
    category_type: "expense",
    attachments: [],
  },
  {
    id: "txn-008",
    created_at: "2026-02-26T18:30:00Z",
    updated_at: "2026-02-26T18:30:00Z",
    deleted_at: null,
    wallet_id: "w-001",
    category_id: "cat-014",
    amount: 1250000,
    transaction_date: "2026-02-26T18:30:00Z",
    description: "New headphones - Sony WH-1000XM5",
    wallet_name: "BCA Primary",
    category_name: "Shopping",
    category_type: "expense",
    attachments: [
      {
        id: "att-003",
        created_at: "2026-02-26T18:30:00Z",
        updated_at: "2026-02-26T18:30:00Z",
        deleted_at: null,
        transaction_id: "txn-008",
        image: null,
        format: "image/jpeg",
        size: 320000,
      },
    ],
  },
  {
    id: "txn-009",
    created_at: "2026-02-25T09:00:00Z",
    updated_at: "2026-02-25T09:00:00Z",
    deleted_at: null,
    wallet_id: "w-006",
    category_id: "cat-001",
    amount: 12500000,
    transaction_date: "2026-02-25T09:00:00Z",
    description: "Monthly salary - February 2026",
    wallet_name: "BNI Payroll",
    category_name: "Salary",
    category_type: "income",
    attachments: [],
  },
  {
    id: "txn-010",
    created_at: "2026-02-24T13:45:00Z",
    updated_at: "2026-02-24T13:45:00Z",
    deleted_at: null,
    wallet_id: "w-002",
    category_id: "cat-015",
    amount: 350000,
    transaction_date: "2026-02-24T13:45:00Z",
    description: "Medical checkup",
    wallet_name: "Mandiri Savings",
    category_name: "Health",
    category_type: "expense",
    attachments: [],
  },
  {
    id: "txn-011",
    created_at: "2026-02-23T20:00:00Z",
    updated_at: "2026-02-23T20:00:00Z",
    deleted_at: null,
    wallet_id: "w-003",
    category_id: "cat-010",
    amount: 55000,
    transaction_date: "2026-02-23T20:00:00Z",
    description: "Dinner delivery - GoFood",
    wallet_name: "GoPay Daily",
    category_name: "Food & Beverage",
    category_type: "expense",
    attachments: [],
  },
  {
    id: "txn-012",
    created_at: "2026-02-22T15:00:00Z",
    updated_at: "2026-02-22T15:00:00Z",
    deleted_at: null,
    wallet_id: "w-001",
    category_id: "cat-003",
    amount: 750000,
    transaction_date: "2026-02-22T15:00:00Z",
    description: "Stock dividend - BBCA",
    wallet_name: "BCA Primary",
    category_name: "Investment Return",
    category_type: "income",
    attachments: [],
  },
  {
    id: "txn-013",
    created_at: "2026-02-21T09:30:00Z",
    updated_at: "2026-02-21T09:30:00Z",
    deleted_at: null,
    wallet_id: "w-004",
    category_id: "cat-011",
    amount: 18000,
    transaction_date: "2026-02-21T09:30:00Z",
    description: "Commuter line ticket",
    wallet_name: "OVO Cashback",
    category_name: "Transportation",
    category_type: "expense",
    attachments: [],
  },
  {
    id: "txn-014",
    created_at: "2026-02-20T17:00:00Z",
    updated_at: "2026-02-20T17:00:00Z",
    deleted_at: null,
    wallet_id: "w-002",
    category_id: "cat-012",
    amount: 450000,
    transaction_date: "2026-02-20T17:00:00Z",
    description: "Internet subscription",
    wallet_name: "Mandiri Savings",
    category_name: "Utilities",
    category_type: "expense",
    attachments: [],
  },
  {
    id: "txn-015",
    created_at: "2026-02-19T12:00:00Z",
    updated_at: "2026-02-19T12:00:00Z",
    deleted_at: null,
    wallet_id: "w-001",
    category_id: "cat-020",
    amount: 2000000,
    transaction_date: "2026-02-19T16:00:00Z",
    description: "Transfer to Mandiri for savings",
    wallet_name: "BCA Primary",
    category_name: "Transfer",
    category_type: "fund_transfer",
    attachments: [],
  },
];

/** Generate paginated transaction list from dummy data */
export function getDummyTransactionList(
  params: {
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    search?: string;
  } = {},
): TransactionListResponse {
  const {
    page = 1,
    page_size = 10,
    sort_by = "transaction_date",
    sort_order = "desc",
    search = "",
  } = params;

  let filtered = [...DUMMY_TRANSACTIONS];

  // Search
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description?.toLowerCase().includes(q) ||
        t.wallet_name?.toLowerCase().includes(q) ||
        t.category_name?.toLowerCase().includes(q) ||
        t.amount.toString().includes(q),
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal: string | number = 0;
    let bVal: string | number = 0;

    switch (sort_by) {
      case "amount":
        aVal = a.amount;
        bVal = b.amount;
        break;
      case "wallet_name":
        aVal = a.wallet_name ?? "";
        bVal = b.wallet_name ?? "";
        break;
      case "category_name":
        aVal = a.category_name ?? "";
        bVal = b.category_name ?? "";
        break;
      case "description":
        aVal = a.description ?? "";
        bVal = b.description ?? "";
        break;
      case "transaction_date":
      default:
        aVal = new Date(a.transaction_date).getTime();
        bVal = new Date(b.transaction_date).getTime();
        break;
    }

    if (typeof aVal === "string") {
      return sort_order === "asc"
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }
    return sort_order === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  // Paginate
  const total = filtered.length;
  const start = page_size === -1 ? 0 : (page - 1) * page_size;
  const end = page_size === -1 ? total : start + page_size;
  const transactions = filtered.slice(start, end);

  return {
    transactions,
    total,
    page_size,
    next_cursor: "",
    has_next: end < total,
    next_cursor_amount:
      transactions.length > 0
        ? transactions[transactions.length - 1].amount
        : 0,
    next_cursor_date:
      transactions.length > 0
        ? transactions[transactions.length - 1].transaction_date
        : "",
  };
}

// ════════════════════════════════════════════
// ASSET CODES (DUMMY)
// ════════════════════════════════════════════

export const DUMMY_ASSET_CODES: AssetCode[] = [
  {
    code: "XAU",
    name: "Gold",
    unit: "troy oz",
    toUSD: 2650.0,
    toEUR: 2430.0,
    toIDR: 42400000,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "XAG",
    name: "Silver",
    unit: "troy oz",
    toUSD: 31.5,
    toEUR: 28.9,
    toIDR: 504000,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "BBCA",
    name: "Bank Central Asia Tbk",
    unit: "lot",
    toUSD: null,
    toEUR: null,
    toIDR: 9875,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "BBRI",
    name: "Bank Rakyat Indonesia Tbk",
    unit: "lot",
    toUSD: null,
    toEUR: null,
    toIDR: 4520,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "BTC",
    name: "Bitcoin",
    unit: "BTC",
    toUSD: 87500.0,
    toEUR: 80250.0,
    toIDR: 1400000000,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "ETH",
    name: "Ethereum",
    unit: "ETH",
    toUSD: 3250.0,
    toEUR: 2980.0,
    toIDR: 52000000,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
  },
  {
    code: "TLKM",
    name: "Telkom Indonesia Tbk",
    unit: "lot",
    toUSD: null,
    toEUR: null,
    toIDR: 3880,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
  },
];

// ════════════════════════════════════════════
// INVESTMENTS (DUMMY)
// ════════════════════════════════════════════

const SOLD_RECORDS: InvestmentSold[] = [
  {
    id: "sold-001",
    investment_id: "inv-002",
    user_id: "user-001",
    quantity: 200,
    amount: 1940000,
    sell_price: 9700,
    deficit: -60000,
    date: "2026-01-15T10:00:00Z",
    description: "Partial profit taking",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "sold-002",
    investment_id: "inv-005",
    user_id: "user-001",
    quantity: 0.005,
    amount: 437500,
    sell_price: 87500,
    deficit: 37500,
    date: "2026-02-10T14:00:00Z",
    description: "Selling some BTC",
    created_at: "2026-02-10T14:00:00Z",
    updated_at: "2026-02-10T14:00:00Z",
    deleted_at: null,
  },
];

export const DUMMY_INVESTMENTS: Investment[] = [
  {
    id: "inv-001",
    user_id: "user-001",
    code: "XAU",
    quantity: 2,
    amount: 78000000,
    initial_valuation: 39000000,
    date: "2025-06-15T10:00:00Z",
    description: "Gold bar investment",
    created_at: "2025-06-15T10:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
    asset: DUMMY_ASSET_CODES[0],
    sold_records: [],
  },
  {
    id: "inv-002",
    user_id: "user-001",
    code: "BBCA",
    quantity: 500,
    amount: 4500000,
    initial_valuation: 9000,
    date: "2025-03-10T09:00:00Z",
    description: "BCA stocks - long term hold",
    created_at: "2025-03-10T09:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
    asset: DUMMY_ASSET_CODES[2],
    sold_records: [SOLD_RECORDS[0]],
  },
  {
    id: "inv-003",
    user_id: "user-001",
    code: "BBRI",
    quantity: 1000,
    amount: 4200000,
    initial_valuation: 4200,
    date: "2025-08-20T11:00:00Z",
    description: "BRI stocks",
    created_at: "2025-08-20T11:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
    asset: DUMMY_ASSET_CODES[3],
    sold_records: [],
  },
  {
    id: "inv-004",
    user_id: "user-001",
    code: "XAG",
    quantity: 10,
    amount: 4500000,
    initial_valuation: 450000,
    date: "2025-10-01T14:00:00Z",
    description: "Silver investment",
    created_at: "2025-10-01T14:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
    asset: DUMMY_ASSET_CODES[1],
    sold_records: [],
  },
  {
    id: "inv-005",
    user_id: "user-001",
    code: "BTC",
    quantity: 0.05,
    amount: 56000000,
    initial_valuation: 1120000000,
    date: "2025-01-05T08:00:00Z",
    description: "Bitcoin DCA",
    created_at: "2025-01-05T08:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
    asset: DUMMY_ASSET_CODES[4],
    sold_records: [SOLD_RECORDS[1]],
  },
  {
    id: "inv-006",
    user_id: "user-001",
    code: "ETH",
    quantity: 1.5,
    amount: 60000000,
    initial_valuation: 40000000,
    date: "2025-04-20T10:00:00Z",
    description: "Ethereum hold",
    created_at: "2025-04-20T10:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
    asset: DUMMY_ASSET_CODES[5],
    sold_records: [],
  },
  {
    id: "inv-007",
    user_id: "user-001",
    code: "TLKM",
    quantity: 2000,
    amount: 7000000,
    initial_valuation: 3500,
    date: "2025-07-12T09:30:00Z",
    description: "Telkom long-term",
    created_at: "2025-07-12T09:30:00Z",
    updated_at: "2026-03-01T00:00:00Z",
    deleted_at: null,
    asset: DUMMY_ASSET_CODES[6],
    sold_records: [],
  },
];

// ════════════════════════════════════════════
// INVESTMENT SUMMARY (DUMMY)
// ════════════════════════════════════════════

function computeCurrentValue(inv: Investment): number {
  const price = inv.asset?.toIDR ?? inv.initial_valuation;
  return inv.quantity * price;
}

export function getDummyInvestmentSummary(): InvestmentSummary {
  const totalInvested = DUMMY_INVESTMENTS.reduce((s, i) => s + i.amount, 0);
  const totalCurrentValue = DUMMY_INVESTMENTS.reduce(
    (s, i) => s + computeCurrentValue(i),
    0,
  );
  const totalSoldAmount = DUMMY_INVESTMENTS.reduce(
    (s, i) => s + (i.sold_records?.reduce((ss, r) => ss + r.amount, 0) ?? 0),
    0,
  );
  const totalRealizedGain = DUMMY_INVESTMENTS.reduce(
    (s, i) =>
      s + (i.sold_records?.reduce((ss, r) => ss + (r.deficit ?? 0), 0) ?? 0),
    0,
  );
  const pl = totalCurrentValue - totalInvested;
  const plPct = totalInvested > 0 ? (pl / totalInvested) * 100 : 0;
  return {
    total_investments: DUMMY_INVESTMENTS.length,
    total_invested: totalInvested,
    total_current_value: totalCurrentValue,
    total_profit_loss: pl,
    total_profit_loss_pct: plPct,
    total_sold_amount: totalSoldAmount,
    total_realized_gain: totalRealizedGain,
  };
}

/** Generate paginated investment list from dummy data */
export function getDummyInvestmentList(
  params: {
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    search?: string;
    code?: string;
  } = {},
): InvestmentListResponse {
  const {
    page = 1,
    page_size = 10,
    sort_by = "date",
    sort_order = "desc",
    search = "",
    code = "",
  } = params;

  let filtered = [...DUMMY_INVESTMENTS];

  if (code) {
    filtered = filtered.filter((i) => i.code === code);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.code.toLowerCase().includes(q) ||
        i.asset?.name.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q),
    );
  }

  filtered.sort((a, b) => {
    let aVal: string | number = 0;
    let bVal: string | number = 0;
    switch (sort_by) {
      case "amount":
        aVal = a.amount;
        bVal = b.amount;
        break;
      case "quantity":
        aVal = a.quantity;
        bVal = b.quantity;
        break;
      case "code":
        aVal = a.code;
        bVal = b.code;
        break;
      case "current_value":
        aVal = computeCurrentValue(a);
        bVal = computeCurrentValue(b);
        break;
      case "date":
      default:
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
        break;
    }
    if (typeof aVal === "string") {
      return sort_order === "asc"
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }
    return sort_order === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const total = filtered.length;
  const totalPages = page_size === -1 ? 1 : Math.ceil(total / page_size);
  const start = page_size === -1 ? 0 : (page - 1) * page_size;
  const end = page_size === -1 ? total : start + page_size;
  const investments = filtered.slice(start, end);

  return {
    investments,
    total,
    page,
    page_size,
    total_pages: totalPages,
  };
}

// ════════════════════════════════════════════
// DASHBOARD DUMMY DATA
// ════════════════════════════════════════════

export const DUMMY_DASHBOARD_WALLETS: DashboardWallet[] = DUMMY_WALLETS.map(
  (w) => ({
    wallet_id: w.id,
    user_id: w.user_id,
    wallet_name: w.name,
    wallet_type: w.wallet_type_detail?.type ?? "bank",
    wallet_type_name: w.wallet_type_detail?.name ?? w.name,
    balance: w.balance,
    currency: "IDR",
    is_active: true,
  }),
);

export function getDummyFinancialSummary(): FinancialSummary[] {
  const totalBalance = DUMMY_WALLETS.reduce((s, w) => s + w.balance, 0);
  const invSummary = getDummyInvestmentSummary();

  return [
    {
      user_id: "user-001",
      period_type: "monthly",
      period_key: "2026-03",
      period_start: "2026-03-01T00:00:00Z",
      period_end: "2026-03-31T23:59:59Z",

      income_now: 18500000,
      expense_now: 12300000,
      profit_now: 6200000,
      balance_now: totalBalance,

      income_prev: 16200000,
      expense_prev: 11500000,
      profit_prev: 4700000,
      balance_prev: totalBalance - 6200000,

      income_growth_pct: 14.2,
      expense_growth_pct: 7.0,
      profit_growth_pct: 31.9,
      balance_growth_pct: 12.5,

      savings_rate: 33.5,
      expense_to_income_ratio: 66.5,
      burn_rate_daily: 410000,
      avg_income_daily: 616667,
      avg_expense_daily: 410000,
      runway_days: Math.round(totalBalance / 410000),

      total_transactions: 45,
      income_transaction_count: 12,
      expense_transaction_count: 33,
      avg_transaction_amount: 683333,
      largest_income: 8500000,
      largest_expense: 3200000,

      investment_summary: {
        total_invested: invSummary.total_invested,
        total_current_valuation: invSummary.total_current_value,
        total_sold_amount: invSummary.total_sold_amount,
        total_deficit: invSummary.total_realized_gain,
        unrealized_gain: invSummary.total_profit_loss,
        realized_gain: invSummary.total_realized_gain,
        investment_growth_pct: invSummary.total_profit_loss_pct,
        buy_count: 7,
        sell_count: 2,
        active_positions: invSummary.total_investments,
      },

      net_worth: {
        total: totalBalance + invSummary.total_current_value,
        wallet_portion: totalBalance,
        investment_portion: invSummary.total_current_value,
        net_worth_prev:
          totalBalance - 6200000 + invSummary.total_current_value * 0.95,
        net_worth_growth_pct: 8.3,
      },

      top_expense_categories: [
        {
          category_id: "cat-001",
          category_name: "Food & Dining",
          amount: 3200000,
          percentage: 26.0,
          transaction_count: 12,
        },
        {
          category_id: "cat-002",
          category_name: "Transportation",
          amount: 2100000,
          percentage: 17.1,
          transaction_count: 8,
        },
        {
          category_id: "cat-003",
          category_name: "Shopping",
          amount: 1850000,
          percentage: 15.0,
          transaction_count: 5,
        },
      ],
      top_income_categories: [
        {
          category_id: "cat-006",
          category_name: "Salary",
          amount: 12000000,
          percentage: 64.9,
          transaction_count: 1,
        },
        {
          category_id: "cat-007",
          category_name: "Freelance",
          amount: 4500000,
          percentage: 24.3,
          transaction_count: 3,
        },
        {
          category_id: "cat-008",
          category_name: "Investment Returns",
          amount: 2000000,
          percentage: 10.8,
          transaction_count: 2,
        },
      ],
    },
  ];
}

export function getDummyBalanceSnapshots(
  aggregation: "daily" | "weekly" | "monthly" = "monthly",
): BalanceSnapshot[] {
  if (aggregation === "monthly") {
    return [
      {
        year: 2025,
        month: 10,
        opening_balance: 28000000,
        closing_balance: 30500000,
        total_income: 15800000,
        total_expense: 13300000,
        net_change: 2500000,
        transaction_count: 38,
      },
      {
        year: 2025,
        month: 11,
        opening_balance: 30500000,
        closing_balance: 33200000,
        total_income: 16500000,
        total_expense: 13800000,
        net_change: 2700000,
        transaction_count: 41,
      },
      {
        year: 2025,
        month: 12,
        opening_balance: 33200000,
        closing_balance: 35800000,
        total_income: 17200000,
        total_expense: 14600000,
        net_change: 2600000,
        transaction_count: 44,
      },
      {
        year: 2026,
        month: 1,
        opening_balance: 35800000,
        closing_balance: 38900000,
        total_income: 16200000,
        total_expense: 13100000,
        net_change: 3100000,
        transaction_count: 40,
      },
      {
        year: 2026,
        month: 2,
        opening_balance: 38900000,
        closing_balance: 42300000,
        total_income: 16200000,
        total_expense: 12800000,
        net_change: 3400000,
        transaction_count: 42,
      },
      {
        year: 2026,
        month: 3,
        opening_balance: 42300000,
        closing_balance: 48500000,
        total_income: 18500000,
        total_expense: 12300000,
        net_change: 6200000,
        transaction_count: 45,
      },
    ];
  }

  // weekly
  if (aggregation === "weekly") {
    return Array.from({ length: 8 }, (_, i) => {
      const base = 40000000 + i * 1200000;
      return {
        year: 2026,
        month: i < 4 ? 2 : 3,
        week: (i % 4) + 1,
        opening_balance: base,
        closing_balance: base + 1200000,
        total_income: 4200000 + Math.round(Math.random() * 500000),
        total_expense: 3000000 + Math.round(Math.random() * 400000),
        net_change: 1200000,
        transaction_count: 10 + Math.floor(Math.random() * 5),
      };
    });
  }

  // daily
  return Array.from({ length: 14 }, (_, i) => {
    const day = i + 1;
    const base = 42300000 + i * 440000;
    return {
      year: 2026,
      month: 3,
      day,
      opening_balance: base,
      closing_balance: base + 440000,
      total_income: 1300000 + Math.round(Math.random() * 300000),
      total_expense: 860000 + Math.round(Math.random() * 200000),
      net_change: 440000,
      transaction_count: 3 + Math.floor(Math.random() * 3),
      date: `2026-03-${String(day).padStart(2, "0")}`,
    };
  });
}

export function getDummyTransactionCategories(
  categoryType: "expense" | "income",
): TransactionCategory[] {
  if (categoryType === "expense") {
    return [
      {
        category_id: "cat-001",
        category_name: "Food & Dining",
        category_type: "expense",
        total_amount: 3200000,
        total_transactions: 12,
      },
      {
        category_id: "cat-002",
        category_name: "Transportation",
        category_type: "expense",
        total_amount: 2100000,
        total_transactions: 8,
      },
      {
        category_id: "cat-003",
        category_name: "Shopping",
        category_type: "expense",
        total_amount: 1850000,
        total_transactions: 5,
      },
      {
        category_id: "cat-004",
        category_name: "Utilities",
        category_type: "expense",
        total_amount: 1500000,
        total_transactions: 4,
      },
      {
        category_id: "cat-005",
        category_name: "Entertainment",
        category_type: "expense",
        total_amount: 950000,
        total_transactions: 3,
      },
    ];
  }
  return [
    {
      category_id: "cat-006",
      category_name: "Salary",
      category_type: "income",
      total_amount: 12000000,
      total_transactions: 1,
    },
    {
      category_id: "cat-007",
      category_name: "Freelance",
      category_type: "income",
      total_amount: 4500000,
      total_transactions: 3,
    },
    {
      category_id: "cat-008",
      category_name: "Investment Returns",
      category_type: "income",
      total_amount: 2000000,
      total_transactions: 2,
    },
  ];
}

export function getDummyNetWorthComposition(): NetWorthComposition {
  const totalBalance = DUMMY_WALLETS.reduce((s, w) => s + w.balance, 0);
  const invSummary = getDummyInvestmentSummary();
  const total = totalBalance + invSummary.total_current_value;

  return {
    user_id: "user-001",
    total,
    slices: [
      {
        label: "Bank Accounts",
        amount: 42450000,
        percentage: (42450000 / total) * 100,
        details: {
          item_count: 3,
          description: "BCA, Mandiri, BNI",
        },
      },
      {
        label: "E-Wallets",
        amount: 5050000,
        percentage: (5050000 / total) * 100,
        details: {
          item_count: 3,
          description: "GoPay, OVO, DANA",
        },
      },
      {
        label: "Cash",
        amount: 1000000,
        percentage: (1000000 / total) * 100,
        details: {
          item_count: 1,
          description: "Cash on hand",
        },
      },
      {
        label: "Investments",
        amount: invSummary.total_current_value,
        percentage: (invSummary.total_current_value / total) * 100,
        details: {
          item_count: invSummary.total_investments,
          description: "Gold, Stocks, Crypto",
          unrealized_gain: invSummary.total_profit_loss,
        },
      },
    ],
  };
}
