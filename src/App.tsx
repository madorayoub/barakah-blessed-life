import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Tasks from "./pages/Tasks";
import Prayers from "./pages/Prayers";
import CalendarView from "./pages/CalendarView";
import Settings from "./pages/Settings";
import DesignSystem from "./pages/DesignSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/prayers" element={<Prayers />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Design System */}
          <Route path="/design-system" element={<DesignSystem />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
