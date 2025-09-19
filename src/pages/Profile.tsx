import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/utils/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type UserProfile = {
  id: number;
  email: string;
  username: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  blood_group: string;
  address: string;
  last_donation_date: string | null;
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [form, setForm] = useState<Partial<UserProfile>>({
    first_name: "",
    last_name: "",
    phone: "",
    blood_group: "",
    address: "",
    last_donation_date: null,
  });

  const [pwdForm, setPwdForm] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const todayStr = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const me = await authAPI.getUserProfile(); // GET /auth/profile/
        if (!mounted) return;
        setProfile(me as unknown as UserProfile);
        setForm({
          first_name: (me as any).first_name ?? "",
          last_name: (me as any).last_name ?? "",
          phone: (me as any).phone ?? "",
          blood_group: (me as any).blood_group ?? "",
          address: (me as any).address ?? "",
          last_donation_date: (me as any).last_donation_date ?? null,
        });
      } catch (err: any) {
        toast({
          title: "লোড করতে ব্যর্থ",
          description: err?.message || "প্রোফাইল তথ্য লোড করা যায়নি।",
          variant: "destructive",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (isAuthenticated) run();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        first_name: form.first_name ?? "",
        last_name: form.last_name ?? "",
        phone: form.phone ?? "",
        blood_group: form.blood_group ?? "",
        address: form.address ?? "",
        last_donation_date: form.last_donation_date || null,
      };
      const updated = await authAPI.updateUserProfile(payload); // PATCH /auth/profile/
      setProfile(updated as unknown as UserProfile);
      toast({ title: "সংরক্ষিত!", description: "প্রোফাইল আপডেট হয়েছে।" });
    } catch (err: any) {
      toast({
        title: "আপডেট ব্যর্থ",
        description: err?.message || "প্রোফাইল আপডেট করা যায়নি।",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwdForm.old_password || !pwdForm.new_password || !pwdForm.confirm_new_password) {
      toast({
        title: "অপূর্ণ তথ্য",
        description: "সবগুলো পাসওয়ার্ড ঘর পূরণ করুন।",
        variant: "destructive",
      });
      return;
    }
    setChangingPass(true);
    try {
      await authAPI.changePassword({
        old_password: pwdForm.old_password,
        new_password: pwdForm.new_password,
        confirm_new_password: pwdForm.confirm_new_password,
      });
      setPwdForm({ old_password: "", new_password: "", confirm_new_password: "" });
      toast({ title: "পাসওয়ার্ড পরিবর্তন হয়েছে", description: "আপনার পাসওয়ার্ড সফলভাবে আপডেট হয়েছে।" });
    } catch (err: any) {
      toast({
        title: "পাসওয়ার্ড পরিবর্তন ব্যর্থ",
        description: err?.message || "অনুগ্রহ করে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-5xl mx-auto section-padding">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">প্রোফাইল</h1>
            <div className="w-24 h-1 medical-gradient rounded-full mt-3" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left – Profile form */}
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">প্রোফাইল তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">ফার্স্ট নেম</label>
                    <Input
                      value={form.first_name ?? ""}
                      onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))}
                      placeholder="উদাহরণ: মোঃ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">লাস্ট নেম</label>
                    <Input
                      value={form.last_name ?? ""}
                      onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))}
                      placeholder="উদাহরণ: রাহমান"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">মোবাইল নম্বর</label>
                    <Input
                      value={form.phone ?? ""}
                      onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                      placeholder="উদাহরণ: ০১XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">রক্তের গ্রুপ</label>
                    <Select
                      value={form.blood_group ?? ""}
                      onValueChange={(v) => setForm((s) => ({ ...s, blood_group: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">ঠিকানা</label>
                  <Textarea
                    rows={3}
                    value={form.address ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
                    placeholder="আপনার বর্তমান ঠিকানা"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">সর্বশেষ রক্তদানের তারিখ</label>
                    <Input
                      type="date"
                      max={todayStr}
                      value={form.last_donation_date ?? ""}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, last_donation_date: e.target.value || null }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">ইমেইল (শুধু পড়ার জন্য)</label>
                    <Input value={profile?.email ?? ""} disabled />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="medical-gradient text-white px-6"
                  >
                    {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right – Password change */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">পাসওয়ার্ড পরিবর্তন</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">পুরোনো পাসওয়ার্ড</label>
                  <Input
                    type="password"
                    value={pwdForm.old_password}
                    onChange={(e) => setPwdForm((s) => ({ ...s, old_password: e.target.value }))}
                    placeholder="পুরোনো পাসওয়ার্ড"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">নতুন পাসওয়ার্ড</label>
                  <Input
                    type="password"
                    value={pwdForm.new_password}
                    onChange={(e) => setPwdForm((s) => ({ ...s, new_password: e.target.value }))}
                    placeholder="নতুন পাসওয়ার্ড"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">নতুন পাসওয়ার্ড (আবার)</label>
                  <Input
                    type="password"
                    value={pwdForm.confirm_new_password}
                    onChange={(e) =>
                      setPwdForm((s) => ({ ...s, confirm_new_password: e.target.value }))
                    }
                    placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
                  />
                </div>
                <Separator />
                <Button
                  variant="outline"
                  onClick={handleChangePassword}
                  disabled={changingPass}
                  className="w-full"
                >
                  {changingPass ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
