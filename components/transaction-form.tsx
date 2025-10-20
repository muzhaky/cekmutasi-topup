"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/validations";
import type { Transaction, TransactionType } from "@prisma/client";

const defaultDate = format(new Date(), "yyyy-MM-dd'T'HH:mm", { locale: localeId });

interface TransactionFormProps {
  onSubmit: (values: TransactionFormValues) => Promise<void> | void;
  submitting?: boolean;
  initialData?: Transaction | null;
  onCancel?: () => void;
}

const transactionTypes: { label: string; value: TransactionType }[] = [
  { label: "Pemasukan", value: "INCOME" },
  { label: "Pengeluaran", value: "EXPENSE" },
  { label: "Transfer", value: "TRANSFER" },
];

export function TransactionForm({
  onSubmit,
  submitting,
  initialData,
  onCancel,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      title: "",
      amount: "",
      type: "INCOME",
      category: "",
      occurredAt: defaultDate,
      notes: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        amount: String(initialData.amount),
        type: initialData.type,
        category: initialData.category,
        occurredAt: format(initialData.occurredAt, "yyyy-MM-dd'T'HH:mm"),
        notes: initialData.notes ?? "",
      });
    }
  }, [initialData, reset]);

  const submitHandler = async (values: TransactionFormValues) => {
    try {
      await onSubmit(values);
      if (!initialData) {
        const currentType = watch("type");
        reset({
          title: "",
          amount: "",
          type: currentType,
          category: "",
          occurredAt: defaultDate,
          notes: "",
        });
      }
    } catch (error) {
      toast.error("Tidak dapat menyimpan transaksi");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Judul</Label>
          <Input id="title" placeholder="Contoh: Gaji Bulanan" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Nominal</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipe</Label>
          <Select
            value={watch("type")}
            onValueChange={(value: TransactionType) => setValue("type", value, { shouldDirty: true })}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              {transactionTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-xs text-destructive">{errors.type.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Input
            id="category"
            placeholder="Contoh: Operasional"
            {...register("category")}
          />
          {errors.category && (
            <p className="text-xs text-destructive">{errors.category.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="occurredAt">Tanggal & Jam</Label>
          <Input
            id="occurredAt"
            type="datetime-local"
            {...register("occurredAt")}
          />
          {errors.occurredAt && (
            <p className="text-xs text-destructive">{errors.occurredAt.message}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Catatan</Label>
          <Input id="notes" placeholder="Opsional" {...register("notes")} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            className="border border-border/60"
            onClick={onCancel}
          >
            Batal
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Transaksi"}
        </Button>
      </div>
    </form>
  );
}
