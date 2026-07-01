import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storeAPI } from '@/lib/api';
import { User, Store, MapPin, FileText, Phone, Mail, Building2, LogOut, Save, Loader2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
    const { user, logout, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [storeData, setStoreData] = useState<any>(null);
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        storeName: user?.storeName || '',
        storeAddress: user?.storeAddress || '',
        gstNumber: user?.gstNumber || '',
        upiId: '',
    });

    useEffect(() => {
        fetchStoreData();
    }, []);

    const fetchStoreData = async () => {
        try {
            const { data } = await storeAPI.getMy();
            const store = data.data;
            setStoreData(store);
            if (store) {
                setFormData(prev => ({
                    ...prev,
                    upiId: store.upiId || '',
                }));
            }
        } catch (error) {
            console.error('Error fetching store data:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateProfile(formData);
            if (storeData) {
                await storeAPI.update({
                    ...storeData,
                    upiId: formData.upiId,
                });
            }
            setEditing(false);
            await fetchStoreData();
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your account and store information</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-smooth"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>

            {/* Profile Card */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-primary-foreground relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/10" />
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur grid place-items-center text-4xl font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user?.name}</h2>
                            <p className="text-primary-foreground/80 mt-1">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium">
                                    {user?.role?.toUpperCase()}
                                </span>
                                {user?.isProfileComplete && (
                                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-xs font-medium">
                                        ✓ Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">Personal Information</h3>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-smooth"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setFormData({
                                            name: user?.name || '',
                                            email: user?.email || '',
                                            phone: user?.phone || '',
                                            storeName: user?.storeName || '',
                                            storeAddress: user?.storeAddress || '',
                                            gstNumber: user?.gstNumber || '',
                                            upiId: storeData?.upiId || '',
                                        });
                                    }}
                                    className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-smooth"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-smooth disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:bg-background outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:bg-background outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    placeholder="Enter phone number"
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:bg-background outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Store Details */}
                        <div className="pt-6 border-t border-border">
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Store className="h-5 w-5 text-primary" />
                                Store Information
                            </h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        Store Name
                                    </label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:bg-background outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        GST Number
                                    </label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:bg-background outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed uppercase"
                                        maxLength={15}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                                        UPI ID for QR Payments
                                    </label>
                                    <input
                                        type="text"
                                        name="upiId"
                                        value={formData.upiId}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="e.g. storename@upi"
                                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:bg-background outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        Store Address
                                    </label>
                                    <textarea
                                        name="storeAddress"
                                        value={formData.storeAddress}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:bg-background outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Store Settings (if available) */}
                        {storeData && (
                            <div className="pt-6 border-t border-border">
                                <h4 className="text-lg font-semibold mb-4">Store Settings</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-muted">
                                        <p className="text-sm text-muted-foreground mb-1">Currency</p>
                                        <p className="font-semibold">{storeData.settings?.currency || 'INR'}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted">
                                        <p className="text-sm text-muted-foreground mb-1">Tax Rate</p>
                                        <p className="font-semibold">{storeData.settings?.taxRate || 18}%</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted">
                                        <p className="text-sm text-muted-foreground mb-1">Business Type</p>
                                        <p className="font-semibold">{storeData.businessType || 'Retail'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Account Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary grid place-items-center">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Account Status</p>
                            <p className="font-semibold">Active</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-600 grid place-items-center">
                            <Store className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Store Status</p>
                            <p className="font-semibold">{storeData?.isActive ? 'Active' : 'Inactive'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 grid place-items-center">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Profile</p>
                            <p className="font-semibold">{user?.isProfileComplete ? 'Complete' : 'Incomplete'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
