import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Onboarding } from "@/components/Onboarding";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

// Auth pages
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Onboarding pages
import LocationSetup from "./pages/onboarding/LocationSetup";
import PrayerMethod from "./pages/onboarding/PrayerMethod";
import Preferences from "./pages/onboarding/Preferences";

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

const queryClient = new QueryClient();

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Only show onboarding for completely new users (not authenticated users)
    const onboardingCompleted = localStorage.getItem('onboarding-completed')
    const hasSeenOnboarding = localStorage.getItem('has-seen-onboarding')
    
    // Don't show onboarding if:
    // 1. It's already completed, OR
    // 2. User has seen it before (even if they didn't complete it)
    if (!onboardingCompleted && !hasSeenOnboarding) {
      // Mark as seen immediately to prevent loops
      localStorage.setItem('has-seen-onboarding', 'true')
      setShowOnboarding(true)
    }
  }, [])

  if (showOnboarding) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Onboarding onComplete={() => setShowOnboarding(false)} />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TaskAutoPopulator />
        <TooltipProvider>
          <Toaster />
          <BrowserRouter 
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
        <Routes>
          {/* Landing and Demo */}
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<Demo />} />
          
          {/* Authentication */}
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          
          {/* Onboarding */}
          <Route path="/onboarding/location-setup" element={<LocationSetup />} />
          <Route path="/onboarding/prayer-method" element={<PrayerMethod />} />
          <Route path="/onboarding/preferences" element={<Preferences />} />
          
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
      </AuthProvider>
    </QueryClientProvider>
  )
};

export default App;
