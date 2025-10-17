import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { TasksProvider } from "@/contexts/TasksContext";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

// Auth pages
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Main app pages
import Dashboard from "./pages/Dashboard";
import TaskAutoPopulator from "./components/TaskAutoPopulator"
import Tasks from "./pages/Tasks";
import Prayers from "./pages/Prayers";
import CalendarView from "./pages/CalendarView";
import Analytics from "./pages/Analytics";
import Quran from "./pages/Quran";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import AppInfo from "./pages/AppInfo";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SUPABASE_READY, SUPABASE_USING_FALLBACK } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  if (!SUPABASE_READY && !SUPABASE_USING_FALLBACK) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Missing Supabase env</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to Actions → Secrets, then redeploy.
        </p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TasksProvider>
          <TaskAutoPopulator />
          <TooltipProvider>
            <Toaster />
            <BrowserRouter
              basename={import.meta.env.BASE_URL}
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              {SUPABASE_USING_FALLBACK && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200">
                  Running with local fallback (demo). Add env secrets for production.
                </div>
              )}
              <Routes>
                {/* Landing and Demo */}
                <Route path="/" element={<Index />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/pricing" element={<Pricing />} />

                {/* Authentication */}
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />

                {/* Main App */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                <Route path="/prayers" element={<ProtectedRoute><Prayers /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
                <Route path="/quran" element={<ProtectedRoute><Quran /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                {/* Info Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/help" element={<Help />} />

                {/* Design System */}
                <Route path="/app-info" element={<AppInfo />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TasksProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
};

export default App;
