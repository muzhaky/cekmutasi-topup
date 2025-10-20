"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard-header";
import { SummaryCards } from "@/components/summary-cards";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionTable } from "@/components/transaction-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { TransactionFormValues } from "@/lib/validations";
import type { TransactionSummary } from "@/types";
import type { Transaction } from "@prisma/client";

interface DashboardResponse {
  transactions: Transaction[];
  summary: TransactionSummary;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Gagal memuat data");
  }
  return res.json() as Promise<DashboardResponse>;
};

export default function Home() {
  const { data, error, isLoading, mutate } = useSWR<DashboardResponse>(
    "/api/transactions",
    fetcher
  );
  const [creating, setCreating] = useState(false);

  const handleCreate = async (values: TransactionFormValues) => {
    setCreating(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan transaksi");
      }

      toast.success("Transaksi ditambahkan");
      await mutate();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Tidak dapat menghapus transaksi");
    }
    await mutate();
  };

  const handleUpdate = async (id: number, values: TransactionFormValues) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      throw new Error("Tidak dapat memperbarui transaksi");
    }
    await mutate();
  };

  const summary = data?.summary ?? {
    balance: 0,
    income: 0,
    expense: 0,
    transfer: 0,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-10 bg-grid px-4 py-10 md:px-8">
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Ringkasan Finansial</h2>
              <p className="text-sm text-muted-foreground">
                Visualisasi ringkas terinspirasi dari estetika Laravel Filament.
              </p>
            </div>
            <Button
              className="gap-2"
              onClick={() =>
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
              }
            >
              <Plus className="h-4 w-4" />
              Transaksi Baru
            </Button>
          </div>
          <SummaryCards summary={summary} />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/40">
            <CardHeader>
              <CardTitle>Statistik Lainnya</CardTitle>
              <CardDescription>
                Insight tambahan mengenai performa keuangan Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border/40 bg-secondary/40 p-6">
                <p className="text-sm text-muted-foreground">Rasio Pengeluaran</p>
                <p className="mt-2 text-3xl font-semibold">
                  {summary.income === 0
                    ? "0%"
                    : `${Math.round((summary.expense / summary.income) * 100)}%`}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Bandingkan pengeluaran terhadap pemasukan untuk menjaga kestabilan kas.
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-secondary/40 p-6">
                <p className="text-sm text-muted-foreground">Rata-rata Transaksi</p>
                <p className="mt-2 text-3xl font-semibold">
                  {data && data.transactions.length > 0
                    ? formatCurrency(
                        data.transactions.reduce((acc, curr) => acc + Number(curr.amount), 0) /
                          data.transactions.length
                      )
                    : formatCurrency(0)}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Memahami pola transaksi membantu memprediksi cashflow berikutnya.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Tambah Transaksi</CardTitle>
              <CardDescription>
                Catat pemasukan, pengeluaran, atau transfer baru secara cepat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionForm onSubmit={handleCreate} submitting={creating} />
            </CardContent>
          </Card>
        </section>

        <section>
          {error ? (
            <div className="rounded-xl border border-border/40 bg-destructive/10 p-6 text-destructive">
              Terjadi kesalahan saat memuat data.
            </div>
          ) : (
            <TransactionTable
              transactions={data?.transactions ?? []}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
          {isLoading && (
            <p className="mt-4 text-sm text-muted-foreground">Memuat data transaksi...</p>
          )}
        </section>
      </main>
    </div>
  );
}
