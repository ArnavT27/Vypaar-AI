import { Link } from "react-router-dom";
import { InsightCard } from "@/components/InsightCard";
import { insights, trending } from "@/lib/mockData";
import { Sparkles, TrendingUp, Brain } from "lucide-react";

export default function Insights() {
  const grouped = {
    Urgent: insights.filter((i) => i.priority === "Urgent"),
    Important: insights.filter((i) => i.priority === "Important"),
    Opportunity: insights.filter((i) => i.priority === "Opportunity"),
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-hero p-6 md:p-8 text-primary-foreground shadow-glow relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center backdrop-blur shrink-0">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">AI Business Insights</h1>
            <p className="mt-1 opacity-85 text-sm md:text-base max-w-2xl">
              Smart recommendations from your sales, stock and local market trends — updated every hour.
            </p>
          </div>
          <Link
            to="/insights/predict"
            className="bg-white text-primary px-5 py-3 rounded-xl font-bold text-sm shadow-soft hover:scale-105 transition-smooth inline-flex items-center gap-2 shrink-0"
          >
            <Brain className="h-4 w-4" /> Predict Future Stock
          </Link>
        </div>
      </div>

      {(["Urgent", "Important", "Opportunity"] as const).map((key) =>
        grouped[key].length ? (
          <section key={key}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">{key}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {grouped[key].map((i) => (
                <InsightCard key={i.id} insight={i} />
              ))}
            </div>
          </section>
        ) : null,
      )}

      <section className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4.5 w-4.5 text-primary" />
          <h2 className="font-semibold">Market Demand Insights</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trending.map((t) => (
            <div key={t.name} className="rounded-xl border border-border/60 p-4 hover:border-primary/40 transition-smooth">
              <p className="text-xs text-muted-foreground">{t.reason}</p>
              <p className="mt-1 font-semibold">{t.name}</p>
              <p className="mt-2 text-success font-bold text-lg">{t.change}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

