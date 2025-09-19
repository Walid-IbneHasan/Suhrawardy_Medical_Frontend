import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate(isAdmin ? "/admin" : "/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navigation />
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex justify-center ">
                <img src="/gallery/logo.png" alt="logo" className="h-32 w-32" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              পুনরায় স্বাগতম
            </CardTitle>
            <CardDescription>
              আপনার সন্ধানী একাউন্টে সাইন ইন করুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="আপনার ইমেইল লিখুন"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="পাসওয়ার্ড দেখুন/লুকান"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full medical-gradient text-white"
                disabled={loading}
              >
                {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
              </Button>
            </form>
            <div className="mt-4 text-center space-y-2">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
              <p className="text-sm text-muted-foreground">
                একাউন্ট নেই?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  রেজিস্টার করুন
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
