import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Store, ArrowRight, Package, Smartphone, CreditCard, ChevronRight } from "lucide-react";
import { products, Product } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function Storefront() {
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory && p.stock > 0;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === id) {
          const newQty = Math.max(0, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      }).filter((item) => item.qty > 0)
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Simulate order placement
    toast.success("Order Placed Successfully!", {
      description: "Your order has been sent to Raju Bhai. You will be notified when it is ready.",
      duration: 5000,
    });
    
    // Dispatch custom event to notify the shop owner app (if running in same window context for demo)
    window.dispatchEvent(new CustomEvent('new-store-order', { 
      detail: {
        amount: totalAmount,
        items: cart.length
      }
    }));

    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-orange-500 rounded-xl grid place-items-center text-white shadow-md">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Raju Bhai Ki Kirana</h1>
              <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Online Store</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full grid place-items-center border-2 border-white">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl font-bold mb-2">Welcome to our Digital Store!</h2>
            <p className="text-orange-50 mb-6">Browse our fresh catalog, add items to your cart, and get them delivered to your doorstep in minutes.</p>
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-1 pl-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-white/80" />
              <input 
                type="text"
                placeholder="What are you looking for today?"
                className="bg-transparent border-none text-white placeholder:text-white/70 outline-none flex-1 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12 pointer-events-none">
            <Store className="w-64 h-64" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
                category === c 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-32 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                {product.emoji}
              </div>
              <div className="mb-1">
                <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200 bg-white">
                  {product.category}
                </Badge>
              </div>
              <h3 className="font-bold text-slate-800 leading-tight mb-1">{product.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{product.unit}</p>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold text-lg text-slate-900">₹{product.price}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="h-8 w-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
            <p className="text-slate-500">Try searching for something else or clear your filters.</p>
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-500" />
                Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Package className="h-16 w-16 mb-4" />
                  <p className="text-lg font-semibold">Your cart is empty</p>
                  <p className="text-sm">Add some items from the store to get started.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="h-16 w-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl">
                      {item.product.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.product.name}</h4>
                      <p className="text-orange-600 font-bold text-sm mb-2">₹{item.product.price}</p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateQty(item.product.id, -1)}
                          className="h-6 w-6 bg-white border border-slate-200 rounded-md grid place-items-center text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-bold text-sm tabular-nums min-w-[1ch] text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.product.id, 1)}
                          className="h-6 w-6 bg-orange-100 text-orange-600 border border-orange-200 rounded-md grid place-items-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      ₹{item.product.price * item.qty}
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-emerald-600 font-medium">
                    <span>Delivery Fee</span>
                    <span>FREE</span>
                  </div>
                  <div className="h-px bg-slate-100 w-full" />
                  <div className="flex justify-between font-bold text-lg text-slate-900">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-3">
                    <Smartphone className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600">
                      <p className="font-semibold text-slate-800 mb-0.5">Cash on Delivery Available</p>
                      Pay via UPI or Cash when the order arrives.
                    </div>
                  </div>
                  <Button onClick={handleCheckout} className="w-full h-14 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg gap-2 shadow-lg shadow-orange-500/20">
                    Place Order <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Simple local search icon since lucide-react import Search might cause issues if not imported at top
function Search(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
