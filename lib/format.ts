import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export function formatCurrency(amount: number | string) {
  const numeric = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numeric || 0);
}

export function formatDate(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return format(value, "dd MMM yyyy HH:mm", { locale: localeId });
}
