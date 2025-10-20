import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { transactionInputSchema } from "@/lib/validations";

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { occurredAt: "desc" },
  });

  const summary = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount);
      if (transaction.type === "INCOME") {
        acc.income += amount;
        acc.balance += amount;
      } else if (transaction.type === "EXPENSE") {
        acc.expense += amount;
        acc.balance -= amount;
      } else {
        acc.transfer += amount;
      }
      return acc;
    },
    { income: 0, expense: 0, transfer: 0, balance: 0 }
  );

  return NextResponse.json({ transactions, summary });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = transactionInputSchema.parse(json);

    const transaction = await prisma.transaction.create({
      data: {
        title: parsed.title,
        amount: parsed.amount,
        type: parsed.type,
        category: parsed.category,
        occurredAt: parsed.occurredAt,
        notes: parsed.notes ?? undefined,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: error.issues },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan saat menyimpan transaksi" },
      { status: 500 }
    );
  }
}
