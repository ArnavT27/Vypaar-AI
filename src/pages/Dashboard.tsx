import { StatCard } from "@/components/StatCard";
import { InsightCard } from "@/components/InsightCard";
import { insights, trending } from "@/lib/mockData";
import { IndianRupee, ShoppingCart, Package, TrendingUp, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { billsAPI, productsAPI, aiInsightsAPI, predictionsAPI, trendingAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

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

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    todaySales: 0,
    todayBills: 0,
    todayProfit: 0,
    yesterdayProfit: 0,
    isTodayProfitActual: false,
    weekSales: 0,
    previousWeekSales: 0,
    weekProfit: 0,
    lowStockCount: 0,
    lowStockProducts: [] as any[],
    salesData: [] as any[],
    topProducts: [] as any[],
    yesterdaySales: 0,
  });
  const [isLowStockBannerDismissed, setIsLowStockBannerDismissed] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [stockPrediction, setStockPrediction] = useState<any>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [trendingData, setTrendingData] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  // Hindi taglines that rotate on each page load
  const taglines = useMemo(() => [
    "Aaj ka business — ek nazar mein",
    "Apne dukaan ka haal — ek click mein",
    "Business ki puri jankari — yahan hai",
    "Aaj ki kamai — sabse pehle yahan",
    "Dukaan ka hisaab — bilkul saaf",
    "Business ka dashboard — smart aur fast",
    "Aaj ka din — kaisa raha dekho",
    "Sales aur stock — sab kuch clear",
  ], []);

  // Random tagline on each render
  const randomTagline = useMemo(() => {
    return taglines[Math.floor(Math.random() * taglines.length)];
  }, [taglines]);

  // Get greeting based on IST time
  const getGreeting = () => {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const hour = istTime.getUTCHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  // Get user's first name in uppercase
  const getUserName = () => {
    if (!user?.name) return "BOSS";
    const firstName = user.name.split(' ')[0];
    return firstName.toUpperCase();
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAIInsights();
    fetchStockPrediction();
    fetchTrending();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch bills and products
      const [billsResponse, productsResponse] = await Promise.all([
        billsAPI.getAll(),
        productsAPI.getAll(),
      ]);

      const bills = billsResponse.data.data || [];
      const products = productsResponse.data.data || [];

      // ── IST Calendar-Date Filtering ──────────────────────────────────────
      // Bills are stored as UTC ISO strings in MongoDB. To correctly assign a
      // bill to an IST calendar day, we convert each bill date to its IST
      // "YYYY-MM-DD" string and compare directly — no UTC boundaries needed.
      const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC + 5h30m

      /** Returns the IST calendar date as "YYYY-MM-DD" for any Date */
      const toISTDateStr = (d: Date): string =>
        new Date(d.getTime() + IST_OFFSET_MS).toISOString().split('T')[0];

      const now = new Date();
      const todayIST      = toISTDateStr(now);
      const yesterdayIST  = toISTDateStr(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000));
      // First day of the current 7-day window (6 days before today)
      const weekStartIST  = toISTDateStr(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
      // Previous 7-day window: 13 days ago → 7 days ago
      const prevWeekEndIST   = toISTDateStr(new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000));
      const prevWeekStartIST = toISTDateStr(new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000));

      /** Get the IST date string of a bill */
      const billISTDate = (b: any): string =>
        toISTDateStr(new Date(b.createdAt));

      // Today's bills — exact IST date match
      const todayBills = bills.filter((b: any) => billISTDate(b) === todayIST);

      // Yesterday's bills — exact IST date match
      const yesterdayBills = bills.filter((b: any) => billISTDate(b) === yesterdayIST);

      // This week's bills — IST date in [weekStartIST, todayIST]
      const weekBills = bills.filter((b: any) => {
        const d = billISTDate(b);
        return d >= weekStartIST && d <= todayIST;
      });

      // Previous week's bills — IST date in [prevWeekStartIST, prevWeekEndIST]
      const previousWeekBills = bills.filter((b: any) => {
        const d = billISTDate(b);
        return d >= prevWeekStartIST && d <= prevWeekEndIST;
      });

      // Map product names to costPrice
      const productCostMap = new Map<string, number>();
      products.forEach((p: any) => {
        if (p.name && p.costPrice !== undefined && p.costPrice !== null) {
          productCostMap.set(p.name.toLowerCase().trim(), p.costPrice);
        }
      });

      // Helper to calculate profit for a bill based on actual cost prices
      const calculateBillProfit = (bill: any) => {
        let billProfit = 0;
        let hasActualCost = false;

        if (bill.items && bill.items.length > 0) {
          bill.items.forEach((item: any) => {
            const itemName = item.name ? item.name.toLowerCase().trim() : "";
            const costPrice = productCostMap.get(itemName);
            const qty = item.qty || 1;
            const price = item.price || 0;

            if (costPrice !== undefined && costPrice > 0) {
              billProfit += (price - costPrice) * qty;
              hasActualCost = true;
            } else {
              // Fallback to 15% margin
              billProfit += (price * 0.15) * qty;
            }
          });
        } else {
          // If no items list exists, fallback to 15% of bill total
          billProfit = bill.total * 0.15;
        }

        return { profit: billProfit, isActual: hasActualCost };
      };

      // Calculate today's sales and profit
      const todaySales = todayBills.reduce((sum: number, b: any) => sum + b.total, 0);
      const yesterdaySales = yesterdayBills.reduce((sum: number, b: any) => sum + b.total, 0);
      const weekSales = weekBills.reduce((sum: number, b: any) => sum + b.total, 0);
      const previousWeekSales = previousWeekBills.reduce((sum: number, b: any) => sum + b.total, 0);

      let todayProfit = 0;
      let isTodayProfitActual = false;
      todayBills.forEach((b: any) => {
        const { profit, isActual } = calculateBillProfit(b);
        todayProfit += profit;
        if (isActual) {
          isTodayProfitActual = true;
        }
      });

      let yesterdayProfit = 0;
      yesterdayBills.forEach((b: any) => {
        yesterdayProfit += calculateBillProfit(b).profit;
      });

      let weekProfit = 0;
      weekBills.forEach((b: any) => {
        weekProfit += calculateBillProfit(b).profit;
      });

      // Calculate low stock products
      const lowStockProducts = products.filter((p: any) => p.stock < p.minStock);
      const lowStockCount = lowStockProducts.length;

      // Generate sales data for last 7 IST calendar days.
      // For today (i === 0) we reuse todayBills so the chart and stat cards
      // always agree on the same number.
      const salesData = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const dayDate    = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayISTStr  = toISTDateStr(dayDate);
        // Use IST day-of-week label (shift UTC day by IST offset)
        const istDayDate = new Date(dayDate.getTime() + IST_OFFSET_MS);

        // Today → reuse already-filtered todayBills (guaranteed consistent)
        const dayBills = i === 0
          ? todayBills
          : bills.filter((b: any) => billISTDate(b) === dayISTStr);

        const daySales = dayBills.reduce((sum: number, b: any) => sum + b.total, 0);
        let dayProfit = 0;
        dayBills.forEach((b: any) => {
          dayProfit += calculateBillProfit(b).profit;
        });

        salesData.push({
          day: dayNames[istDayDate.getUTCDay()],
          sales: Math.round(daySales),
          profit: Math.round(dayProfit),
        });
      }

      // Calculate top products from bills
      const productSales: { [key: string]: { name: string; emoji: string; sold: number } } = {};

      bills.forEach((bill: any) => {
        bill.items.forEach((item: any) => {
          const key = item.name;
          if (!productSales[key]) {
            productSales[key] = {
              name: item.name,
              emoji: item.emoji || '📦',
              sold: 0,
            };
          }
          productSales[key].sold += item.qty;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5)
        .map(p => ({
          name: `${p.emoji} ${p.name.substring(0, 12)}`,
          sold: p.sold,
        }));

      setDashboardData({
        todaySales,
        todayBills: todayBills.length,
        todayProfit,
        yesterdayProfit,
        isTodayProfitActual,
        weekSales,
        previousWeekSales,
        weekProfit,
        lowStockCount,
        lowStockProducts,
        salesData,
        topProducts,
        yesterdaySales,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsights = async () => {
    try {
      setInsightsLoading(true);
      console.log('🤖 Fetching AI insights...');
      const { data } = await aiInsightsAPI.generate();
      console.log('✅ AI insights received:', data);
      console.log('📊 Insights data:', data.data);
      setAiInsights(data.data || []);
      if (data.data && data.data.length > 0) {
        toast.success('AI insights generated successfully!');
      }
    } catch (error) {
      console.error('❌ Error fetching AI insights:', error);
      // Don't show error toast, just use fallback insights
      setAiInsights([]);
    } finally {
      setInsightsLoading(false);
    }
  };

  const fetchStockPrediction = async () => {
    try {
      setPredictionLoading(true);
      console.log('🔮 Fetching stock prediction...');
      const { data } = await predictionsAPI.getStockPrediction();
      console.log('✅ Stock prediction received:', data);
      setStockPrediction(data.data);
      toast.success(`Prediction generated for ${data.data.product.name}!`);
    } catch (error) {
      console.error('❌ Error fetching stock prediction:', error);
      setStockPrediction(null);
    } finally {
      setPredictionLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      setTrendingLoading(true);
      console.log('📈 Fetching trending data...');
      const { data } = await trendingAPI.generate();
      console.log('✅ Trending data received:', data);
      setTrendingData(data.data || []);
      if (data.data && data.data.length > 0) {
        toast.success('Market trends updated!');
      }
    } catch (error) {
      console.error('❌ Error fetching trending:', error);
      // Fallback to mock data
      setTrendingData(trending);
    } finally {
      setTrendingLoading(false);
    }
  };

  // Calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const todayVsYesterday = calculateChange(dashboardData.todaySales, dashboardData.yesterdaySales);
  const weekVsPreviousWeek = calculateChange(dashboardData.weekSales, dashboardData.previousWeekSales);
  const todayProfitVsYesterdayProfit = calculateChange(dashboardData.todayProfit, dashboardData.yesterdayProfit);

  // Get status message based on week comparison
  const getStatusMessage = () => {
    if (dashboardData.previousWeekSales === 0 && dashboardData.weekSales > 0) {
      return "Bahut badhiya! Is hafte sales shuru ho gayi hai.";
    } else if (dashboardData.weekSales > dashboardData.previousWeekSales) {
      return `Sab kuch sahi chal raha hai. Aapki sales pichle hafte se ${weekVsPreviousWeek} zyada hain.`;
    } else if (dashboardData.weekSales < dashboardData.previousWeekSales) {
      return `Is hafte sales pichle hafte se ${weekVsPreviousWeek} kam hain. Thoda aur mehnat karein!`;
    } else {
      return "Is hafte sales pichle hafte ke barabar hain.";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <section className="rounded-3xl bg-gradient-hero p-6 md:p-8 text-primary-foreground shadow-glow relative overflow-hidden animate-scale-in">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-6 bottom-0 h-32 w-32 rounded-full bg-white/5 blur-xl" />
        <div className="relative">
          <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">{getGreeting()}, {getUserName()} 👋</p>
          <h1 className="mt-2 text-2xl md:text-4xl font-bold leading-tight">
            {randomTagline.split('—')[0]} <span className="opacity-80">— {randomTagline.split('—')[1]}</span>
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-85 max-w-xl">
            {getStatusMessage()}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-smooth shadow-md">
              <NavLink to={"/billing"}>
                Start Billing
              </NavLink>
            </button>
          </div>
        </div>
      </section>

      {/* Low Stock Alert Banner */}
      {!isLowStockBannerDismissed && dashboardData.lowStockCount > 0 && (
        <section className="rounded-2xl border border-amber-400/40 bg-amber-50 dark:bg-amber-950/30 p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-amber-400/5 to-transparent pointer-events-none" />
          <div className="flex items-start gap-3 relative z-10">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm md:text-base flex items-center gap-1.5">
                Low Stock Alert — {dashboardData.lowStockCount} items running low
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                The following products are below their minimum threshold:{" "}
                <span className="font-semibold text-amber-900 dark:text-amber-200">
                  {dashboardData.lowStockProducts
                    .slice(0, 5)
                    .map((p) => `${p.emoji || "📦"} ${p.name} (${p.stock} left)`)
                    .join(", ")}
                  {dashboardData.lowStockCount > 5 ? " and more..." : ""}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <NavLink
              to="/inventory"
              className="bg-warning text-warning-foreground px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 hover:scale-[1.02] transition-smooth shadow-sm"
            >
              Reorder Now →
            </NavLink>
            <button
              onClick={() => setIsLowStockBannerDismissed(true)}
              className="text-xs font-semibold text-warning-foreground/60 hover:text-warning-foreground/90 transition-colors px-2 py-2"
            >
              Dismiss
            </button>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Today's Sales"
          value={`₹${dashboardData.todaySales.toLocaleString('en-IN')}`}
          delta={`${todayVsYesterday} vs yesterday`}
          trend={dashboardData.todaySales >= dashboardData.yesterdaySales ? "up" : "down"}
          icon={IndianRupee}
          tone="primary"
        />
        <StatCard
          label="Bills Today"
          value={dashboardData.todayBills.toString()}
          delta={`${dashboardData.todayBills} bills`}
          trend="up"
          icon={ShoppingCart}
          tone="success"
        />
        <StatCard
          label="Low Stock"
          value={dashboardData.lowStockCount.toString()}
          delta={dashboardData.lowStockCount > 0 ? "Reorder soon" : "All good"}
          trend={dashboardData.lowStockCount > 0 ? "down" : "up"}
          icon={Package}
          tone={dashboardData.lowStockCount > 0 ? "alert" : "success"}
        />
        <StatCard
          label="Today's Profit"
          value={`₹${Math.round(dashboardData.todayProfit).toLocaleString('en-IN')}`}
          delta={`${todayProfitVsYesterdayProfit} vs yesterday`}
          trend={dashboardData.todayProfit >= dashboardData.yesterdayProfit ? "up" : "down"}
          icon={TrendingUp}
          tone="success"
          extra={
            <span className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-block",
              dashboardData.isTodayProfitActual 
                ? "bg-success-soft text-success border border-success/15" 
                : "bg-muted text-muted-foreground border border-border"
            )}>
              {dashboardData.isTodayProfitActual ? "📊 Actual Margin" : "📊 Estimated (15%)"}
            </span>
          }
        />
      </section>

      {/* Charts row */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border/60 p-5 shadow-soft animate-fade-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-semibold text-foreground">Sales this week</h2>
              <p className="text-xs text-muted-foreground">Daily revenue & profit</p>
            </div>
            <span className="text-xs font-semibold text-success bg-success-soft px-2.5 py-1 rounded-full">
              ₹{Math.round(dashboardData.weekSales).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="h-64">
            {dashboardData.salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.salesData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltip} />
                  <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#salesGrad)" />
                  <Line type="monotone" dataKey="profit" stroke="hsl(var(--success))" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No sales data available
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft animate-fade-up">
          <h2 className="font-semibold text-foreground">Top Products</h2>
          <p className="text-xs text-muted-foreground">Most sold items</p>
          <div className="h-64 mt-3">
            {dashboardData.topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.topProducts} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={75} />
                  <Tooltip {...chartTooltip} />
                  <Bar dataKey="sold" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No product data available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Insights */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            <h2 className="font-semibold text-foreground">AI Business Insights</h2>
          </div>
          <button
            onClick={fetchAIInsights}
            disabled={insightsLoading}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            {insightsLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ArrowRight className="h-3.5 w-3.5" />
                Refresh
              </>
            )}
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {insightsLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-card border border-border/60 p-4 shadow-soft animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            ))
          ) : aiInsights.length > 0 ? (
            // Display AI-generated insights
            aiInsights.slice(0, 4).map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          ) : (
            // Fallback to mock insights if AI fails
            insights.slice(0, 4).map((i) => (
              <InsightCard key={i.id} insight={i} />
            ))
          )}
        </div>
      </section>

      {/* Prediction + Trending */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft animate-fade-up">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                {predictionLoading ? (
                  'Loading prediction...'
                ) : stockPrediction ? (
                  <>
                    {`Stock Prediction · ${stockPrediction.product.emoji} ${stockPrediction.product.name}`}
                    {stockPrediction.product.isTopSeller && (
                      <span className="text-xs font-bold text-warning bg-warning-soft px-2 py-0.5 rounded-full border border-warning/20">
                        ⭐ TOP SELLER
                      </span>
                    )}
                  </>
                ) : (
                  'Stock Prediction'
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                {stockPrediction ? (
                  stockPrediction.product.isTopSeller
                    ? 'Last 7 days (actual) vs Next 7 days (predicted) · High priority item'
                    : 'Last 7 days (actual) vs Next 7 days (predicted)'
                ) : (
                  'AI-powered inventory forecast'
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {stockPrediction && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stockPrediction.prediction.daysUntilStockout <= 3
                  ? 'text-alert bg-alert-soft'
                  : stockPrediction.prediction.daysUntilStockout <= 7
                    ? 'text-warning bg-warning-soft'
                    : 'text-success bg-success-soft'
                  }`}>
                  {stockPrediction.prediction.daysUntilStockout <= 7
                    ? `Out in ${stockPrediction.prediction.daysUntilStockout} days`
                    : `${stockPrediction.prediction.daysUntilStockout} days left`}
                </span>
              )}
              <button
                onClick={fetchStockPrediction}
                disabled={predictionLoading}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {predictionLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-3 w-3" />
                    New Item
                  </>
                )}
              </button>
            </div>
          </div>

          {predictionLoading ? (
            <div className="h-56 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Generating prediction...</p>
              </div>
            </div>
          ) : stockPrediction ? (
            <>
              <div className="h-56 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockPrediction.prediction.prediction.slice(0, 7)} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value.replace('Day ', 'D')}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} label={{ value: 'Units', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                    <Tooltip {...chartTooltip} />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                      name="Actual Sales"
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="hsl(var(--alert))"
                      strokeWidth={2.5}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: 'hsl(var(--alert))' }}
                      name="Predicted Sales"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Actual (Last 7 days)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-alert" style={{ borderTop: '2px dashed hsl(var(--alert))' }}></div>
                  <span className="text-muted-foreground">Predicted (Next 7 days)</span>
                </div>
              </div>
              <div className={`mt-3 p-3 rounded-xl text-sm font-medium ${stockPrediction.prediction.daysUntilStockout <= 3
                ? 'bg-alert-soft text-alert'
                : stockPrediction.prediction.daysUntilStockout <= 7
                  ? 'bg-warning-soft text-warning'
                  : 'bg-primary-soft text-primary'
                }`}>
                💡 {stockPrediction.prediction.insight}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Current: {stockPrediction.product.currentStock} units</span>
                <span>Avg: {stockPrediction.analytics.avgDailySales} units/day</span>
                <span className={`font-semibold ${stockPrediction.prediction.confidence === 'High' ? 'text-success' :
                  stockPrediction.prediction.confidence === 'Medium' ? 'text-warning' : 'text-muted-foreground'
                  }`}>
                  {stockPrediction.prediction.confidence} confidence
                </span>
              </div>
            </>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">No prediction available</p>
                <button
                  onClick={fetchStockPrediction}
                  className="mt-2 text-xs font-medium text-primary hover:text-primary/80"
                >
                  Generate Prediction
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-soft animate-fade-up">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-semibold text-foreground">Trending in your area</h2>
              <p className="text-xs text-muted-foreground">AI-powered market demand intelligence</p>
            </div>
            <button
              onClick={fetchTrending}
              disabled={trendingLoading}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {trendingLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ArrowRight className="h-3 w-3" />
                  Refresh
                </>
              )}
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {trendingLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 animate-pulse">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                  <div className="h-6 w-16 bg-muted rounded-lg ml-3"></div>
                </div>
              ))
            ) : trendingData.length > 0 ? (
              trendingData.map((t) => (
                <div key={t.id || t.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-smooth">
                  <div>
                    <p className="font-semibold text-sm">{t.emoji ? `${t.emoji} ` : ''}{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.reason}</p>
                  </div>
                  <span className="text-sm font-bold text-success bg-success-soft px-2.5 py-1 rounded-lg">{t.change}</span>
                </div>
              ))
            ) : (
              trending.map((t) => (
                <div key={t.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-smooth">
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.reason}</p>
                  </div>
                  <span className="text-sm font-bold text-success bg-success-soft px-2.5 py-1 rounded-lg">{t.change}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
