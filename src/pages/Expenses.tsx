import { useEffect, useState, useMemo } from "react";
import { billsAPI, productsAPI, expensesAPI } from "@/lib/api";
import { toast } from "sonner";
import {
  Wallet,
  Plus,
  Trash2,
  Calendar,
  Filter,
  Search,
  ArrowUpRight,
  TrendingDown,
  Percent,
  X,
  TrendingUp,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: "Rent" | "Utilities" | "Salary" | "Inventory Purchase" | "Marketing" | "Others";
  paymentMethod: "Cash" | "UPI" | "Card" | "Bank Transfer";
  date: string;
  description?: string;
}

const CATEGORY_COLORS = {
  Rent: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
  Utilities: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
  Salary: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
  "Inventory Purchase": "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  Marketing: "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20",
  Others: "bg-gray-500/10 text-gray-600 border border-gray-500/20",
};

const CHART_COLORS = ["#f97316", "#3b82f6", "#a855f7", "#10b981", "#06b6d4", "#6b7280"];

const chartTooltip = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12,
    boxShadow: "var(--shadow-md)",
    fontSize: 12,
  },
  cursor: { fill: "hsl(var(--primary-soft))" },
};

export default function Expenses() {
  const [activeTab, setActiveTab] = useState<"list" | "p&l">("list");
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "Others" as Expense["category"],
    paymentMethod: "UPI" as Expense["paymentMethod"],
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  // P&L Period State
  const [plPeriod, setPlPeriod] = useState<"week" | "month" | "last30" | "ytd">("month");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, billsRes, prodRes] = await Promise.all([
        expensesAPI.getAll(),
        billsAPI.getAll(),
        productsAPI.getAll(),
      ]);

      setExpenses(expRes.data.data || []);
      setBills(billsRes.data.data || []);
      setProducts(prodRes.data.data || []);
    } catch (error) {
      console.error("Error loading expenses/financial data:", error);
      toast.error("Failed to load financial records");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      setSubmitting(true);
      await expensesAPI.create({
        ...newExpense,
        amount: parseFloat(newExpense.amount),
      });
      toast.success("Expense logged successfully!");
      setIsAddModalOpen(false);
      setNewExpense({
        title: "",
        amount: "",
        category: "Others",
        paymentMethod: "UPI",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to create expense:", error);
      toast.error("Failed to log expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await expensesAPI.delete(id);
      toast.success("Expense deleted");
      fetchData();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || exp.category === categoryFilter;
      
      const expDate = new Date(exp.date);
      const matchesStart = !startDate || expDate >= new Date(startDate);
      
      let matchesEnd = true;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesEnd = expDate <= end;
      }

      return matchesSearch && matchesCategory && matchesStart && matchesEnd;
    });
  }, [expenses, searchTerm, categoryFilter, startDate, endDate]);

  // Overall Financial Calculations
  const stats = useMemo(() => {
    const totalExp = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
    const avgExp = filteredExpenses.length > 0 ? totalExp / filteredExpenses.length : 0;

    // Find highest expense category
    const categoryTotals: { [key: string]: number } = {};
    filteredExpenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    let highestCat = "None";
    let highestAmt = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestAmt) {
        highestAmt = amt;
        highestCat = cat;
      }
    });

    return {
      total: totalExp,
      avg: avgExp,
      highestCategory: highestCat,
      highestAmount: highestAmt,
    };
  }, [filteredExpenses]);

  // P&L Ledger Calculations
  const plData = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let periodStart = new Date(todayStart);
    if (plPeriod === "week") {
      periodStart.setDate(periodStart.getDate() - 7);
    } else if (plPeriod === "month") {
      periodStart.setDate(1); // Start of this month
    } else if (plPeriod === "last30") {
      periodStart.setDate(periodStart.getDate() - 30);
    } else if (plPeriod === "ytd") {
      periodStart = new Date(now.getFullYear(), 0, 1); // Start of year
    }

    // 1. Filter bills in period
    const periodBills = bills.filter((b) => {
      const bDate = new Date(b.createdAt);
      return bDate >= periodStart;
    });

    // 2. Filter expenses in period
    const periodExpenses = expenses.filter((e) => {
      const eDate = new Date(e.date);
      return eDate >= periodStart;
    });

    // 3. Compute Sales Revenue
    const revenue = periodBills.reduce((sum, b) => sum + b.total, 0);

    // 4. Compute Cost of Goods Sold (COGS)
    const productCostMap = new Map<string, number>();
    products.forEach((p) => {
      if (p.name && p.costPrice) {
        productCostMap.set(p.name.toLowerCase().trim(), p.costPrice);
      }
    });

    let cogs = 0;
    let actualCostsMatchedCount = 0;
    let totalItemsCount = 0;

    periodBills.forEach((b) => {
      b.items.forEach((item: any) => {
        totalItemsCount += item.qty || 1;
        const itemName = item.name ? item.name.toLowerCase().trim() : "";
        const cost = productCostMap.get(itemName);
        if (cost !== undefined && cost > 0) {
          cogs += cost * (item.qty || 1);
          actualCostsMatchedCount += item.qty || 1;
        } else {
          // Fallback to 85% cost (meaning 15% estimated profit margin)
          cogs += item.price * 0.85 * (item.qty || 1);
        }
      });
    });

    const operatingExpenses = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;

    // 5. Generate Expense pie chart data
    const expGroup: { [key: string]: number } = {};
    periodExpenses.forEach((exp) => {
      expGroup[exp.category] = (expGroup[exp.category] || 0) + exp.amount;
    });
    
    const pieData = Object.entries(expGroup).map(([name, value]) => ({
      name,
      value,
    }));

    // 6. Generate Cashflow comparison area chart data
    const dailyDataMap = new Map<string, { dateStr: string; sales: number; cogs: number; expenses: number }>();
    
    // Fill in last 7 dates for details
    for (let i = 6; i >= 0; i--) {
      const date = new Date(todayStart);
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      dailyDataMap.set(key, { dateStr: key, sales: 0, cogs: 0, expenses: 0 });
    }

    periodBills.forEach((b) => {
      const bDate = new Date(b.createdAt);
      const key = bDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      if (dailyDataMap.has(key)) {
        const dayRecord = dailyDataMap.get(key)!;
        dayRecord.sales += b.total;
        
        // Calculate items COGS
        b.items.forEach((item: any) => {
          const itemName = item.name ? item.name.toLowerCase().trim() : "";
          const cost = productCostMap.get(itemName) || item.price * 0.85;
          dayRecord.cogs += cost * (item.qty || 1);
        });
      }
    });

    periodExpenses.forEach((e) => {
      const eDate = new Date(e.date);
      const key = eDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      if (dailyDataMap.has(key)) {
        const dayRecord = dailyDataMap.get(key)!;
        dayRecord.expenses += e.amount;
      }
    });

    const areaChartData = Array.from(dailyDataMap.values());

    return {
      revenue,
      cogs,
      grossProfit,
      operatingExpenses,
      netProfit,
      pieData,
      areaChartData,
      isEstimated: actualCostsMatchedCount < totalItemsCount * 0.5, // Estimated if less than 50% matched
    };
  }, [plPeriod, bills, expenses, products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading financial ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero greetings header */}
      <section className="rounded-3xl bg-gradient-hero p-6 md:p-8 text-primary-foreground shadow-glow relative overflow-hidden animate-scale-in">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center backdrop-blur shrink-0">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Expenses & Reports</h1>
              <p className="mt-1 opacity-85 text-xs md:text-sm">
                Track your store expenditures, calculate margins, and visualize your real-time net profitability.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white text-primary px-4 py-2.5 rounded-xl font-bold text-xs hover:scale-105 transition-smooth shadow-md flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Log Expense
            </button>
          </div>
        </div>
      </section>

      {/* KPI Stats widgets */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-soft hover:shadow-elevated transition-smooth animate-fade-up">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">LOGGED OUTFLOWS (FILTERED)</p>
          <p className="mt-2 text-2xl md:text-3xl font-bold text-foreground tabular-nums">
            ₹{Math.round(stats.total).toLocaleString("en-IN")}
          </p>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <TrendingDown className="h-3.5 w-3.5 text-alert" />
            <span>Outflow across {filteredExpenses.length} entries</span>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-soft hover:shadow-elevated transition-smooth animate-fade-up">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">AVERAGE TRANSACTION OUTFLOW</p>
          <p className="mt-2 text-2xl md:text-3xl font-bold text-foreground tabular-nums">
            ₹{Math.round(stats.avg).toLocaleString("en-IN")}
          </p>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
            <span>Average per recorded ticket</span>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-soft hover:shadow-elevated transition-smooth animate-fade-up">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">HIGHEST OVERHEAD CATEGORY</p>
          <p className="mt-2 text-xl md:text-2xl font-bold text-foreground truncate uppercase">
            {stats.highestCategory}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Percent className="h-3.5 w-3.5 text-success" />
            <span>Peak category: ₹{Math.round(stats.highestAmount).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </section>

      {/* Tabs selectors */}
      <div className="flex border-b border-border/60">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "list"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Expense List & Logger
        </button>
        <button
          onClick={() => setActiveTab("p&l")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "p&l"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          📈 Profit & Loss Statement
        </button>
      </div>

      {/* Tab 1: Expense Logger List */}
      {activeTab === "list" && (
        <section className="space-y-4">
          {/* Filters Bar */}
          <div className="rounded-2xl bg-card border border-border/50 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fade-up">
            <div className="flex flex-1 flex-col sm:flex-row gap-3">
              {/* Search bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search expense title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-muted/40 border border-border/80 focus:border-primary focus:bg-background outline-none rounded-xl text-sm transition-all"
                />
              </div>

              {/* Category dropdown selector */}
              <div className="relative shrink-0">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-44 px-3 py-2 bg-muted/40 border border-border/80 outline-none rounded-xl text-sm focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Salary">Salary</option>
                  <option value="Inventory Purchase">Inventory Purchase</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* Date range pickers */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-8 pr-2 py-1.5 bg-muted/40 border border-border/80 outline-none rounded-xl text-xs focus:border-primary transition-all"
                />
              </div>
              <span className="text-xs text-muted-foreground">to</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-8 pr-2 py-1.5 bg-muted/40 border border-border/80 outline-none rounded-xl text-xs focus:border-primary transition-all"
                />
              </div>
              {(startDate || endDate || searchTerm || categoryFilter !== "All") && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setSearchTerm("");
                    setCategoryFilter("All");
                  }}
                  className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Expenses Table */}
          <div className="rounded-2xl bg-card border border-border/60 overflow-hidden shadow-soft animate-fade-up">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/60">
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Title</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Payment Method</th>
                    <th className="px-5 py-3.5 text-right">Amount</th>
                    <th className="px-5 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((exp) => (
                      <tr key={exp._id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(exp.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3 font-semibold text-foreground truncate max-w-[200px]">
                          {exp.title}
                          {exp.description && (
                            <span className="block text-[11px] font-normal text-muted-foreground truncate">
                              {exp.description}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${
                              CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Others
                            }`}
                          >
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{exp.paymentMethod}</td>
                        <td className="px-5 py-3 text-right font-bold text-foreground tabular-nums">
                          ₹{exp.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => handleDeleteExpense(exp._id)}
                            className="p-1.5 rounded-lg text-alert hover:bg-alert/10 transition-smooth"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                        No expenditures recorded matching selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Profit & Loss Statement Ledger */}
      {activeTab === "p&l" && (
        <section className="grid lg:grid-cols-3 gap-6">
          {/* Left: Interactive Financial Ledger Sheets */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft space-y-6 animate-fade-up">
              {/* Ledger Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="font-bold text-lg text-foreground flex items-center gap-1.5">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    Profit & Loss Statement
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Traditional trading and income ledger account summary
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Period selection */}
                  <select
                    value={plPeriod}
                    onChange={(e: any) => setPlPeriod(e.target.value)}
                    className="px-3 py-1.5 bg-muted border border-border outline-none rounded-xl text-xs font-semibold focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="week">Past 7 Days</option>
                    <option value="month">This Month</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="ytd">Year-to-Date (YTD)</option>
                  </select>
                </div>
              </div>

              {/* Ledger Rows */}
              <div className="space-y-4 text-sm">
                {/* 1. Operating Revenue */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-foreground border-b border-border/30 pb-1">
                    <span>1. Operating Revenue (Sales)</span>
                    <span className="tabular-nums">₹{Math.round(plData.revenue).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs pl-4">
                    <span>Invoice Bill Receipts</span>
                    <span className="tabular-nums">₹{Math.round(plData.revenue).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* 2. Cost of Goods Sold */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-foreground border-b border-border/30 pb-1">
                    <span>2. Cost of Goods Sold (COGS)</span>
                    <span className="tabular-nums text-alert">
                      -₹{Math.round(plData.cogs).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs pl-4">
                    <span>Product Costs (Base purchases)</span>
                    <span className="tabular-nums">₹{Math.round(plData.cogs).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* 3. Gross Profit */}
                <div className="flex justify-between font-bold text-base p-3 bg-muted/40 rounded-xl border border-border/40">
                  <span className="text-foreground">3. Gross Profit Margin (1 - 2)</span>
                  <span className="text-primary tabular-nums">
                    ₹{Math.round(plData.grossProfit).toLocaleString("en-IN")}
                  </span>
                </div>

                {/* 4. Operating Expenses */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-foreground border-b border-border/30 pb-1">
                    <span>4. Logged Store Expenses</span>
                    <span className="tabular-nums text-alert">
                      -₹{Math.round(plData.operatingExpenses).toLocaleString("en-IN")}
                    </span>
                  </div>
                  {plData.pieData.map((item) => (
                    <div key={item.name} className="flex justify-between text-muted-foreground text-xs pl-4">
                      <span>{item.name}</span>
                      <span className="tabular-nums">₹{Math.round(item.value).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  {plData.pieData.length === 0 && (
                    <div className="text-muted-foreground text-xs pl-4 italic">No overhead expenses logged.</div>
                  )}
                </div>

                {/* 5. Net Profit */}
                <div className={`flex justify-between font-bold text-lg p-4 rounded-xl border ${
                  plData.netProfit >= 0 
                    ? "bg-success-soft/30 border-success/30 text-success" 
                    : "bg-alert-soft/30 border-alert/30 text-alert"
                }`}>
                  <span>5. Net Operating Profit (3 - 4)</span>
                  <span className="tabular-nums">
                    ₹{Math.round(plData.netProfit).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Indicator estimation banner */}
              <div className={`p-3.5 rounded-xl text-xs ${
                plData.isEstimated ? "bg-muted text-muted-foreground border border-border" : "bg-primary-soft text-primary border border-primary/20"
              }`}>
                {plData.isEstimated ? (
                  <p>
                    💡 <strong>Calculation Note:</strong> Many products in the database do not have their <strong>costPrice</strong> configured. Profit calculations are currently estimated based on a standard 15% product margin.
                  </p>
                ) : (
                  <p>
                    ✅ <strong>High Integrity Margin:</strong> Using accurate costPrice settings mapped directly from your product catalog.
                  </p>
                )}
              </div>
            </div>

            {/* Daily Cashflow Chart */}
            <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft animate-fade-up">
              <h3 className="font-semibold text-foreground">Cashflow & Revenue comparison</h3>
              <p className="text-xs text-muted-foreground mb-4">Daily comparison of billed sales vs COGS vs logged expenditures</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={plData.areaChartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expensesColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="dateStr" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip {...chartTooltip} />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#salesColor)" name="Revenue (Sales)" />
                    <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#expensesColor)" name="Store Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right: Expense Pie Chart Distributions */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft animate-fade-up flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Outflow by Category</h3>
                <p className="text-xs text-muted-foreground mb-4">Distribution of overhead operating expenses</p>
              </div>
              <div className="h-64 flex items-center justify-center">
                {plData.pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={plData.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {plData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip {...chartTooltip} formatter={(val: number) => `₹${val.toLocaleString()}`} />
                      <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-12">
                    <TrendingDown className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <span>No operating expenses logged to chart</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft animate-fade-up">
              <h3 className="font-semibold text-foreground">Operating margin statistics</h3>
              <p className="text-xs text-muted-foreground mb-4">Key indicators for store cost structure</p>
              <div className="space-y-3.5 mt-2 text-sm">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Operating Profit Margin</span>
                  <span className="font-bold text-foreground">
                    {plData.revenue > 0 ? `${((plData.netProfit / plData.revenue) * 100).toFixed(1)}%` : "0.0%"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Expense to Sales Ratio</span>
                  <span className="font-bold text-foreground">
                    {plData.revenue > 0 ? `${((plData.operatingExpenses / plData.revenue) * 100).toFixed(1)}%` : "0.0%"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Cost of Goods Ratio</span>
                  <span className="font-bold text-foreground">
                    {plData.revenue > 0 ? `${((plData.cogs / plData.revenue) * 100).toFixed(1)}%` : "0.0%"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Invoices Billed</span>
                  <span className="font-bold text-foreground">{bills.length} bills</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-in text-foreground"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-card rounded-3xl shadow-elevated border border-border/60 overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
              <h2 className="font-bold text-lg flex-1">Log Store Expense</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted transition-smooth"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Expense Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    placeholder="e.g. Electricity bill, Supplier cash purchase"
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-sm transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-sm transition-all tabular-nums"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Outflow Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-sm transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value as Expense["category"] })
                    }
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border outline-none rounded-xl text-sm focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Salary">Salary</option>
                    <option value="Inventory Purchase">Inventory Purchase</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Payment Method
                  </label>
                  <select
                    value={newExpense.paymentMethod}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        paymentMethod: e.target.value as Expense["paymentMethod"],
                      })
                    }
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border outline-none rounded-xl text-sm focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Description / Notes
                  </label>
                  <textarea
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Optional notes or references..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-muted/40 border border-border focus:border-primary focus:bg-background outline-none rounded-xl text-sm transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-muted hover:bg-secondary text-sm font-semibold transition-smooth"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 shadow-glow transition-smooth disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Logging...
                    </>
                  ) : (
                    "Save Expense"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
