import { Puzzle, ArrowRight, CheckCircle2, Link as LinkIcon, Database, HardDrive, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Integrations() {
  const handleConnect = (appName: string) => {
    toast.success(`Successfully connected with ${appName}!`, {
      description: "Data synchronization has been scheduled."
    });
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting to ${format}...`, {
      description: "Your file will download shortly."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Software Integrations</h2>
          <p className="text-muted-foreground">Connect Hisaab Kitaab Smart with your existing ERPs and accounting software.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tally Prime Integration */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 flex-1">
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4 border border-orange-500/20">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Tally Prime Sync</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Automatically sync your daily billing data, inventory levels, and customer ledgers directly into Tally via XML data exchange.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-[10px]">Bills</Badge>
              <Badge variant="outline" className="text-[10px]">Inventory</Badge>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> API Ready
            </span>
            <Button size="sm" onClick={() => handleConnect("Tally Prime")} className="gap-2">
              <LinkIcon className="h-4 w-4" /> Connect
            </Button>
          </div>
        </div>

        {/* Zoho Books Integration */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 flex-1">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 border border-blue-500/20">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Zoho Books Integration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Seamlessly push your GST invoices and payment receipts into Zoho Books through our secure REST API bridge.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-[10px]">Invoices</Badge>
              <Badge variant="outline" className="text-[10px]">Payments</Badge>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> API Ready
            </span>
            <Button size="sm" onClick={() => handleConnect("Zoho Books")} className="gap-2">
              <LinkIcon className="h-4 w-4" /> Connect
            </Button>
          </div>
        </div>

        {/* Marg ERP / Custom Export */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 flex-1">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 border border-purple-500/20">
              <HardDrive className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Marg ERP / CSV Export</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate daily reports formatted specifically for Marg ERP or generic CSV downloads for manual entry into other systems.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-[10px]">CSV Data</Badge>
              <Badge variant="outline" className="text-[10px]">Reports</Badge>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Manual Export
            </span>
            <Button size="sm" variant="outline" onClick={() => handleExport("CSV")} className="gap-2">
              <ArrowRight className="h-4 w-4" /> Export Data
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-2xl border border-primary/20 flex flex-col md:flex-row items-center gap-6">
        <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
          <Puzzle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1">Need a Custom Integration?</h3>
          <p className="text-sm text-muted-foreground">Our team can build customized API bridges connecting Hisaab Kitaab Smart directly to your proprietary local servers or customized ERPs.</p>
        </div>
        <div className="md:ml-auto">
          <Button variant="secondary" onClick={() => toast("Request sent to technical team!")}>
            Request Integration
          </Button>
        </div>
      </div>
    </div>
  );
}
