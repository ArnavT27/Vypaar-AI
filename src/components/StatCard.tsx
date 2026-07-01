import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  tone?: "primary" | "success" | "alert" | "warning";
  extra?: React.ReactNode;
};

const toneStyles = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  alert: "bg-alert-soft text-alert",
  warning: "bg-warning-soft text-warning",
};

export function StatCard({ label, value, delta, trend = "neutral", icon: Icon, tone = "primary", extra }: Props) {
  return (
    <div className="group rounded-2xl bg-card p-5 shadow-soft border border-border/50 transition-smooth hover:shadow-elevated hover:-translate-y-0.5 animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl md:text-3xl font-bold text-foreground tabular-nums">{value}</p>
          {delta && (
            <p
              className={cn(
                "mt-1 text-xs font-semibold",
                trend === "up" && "text-success",
                trend === "down" && "text-alert",
                trend === "neutral" && "text-muted-foreground",
              )}
            >
              {delta}
            </p>
          )}
          {extra}
        </div>
        <div className={cn("rounded-xl p-2.5 transition-smooth group-hover:scale-110", toneStyles[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
