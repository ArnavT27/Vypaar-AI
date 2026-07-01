import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Package,
  Sparkles,
  ScanLine,
  ShoppingBag,
  ListPlus,
  Link2,
  User,
  Wallet,
  PlusCircle,
  BarChart3,
  Search,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenHelp }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (callback: () => void) => {
    callback();
    onClose();
    setSearch("");
  };

  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modKey = isMac ? "⌘" : "Ctrl+";

  const navigationItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, shortcut: "D" },
    { to: "/billing", label: "Billing", icon: Receipt, shortcut: "B" },
    { to: "/inventory", label: "Inventory", icon: Package, shortcut: "I" },
    { to: "/expenses", label: "Expenses", icon: Wallet, shortcut: "" },
    { to: "/insights", label: "Insights", icon: Sparkles, shortcut: "" },
    { to: "/scan", label: "Scan Bill", icon: ScanLine, shortcut: "" },
    { to: "/marketplace", label: "Market", icon: ShoppingBag, shortcut: "" },
    { to: "/catalog", label: "Catalog", icon: ListPlus, shortcut: "" },
    { to: "/integrations", label: "Integrations", icon: Link2, shortcut: "" },
    { to: "/profile", label: "Profile Settings", icon: User, shortcut: "" },
  ];

  const actionItems = [
    {
      label: "Start New Bill",
      icon: PlusCircle,
      action: () => navigate("/billing"),
    },
    {
      label: "View Stock Predictions",
      icon: BarChart3,
      action: () => navigate("/insights/predict"),
    },
    {
      label: "Show Keyboard Shortcuts Help",
      icon: Sparkles,
      action: onOpenHelp,
      shortcut: "/",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh] bg-foreground/30 backdrop-blur-sm animate-fade-in text-foreground"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-card rounded-2xl border border-border/60 shadow-elevated overflow-hidden animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex-1 flex flex-col" label="Global Command Menu">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search page..."
              value={search}
              onValueChange={setSearch}
              className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-sm py-1"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-muted-foreground bg-muted border border-border rounded shadow-sm shrink-0">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[350px] overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found for "{search}"
            </Command.Empty>

            <Command.Group heading="Pages" className="text-[11px] font-semibold text-muted-foreground/80 px-2 py-1.5 uppercase tracking-wider">
              {navigationItems.map((item) => (
                <Command.Item
                  key={item.to}
                  value={item.label}
                  onSelect={() => handleSelect(() => navigate(item.to))}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-primary-soft hover:text-primary active:bg-primary-soft/80 cursor-pointer transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4.5 w-4.5 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <kbd className="text-[10px] font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded shadow-sm">
                      {modKey}{item.shortcut}
                    </kbd>
                  )}
                </Command.Item>
              ))}
            </Command.Group>

            <div className="border-t border-border/40 my-2" />

            <Command.Group heading="Quick Actions" className="text-[11px] font-semibold text-muted-foreground/80 px-2 py-1.5 uppercase tracking-wider">
              {actionItems.map((item) => (
                <Command.Item
                  key={item.label}
                  value={item.label}
                  onSelect={() => handleSelect(item.action)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-primary-soft hover:text-primary active:bg-primary-soft/80 cursor-pointer transition-smooth"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4.5 w-4.5 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <kbd className="text-[10px] font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded shadow-sm">
                      {modKey}{item.shortcut}
                    </kbd>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Use ↑↓ to navigate, Enter to select</span>
            <span>Press <kbd className="font-bold">{modKey}/</kbd> for shortcut help</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
