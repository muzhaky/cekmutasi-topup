import { ArrowTrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ArrowTrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Finote Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Pantau arus kas bisnis Anda secara real-time.
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
