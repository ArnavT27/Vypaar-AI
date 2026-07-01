import { useEffect, useState } from "react";
import { suppliersAPI } from "@/lib/api";
import { toast } from "sonner";
import { Search, Store, Phone, MapPin, Package, Filter, Loader2, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Supplier {
  _id: string;
  name: string;
  type: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  source: string;
  pricingTerms: string;
  topProducts: string;
  rating: number;
  verified: boolean;
}

export default function Marketplace() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSuppliers();
    fetchFilters();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [suppliers, searchQuery, selectedCategory, selectedCity, selectedType]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await suppliersAPI.getAll();
      setSuppliers(data.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [categoriesRes, citiesRes] = await Promise.all([
        suppliersAPI.getCategories(),
        suppliersAPI.getCities(),
      ]);
      setCategories(categoriesRes.data.data || []);
      setCities(citiesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const filterSuppliers = () => {
    let filtered = [...suppliers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.topProducts.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // City filter
    if (selectedCity !== "All") {
      filtered = filtered.filter((s) => s.city === selectedCity);
    }

    // Type filter
    if (selectedType !== "All") {
      filtered = filtered.filter((s) => s.type === selectedType);
    }

    setFilteredSuppliers(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedCity("All");
    setSelectedType("All");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Wholesaler":
        return "bg-blue-soft text-blue-600";
      case "Distributor":
        return "bg-green-soft text-green-600";
      case "Manufacturer":
        return "bg-purple-soft text-purple-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="rounded-3xl bg-gradient-hero p-6 md:p-8 text-primary-foreground shadow-glow relative overflow-hidden animate-scale-in">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-6 bottom-0 h-32 w-32 rounded-full bg-white/5 blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-white/15 grid place-items-center backdrop-blur shrink-0">
              <Store className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Supplier Marketplace</h1>
              <p className="text-sm md:text-base opacity-90 mt-1">Connect with {suppliers.length}+ verified suppliers across India</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <p className="text-xs opacity-75">Total Suppliers</p>
              <p className="text-2xl font-bold">{suppliers.length}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <p className="text-xs opacity-75">Categories</p>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <p className="text-xs opacity-75">Cities</p>
              <p className="text-2xl font-bold">{cities.length - 1}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="rounded-2xl bg-card border border-border/60 shadow-soft p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search suppliers, products, categories..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none text-sm transition-smooth"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "px-4 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition-smooth",
              showFilters
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-secondary"
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-up">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none text-sm"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none text-sm"
              >
                <option value="All">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none text-sm"
              >
                <option value="All">All Types</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="Distributor">Distributor</option>
                <option value="Manufacturer">Manufacturer</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredSuppliers.length}</span> of{" "}
          <span className="font-semibold text-foreground">{suppliers.length}</span> suppliers
        </div>
      </section>

      {/* Suppliers Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-card border border-border/60 p-10 text-center">
            <Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
            <p className="text-sm text-muted-foreground">No suppliers found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-primary hover:underline font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div
              key={supplier._id}
              className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft hover:shadow-elevated transition-smooth animate-fade-up group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors">{supplier.name}</h3>
                    {supplier.verified && (
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    )}
                  </div>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full inline-block", getTypeColor(supplier.type))}>
                    {supplier.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1.5 rounded-lg shrink-0">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-sm text-yellow-700 dark:text-yellow-400">{supplier.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Category:</span>
                  <span className="font-semibold text-foreground">{supplier.category}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-muted-foreground text-xs">Location:</span>
                    <p className="font-semibold text-foreground leading-tight">{supplier.address}, {supplier.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Store className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-muted-foreground text-xs">Top Products:</span>
                    <p className="font-semibold text-foreground leading-tight">{supplier.topProducts}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                    📍 {supplier.source}
                  </span>
                </div>
              </div>

              {/* Contact Button */}
              <a
                href={`tel:${supplier.phone}`}
                className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm inline-flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] transition-smooth shadow-md"
              >
                <Phone className="h-4 w-4" />
                Contact Supplier
              </a>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
