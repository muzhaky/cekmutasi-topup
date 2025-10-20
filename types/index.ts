import type { Transaction, TransactionType } from "@prisma/client";

export type TransactionWithFormatted = Transaction & {
  formattedAmount: string;
  formattedDate: string;
};

export type TransactionSummary = {
  income: number;
  expense: number;
  transfer: number;
  balance: number;
};

export type TransactionPayload = {
  id?: number;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  occurredAt: string;
  notes?: string | null;
};
