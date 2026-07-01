import { useState, useEffect } from "react";
import { Users, MapPin, Phone, Mail, ShoppingBag, Calendar, CheckCircle2, Search, ArrowRight, Receipt, PackageCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { format } from "date-fns";
import { billStore, Bill } from "@/lib/mockData";
import { billsAPI, productsAPI } from "@/lib/api";

// Detailed Mock Data for Customers
const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: "Ramesh Kumar",
    type: "Regular",
    address: "Flat 402, Shivam Apts, Andheri West",
    contact: "+91 98765 12345",
    email: "ramesh.k@email.com",
    totalOrders: 45,
    totalSpent: "₹12,450",
    lastOrderDate: new Date(2026, 4, 25),
    recentOrders: [
      {
        id: "ORD-9821", date: new Date(2026, 4, 25), amount: 450, status: "Delivered",
        items: [
          { productId: "p1", name: "Parle-G Biscuit", emoji: "🍪", qty: 5, price: 10 },
          { productId: "p3", name: "Coca-Cola 750ml", emoji: "🥤", qty: 10, price: 40 }
        ]
      },
      {
        id: "ORD-9754", date: new Date(2026, 4, 18), amount: 1200, status: "Delivered",
        items: [
          { productId: "p6", name: "Surf Excel 1kg", emoji: "🧺", qty: 2, price: 165 },
          { productId: "p30", name: "Fortune Sunflower Oil 1L", emoji: "🛢️", qty: 5, price: 165 },
          { productId: "p9", name: "Britannia Bread", emoji: "🍞", qty: 1, price: 45 }
        ]
      },
    ]
  },
  {
    id: 2,
    name: "Priya Sharma",
    type: "Premium",
    address: "B-22, Green Park Society, Vile Parle",
    contact: "+91 99887 22334",
    email: "priya.sharma99@email.com",
    totalOrders: 112,
    totalSpent: "₹45,800",
    lastOrderDate: new Date(2026, 4, 28),
    recentOrders: [
      {
        id: "ORD-9901", date: new Date(2026, 4, 28), amount: 2100, status: "Processing",
        items: [
          { productId: "p31", name: "Daawat Basmati 1kg", emoji: "🍚", qty: 10, price: 130 },
          { productId: "p29", name: "Aashirvaad Atta 5kg", emoji: "🌾", qty: 2, price: 285 },
          { productId: "p32", name: "Tata Sampann Dal 1kg", emoji: "🫘", qty: 1, price: 145 },
          { productId: "p33", name: "MDH Garam Masala", emoji: "🌶️", qty: 1, price: 85 }
        ]
      },
      {
        id: "ORD-9800", date: new Date(2026, 4, 20), amount: 3450, status: "Delivered",
        items: [
          { productId: "p56", name: "boAt Rockerz 450", emoji: "🎧", qty: 2, price: 1499 },
          { productId: "p63", name: "Duracell AA Battery", emoji: "🔋", qty: 2, price: 180 }
        ]
      },
    ]
  },
  {
    id: 3,
    name: "Amit Patel",
    type: "Occasional",
    address: "Shop No 4, Local Market, Borivali",
    contact: "+91 91234 55667",
    email: "amit.p@email.com",
    totalOrders: 8,
    totalSpent: "₹3,200",
    lastOrderDate: new Date(2026, 3, 15),
    recentOrders: [
      {
        id: "ORD-9102", date: new Date(2026, 3, 15), amount: 850, status: "Delivered",
        items: [
          { productId: "p10", name: "Dairy Milk 50g", emoji: "🍫", qty: 5, price: 50 },
          { productId: "p14", name: "Haldiram Bhujia", emoji: "🥜", qty: 10, price: 60 }
        ]
      },
    ]
  },
  {
    id: 4,
    name: "Sneha Desai",
    type: "Regular",
    address: "A-wing, Gokuldham, Goregaon East",
    contact: "+91 94444 88888",
    email: "sneha.d@email.com",
    totalOrders: 34,
    totalSpent: "₹18,900",
    lastOrderDate: new Date(2026, 4, 29),
    recentOrders: [
      {
        id: "ORD-9950", date: new Date(2026, 4, 29), amount: 1150, status: "Out for Delivery",
        items: [
          { productId: "p12", name: "Bisleri 1L", emoji: "💧", qty: 10, price: 20 },
          { productId: "p40", name: "Harpic 500ml", emoji: "🚽", qty: 10, price: 95 }
        ]
      },
    ]
  },
  {
    id: 5,
    name: "Vikram Singh",
    type: "New",
    address: "12/A, Sunshine Towers, Dadar",
    contact: "+91 95555 11111",
    email: "vikram.s@email.com",
    totalOrders: 2,
    totalSpent: "₹1,400",
    lastOrderDate: new Date(2026, 4, 30),
    recentOrders: [
      {
        id: "ORD-9988", date: new Date(2026, 4, 30), amount: 1400, status: "Processing",
        items: [
          { productId: "p68", name: "Men's Cotton T-Shirt", emoji: "👕", qty: 4, price: 349 }
        ]
      },
    ]
  },
  {
    id: 6,
    name: "Anjali Gupta",
    type: "Premium",
    address: "Villa 5, Palm Meadows, Juhu",
    contact: "+91 98888 33333",
    email: "anjali.g@email.com",
    totalOrders: 89,
    totalSpent: "₹67,500",
    lastOrderDate: new Date(2026, 4, 27),
    recentOrders: [
      {
        id: "ORD-9876", date: new Date(2026, 4, 27), amount: 4500, status: "Delivered",
        items: [
          { productId: "p65", name: "Smart Watch Fire-Boltt", emoji: "⌚", qty: 2, price: 1599 },
          { productId: "p76", name: "Saree Cotton Print", emoji: "🥻", qty: 1, price: 1299 }
        ]
      },
    ]
  },
  {
    id: 7,
    name: "Rahul Verma",
    type: "Regular",
    address: "302, Galaxy Apts, Malad West",
    contact: "+91 97777 55555",
    email: "rahul.v@email.com",
    totalOrders: 27,
    totalSpent: "₹9,800",
    lastOrderDate: new Date(2026, 4, 10),
    recentOrders: [
      {
        id: "ORD-9654", date: new Date(2026, 4, 10), amount: 650, status: "Delivered",
        items: [
          { productId: "p45", name: "Dove Soap 100g", emoji: "🛁", qty: 10, price: 65 }
        ]
      },
    ]
  },
  {
    id: 8,
    name: "Neha Mehta",
    type: "Occasional",
    address: "C-14, Rosewood Society, Kandivali",
    contact: "+91 96666 44444",
    email: "neha.m@email.com",
    totalOrders: 12,
    totalSpent: "₹4,100",
    lastOrderDate: new Date(2026, 2, 28),
    recentOrders: [
      {
        id: "ORD-8900", date: new Date(2026, 2, 28), amount: 1100, status: "Delivered",
        items: [
          { productId: "p41", name: "Lizol 500ml", emoji: "🧴", qty: 10, price: 110 }
        ]
      },
    ]
  },
  {
    id: 9,
    name: "Sunil Tiwari",
    type: "New",
    address: "B-2, Royal Palms, Aarey Colony",
    contact: "+91 91111 22222",
    email: "sunil.t@email.com",
    totalOrders: 1,
    totalSpent: "₹850",
    lastOrderDate: new Date(2026, 4, 30),
    recentOrders: [
      {
        id: "ORD-9999", date: new Date(2026, 4, 30), amount: 850, status: "Processing",
        items: [
          { productId: "p33", name: "MDH Garam Masala", emoji: "🌶️", qty: 10, price: 85 }
        ]
      },
    ]
  },
  {
    id: 10,
    name: "Pooja Singh",
    type: "Premium",
    address: "A-501, Highland Park, Mulund",
    contact: "+91 92222 33333",
    email: "pooja.s@email.com",
    totalOrders: 65,
    totalSpent: "₹25,400",
    lastOrderDate: new Date(2026, 4, 25),
    recentOrders: [
      {
        id: "ORD-9840", date: new Date(2026, 4, 25), amount: 2540, status: "Out for Delivery",
        items: [
          { productId: "p52", name: "Pampers Diapers", emoji: "👶", qty: 5, price: 299 },
          { productId: "p24", name: "Frooti 250ml", emoji: "🥭", qty: 25, price: 20 },
          { productId: "p54", name: "Modern Brown Bread", emoji: "🍞", qty: 11, price: 50 }
        ]
      },
    ]
  }
];

