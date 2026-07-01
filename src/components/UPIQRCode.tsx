import { useEffect, useRef, useState } from "react";
import { renderQRToCanvas, generateUPILink } from "@/lib/qrcode";
import { QrCode, Copy, Check, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface UPIQRCodeProps {
  amount: number;
  payeeName: string;
  payeeUPI: string;
  billId?: string;
  size?: number;
}

export function UPIQRCode({ amount, payeeName, payeeUPI, billId, size = 200 }: UPIQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const upiLink = generateUPILink({
    payeeUPI,
    payeeName,
    amount,
    transactionNote: billId ? `Payment for ${billId}` : "Store Payment",
  });

  useEffect(() => {
    if (canvasRef.current && payeeUPI) {
      try {
        renderQRToCanvas(canvasRef.current, upiLink, {
          size,
          darkColor: "#1e293b",
          lightColor: "#ffffff",
          quietZone: 2,
        });
      } catch {
        // QR generation failed — content too long or encoding error
        console.error("QR code generation failed");
      }
    }
  }, [upiLink, size, payeeUPI]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiLink);
      setCopied(true);
      toast.success("UPI link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (!payeeUPI) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border/60 p-6 text-center">
        <Smartphone className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-sm font-semibold text-muted-foreground mb-1">UPI QR Not Available</p>
        <p className="text-xs text-muted-foreground">
          Set your UPI ID in{" "}
          <a href="/profile" className="text-primary font-semibold hover:underline">
            Profile Settings
          </a>{" "}
          to enable QR code payments.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
          <QrCode className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">Scan to Pay</h4>
          <p className="text-[11px] text-muted-foreground">Works with all UPI apps</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* QR Code */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-border/40 mb-3">
          <canvas
            ref={canvasRef}
            style={{ width: size, height: size }}
            className="rounded-lg"
          />
        </div>

        {/* Amount */}
        <div className="text-center mb-3">
          <p className="text-2xl font-bold text-primary tabular-nums">
            ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pay to: <span className="font-semibold">{payeeName}</span>
          </p>
        </div>

        {/* UPI Apps icons */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-3">
          <span className="px-2 py-1 bg-muted rounded-full font-semibold">Google Pay</span>
          <span className="px-2 py-1 bg-muted rounded-full font-semibold">PhonePe</span>
          <span className="px-2 py-1 bg-muted rounded-full font-semibold">Paytm</span>
          <span className="px-2 py-1 bg-muted rounded-full font-semibold">BHIM</span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy UPI Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
