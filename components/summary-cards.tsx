import type { ReactNode } from "react";
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { TransactionSummary } from "@/types";

const summaryCards = (
  summary: TransactionSummary
): {
  title: string;
  description: string;
  icon: ReactNode;
  amount: number;
  accent: string;
}[] => [
  {
    title: "Total Saldo",
    description: "Akumulasi pemasukan - pengeluaran",
    icon: <Wallet className="h-6 w-6 text-primary" />,
    amount: summary.balance,
    accent: "from-primary/20 via-primary/40 to-primary/20",
  },
  {
    title: "Pemasukan",
    description: "Seluruh pemasukan yang tercatat",
    icon: <ArrowUpCircle className="h-6 w-6 text-emerald-400" />,
    amount: summary.income,
    accent: "from-emerald-500/10 via-emerald-500/20 to-emerald-500/10",
  },
  {
    title: "Pengeluaran",
    description: "Seluruh pengeluaran operasional",
    icon: <ArrowDownCircle className="h-6 w-6 text-rose-400" />,
    amount: summary.expense,
    accent: "from-rose-500/10 via-rose-500/20 to-rose-500/10",
  },
  {
    title: "Transfer",
    description: "Mutasi antar akun",
    icon: <ArrowLeftRight className="h-6 w-6 text-sky-400" />,
    amount: summary.transfer,
    accent: "from-sky-500/10 via-sky-500/20 to-sky-500/10",
  },
];

interface SummaryCardsProps {
  summary: TransactionSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {summaryCards(summary).map((card) => (
        <Card
          key={card.title}
          className="relative overflow-hidden border-border/40 bg-gradient-to-br from-secondary/40 via-secondary/80 to-secondary/40"
        >
          <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${card.accent}`} />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-foreground/90">
                {card.title}
              </CardTitle>
              {card.icon}
            </div>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight">
              {formatCurrency(card.amount)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
