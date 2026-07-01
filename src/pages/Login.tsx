import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Store, Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
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
                    <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
                    <p className="text-xl opacity-90 mb-8">
                        Manage your retail store with ease. Track inventory, create bills, and grow your business.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 grid place-items-center">📊</div>
                            <div>
                                <p className="font-semibold">Real-time Analytics</p>
                                <p className="text-sm opacity-80">Track sales and inventory</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 grid place-items-center">🤖</div>
                            <div>
                                <p className="font-semibold">AI-Powered Insights</p>
                                <p className="text-sm opacity-80">Smart business recommendations</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 grid place-items-center">📱</div>
                            <div>
                                <p className="font-semibold">Easy to Use</p>
                                <p className="text-sm opacity-80">Simple and intuitive interface</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-background">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="lg:hidden h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center mx-auto mb-4">
                            <Store className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold">Sign In</h2>
                        <p className="text-muted-foreground mt-2">Enter your credentials to access your store</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary font-semibold hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 p-4 bg-muted/30 rounded-xl border border-border">
                        <p className="text-xs font-semibold mb-2 text-center">Demo Credentials</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>Email: <span className="text-foreground font-mono">demo@store.com</span></p>
                            <p>Password: <span className="text-foreground font-mono">demo123</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
