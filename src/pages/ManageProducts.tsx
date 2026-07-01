import { useState, useEffect } from "react";
import { productsAPI } from "@/lib/api";
import { Search, Plus, Edit2, EyeOff, Save, X, Package, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ManageProducts() {
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form state for editing
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editCategory, setEditCategory] = useState("");
  const [editEmoji, setEditEmoji] = useState("");

  const [addProductOpen, setAddProductOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productsAPI.getAll();
      setProductList(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productList.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditCategory(product.category);
    setEditEmoji(product.emoji);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      await productsAPI.update(editingProduct._id, {
        name: editName,
        price: editPrice,
        category: editCategory,
        emoji: editEmoji
      });

      await fetchProducts();
      toast.success("Product details updated successfully!");
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleHideProduct = async (productId: string, productName: string) => {
    try {
      await productsAPI.delete(productId);
      await fetchProducts();
      toast.success(`${productName} hidden from catalog`);
    } catch (error) {
      console.error('Error hiding product:', error);
      toast.error('Failed to hide product');
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await productsAPI.delete(productId);
      await fetchProducts();
      toast.success(`${productName} deleted successfully`);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Catalog</h2>
          <p className="text-muted-foreground">Manage your product catalog - edit, hide, or delete products.</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={() => setAddProductOpen(true)}>
          <Plus className="h-4 w-4" /> Add New Product
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products by name..."
          className="pl-10 h-12 max-w-md bg-card border-border/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="group relative flex flex-col bg-card border rounded-2xl overflow-hidden transition-all duration-300 border-border/50 hover:shadow-glow"
          >
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full shadow-sm bg-warning/10 text-warning hover:bg-warning/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleHideProduct(product._id, product.name);
                }}
                title="Hide from catalog"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full shadow-sm bg-alert/10 text-alert hover:bg-alert/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProduct(product._id, product.name);
                }}
                title="Delete product"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-40 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center border-b border-border/50">
              {/* Using Emoji as a placeholder for Product Photo */}
              <span className="text-7xl drop-shadow-sm filter group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                  {product.category}
                </Badge>
                <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                  Stock: {product.stock}
                </Badge>
              </div>

              <h3 className="font-bold text-lg leading-tight mb-1">
                {product.name}
              </h3>

              <div className="mt-auto pt-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Price</span>
                  <span className="text-lg font-bold text-primary">₹{product.price}</span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-border/50 hover:bg-muted"
                  onClick={() => handleEditClick(product)}
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product Details</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-muted/50 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Selling Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                className="bg-muted/50 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="bg-muted/50 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji</Label>
              <Input
                id="emoji"
                value={editEmoji}
                onChange={(e) => setEditEmoji(e.target.value)}
                className="bg-muted/50 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingProduct(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  );
}

function AddProductModal({ onClose, onAdd }: { onClose: () => void, onAdd: (p: any) => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("10");
  const [category, setCategory] = useState("Grocery");
  const [unit, setUnit] = useState("pcs");
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
              <label className="text-sm font-semibold">Min Stock</label>
              <input type="number" value={minStock} onChange={e => setMinStock(e.target.value)} className="w-full p-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm" placeholder="10" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Unit</label>
              <input value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm" placeholder="pcs" required />
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
