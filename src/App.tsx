import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/AppShell";
import { useBfcache, monitorBfcacheEligibility } from "@/hooks/useBfcache";

// Lazy load all page components
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Billing = lazy(() => import("./pages/Billing"));
const Inventory = lazy(() => import("./pages/Inventory"));
const PredictStock = lazy(() => import("./pages/PredictStock"));
const Scan = lazy(() => import("./pages/Scan"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Customers = lazy(() => import("./pages/Customers"));
const ManageProducts = lazy(() => import("./pages/ManageProducts"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Storefront = lazy(() => import("./pages/Storefront"));
const Insights = lazy(() => import("./pages/Insights"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen grid place-items-center bg-background">
    <div className="text-center">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  // Enable bfcache optimization
  useBfcache();

  // Monitor bfcache in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      monitorBfcacheEligibility();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Dashboard />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/billing"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Billing />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Inventory />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/insights"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Insights />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/insights/predict"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <PredictStock />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/scan"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Scan />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketplace"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Marketplace />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Customers />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/catalog"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <ManageProducts />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/integrations"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Integrations />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Expenses />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <AppShell>
                        <Profile />
                      </AppShell>
                    </ProtectedRoute>
                  }
                />
                <Route path="/store" element={<Storefront />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
