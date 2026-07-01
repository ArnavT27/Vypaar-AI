import { useEffect, useMemo, useState, useSyncExternalStore, useRef } from "react";
import { products, Product, billStore, Bill } from "@/lib/mockData";
import {
  Search, Plus, Minus, Trash2, Receipt, Share2, Printer, Sparkles,
  ScanLine, X, ShoppingBag, ArrowRight, ArrowLeft, CheckCircle2, FileText, Eye, Mic, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { billsAPI, productsAPI, storeAPI } from "@/lib/api";
import { createBillWithStockUpdate } from "@/lib/stockHelper";
import { useAuth } from "@/contexts/AuthContext";
import { UPIQRCode } from "@/components/UPIQRCode";

type CartItem = { product: Product; qty: number };

function useBills() {
  return useSyncExternalStore(
    (cb) => billStore.subscribe(cb),
    () => billStore.getAll(),
    () => billStore.getAll(),
  );
}

export default function Billing() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [voiceWizardOpen, setVoiceWizardOpen] = useState(false);
  const [viewBill, setViewBill] = useState<Bill | null>(null);

  // Fetch bills from database
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const { data } = await billsAPI.getAll();
        const dbBills = data.data || [];

        // Transform database bills to match the Bill interface
        const transformedBills = dbBills.map((b: any) => ({
          id: b.billNumber || b._id,
          date: b.createdAt,
          items: b.items.map((item: any) => ({
            productId: item.product || item.productId,
            name: item.name,
            emoji: item.emoji || "📦",
            price: item.price,
            qty: item.qty,
          })),
          subtotal: b.subtotal,
          gst: b.gst,
          discount: b.discount,
          total: b.total,
          customerName: b.customerName,
          customerPhone: b.customerPhone,
        }));

        setBills(transformedBills);
      } catch (error) {
        console.error('Error fetching bills:', error);
        toast.error('Failed to load bills');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [wizardOpen, voiceWizardOpen]); // Refetch when modals close

  const refreshBills = async () => {
    try {
      const { data } = await billsAPI.getAll();
      const dbBills = data.data || [];

      const transformedBills = dbBills.map((b: any) => ({
        id: b.billNumber || b._id,
        date: b.createdAt,
        items: b.items.map((item: any) => ({
          productId: item.product || item.productId,
          name: item.name,
          emoji: item.emoji || "📦",
          price: item.price,
          qty: item.qty,
        })),
        subtotal: b.subtotal,
        gst: b.gst,
        discount: b.discount,
        total: b.total,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
      }));

      setBills(transformedBills);
    } catch (error) {
      console.error('Error refreshing bills:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero / CTA */}
      <div className="rounded-3xl bg-gradient-hero p-6 md:p-8 text-primary-foreground shadow-glow relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center backdrop-blur shrink-0">
            <Receipt className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">Smart Billing</h1>
            <p className="mt-1 opacity-85 text-sm md:text-base">
              Create a bill in seconds. Pick products, choose quantity — pricing is calculated automatically from your inventory.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setVoiceWizardOpen(true)}
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg hover:shadow-xl hover:scale-105 border-0 px-5 py-3 rounded-xl font-bold text-sm transition-smooth inline-flex items-center gap-2"
            >
              <Mic className="h-4 w-4" /> Voice Bill
            </button>
            <button
              onClick={() => setWizardOpen(true)}
              className="bg-white text-primary px-5 py-3 rounded-xl font-bold text-sm shadow-soft hover:scale-105 transition-smooth inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Make a Bill
            </button>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Bills Today" value={bills.filter(b => isToday(b.date)).length.toString()} />
        <StatBox label="Today's Revenue" value={`₹${bills.filter(b => isToday(b.date)).reduce((s, b) => s + b.total, 0).toFixed(0)}`} />
        <StatBox label="Total Bills" value={bills.length.toString()} />
      </div>

      {/* Previous Bills */}
      <section className="rounded-2xl bg-card border border-border/60 shadow-soft overflow-hidden">
        <div className="p-4 md:p-5 border-b border-border bg-gradient-card flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-primary" />
          <h2 className="font-semibold">Previous Bills</h2>
          <span className="ml-auto text-xs text-muted-foreground">{bills.length} total</span>
        </div>
        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            <Loader2 className="h-10 w-10 mx-auto mb-3 opacity-40 animate-spin" />
            Loading bills...
          </div>
        ) : bills.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            <Receipt className="h-10 w-10 mx-auto mb-3 opacity-40" />
            No bills yet. Click "Make a Bill" to create one.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {bills.map((b) => (
              <button
                key={b.id}
                onClick={() => setViewBill(b)}
                className="w-full p-4 flex items-center gap-4 hover:bg-muted/40 transition-smooth text-left animate-fade-up"
              >
                <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary grid place-items-center text-lg shrink-0">
                  🧾
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{b.id}</p>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <p className="text-xs text-muted-foreground">{formatDate(b.date)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {b.items.length} items — {b.items.slice(0, 2).map(i => i.name).join(", ")}
                    {b.items.length > 2 ? `…` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-primary tabular-nums">₹{b.total.toFixed(2)}</p>
                  <p className="text-[10px] text-muted-foreground inline-flex items-center gap-1 justify-end">
                    View <Eye className="h-3 w-3" />
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {wizardOpen && <BillWizard onClose={() => { setWizardOpen(false); refreshBills(); }} />}
      {voiceWizardOpen && <VoiceBillingWizard onClose={() => { setVoiceWizardOpen(false); refreshBills(); }} />}
      {viewBill && <BillDetails bill={viewBill} onClose={() => setViewBill(null)} />}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
      <p className="mt-1 text-xl md:text-2xl font-bold text-foreground tabular-nums">{value}</p>
    </div>
  );
}

function isToday(iso: string) {
  const d = new Date(iso);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

/* ---------------- Wizard: Make a Bill ---------------- */
function BillWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productsAPI.getAll();
        const dbProducts = data.data || [];

        // Transform database products to match Product interface
        const transformedProducts = dbProducts.map((p: any) => ({
          id: p._id,
          _id: p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          minStock: p.minStock,
          unit: p.unit,
          emoji: p.emoji || "📦",
        }));

        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "All" || p.category === category) &&
          p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, category, products],
  );

  const add = (p: Product) => {
    setCart((c) => {
      const f = c.find((i) => i.product.id === p.id);
      if (f) {
        // Check if adding one more would exceed stock
        if (f.qty >= p.stock) {
          toast.error(`Cannot add more. Only ${p.stock} ${p.unit} available in stock.`);
          return c;
        }
        return c.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      }
      // Check if product has stock before adding
      if (p.stock === 0) {
        toast.error(`${p.name} is out of stock.`);
        return c;
      }
      return [...c, { product: p, qty: 1 }];
    });
  };

  const setQty = (id: string, qty: number) => {
    setCart((c) => {
      return c.map((i) => {
        if (i.product.id === id) {
          // Enforce stock limit
          if (qty > i.product.stock) {
            toast.error(`Cannot set quantity to ${qty}. Only ${i.product.stock} ${i.product.unit} available.`);
            return i; // Keep current quantity
          }
          return { ...i, qty: Math.max(0, qty) };
        }
        return i;
      }).filter((i) => i.qty > 0);
    });
  };
  const remove = (id: string) => setCart((c) => c.filter((i) => i.product.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const gst = subtotal * 0.05;
  const total = Math.max(0, subtotal + gst - discount);

  // Check if any item exceeds stock
  const hasOverstock = cart.some((i) => i.qty > i.product.stock);

  const save = async () => {
    console.log(customerName, customerPhone);
    const billId = await createBillWithStockUpdate(
      cart,
      subtotal,
      gst,
      discount,
      total,
      customerName,
      customerPhone
    );

    if (billId) {
      toast.success(`Bill saved to database`);
      if (customerPhone) {
        toast.success("Ready to send via WhatsApp!", {
          description: `Bill for ${customerName || 'customer'}`,
          duration: 4000,
        });
      }
      onClose();
    }
  };

  return (
    <Modal onClose={onClose} title="Make a Bill" maxWidth="max-w-4xl">
      {/* Stepper */}
      <div className="px-5 md:px-6 pt-4">
        <div className="flex items-center gap-2 text-xs">
          {[
            { n: 1, label: "Add Products" },
            { n: 2, label: "Set Quantity" },
            { n: 3, label: "Review & Save" },
            { n: 4, label: "Customer Info" },
          ].map((s, idx) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-7 w-7 rounded-full grid place-items-center font-bold text-[11px] shrink-0",
                  step >= (s.n as 1 | 2 | 3 | 4)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {s.n}
              </div>
              <span className={cn("font-semibold hidden sm:inline", step >= s.n ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
              {idx < 3 && <div className={cn("h-0.5 flex-1 rounded", step > s.n ? "bg-primary" : "bg-muted")} />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 md:px-6 py-5 max-h-[65vh] overflow-y-auto">
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 50+ products…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none text-sm transition-smooth"
                />
              </div>
              <button className="px-3 rounded-xl bg-primary-soft text-primary grid place-items-center hover:bg-primary hover:text-primary-foreground transition-smooth">
                <ScanLine className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-smooth border",
                    category === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((p) => {
                const inCart = cart.find((i) => i.product.id === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => add(p)}
                    disabled={p.stock === 0}
                    className={cn(
                      "relative rounded-2xl bg-card border p-3 text-left shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-elevated disabled:opacity-50 disabled:cursor-not-allowed",
                      inCart ? "border-primary ring-2 ring-primary/20" : "border-border/60 hover:border-primary/30",
                    )}
                  >
                    {inCart && (
                      <span className="absolute top-2 right-2 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">
                        {inCart.qty}
                      </span>
                    )}
                    <div className="text-3xl mb-1.5">{p.emoji}</div>
                    <p className="text-xs font-semibold line-clamp-2 leading-tight min-h-[2rem]">{p.name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">₹{p.price}</span>
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                          p.stock === 0 ? "bg-alert-soft text-alert" : p.stock < p.minStock ? "bg-warning-soft text-warning" : "bg-success-soft text-success",
                        )}
                      >
                        {p.stock === 0 ? "Out" : `${p.stock} left`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No products match your search.</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Adjust quantity for each item. Stock availability is checked from your inventory.
            </p>
            {cart.length === 0 ? (
              <div className="rounded-xl bg-muted/40 p-8 text-center text-sm text-muted-foreground">
                No products added yet. Go back to step 1.
              </div>
            ) : (
              cart.map((i) => {
                const overstock = i.qty > i.product.stock;
                return (
                  <div key={i.product.id} className="rounded-2xl border border-border/60 p-3 flex items-center gap-3 bg-card">
                    <div className="text-2xl">{i.product.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{i.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ₹{i.product.price} / {i.product.unit} · {i.product.stock} in stock
                      </p>
                      {overstock && (
                        <p className="text-[11px] text-alert font-semibold mt-0.5">
                          ⚠ Only {i.product.stock} available
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                      <button
                        onClick={() => setQty(i.product.id, i.qty - 1)}
                        className="h-8 w-8 grid place-items-center rounded-md hover:bg-card transition-smooth"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number"
                        value={i.qty}
                        onChange={(e) => setQty(i.product.id, Number(e.target.value) || 0)}
                        max={i.product.stock}
                        min={0}
                        className="w-12 text-center text-sm font-bold tabular-nums bg-transparent outline-none"
                      />
                      <button
                        onClick={() => setQty(i.product.id, i.qty + 1)}
                        disabled={i.qty >= i.product.stock}
                        className="h-8 w-8 grid place-items-center rounded-md hover:bg-card transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-sm font-bold tabular-nums w-20 text-right">₹{(i.product.price * i.qty).toFixed(2)}</p>
                    <button onClick={() => remove(i.product.id)} className="text-muted-foreground hover:text-alert transition-smooth">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/60 overflow-hidden">
              <div className="p-3 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bill Preview
              </div>
              {cart.map((i) => (
                <div key={i.product.id} className="px-4 py-2.5 border-t border-border/60 flex items-center gap-3 text-sm">
                  <span className="text-xl">{i.product.emoji}</span>
                  <span className="flex-1 truncate">{i.product.name}</span>
                  <span className="text-muted-foreground tabular-nums">₹{i.product.price} × {i.qty}</span>
                  <span className="font-semibold tabular-nums w-20 text-right">₹{(i.product.price * i.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-muted/30 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span className="tabular-nums">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (5%)</span><span className="tabular-nums">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Discount</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="w-24 text-right px-2 py-1 rounded-md bg-card border border-border text-sm tabular-nums outline-none focus:border-primary"
                />
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total</span><span className="text-primary tabular-nums">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter customer details and bill date to save with the bill and enable WhatsApp sharing.
            </p>
            <div className="space-y-3">

              <div>
                <label className="text-sm font-semibold mb-1.5 block">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none text-sm transition-smooth"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none text-sm transition-smooth"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Optional: Add customer details to send bill via WhatsApp
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-primary-soft/30 border border-primary/20 p-4">
              <h4 className="text-sm font-semibold mb-2 text-primary">Bill Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-semibold">{new Date().toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-bold text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="border-t border-border p-4 flex items-center gap-2 bg-card">
        <div className="text-xs text-muted-foreground mr-auto">
          {cart.length > 0 && (
            <>
              <ShoppingBag className="h-3.5 w-3.5 inline mr-1" />
              {cart.length} items · <span className="font-semibold text-foreground tabular-nums">₹{total.toFixed(2)}</span>
            </>
          )}
        </div>
        {step > 1 && (
          <button
            onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
            className="px-4 py-2 rounded-xl bg-muted hover:bg-secondary text-sm font-semibold inline-flex items-center gap-1 transition-smooth"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={() => {
              if (step === 2 && hasOverstock) {
                toast.error("Some items exceed available stock. Please adjust quantities.");
                return;
              }
              setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
            }}
            disabled={cart.length === 0 || (step === 2 && hasOverstock)}
            className="px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-bold inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow transition-smooth"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={save}
            disabled={cart.length === 0 || hasOverstock}
            className="px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-bold inline-flex items-center gap-1 disabled:opacity-50 shadow-glow transition-smooth"
          >
            <CheckCircle2 className="h-4 w-4" /> Save Bill
          </button>
        )}
      </div>
    </Modal>
  );
}

/* ---------------- Bill Details Modal ---------------- */
function BillDetails({ bill, onClose }: { bill: Bill; onClose: () => void }) {
  const [waMode, setWaMode] = useState(false);
  const [waName, setWaName] = useState(bill.customerName || "");
  const [waPhone, setWaPhone] = useState(bill.customerPhone || "");
  const [storeInfo, setStoreInfo] = useState<any>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await storeAPI.getMy();
        setStoreInfo(data.data);
      } catch (err) {
        console.error("Error fetching store for QR:", err);
      }
    };
    fetchStore();
  }, []);

  const handlePrint = async () => {
    try {
      // Fetch store information
      const { data: storeData } = await storeAPI.getMy();
      const store = storeData.data;

      // Create print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Please allow popups to print invoice');
        return;
      }

      // Generate invoice HTML
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice - ${bill.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 20px;
              background: #f5f5f5;
            }
            .invoice {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: start;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #3b82f6;
            }
            .store-info h1 {
              font-size: 28px;
              color: #1e40af;
              margin-bottom: 8px;
            }
            .store-info p {
              color: #64748b;
              font-size: 14px;
              line-height: 1.6;
            }
            .invoice-info {
              text-align: right;
            }
            .invoice-info h2 {
              font-size: 24px;
              color: #1e293b;
              margin-bottom: 8px;
            }
            .invoice-info p {
              color: #64748b;
              font-size: 14px;
            }
            .bill-number {
              background: #dbeafe;
              color: #1e40af;
              padding: 4px 12px;
              border-radius: 6px;
              font-weight: 600;
              display: inline-block;
              margin-bottom: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            thead {
              background: #f1f5f9;
            }
            th {
              text-align: left;
              padding: 12px;
              font-weight: 600;
              color: #1e293b;
              border-bottom: 2px solid #e2e8f0;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e2e8f0;
              color: #475569;
            }
            .item-emoji {
              font-size: 20px;
              margin-right: 8px;
            }
            .text-right {
              text-align: right;
            }
            .totals {
              margin-top: 30px;
              display: flex;
              justify-content: flex-end;
            }
            .totals-table {
              width: 300px;
            }
            .totals-table tr td {
              padding: 8px 12px;
              border: none;
            }
            .totals-table tr:last-child {
              border-top: 2px solid #e2e8f0;
              font-weight: 700;
              font-size: 18px;
              color: #1e40af;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              text-align: center;
              color: #64748b;
              font-size: 14px;
            }
            .footer p {
              margin: 4px 0;
            }
            @media print {
              body { background: white; padding: 0; }
              .invoice { box-shadow: none; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <div class="store-info">
                <h1>${store?.storeName || 'Store Name'}</h1>
                <p>${store?.storeAddress || 'Store Address'}</p>
                ${store?.gstNumber ? `<p>GST: ${store.gstNumber}</p>` : ''}
              </div>
              <div class="invoice-info">
                <h2>INVOICE</h2>
                <div class="bill-number">${bill.id}</div>
                <p>${formatDate(bill.date)}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${bill.items.map(item => `
                  <tr>
                    <td>
                      <span class="item-emoji">${item.emoji}</span>
                      ${item.name}
                    </td>
                    <td class="text-right">₹${item.price.toFixed(2)}</td>
                    <td class="text-right">${item.qty}</td>
                    <td class="text-right">₹${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <table class="totals-table">
                <tr>
                  <td>Subtotal:</td>
                  <td class="text-right">₹${bill.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>GST (5%):</td>
                  <td class="text-right">₹${bill.gst.toFixed(2)}</td>
                </tr>
                ${bill.discount > 0 ? `
                  <tr>
                    <td>Discount:</td>
                    <td class="text-right">-₹${bill.discount.toFixed(2)}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td>Total:</td>
                  <td class="text-right">₹${bill.total.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <p><strong>Thank you for your business!</strong></p>
              <p>This is a computer-generated invoice.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              // Close window after printing or canceling
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(invoiceHTML);
      printWindow.document.close();

      toast.success('Opening print dialog...');
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error('Failed to print invoice');
    }
  };

  const handleSendWA = async () => {
    if (!waPhone) { toast.error("Phone number is required"); return; }

    try {
      // Fetch store information
      const { data: storeData } = await storeAPI.getMy();
      const store = storeData.data;
      const storeName = store?.storeName || 'Our Store';

      // Build items list
      const itemsList = bill.items.map(item =>
        `${item.emoji} ${item.name} - ₹${item.price} × ${item.qty} = ₹${(item.price * item.qty).toFixed(2)}`
      ).join('\n');

      const text = `Hello ${waName},

Thank you for shopping at *${storeName}*!

*Bill No:* ${bill.id}
*Date:* ${formatDate(bill.date)}

*Items:*
${itemsList}

*Subtotal:* ₹${bill.subtotal.toFixed(2)}
*GST (5%):* ₹${bill.gst.toFixed(2)}
${bill.discount > 0 ? `*Discount:* -₹${bill.discount.toFixed(2)}\n` : ''}*Total:* ₹${bill.total.toFixed(2)}

Visit our online store: http://localhost:5173/store

Thank you for your business!`;

      window.open(`https://wa.me/91${waPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
      toast.success("Opening WhatsApp...");
      setWaMode(false);
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      // Fallback to simple message if store fetch fails
      const text = `Hello ${waName},\nHere is your bill:\nBill No: ${bill.id}\nDate: ${formatDate(bill.date)}\nTotal: ₹${bill.total.toFixed(2)}\n\nThank you for shopping!`;
      window.open(`https://wa.me/91${waPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
      toast.success("Opening WhatsApp...");
      setWaMode(false);
    }
  };

  if (waMode) {
    return (
      <Modal onClose={onClose} title="Share via WhatsApp" maxWidth="max-w-md">
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Customer Name</label>
            <input value={waName} onChange={e => setWaName(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-primary outline-none rounded-lg text-sm" placeholder="e.g. Rahul" />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Phone Number</label>
            <input value={waPhone} onChange={e => setWaPhone(e.target.value)} type="tel" className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-primary outline-none rounded-lg text-sm" placeholder="9876543210" />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setWaMode(false)} className="flex-1 py-2.5 rounded-xl bg-muted text-sm font-semibold hover:bg-secondary transition-smooth">Cancel</button>
            <button onClick={handleSendWA} className="flex-1 py-2.5 rounded-xl bg-gradient-success text-success-foreground text-sm font-semibold shadow-glow hover:opacity-90 transition-smooth">Send via WhatsApp</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} title={`Bill ${bill.id}`} maxWidth="max-w-md">
      <div className="px-5 py-4 space-y-3">
        <p className="text-xs text-muted-foreground">{formatDate(bill.date)}</p>
        <div className="rounded-2xl border border-border/60 overflow-hidden">
          {bill.items.map((i) => (
            <div key={i.productId} className="px-3 py-2.5 border-b border-border/60 last:border-0 flex items-center gap-3 text-sm">
              <span className="text-xl">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{i.name}</p>
                <p className="text-xs text-muted-foreground">₹{i.price} × {i.qty}</p>
              </div>
              <p className="font-semibold tabular-nums">₹{(i.price * i.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-muted/30 p-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="tabular-nums">₹{bill.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>GST</span><span className="tabular-nums">₹{bill.gst.toFixed(2)}</span></div>
          {bill.discount > 0 && <div className="flex justify-between text-muted-foreground"><span>Discount</span><span className="tabular-nums">-₹{bill.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between text-base font-bold pt-2 border-t border-border"><span>Total</span><span className="text-primary tabular-nums">₹{bill.total.toFixed(2)}</span></div>
        </div>

        {storeInfo && (
          <div className="pt-1">
            <UPIQRCode
              amount={bill.total}
              payeeName={storeInfo.storeName || "Store Owner"}
              payeeUPI={storeInfo.upiId || ""}
              billId={bill.id}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button onClick={handlePrint} className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-muted hover:bg-secondary text-xs font-semibold transition-smooth">
            <Printer className="h-4 w-4" /> Print
          </button>
          <button onClick={() => setWaMode(true)} className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-success-soft text-success hover:bg-success hover:text-success-foreground text-xs font-semibold transition-smooth">
            <Share2 className="h-4 w-4" /> WhatsApp
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- Modal shell ---------------- */
function Modal({
  children, onClose, title, maxWidth = "max-w-lg",
}: { children: React.ReactNode; onClose: () => void; title: string; maxWidth?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-up" onClick={onClose}>
      <div
        className={cn("w-full bg-card rounded-3xl shadow-elevated border border-border/60 overflow-hidden animate-scale-in", maxWidth)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-5 md:px-6 py-4 border-b border-border">
          <h2 className="font-bold text-lg flex-1">{title}</h2>
          <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted transition-smooth">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Voice Billing Wizard ---------------- */
function VoiceBillingWizard({ onClose }: { onClose: () => void }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const recognitionRef = useRef<any>(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productsAPI.getAll();
        const dbProducts = data.data || [];

        // Transform database products to match Product interface
        const transformedProducts = dbProducts.map((p: any) => ({
          id: p._id,
          _id: p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          minStock: p.minStock,
          unit: p.unit,
          emoji: p.emoji || "📦",
        }));

        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      let fullText = "";
      for (let i = 0; i < event.results.length; ++i) {
        fullText += event.results[i][0].transcript;
      }
      setTranscript(fullText);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Speech recognition error:", e);
    }
  };

  const handleDone = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
    }
    setIsListening(false);
    if (transcript.trim().length > 0) {
      processVoice(transcript);
    } else {
      toast.error("Nothing was heard. Please try again.");
    }
  };

  const processVoice = async (text: string) => {
    setProcessing(true);
    try {
      const promptText = `You are an AI assistant for an Indian Kirana store voice billing system.
The user said: "${text}"

Our inventory:
${products.map(p => `${p.id}: ${p.name} (₹${p.price})`).join('\n')}

Extract the items and quantities. If the user explicitly asks to "save bill", "done", "save it", "save billing", or similar phrases, set saveCommand to true.
Return ONLY valid JSON exactly like this:
{
  "saveCommand": boolean,
  "items": [
    { "productId": "string", "qty": number }
  ]
}
Important: Match the items to the inventory list. Do NOT use markdown code blocks.`;

      const attemptProviders = async () => {

        // 4. Mistral
        try {
          const mistralApiKey = import.meta.env.VITE_MISTRAL_API_KEY;
          if (!mistralApiKey) throw new Error("Mistral API key is missing.");
          const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${mistralApiKey}`, "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
              model: "mistral-large-latest",
              messages: [{ role: "user", content: promptText }],
              temperature: 0,
            })
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          return data.choices[0].message.content;
        } catch (e) {
          console.warn("Mistral failed", e);
        }

        // 1. VypaarAI
        try {
          const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
          if (!apiKey) throw new Error("VypaarAI API key is missing.");
          const { GoogleGenerativeAI } = await import("@google/generative-ai");
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
          const result = await model.generateContent(promptText);
          return result.response.text();
        } catch (e) {
          console.warn("VypaarAI failed, trying Groq...", e);
        }

        // 2. Groq
        try {
          const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
          if (!groqApiKey) throw new Error("Groq API key is missing.");
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${groqApiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [{ role: "user", content: promptText }],
              temperature: 0,
            })
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          return data.choices[0].message.content;
        } catch (e) {
          console.warn("Groq failed, trying OpenRouter...", e);
        }

        // 3. OpenRouter
        try {
          const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
          if (!openRouterApiKey) throw new Error("OpenRouter API key is missing.");
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${openRouterApiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [{ role: "user", content: promptText }],
              temperature: 0,
            })
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          return data.choices[0].message.content;
        } catch (e) {
          console.warn("OpenRouter failed, trying Mistral...", e);
        }



        try {
          const deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
          if (!deepseekApiKey) throw new Error("DeepSeek API key is missing.");
          const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${deepseekApiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [{ role: "user", content: promptText }],
              temperature: 0,
            })
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          return data.choices[0].message.content;
        } catch (e) {
          console.warn("DeepSeek failed", e);
        }
        throw new Error("All AI models (VypaarAI, Groq, OpenRouter, Mistral, DeepSeek) failed to process.");
      };


      const responseText = await attemptProviders();
      const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanText);

      const newCartItems: CartItem[] = [];
      parsed.items.forEach((it: any) => {
        const prod = products.find(p => p.id === it.productId);
        if (prod) {
          const requestedQty = it.qty || 1;
          // Enforce stock limit
          if (requestedQty > prod.stock) {
            toast.warning(`${prod.name}: Requested ${requestedQty}, but only ${prod.stock} available. Adding ${prod.stock}.`);
            newCartItems.push({ product: prod, qty: prod.stock });
          } else if (prod.stock === 0) {
            toast.error(`${prod.name} is out of stock. Skipping.`);
          } else {
            newCartItems.push({ product: prod, qty: requestedQty });
          }
        }
      });

      let finalCart = cart;
      setCart(prev => {
        const combined = [...prev];
        newCartItems.forEach(newItem => {
          const existing = combined.find(c => c.product.id === newItem.product.id);
          if (existing) {
            const newQty = existing.qty + newItem.qty;
            // Enforce stock limit when combining
            if (newQty > newItem.product.stock) {
              toast.warning(`${newItem.product.name}: Total would be ${newQty}, but only ${newItem.product.stock} available. Setting to ${newItem.product.stock}.`);
              existing.qty = newItem.product.stock;
            } else {
              existing.qty = newQty;
            }
          } else {
            combined.push(newItem);
          }
        });
        finalCart = combined;
        return combined;
      });

      if (parsed.saveCommand) {
        handleSave(finalCart);
      }

    } catch (e: any) {
      console.error(e);
      toast.error("All AI models failed. Please try speaking again or use manual billing.");

      // Fallback: Show helpful message
      toast.info("Tip: Speak clearly like 'Add 2 Parle-G and 1 Amul Milk'", {
        duration: 6000,
      });

      setProcessing(false);
      return;
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async (itemsToSave = cart) => {
    if (itemsToSave.length === 0) {
      toast.error("Cart is empty. Say some items first!");
      return;
    }

    const subtotal = itemsToSave.reduce((s, i) => s + i.product.price * i.qty, 0);
    const gst = subtotal * 0.05;
    const total = Math.max(0, subtotal + gst);

    const billId = await createBillWithStockUpdate(itemsToSave, subtotal, gst, 0, total);

    if (billId) {
      toast.success(`Voice Bill saved to database!`);
      toast.success("WhatsApp Bill Sent!", {
        description: "Bill & online store link (http://localhost:5173/store) sent to the customer.",
        duration: 6000,
      });
      onClose();
    }
  };

  return (
    <Modal onClose={onClose} title="AI Voice Billing" maxWidth="max-w-xl">
      <div className="p-8 flex flex-col items-center">
        <button
          onClick={isListening ? handleDone : (processing ? () => { } : startListening)}
          className={cn(
            "h-24 w-24 rounded-full flex items-center justify-center transition-all mb-6",
            isListening ? "bg-alert-soft text-alert animate-pulse ring-4 ring-alert/20" : "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-glow hover:scale-105"
          )}
        >
          {processing ? <Loader2 className="h-8 w-8 animate-spin" /> : <Mic className="h-8 w-8" />}
        </button>
        <p className="text-sm font-semibold mb-2">
          {isListening ? "Listening... Tap mic to finish" : processing ? "AI is processing..." : "Tap the mic to start speaking"}
        </p>
        <p className="text-sm text-muted-foreground text-center max-w-sm italic min-h-[3rem]">
          {transcript || '"Add 2 Parle-G and 1 Amul Milk. Save bill."'}
        </p>

        {isListening && (
          <button
            onClick={handleDone}
            className="mt-6 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold shadow-md hover:scale-105 transition-smooth animate-fade-up"
          >
            Done Speaking
          </button>
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-border p-5 bg-muted/20 animate-fade-up">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Extracted Items</h3>



          <div className="space-y-2 mb-5">
            {cart.map((i, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm bg-card px-4 py-3 rounded-xl border border-border/60 shadow-sm">
                <span className="flex items-center gap-2"><span className="text-xl">{i.product.emoji}</span> {i.product.name}</span>
                <span className="font-semibold">{i.qty} × ₹{i.product.price}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setCart([])} className="flex-1 py-3 rounded-xl bg-card border font-semibold text-sm hover:bg-muted transition-smooth">Clear</button>
            <button onClick={() => handleSave(cart)} className="flex-[2] py-3 rounded-xl bg-gradient-success text-success-foreground font-semibold text-sm shadow-md hover:opacity-90 transition-smooth">Confirm & Save Bill</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
