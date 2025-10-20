"use client";

import { useState } from "react";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionForm } from "@/components/transaction-form";
import { formatCurrency, formatDate } from "@/lib/format";
import type { TransactionFormValues } from "@/lib/validations";
import type { Transaction } from "@prisma/client";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, values: TransactionFormValues) => Promise<void>;
}

const typeBadgeVariant: Record<Transaction["type"], "success" | "destructive" | "outline"> = {
  INCOME: "success",
  EXPENSE: "destructive",
  TRANSFER: "outline",
};

export function TransactionTable({ transactions, onDelete, onUpdate }: TransactionTableProps) {
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [open, setOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setLoadingId(id);
    try {
      await onDelete(id);
      toast.success("Transaksi dihapus");
    } catch (error) {
      toast.error("Gagal menghapus transaksi");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdate = async (values: TransactionFormValues) => {
    if (!selected) return;
    try {
      await onUpdate(selected.id, values);
      toast.success("Transaksi diperbarui");
      setOpen(false);
    } catch (error) {
      toast.error("Gagal memperbarui transaksi");
    }
  };

  return (
    <div className="rounded-2xl border border-border/40 bg-secondary/30 backdrop-blur">
      <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold">Daftar Transaksi</h2>
          <p className="text-sm text-muted-foreground">
            Ringkasan mutasi terbaru dalam organisasi Anda.
          </p>
        </div>
      </div>
      <div className="p-2 sm:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Nominal</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  Belum ada transaksi.
                </TableCell>
              </TableRow>
            )}
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{transaction.title}</span>
                    {transaction.notes && (
                      <span className="text-xs text-muted-foreground">
                        {transaction.notes}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {transaction.type === "EXPENSE" ? "-" : ""}
                  {formatCurrency(Number(transaction.amount))}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Badge variant={typeBadgeVariant[transaction.type]}>
                    {transaction.type === "INCOME"
                      ? "Pemasukan"
                      : transaction.type === "EXPENSE"
                      ? "Pengeluaran"
                      : "Transfer"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(transaction.occurredAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={open && selected?.id === transaction.id}
                      onOpenChange={(isOpen) => {
                        setOpen(isOpen);
                        setSelected(isOpen ? transaction : null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ubah transaksi</DialogTitle>
                          <DialogDescription>
                            Sesuaikan informasi transaksi sesuai kebutuhan Anda.
                          </DialogDescription>
                        </DialogHeader>
                        <TransactionForm
                          initialData={transaction}
                          onSubmit={handleUpdate}
                          onCancel={() => setOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={loadingId === transaction.id}
                    >
                      {loadingId === transaction.id ? (
                        <EllipsisVertical className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Hapus</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>
            Data realtime - bangun fondasi finansial yang sehat bersama tim Anda.
          </TableCaption>
        </Table>
      </div>
    </div>
  );
}
