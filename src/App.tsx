import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Blogs from "./pages/Blogs";
import Events from "./pages/Events";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";
import BlogDetail from "./pages/BlogDetail";
import BloodInventoryPage from "./pages/BloodInventory";
import VaccineInventoryPage from "./pages/VaccineInventory";
import EventDetail from "./pages/EventDetail";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/blood-inventory" element={<BloodInventoryPage />} />
            <Route
              path="/vaccine-inventory"
              element={<VaccineInventoryPage />}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
