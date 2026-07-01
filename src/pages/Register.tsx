import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Store, Mail, Lock, User, Loader2, Building2, MapPin, FileText } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [storeName, setStoreName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const validateGST = (gst: string) => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gst);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return;
        }

        if (password.length < 6) {
            return;
        }

        if (!validateGST(gstNumber)) {
            alert('Please enter a valid GST number (15 characters)');
            return;
        }

        setLoading(true);
        try {
            await register(email, password, name, storeName, storeAddress, gstNumber);
            navigate('/');
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10" />
                <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

                <div className="relative z-10 max-w-md">
                    <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur grid place-items-center mb-8">
                        <Store className="h-10 w-10" />
                    </div>
                    <h1 className="text-5xl font-bold mb-4">Start Your Journey</h1>
                    <p className="text-xl opacity-90 mb-8">
                        Join thousands of retailers managing their stores efficiently with our platform.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 grid place-items-center">✨</div>
                            <div>
                                <p className="font-semibold">Quick Setup</p>
                                <p className="text-sm opacity-80">Get started in minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 grid place-items-center">🔒</div>
                            <div>
                                <p className="font-semibold">Secure & Safe</p>
                                <p className="text-sm opacity-80">Your data is protected</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 grid place-items-center">💼</div>
                            <div>
                                <p className="font-semibold">Professional Tools</p>
                                <p className="text-sm opacity-80">Everything you need to succeed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-background">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="lg:hidden h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center mx-auto mb-4">
                            <Store className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold">Create Account</h2>
                        <p className="text-muted-foreground mt-2">Sign up to start managing your store</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all"
                                    required
                                />
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-alert">Passwords do not match</p>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Store Details</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Store Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    placeholder="My Retail Store"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Store Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={storeAddress}
                                    onChange={(e) => setStoreAddress(e.target.value)}
                                    placeholder="123 Main Street, City, State"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">GST Number</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={gstNumber}
                                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                                    placeholder="22AAAAA0000A1Z5"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:bg-background outline-none transition-all uppercase"
                                    required
                                    maxLength={15}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">15-character GST identification number</p>
                            {gstNumber && gstNumber.length === 15 && !validateGST(gstNumber) && (
                                <p className="text-xs text-alert">Invalid GST number format</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                password !== confirmPassword ||
                                password.length < 6 ||
                                !storeName ||
                                !storeAddress ||
                                !gstNumber ||
                                (gstNumber.length === 15 && !validateGST(gstNumber))
                            }
                            className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-semibold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
