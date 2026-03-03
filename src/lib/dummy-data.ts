import type { Wallet, WalletType, WalletSummary } from "@/types/wallet";
import type {
  Transaction,
  TransactionListResponse,
  Category,
} from "@/types/transaction";

// ════════════════════════════════════════════
// WALLET TYPES (DUMMY)
// ════════════════════════════════════════════

export const DUMMY_WALLET_TYPES: WalletType[] = [
  {
    id: "wt-001",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "Bank BCA",
    type: "bank",
    description: "Bank Central Asia",
  },
  {
    id: "wt-002",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "Bank Mandiri",
    type: "bank",
    description: "Bank Mandiri",
  },
  {
    id: "wt-003",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "GoPay",
    type: "e-wallet",
    description: "GoPay Digital Wallet",
  },
  {
    id: "wt-004",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "OVO",
    type: "e-wallet",
    description: "OVO Digital Wallet",
  },
  {
    id: "wt-005",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "Cash",
    type: "cash",
    description: "Cash on hand",
  },
  {
    id: "wt-006",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    name: "Bank BNI",
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
    wallet_type: DUMMY_WALLET_TYPES[0],
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
    wallet_type: DUMMY_WALLET_TYPES[1],
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
    wallet_type: DUMMY_WALLET_TYPES[2],
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
    wallet_type: DUMMY_WALLET_TYPES[3],
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
    wallet_type: DUMMY_WALLET_TYPES[4],
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
    wallet_type: DUMMY_WALLET_TYPES[5],
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
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    parent_id: null,
    name: "Salary",
    type: "income",
  },
  {
    id: "cat-002",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    parent_id: null,
    name: "Freelance",
    type: "income",
  },
  {
    id: "cat-003",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    parent_id: null,
    name: "Investment Return",
    type: "income",
  },
  // Expense
  {
    id: "cat-010",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    parent_id: null,
    name: "Food & Beverage",
    type: "expense",
  },
  {
    id: "cat-011",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    parent_id: null,
    name: "Transportation",
    type: "expense",
  },
  {
    id: "cat-012",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    parent_id: null,
    name: "Utilities",
    type: "expense",
  },
  {
    id: "cat-013",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    parent_id: null,
    name: "Entertainment",
    type: "expense",
  },
  {
    id: "cat-014",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    parent_id: null,
    name: "Shopping",
    type: "expense",
  },
  {
    id: "cat-015",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    parent_id: null,
    name: "Health",
    type: "expense",
  },
  // Fund Transfer
  {
    id: "cat-020",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    deleted_at: null,
    parent_id: null,
    name: "Transfer",
    type: "fund_transfer",
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
  const totalPages = page_size === -1 ? 1 : Math.ceil(total / page_size);
  const start = page_size === -1 ? 0 : (page - 1) * page_size;
  const end = page_size === -1 ? total : start + page_size;
  const transactions = filtered.slice(start, end);

  return {
    transactions,
    total,
    page,
    page_size,
    total_pages: totalPages,
  };
}
