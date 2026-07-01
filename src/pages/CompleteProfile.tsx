import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Store, MapPin, Phone, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CompleteProfile() {
    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const { updateProfile, user } = useAuth();
    const navigate = useNavigate();

    const validateGST = (gst: string) => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gst);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateGST(gstNumber.toUpperCase())) {
            toast.error('Please enter a valid GST number');
            return;
        }

        setLoading(true);
        try {
            await updateProfile({
                storeName,
                storeAddress,
                gstNumber: gstNumber.toUpperCase(),
                phone,
            });
            toast.success('Profile completed successfully!');
            navigate('/');
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-4 shadow-glow">
                        <Store className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Complete Your Profile</h1>
                    <p className="text-muted-foreground">
                        Tell us about your store to get started
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-success text-success-foreground grid place-items-center text-sm font-bold">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-medium hidden sm:inline">Account Created</span>
                        </div>
                        <div className="h-0.5 w-12 bg-primary" />
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-bold">
                                2
                            </div>
                            <span className="text-sm font-medium hidden sm:inline">Store Details</span>
                        </div>
                        <div className="h-0.5 w-12 bg-muted" />
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground grid place-items-center text-sm font-bold">
                                3
                            </div>
                            <span className="text-sm font-medium hidden sm:inline">Start Using</span>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-card border border-border rounded-3xl shadow-elevated p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Store Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Store className="h-4 w-4 text-primary" />
                                Store Name <span className="text-alert">*</span>
                            </label>
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                placeholder="e.g., Quick Mart Retail Store"
                                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all"
                                required
                            />
                        </div>

                        {/* Store Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                Store Address <span className="text-alert">*</span>
                            </label>
                            <textarea
                                value={storeAddress}
                                onChange={(e) => setStoreAddress(e.target.value)}
                                placeholder="e.g., Shop No. 5, Main Market, Mumbai, Maharashtra - 400001"
                                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all resize-none"
                                rows={3}
                                required
                            />
                        </div>

                        {/* GST Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                GST Number <span className="text-alert">*</span>
                            </label>
                            <input
                                type="text"
                                value={gstNumber}
                                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                                placeholder="e.g., 27AAPFU0939F1ZV"
                                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all font-mono"
                                required
                                maxLength={15}
                            />
                            <p className="text-xs text-muted-foreground">
                                15-character GST identification number
                            </p>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                Phone Number <span className="text-muted-foreground text-xs">(Optional)</span>
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g., +91 9876543210"
                                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all"
                            />
                        </div>

                        {/* Info Box */}
                        <div className="bg-primary-soft border border-primary/20 rounded-xl p-4">
                            <p className="text-sm text-primary font-medium mb-2">📋 Why do we need this?</p>
                            <ul className="text-xs text-primary/80 space-y-1">
                                <li>• Store details help personalize your experience</li>
                                <li>• GST number is required for generating compliant bills</li>
                                <li>• This information is securely stored and never shared</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !storeName || !storeAddress || !gstNumber}
                            className="w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-glow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Complete Setup
                                    <CheckCircle2 className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* User Info */}
                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground text-center">
                            Logged in as <span className="font-semibold text-foreground">{user?.email}</span>
                        </p>
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                    Need help? Contact support at support@example.com
                </p>
            </div>
        </div>
    );
}
