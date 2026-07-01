import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    storeName?: string;
    storeAddress?: string;
    gstNumber?: string;
    isProfileComplete: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        name: string,
        storeName: string,
        storeAddress: string,
        gstNumber: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await authAPI.getMe();
                setUser(data.data);
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };

    const login = async (email: string, password: string) => {
        try {
            const { data } = await authAPI.login({ email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            toast.success('Login successful!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (
        email: string,
        password: string,
        name: string,
        storeName: string,
        storeAddress: string,
        gstNumber: string
    ) => {
        try {
            const { data } = await authAPI.register({
                email,
                password,
                name,
                storeName,
                storeAddress,
                gstNumber,
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            toast.success('Registration successful! Welcome to your store.');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const updateProfile = async (profileData: any) => {
        try {
            const { data } = await authAPI.updateDetails(profileData);
            setUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Profile update failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                updateProfile,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
