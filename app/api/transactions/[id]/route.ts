import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { transactionInputSchema } from "@/lib/validations";

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const json = await request.json();
    const parsed = transactionInputSchema.parse(json);

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        title: parsed.title,
        amount: parsed.amount,
        type: parsed.type,
        category: parsed.category,
        occurredAt: parsed.occurredAt,
        notes: parsed.notes ?? undefined,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: error.issues },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { message: "Transaksi tidak ditemukan" },
      { status: 404 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { message: "ID tidak valid" },
        { status: 400 }
      );
    }

    await prisma.transaction.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Transaksi tidak ditemukan" },
      { status: 404 }
    );
  }
}