export default function Customers() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof INITIAL_CUSTOMERS[0] | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);

  useEffect(() => {
    const handleNewStoreOrder = (e: any) => {
      const orderAmount = e.detail?.amount || 500;
      toast.success("Online Store Order!", {
        description: `An order worth ₹${orderAmount} was just placed via your digital storefront.`,
        icon: <ShoppingBag className="h-4 w-4 text-emerald-500" />,
        duration: 8000,
      });
      const bell = document.querySelector('.bg-alert');
      if (bell) {
        bell.classList.add('animate-ping');
        setTimeout(() => bell.classList.remove('animate-ping'), 1000);
      }
    };
    window.addEventListener('new-store-order', handleNewStoreOrder);
    return () => window.removeEventListener('new-store-order', handleNewStoreOrder);
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contact.includes(searchTerm)
  );

  const handleSimulateOrder = () => {
    setIsOrdering(true);
    // Simulate network request
    setTimeout(() => {
      setIsOrdering(false);
      setSelectedCustomer(null);
      // Trigger a notification (toast)
      toast.success("New Order Received!", {
        description: `₹${Math.floor(Math.random() * 2000) + 500} order placed by ${selectedCustomer?.name}.`,
        icon: <ShoppingBag className="h-4 w-4 text-emerald-500" />,
        duration: 5000,
      });

      // Also simulate a general bell notification sound/alert if needed
      const bell = document.querySelector('.bg-alert');
      if (bell) {
        bell.classList.add('animate-ping');
        setTimeout(() => bell.classList.remove('animate-ping'), 1000);
      }
    }, 1500);
  };

  const handleDeliverOrder = async (orderId: string, orderDetails: any) => {
    try {
      // Fetch current products from database to get _id
      const { data: productsData } = await productsAPI.getAll();
      const dbProducts = productsData.data || [];

      // Validate stock and prepare bill items
      const billItems = [];
      for (const item of orderDetails.items) {
        const dbProduct = dbProducts.find((p: any) => p._id === item.productId || p.name === item.name);

        if (!dbProduct) {
          toast.error(`Product "${item.name}" not found in database`);
          return;
        }

        if (dbProduct.stock < item.qty) {
          toast.error(`Insufficient stock for "${item.name}". Available: ${dbProduct.stock}, Required: ${item.qty}`);
          return;
        }

        billItems.push({
          product: dbProduct._id,
          name: item.name,
          emoji: item.emoji,
          price: item.price,
          qty: item.qty,
          total: item.price * item.qty, // Add item total
        });
      }

      const subtotal = orderDetails.amount;
      const gst = Math.round(subtotal * 0.05);
      const total = subtotal + gst;

      // Create bill in database (backend calculates totals)
      await billsAPI.create({
        items: billItems,
        discount: 0,
      });

      // Update order status in local state
      setCustomers(prev => prev.map(c => {
        if (c.id === selectedCustomer?.id) {
          return {
            ...c,
            recentOrders: c.recentOrders.map(o =>
              o.id === orderId ? { ...o, status: "Delivered" } : o
            )
          };
        }
        return c;
      }));

      // Update selected customer local state so the UI refreshes
      if (selectedCustomer) {
        setSelectedCustomer({
          ...selectedCustomer,
          recentOrders: selectedCustomer.recentOrders.map(o =>
            o.id === orderId ? { ...o, status: "Delivered" } : o
          )
        });
      }

      toast.success(`Order ${orderId} delivered!`, {
        description: "A new bill has been successfully generated in your records."
      });
    } catch (error: any) {
      console.error('Error delivering order:', error);
      toast.error(error.response?.data?.message || "Failed to deliver order and create bill");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage your customer relationships and view order histories.</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={() => setAddCustomerOpen(true)}>
          <Users className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone number..."
          className="pl-10 h-12 max-w-md bg-card border-border/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="group relative flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-glow hover:border-primary/20 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedCustomer(customer)}
          >
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 grid place-items-center text-primary font-bold text-lg shadow-sm">
                  {customer.name.charAt(0)}
                </div>
                <Badge
                  variant="secondary"
                  className={
                    customer.type === "Premium" ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10" :
                      customer.type === "New" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10" :
                        "bg-muted text-muted-foreground hover:bg-muted"
                  }
                >
                  {customer.type}
                </Badge>
              </div>

              <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                {customer.name}
              </h3>

              <div className="space-y-1 mt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3 shrink-0" />
                  {customer.contact}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{customer.address}</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-border/50 bg-muted/30 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Total Spent</span>
                <span className="text-sm font-bold text-foreground">{customer.totalSpent}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-background grid place-items-center shadow-sm text-muted-foreground group-hover:text-primary group-hover:bg-primary-soft transition-colors">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        {selectedCustomer && (
          <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden gap-0 bg-card">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border/50">
              <div className="flex items-center gap-5">
                <div className="h-20 w-20 rounded-full bg-background border-2 border-primary/20 shadow-sm grid place-items-center text-primary text-3xl font-bold shrink-0">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DialogTitle className="text-2xl font-bold">{selectedCustomer.name}</DialogTitle>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                      {selectedCustomer.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {selectedCustomer.contact}</span>
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {selectedCustomer.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="max-h-[60vh]">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase mb-1">Lifetime Orders</span>
                    <span className="text-2xl font-bold text-foreground">{selectedCustomer.totalOrders}</span>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase mb-1">Total Value</span>
                    <span className="text-2xl font-bold text-emerald-500">{selectedCustomer.totalSpent}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Delivery Address
                  </h4>
                  <p className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-lg border border-border/30">
                    {selectedCustomer.address}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" /> Recent Orders
                  </h4>
                  <div className="space-y-4">
                    {selectedCustomer.recentOrders.map((order) => (
                      <div key={order.id} className="flex flex-col p-4 border border-border/50 rounded-xl hover:bg-muted/10 transition-colors">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-background border border-border/50 grid place-items-center shrink-0">
                              <Receipt className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground">{order.id}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(order.date, 'MMM dd, yyyy')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <span className="text-base font-bold text-primary">₹{order.amount}</span>
                            <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Order Items Detailed View */}
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span>{item.emoji}</span>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-muted-foreground text-xs">x{item.qty}</span>
                              </div>
                              <span className="font-semibold text-muted-foreground">₹{item.price * item.qty}</span>
                            </div>
                          ))}
                        </div>

                        {order.status !== "Delivered" && (
                          <div className="pt-2">
                            <Button
                              onClick={() => handleDeliverOrder(order.id, order)}
                              className="w-full gap-2 bg-gradient-success text-success-foreground hover:opacity-90 shadow-sm"
                            >
                              <PackageCheck className="h-4 w-4" /> Deliver Product & Generate Bill
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="p-4 border-t border-border/50 bg-muted/10 flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="sm:flex-1" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
              <Button
                className="sm:flex-1 gap-2"
                onClick={handleSimulateOrder}
                disabled={isOrdering}
              >
                {isOrdering ? (
                  <span className="flex items-center gap-2">Processing...</span>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Simulate Online Order
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      {addCustomerOpen && (
        <AddCustomerModal
          onClose={() => setAddCustomerOpen(false)}
          onAdd={(newCustomer) => {
            setCustomers([newCustomer, ...customers]);
            toast.success("Customer Added & WhatsApp Sent!", {
              description: `Welcome message and store link sent to ${newCustomer.contact}.`,
              icon: <Phone className="h-4 w-4 text-emerald-500" />,
              duration: 5000,
            });
            setAddCustomerOpen(false);
          }}
        />
      )}
    </div>
  );
}

function AddCustomerModal({ onClose, onAdd }: { onClose: () => void, onAdd: (c: any) => void }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return toast.error("Please fill Name and Contact");

    const newCustomer = {
      id: Date.now(),
      name,
      type: "New",
      address: address || "Not Provided",
      contact,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      totalOrders: 0,
      totalSpent: "₹0",
      lastOrderDate: new Date(),
      recentOrders: []
    };
    onAdd(newCustomer);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-elevated border border-border/60 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <Users className="h-5 w-5" />
          <h2 className="font-bold text-lg flex-1">Add New Customer</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/20 transition-smooth text-white">
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 mb-4 flex items-start gap-3 text-sm text-emerald-700">
            <Phone className="h-5 w-5 shrink-0 mt-0.5 text-emerald-500" />
            <div>
              <strong>WhatsApp Automation</strong>
              <p className="mt-0.5 opacity-90 text-xs">A welcome message and your online store link will be sent to this number automatically.</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Customer Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm" placeholder="e.g. Ramesh Kumar" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Contact Number</label>
            <input value={contact} onChange={e => setContact(e.target.value)} className="w-full p-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm" placeholder="+91 98765 43210" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Address (Optional)</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2.5 rounded-xl bg-muted/60 border border-transparent focus:bg-card focus:border-primary outline-none transition-smooth text-sm" placeholder="e.g. Flat 402, Shivam Apts" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-muted">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm shadow-md hover:bg-emerald-600">Save & Notify</button>
          </div>
        </form>
      </div>
    </div>
  );
}
