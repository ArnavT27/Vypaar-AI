import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { products, Product } from "@/lib/mockData";
import {
  Brain,
  Sparkles,
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  PackagePlus,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ReorderItem = {
  product: Product;
  aiQty: number;
  reason: string;
  manualQty: number;
};

type CustomItem = {
  id: string;
  name: string;
  category: string;
  manualQty: number;
  aiQty: number;
};

const CATEGORIES = [
  "All",
  "Grocery",
  "Snacks",
  "Dairy",
  "Beverages",
  "Bakery",
  "Household",
  "Personal Care",
  "Electronics",
  "Clothing",
  "Toys",
  "Stationery",
];

function aiSuggest(p: Product) {
  // Simple heuristic that mimics AI prediction from sales velocity & min stock
  const base = Math.max(p.minStock * 2 - p.stock, p.minStock);
  const trendBoost =
    p.category === "Beverages" || p.category === "Snacks" ? 1.2 : 1;
  return Math.round(base * trendBoost);
}

function aiReason(p: Product) {
  if (p.stock === 0) return "Out of stock — high lost-sale risk";
  if (p.stock < p.minStock)
    return `Below min (${p.stock}/${p.minStock}) — restock soon`;
  if (p.category === "Beverages") return "Seasonal demand rising (+38%)";
  if (p.category === "Snacks") return "Steady weekly velocity";
  return "Based on 30-day sales pattern";
}

export default function PredictStock() {
  const [reorder, setReorder] = useState<ReorderItem[]>([]);
  const [custom, setCustom] = useState<CustomItem[]>([]);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [customName, setCustomName] = useState("");
  const [customCat, setCustomCat] = useState("Grocery");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products
      .filter((p) => (activeCat === "All" ? true : p.category === activeCat))
      .filter((p) => p.name.toLowerCase().includes(q))
      .filter((p) => !reorder.some((r) => r.product.id === p.id));
  }, [query, activeCat, reorder]);

  const addProduct = (p: Product) => {
    const aiQty = aiSuggest(p);
    setReorder((r) => [
      ...r,
      { product: p, aiQty, reason: aiReason(p), manualQty: aiQty },
    ]);
    toast.success(`${p.name} added to reorder list`);
  };

  const setManualQty = (id: string, qty: number) =>
    setReorder((r) =>
      r.map((i) =>
        i.product.id === id ? { ...i, manualQty: Math.max(0, qty) } : i,
      ),
    );

  const remove = (id: string) =>
    setReorder((r) => r.filter((i) => i.product.id !== id));

  const addCustom = () => {
    if (!customName.trim()) {
      toast.error("Enter a product name");
      return;
    }
    const aiQty = customCat === "Beverages" || customCat === "Snacks" ? 24 : 12;
    setCustom((c) => [
      ...c,
      {
        id: `c-${Date.now()}`,
        name: customName.trim(),
        category: customCat,
        aiQty,
        manualQty: aiQty,
      },
    ]);
    setCustomName("");
    toast.success("Custom product added");
  };

  const setCustomQty = (id: string, qty: number) =>
    setCustom((c) =>
      c.map((i) => (i.id === id ? { ...i, manualQty: Math.max(0, qty) } : i)),
    );
  const removeCustom = (id: string) =>
    setCustom((c) => c.filter((i) => i.id !== id));

  const totalUnits =
    reorder.reduce((s, i) => s + i.manualQty, 0) +
    custom.reduce((s, i) => s + i.manualQty, 0);
  const totalCost = reorder.reduce(
    (s, i) => s + i.product.price * i.manualQty,
    0,
  );
  const totalItems = reorder.length + custom.length;

  const placeOrder = () => {
    if (totalItems === 0) {
      toast.error("Add at least one product");
      return;
    }
    toast.success(
      `Reorder placed — ${totalItems} products, ${totalUnits} units, est. ₹${totalCost.toFixed(0)}`,
    );
    setReorder([]);
    setCustom([]);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-hero p-6 md:p-8 text-primary-foreground shadow-glow relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <Link
            to="/insights"
            className="inline-flex items-center gap-1.5 text-xs font-semibold opacity-85 hover:opacity-100 transition-smooth mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Insights
          </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center backdrop-blur shrink-0">
              <Brain className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">
                Predict Future Stock
              </h1>
              <p className="mt-1 opacity-85 text-sm md:text-base max-w-2xl">
                Browse 100+ products across categories. AI suggests reorder
                quantities — you decide the final number.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Categories */}
      <section className="rounded-2xl bg-card border border-border/60 p-4 md:p-5 shadow-soft space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across electronics, clothing, grocery, toys…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm transition-smooth"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth border",
                activeCat === c
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Product catalog grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Product Catalog
          </h2>
          <span className="text-xs text-muted-foreground">
            {filtered.length} products
          </span>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-xl bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            No products match. Try another category or search.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.slice(0, 24).map((p) => (
              <button
                key={p.id}
                onClick={() => addProduct(p)}
                className="group flex flex-col items-start gap-1 p-3 rounded-2xl bg-card border border-border/60 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-soft transition-smooth text-left"
              >
                <span className="text-2xl">{p.emoji}</span>
                <p className="text-sm font-semibold line-clamp-1 w-full">
                  {p.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {p.category} · ₹{p.price}
                </p>
                <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                  <Plus className="h-3 w-3" /> Add to reorder
                </div>
              </button>
            ))}
          </div>
        )}
        {filtered.length > 24 && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Showing 24 of {filtered.length}. Refine with search to see more.
          </p>
        )}
      </section>

      {/* Add custom product */}
      <section className="rounded-2xl bg-card border border-border/60 p-4 md:p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-3">
          <PackagePlus className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-sm">
            Add a product not in the catalog
          </h2>
        </div>
        <div className="grid sm:grid-cols-[1fr_180px_auto] gap-2">
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Product name (e.g. Imported Chocolate)"
            className="px-3 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm transition-smooth"
          />
          <select
            value={customCat}
            onChange={(e) => setCustomCat(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-background border border-border focus:border-primary outline-none text-sm transition-smooth"
          >
            {CATEGORIES.filter((c) => c !== "All").map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={addCustom}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold inline-flex items-center justify-center gap-1.5 hover:scale-105 transition-smooth"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </section>

      {/* Reorder list with AI vs Manual columns */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Your Reorder List
          </h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        {totalItems === 0 ? (
          <div className="rounded-xl bg-muted/40 p-8 text-center text-sm text-muted-foreground">
            Tap any product above to add it. AI will suggest the right quantity
            based on past sales.
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border/60 shadow-soft overflow-hidden">
            {/* Column headers (md+) */}
            <div className="hidden md:grid grid-cols-[1fr_200px_200px_100px_40px] gap-3 px-4 py-3 bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <div>Product</div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" /> AI Suggestion
              </div>
              <div>Your Quantity</div>
              <div className="text-right">Subtotal</div>
              <div></div>
            </div>

            <ul className="divide-y divide-border">
              {reorder.map((i) => (
                <li
                  key={i.product.id}
                  className="grid md:grid-cols-[1fr_200px_200px_100px_40px] gap-3 p-4 items-center animate-fade-up"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{i.product.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {i.product.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {i.product.category} · ₹{i.product.price} /{" "}
                        {i.product.unit} · {i.product.stock} in stock
                      </p>
                    </div>
                  </div>

                  {/* AI suggestion column */}
                  <div className="rounded-xl bg-primary/5 border border-primary/20 px-3 py-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-primary tabular-nums">
                        {i.aiQty}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {i.product.unit}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {i.reason}
                    </p>
                  </div>

                  {/* Manual quantity column */}
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 w-fit">
                    <button
                      onClick={() =>
                        setManualQty(i.product.id, i.manualQty - 1)
                      }
                      className="h-8 w-8 grid place-items-center rounded-md hover:bg-card transition-smooth"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      value={i.manualQty}
                      onChange={(e) =>
                        setManualQty(
                          i.product.id,
                          Number(e.target.value) || 0,
                        )
                      }
                      className="w-14 text-center text-sm font-bold tabular-nums bg-transparent outline-none"
                    />
                    <button
                      onClick={() =>
                        setManualQty(i.product.id, i.manualQty + 1)
                      }
                      className="h-8 w-8 grid place-items-center rounded-md hover:bg-card transition-smooth"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-bold tabular-nums md:text-right">
                    ₹{(i.product.price * i.manualQty).toFixed(0)}
                  </p>

                  <button
                    onClick={() => remove(i.product.id)}
                    className="text-muted-foreground hover:text-alert transition-smooth justify-self-end md:justify-self-center"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}

              {custom.map((i) => (
                <li
                  key={i.id}
                  className="grid md:grid-cols-[1fr_200px_200px_100px_40px] gap-3 p-4 items-center animate-fade-up"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">📦</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {i.name}
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          Custom
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {i.category} · price TBD
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-primary/5 border border-primary/20 px-3 py-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-primary tabular-nums">
                        {i.aiQty}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        units
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Estimated from category average
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 w-fit">
                    <button
                      onClick={() => setCustomQty(i.id, i.manualQty - 1)}
                      className="h-8 w-8 grid place-items-center rounded-md hover:bg-card transition-smooth"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      value={i.manualQty}
                      onChange={(e) =>
                        setCustomQty(i.id, Number(e.target.value) || 0)
                      }
                      className="w-14 text-center text-sm font-bold tabular-nums bg-transparent outline-none"
                    />
                    <button
                      onClick={() => setCustomQty(i.id, i.manualQty + 1)}
                      className="h-8 w-8 grid place-items-center rounded-md hover:bg-card transition-smooth"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-bold tabular-nums md:text-right text-muted-foreground">
                    —
                  </p>

                  <button
                    onClick={() => removeCustom(i.id)}
                    className="text-muted-foreground hover:text-alert transition-smooth justify-self-end md:justify-self-center"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Sticky footer */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 z-30 border-t border-border bg-card/95 backdrop-blur px-4 py-3 flex items-center gap-3 shadow-elevated">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              {totalItems} products · {totalUnits} units
            </p>
            <p className="text-lg font-bold text-primary tabular-nums">
              Est. ₹{totalCost.toFixed(0)}
            </p>
          </div>
          <button
            onClick={placeOrder}
            className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-bold shadow-glow inline-flex items-center gap-2 hover:scale-105 transition-smooth"
          >
            <CheckCircle2 className="h-4 w-4" /> Confirm Reorder
          </button>
        </div>
      )}
    </div>
  );
}
