import { z } from "zod";

export const transactionFormSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter"),
  amount: z
    .string()
    .min(1, "Nominal wajib diisi")
    .refine((val) => !Number.isNaN(Number(val)), "Nominal tidak valid"),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"], {
    required_error: "Tipe transaksi wajib dipilih",
  }),
  category: z.string().min(2, "Kategori minimal 2 karakter"),
  occurredAt: z.string().min(1, "Tanggal wajib diisi"),
  notes: z.string().optional().nullable(),
});

export const transactionInputSchema = transactionFormSchema.transform((values) => ({
  ...values,
  amount: Number(values.amount),
  occurredAt: new Date(values.occurredAt),
}));

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export type TransactionInput = z.infer<typeof transactionInputSchema>;
