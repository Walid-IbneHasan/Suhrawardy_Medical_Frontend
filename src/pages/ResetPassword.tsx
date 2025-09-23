import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
import { Activity, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/utils/api";
import Navigation from "@/components/Navigation";

const ResetPassword: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = useMemo(
    () => new URLSearchParams(search).get("token") ?? "",
    [search]
  );

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const noToken = !token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (noToken) return;

    setLoading(true);
    try {
      await authAPI.resetPassword({
        token,
        new_password: password,
        confirm_new_password: confirm,
      });

      toast({
        title: "পাসওয়ার্ড রিসেট সফল",
        description: "এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।",
      });

      navigate("/login");
    } catch (err) {
      toast({
        title: "রিসেট ব্যর্থ হয়েছে",
        description:
          "টোকেনটি অবৈধ বা মেয়াদোত্তীর্ণ হতে পারে। অনুগ্রহ করে আবার ‘পাসওয়ার্ড রিসেট’ শুরু করুন।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordsMismatch = password && confirm && password !== confirm;
  const canSubmit = !loading && !passwordsMismatch && password.length >= 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navigation />
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex justify-center">
                <img src="/gallery/logo.jpg" alt="logo" className="h-32 w-32" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {noToken ? "টোকেন পাওয়া যায়নি" : "নতুন পাসওয়ার্ড সেট করুন"}
            </CardTitle>
            <CardDescription>
              {noToken
                ? "দয়া করে আপনার ইমেইলে পাওয়া লিংকটি ব্যবহার করে আবার চেষ্টা করুন বা নতুন করে রিসেট অনুরোধ পাঠান।"
                : "একটি শক্তিশালী নতুন পাসওয়ার্ড নির্বাচন করুন এবং নিশ্চিত করুন।"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {noToken ? (
              <div className="space-y-4">
                <Link to="/forgot-password">
                  <Button className="w-full medical-gradient text-white">
                    নতুন রিসেট লিংক নিন
                  </Button>
                </Link>
                <Link
                  to="/login"
                  className="text-sm text-primary hover:underline flex items-center justify-center space-x-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>লগইনে ফিরে যান</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      placeholder="নতুন পাসওয়ার্ড লিখুন"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={
                        showPw ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"
                      }
                    >
                      {showPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    অন্তত ৬ অক্ষরের পাসওয়ার্ড দিন।
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm">পাসওয়ার্ড নিশ্চিত করুন</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="পাসওয়ার্ড আবার লিখুন"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                  {passwordsMismatch && (
                    <p className="text-sm text-destructive">
                      পাসওয়ার্ড মিলছে না
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full medical-gradient text-white"
                  disabled={!canSubmit}
                >
                  {loading ? "সেভ হচ্ছে..." : "পাসওয়ার্ড সেভ করুন"}
                </Button>

                <div className="mt-2 text-center">
                  <Link
                    to="/login"
                    className="text-sm text-primary hover:underline inline-flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>লগইনে ফিরে যান</span>
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
