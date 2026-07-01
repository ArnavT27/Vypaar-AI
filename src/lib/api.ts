import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    logout: () => api.get('/auth/logout'),
    updateDetails: (data: any) => api.put('/auth/updatedetails', data),
    updatePassword: (data: any) => api.put('/auth/updatepassword', data),
};

// Products API
export const productsAPI = {
    getAll: (params?: any) => api.get('/products', { params }),
    getOne: (id: string) => api.get(`/products/${id}`),
    create: (data: any) => api.post('/products', data),
    update: (id: string, data: any) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
    getCategories: () => api.get('/products/categories'),
    updateStock: (id: string, data: any) => api.patch(`/products/${id}/stock`, data),
};

// Bills API
export const billsAPI = {
    getAll: (params?: any) => api.get('/bills', { params }),
    getOne: (id: string) => api.get(`/bills/${id}`),
    create: (data: any) => api.post('/bills', data),
    update: (id: string, data: any) => api.put(`/bills/${id}`, data),
    delete: (id: string) => api.delete(`/bills/${id}`),
    getSalesStats: (params?: any) => api.get('/bills/stats/sales', { params }),
};

// Customers API
export const customersAPI = {
    getAll: (params?: any) => api.get('/customers', { params }),
    getOne: (id: string) => api.get(`/customers/${id}`),
    create: (data: any) => api.post('/customers', data),
    update: (id: string, data: any) => api.put(`/customers/${id}`, data),
    delete: (id: string) => api.delete(`/customers/${id}`),
    addOrder: (id: string, data: any) => api.post(`/customers/${id}/orders`, data),
    updateOrderStatus: (id: string, orderId: string, data: any) =>
        api.patch(`/customers/${id}/orders/${orderId}`, data),
};

// Insights API
export const insightsAPI = {
    getAll: (params?: any) => api.get('/insights', { params }),
    create: (data: any) => api.post('/insights', data),
    generate: () => api.post('/insights/generate'),
    markAsRead: (id: string) => api.patch(`/insights/${id}/read`),
    delete: (id: string) => api.delete(`/insights/${id}`),
};

// Store API
export const storeAPI = {
    getMy: () => api.get('/store'),
    create: (data: any) => api.post('/store', data),
    update: (data: any) => api.put('/store', data),
    delete: () => api.delete('/store'),
    getById: (id: string) => api.get(`/store/${id}`),
};

// Expenses API
export const expensesAPI = {
    getAll: (params?: any) => api.get('/expenses', { params }),
    create: (data: any) => api.post('/expenses', data),
    delete: (id: string) => api.delete(`/expenses/${id}`),
};

// Suppliers API
export const suppliersAPI = {
    getAll: (params?: any) => api.get('/suppliers', { params }),
    getOne: (id: string) => api.get(`/suppliers/${id}`),
    getCategories: () => api.get('/suppliers/categories/list'),
    getCities: () => api.get('/suppliers/cities/list'),
};

// AI Insights API
export const aiInsightsAPI = {
    generate: () => api.get('/ai-insights/generate'),
};

// Predictions API
export const predictionsAPI = {
    getStockPrediction: () => api.get('/predictions/stock'),
};

// Trending API
export const trendingAPI = {
    generate: () => api.get('/trending/generate'),
};
