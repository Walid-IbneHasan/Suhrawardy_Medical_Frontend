import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { Activity, ArrowLeft } from "lucide-react";
import { authAPI } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast({
        title: "রিসেট লিংক পাঠানো হয়েছে",
        description: "পাসওয়ার্ড রিসেটের নির্দেশনার জন্য ইমেইল চেক করুন।",
      });
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "রিসেট ইমেইল পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
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
              {sent ? "আপনার ইমেইল চেক করুন" : "পাসওয়ার্ড রিসেট"}
            </CardTitle>
            <CardDescription>
              {sent
                ? "আপনার ইমেইল ঠিকানায় পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।"
                : "পাসওয়ার্ড রিসেট লিংক পেতে আপনার ইমেইল লিখুন।"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  ইমেইল পাননি? স্প্যাম/জাঙ্ক ফোল্ডার দেখুন বা আবার চেষ্টা করুন।
                </p>
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  আবার চেষ্টা করুন
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="আপনার ইমেইল ঠিকানা লিখুন"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full medical-gradient text-white"
                  disabled={loading}
                >
                  {loading ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
                </Button>
              </form>
            )}
            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>লগইনে ফিরে যান</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
