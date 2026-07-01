import { useState, useEffect } from "react";
import { productsAPI, billsAPI } from "@/lib/api";
import { Search, Plus, Package, AlertTriangle, XCircle, CheckCircle2, Sparkles, X, Minus, Loader2, Check } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Inventory() {
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [aiReorderOpen, setAiReorderOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productsAPI.getAll();
      setProductList(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filtered = productList.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const lowCount = productList.filter((p) => p.stock > 0 && p.stock < p.minStock).length;
  const outCount = productList.filter((p) => p.stock === 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">Live stock levels across {productList.length} products</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setAiReorderOpen(true)} className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-glow hover:scale-105 transition-smooth border-0">
            <Sparkles className="h-4 w-4" /> AI Reorder
          </button>
          <button onClick={() => setAddProductOpen(true)} className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-sm shadow-glow hover:opacity-90 transition-smooth">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Products" value={`${productList.length}`} icon={Package} tone="primary" />
        <StatCard label="Healthy Stock" value={`${productList.length - lowCount - outCount}`} icon={CheckCircle2} tone="success" />
        <StatCard label="Low Stock" value={`${lowCount}`} icon={AlertTriangle} tone="warning" />
        <StatCard label="Out of Stock" value={`${outCount}`} icon={XCircle} tone="alert" />
      </div>

      <div className="rounded-2xl bg-card border border-border/60 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search inventory…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm"
            />
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {filtered.map((p) => {
            // Calculate percentage based on current stock vs minimum stock
            // If stock >= minStock, show as healthy (green zone)
            // Bar fills from 0 to minStock*2 for better visualization
            const maxForBar = p.minStock * 2;
            const pct = Math.min(100, Math.round((p.stock / maxForBar) * 100));

            const status =
              p.stock === 0 ? "out" : p.stock < p.minStock ? "low" : "good";
            const barColor =
              status === "out" ? "bg-alert" : status === "low" ? "bg-warning" : "bg-success";
            const badge =
              status === "out"
                ? "bg-alert-soft text-alert"
                : status === "low"
                  ? "bg-warning-soft text-warning"
                  : "bg-success-soft text-success";
            return (
              <div key={p._id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-smooth animate-fade-up">
                <div className="text-3xl shrink-0">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{p.name}</p>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{p.category}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden max-w-xs relative">
                      <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
                      {/* Min stock indicator line */}
                      {p.stock < maxForBar && (
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-foreground/30"
                          style={{ left: `${(p.minStock / maxForBar) * 100}%` }}
                          title={`Min stock: ${p.minStock}`}
                        />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {p.stock} / {p.minStock} {p.unit}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:flex items-center gap-2">
                  <div>
                    <p className="text-sm font-bold text-foreground tabular-nums">₹{p.price}</p>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider", badge)}>
                      {status === "out" ? "Out" : status === "low" ? "Low" : "Good"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setAddStockOpen(true);
                    }}
                    className="h-8 w-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary grid place-items-center transition-smooth"
                    title="Add stock"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {aiReorderOpen && <AIReorderModal onClose={() => setAiReorderOpen(false)} products={productList} onRefresh={fetchProducts} />}
      {addProductOpen && (
        <AddProductModal
          onClose={() => setAddProductOpen(false)}
          onAdd={async (newProduct) => {
            try {
              await productsAPI.create(newProduct);
              await fetchProducts();
              toast.success("Product added successfully!");
              setAddProductOpen(false);
            } catch (error) {
              toast.error("Failed to add product");
            }
          }}
        />
      )}
      {addStockOpen && selectedProduct && (
        <AddStockModal
          product={selectedProduct}
          onClose={() => {
            setAddStockOpen(false);
            setSelectedProduct(null);
          }}
          onUpdate={async (quantity) => {
            try {
              await productsAPI.updateStock(selectedProduct._id, {
                quantity,
                operation: 'add'
              });
              await fetchProducts();
              toast.success(`Added ${quantity} ${selectedProduct.unit} to ${selectedProduct.name}`);
              setAddStockOpen(false);
              setSelectedProduct(null);
            } catch (error) {
              toast.error("Failed to update stock");
            }
          }}
        />
      )}
    </div>
  );
}

function AddProductModal({ onClose, onAdd }: { onClose: () => void, onAdd: (p: any) => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock] = useState("10");
  const [category, setCategory] = useState("Grocery");
  const [unit] = useState("pcs");
  const [emoji, setEmoji] = useState("📦");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return toast.error("Please fill all fields");

    const newProduct = {
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      minStock: Number(minStock),
      unit,
      emoji
    };
    onAdd(newProduct);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-elevated border border-border/60 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-gradient-primary text-primary-foreground">
          <Package className="h-5 w-5" />
          <h2 className="font-bold text-lg flex-1">Add New Product</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/20 transition-smooth text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Product Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm" placeholder="e.g. Aashirvaad Atta" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Price (₹)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm" placeholder="100" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Current Stock</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full p-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm" placeholder="25" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Category</label>
              <input value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm" placeholder="Grocery" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Emoji</label>
              <input value={emoji} onChange={e => setEmoji(e.target.value)} className="w-full p-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm" placeholder="📦" required />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-muted">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-md">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AIReorderModal({ onClose, products, onRefresh }: { onClose: () => void, products: any[], onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<{ id: string; name: string; qty: number; emoji: string; reason: string }[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  const analyze = async () => {
    setLoading(true);
    const allProducts = products.map(p => ({ id: p._id, name: p.name, stock: p.stock, minStock: p.minStock }));
    try {
      const { data: billsData } = await billsAPI.getAll();
      const allBills = billsData.data || [];

      const promptText = `You are an AI inventory manager for a retail Kirana store.
      Your task is to predict and generate a dynamic list of products that need to be reordered today. 
      
      You must evaluate reorder priority using the following logic:
      1. SALES TRENDS (60% weightage): Analyze ALL the provided historical bills. Identify which products are selling the most, detect patterns, and predict future spikes in demand. High-velocity items must be reordered even if they haven't hit zero yet.
      2. INVENTORY LEVELS (40% weightage): Analyze the current stock vs minimum stock threshold.
      
      As new bills are generated and stock reduces, your output must adapt instantly to these changes.
      
      Current Inventory: ${JSON.stringify(allProducts)}
      All Historical Bills: ${JSON.stringify(allBills)}
      
      Output the top suggested products to reorder. For each item, specify the suggested quantity to order and a very short reason (e.g. "Trending item: 25 sold recently" or "Critical: Only 2 left in stock").
      Return ONLY a raw JSON array of objects with keys: id (string), name (string), emoji (string), qty (number), reason (string).
      Do NOT wrap in markdown code blocks.`;

      const attemptProviders = async () => {
        // 4. x
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
          console.warn("Mistral failed, trying DeepSeek...", e);
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



        // 5. DeepSeek (Final fallback)
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
      const text = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      let parsed = [];
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        throw new Error("Failed to parse AI response. Try again.");
      }
      setList(parsed);
      setAnalyzed(true);
      toast.success("AI Analysis complete!");
    } catch (e: any) {
      console.error(e);

      // Fallback: Generate basic reorder list based on low stock
      const lowStockProducts = allProducts.filter(p => p.stock < p.minStock)
        .sort((a, b) => (a.stock / a.minStock) - (b.stock / b.minStock))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          emoji: "📦",
          qty: Math.max(p.minStock * 2 - p.stock, p.minStock),
          reason: `Low stock: ${p.stock}/${p.minStock} units`
        }));

      if (lowStockProducts.length > 0) {
        setList(lowStockProducts);
        setAnalyzed(true);
        toast.warning("AI models failed. Showing basic low-stock analysis.");
        toast.info("Reorder suggestions based on minimum stock levels", {
          duration: 5000,
        });
      } else {
        toast.error("All AI models failed and no low-stock items found.");
        toast.info("Your inventory looks healthy! No immediate reordering needed.", {
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const submitReorder = async () => {
    try {
      // Update stock for each item in the reorder list
      for (const item of list) {
        await productsAPI.updateStock(item.id, {
          quantity: item.qty,
          operation: 'add'
        });
      }

      await onRefresh();
      toast.success(`Reorder confirmed! Added ${list.reduce((sum, item) => sum + item.qty, 0)} items to inventory.`);
      onClose();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update inventory');
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-2xl bg-card rounded-3xl shadow-elevated border border-border/60 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
          <Sparkles className="h-5 w-5" />
          <h2 className="font-bold text-lg flex-1">AI Smart Reorder</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/20 transition-smooth text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 bg-card">
          {!analyzed && !loading && (
            <div className="text-center py-10 space-y-4">
              <div className="h-16 w-16 bg-muted text-foreground rounded-full grid place-items-center mx-auto border border-border"><Sparkles className="h-8 w-8" /></div>
              <h3 className="text-lg font-bold">Let VypaarAI Analyze Your Inventory</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">We will look at your current stock levels, low-stock alerts, and recent sales trends from your billing history to predict exactly what and how much you need to reorder.</p>
              <button onClick={analyze} className="mt-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-bold shadow-glow hover:scale-105 transition-smooth">Start Analysis</button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 space-y-4 animate-pulse">
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
              <p className="font-semibold">VypaarAI is crunching numbers...</p>
            </div>
          )}

          {analyzed && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Review the AI-suggested reorder quantities. You can adjust them before confirming.</p>
              <div className="space-y-2">
                {list.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 border border-border/60 rounded-xl">
                    <span className="text-2xl">{it.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{it.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{it.reason}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-card rounded-lg p-0.5 border border-border">
                      <button onClick={() => setList(l => l.map((x, i) => i === idx ? { ...x, qty: Math.max(0, x.qty - 1) } : x))} className="h-7 w-7 grid place-items-center hover:bg-muted rounded"><Minus className="h-3 w-3" /></button>
                      <input type="number" value={it.qty} onChange={e => setList(l => l.map((x, i) => i === idx ? { ...x, qty: +e.target.value } : x))} className="w-10 text-center text-sm font-bold bg-transparent outline-none" />
                      <button onClick={() => setList(l => l.map((x, i) => i === idx ? { ...x, qty: x.qty + 1 } : x))} className="h-7 w-7 grid place-items-center hover:bg-muted rounded"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => setList(l => l.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-alert p-2"><X className="h-4 w-4" /></button>
                  </div>
                ))}
                {list.length === 0 && <p className="text-sm text-center py-4 text-muted-foreground">No items to reorder right now.</p>}
              </div>
            </div>
          )}
        </div>

        {analyzed && (
          <div className="p-4 border-t border-border bg-card flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-muted">Cancel</button>
            <button onClick={submitReorder} disabled={list.length === 0} className="px-5 py-2.5 rounded-xl bg-gradient-success text-success-foreground font-semibold text-sm shadow-md disabled:opacity-50 inline-flex items-center gap-2"><Check className="h-4 w-4" /> Confirm & Order</button>
          </div>
        )}
      </div>
    </div>
  )
}

function AddStockModal({ product, onClose, onUpdate }: { product: any, onClose: () => void, onUpdate: (qty: number) => void }) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || Number(quantity) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setLoading(true);
    try {
      await onUpdate(Number(quantity));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-elevated border border-border/60 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-gradient-primary text-primary-foreground">
          <Package className="h-5 w-5" />
          <h2 className="font-bold text-lg flex-1">Add Stock</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/20 transition-smooth text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
            <span className="text-3xl">{product.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-muted-foreground">Current stock: {product.stock} {product.unit}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Quantity to Add</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm"
              placeholder="Enter quantity"
              min="1"
              required
              autoFocus
            />
            {quantity && Number(quantity) > 0 && (
              <p className="text-xs text-muted-foreground">
                New stock will be: <span className="font-semibold text-foreground">{product.stock + Number(quantity)} {product.unit}</span>
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-muted" disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !quantity || Number(quantity) <= 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-md disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Stock
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
