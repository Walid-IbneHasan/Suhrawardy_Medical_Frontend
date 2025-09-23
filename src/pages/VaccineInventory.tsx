import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { vaccineAPI, VaccineInventory, adminAPI } from "@/utils/api";
import { Syringe, Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const VaccineInventoryPage = () => {
  const [vaccineInventory, setVaccineInventory] = useState<VaccineInventory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<VaccineInventory | null>(
    null
  );
  const [formData, setFormData] = useState({ type: "", available: false });
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  // Default data for demo
  const defaultVaccineInventory = [
    { id: 1, type: "Hepatitis B", available: true },
    { id: 2, type: "Influenza", available: true },
    { id: 3, type: "Tetanus", available: false },
    { id: 4, type: "COVID-19", available: true },
    { id: 5, type: "Rabies", available: true },
    { id: 6, type: "Typhoid", available: false },
    { id: 7, type: "Pneumonia", available: true },
    { id: 8, type: "Meningitis", available: true },
  ];

  useEffect(() => {
    const fetchVaccineInventory = async () => {
      try {
        console.log("Fetching vaccine inventory...");
        const data = await vaccineAPI.getVaccineInventory();
        setVaccineInventory(data);
      } catch (error) {
        console.error("Failed to fetch vaccine inventory:", error);
        setVaccineInventory(defaultVaccineInventory);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccineInventory();
  }, []);

  const handleCreateVaccineInventory = async () => {
    try {
      await adminAPI.vaccineInventory.create(formData);
      toast({
        title: "Success",
        description: "Vaccine inventory created successfully",
      });
      setDialogOpen(false);
      setFormData({ type: "", available: false });
      // Refresh inventory
      const data = await vaccineAPI.getVaccineInventory();
      setVaccineInventory(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create vaccine inventory",
        variant: "destructive",
      });
    }
  };

  const handleEditVaccineInventory = async () => {
    if (!editingVaccine) return;
    try {
      await adminAPI.vaccineInventory.update(editingVaccine.id, formData);
      toast({
        title: "Success",
        description: "Vaccine inventory updated successfully",
      });
      setDialogOpen(false);
      setEditingVaccine(null);
      setFormData({ type: "", available: false });
      // Refresh inventory
      const data = await vaccineAPI.getVaccineInventory();
      setVaccineInventory(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vaccine inventory",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVaccineInventory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vaccine inventory?"))
      return;
    try {
      await adminAPI.vaccineInventory.delete(id);
      toast({
        title: "Success",
        description: "Vaccine inventory deleted successfully",
      });
      // Refresh inventory
      const data = await vaccineAPI.getVaccineInventory();
      setVaccineInventory(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vaccine inventory",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    setEditingVaccine(null);
    setFormData({ type: "", available: false });
    setDialogOpen(true);
  };

  const openEditDialog = (vaccine: VaccineInventory) => {
    setEditingVaccine(vaccine);
    setFormData({ type: vaccine.type, available: vaccine.available });
    setDialogOpen(true);
  };

  console.log("vaccineInventory:", vaccineInventory);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Vaccine Inventory
              </h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-lg animate-pulse"
                >
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ভ্যাকসিন মজুত
          </h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            আমাদের কাছে বর্তমানে কোন কোন ভ্যাকসিন উপলভ্য—এখানেই দেখুন।
          </p>
        </div>
      </section>
      {/* Why Vaccination section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              কেন টিকা গুরুত্বপূর্ণ?
            </h2>
            <p className="text-gray-700 mb-4">
              টিকা আমাদের শরীরকে ক্ষতিকর জীবাণুর বিরুদ্ধে প্রতিরোধ গড়ে তুলতে
              সাহায্য করে। সময়মতো টিকা নিলে গুরুতর রোগের ঝুঁকি কমে, জটিলতা এড়ানো
              যায় এবং সমাজব্যাপী রোগ ছড়ানো প্রতিরোধ করা সম্ভব হয়।
            </p>
            <ul className="space-y-2 text-gray-700 list-disc pl-5">
              <li>রোগ প্রতিরোধে নিরাপদ ও কার্যকর উপায়</li>
              <li>হাসপাতালে ভর্তি ও জটিলতার ঝুঁকি কমায়</li>
              <li>পরিবার ও সমাজকে সুরক্ষা দেয় (হার্ড ইমিউনিটি)</li>
              <li>দীর্ঘমেয়াদে স্বাস্থ্য খরচ কমাতে সাহায্য করে</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              সাধারণ পার্শ্বপ্রতিক্রিয়া
            </h3>
            <p className="text-gray-700 mb-4">
              অধিকাংশ টিকার পার্শ্বপ্রতিক্রিয়া সামান্য ও স্বল্পস্থায়ী হয়ে থাকে।
              যেমন: ইনজেকশন স্থানে ব্যথা/লালচে ভাব, হালকা জ্বর, ক্লান্তি
              ইত্যাদি। বেশিরভাগ ক্ষেত্রে ২৪-৪৮ ঘণ্টার মধ্যে স্বাভাবিক হয়ে যায়।
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-gray-700">
              <div className="p-3 rounded-lg bg-gray-50 border">
                হালকা জ্বর বা শরীর ব্যথা
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border">
                ইনজেকশন স্থানে ফোলা/ব্যথা
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border">
                মাথাব্যথা/ক্লান্তি
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border">
                খাদ্য রুচি কমে যাওয়া
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who and When section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            কারা ও কখন টিকা নেবেন?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">শিশু</h4>
              <p>
                জাতীয় কর্মসূচি অনুযায়ী (EPI) জন্মের পর থেকে নির্ধারিত সময়সূচিতে
                সব টিকা।
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">কিশোর/তরুণ</h4>
              <p>
                HPV, টিটেনাস বুস্টার, হেপাটাইটিস বি (ডোজ মিস থাকলে পূরণ করুন)।
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">প্রাপ্তবয়স্ক</h4>
              <p>
                ইনফ্লুয়েঞ্জা (বার্ষিক), টিটেনাস বুস্টার, হেপাটাইটিস বি, প্রয়োজন
                অনুযায়ী অন্যান্য।
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
            ভ্রমণ, পেশাগত ঝুঁকি বা ক্রনিক রোগ থাকলে আপনার চিকিৎসকের সাথে পরামর্শ
            করে টিকা নিন।
          </div>
        </div>
      </section>

      {/* Preparation and Aftercare */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              টিকা নেওয়ার আগে করণীয়
            </h3>
            <ul className="space-y-2 text-gray-700 list-disc pl-5">
              <li>বর্তমান ওষুধ/অ্যালার্জির তথ্য নিয়ে আসুন</li>
              <li>আগের টিকার কার্ড/প্রমাণ সঙ্গে আনুন</li>
              <li>জ্বর/অসুস্থতা থাকলে আগে জানান</li>
              <li>পর্যাপ্ত পানি পান করুন ও হালকা খাবার খান</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              টিকা নেওয়ার পর করণীয়
            </h3>
            <ul className="space-y-2 text-gray-700 list-disc pl-5">
              <li>৩০ মিনিট পর্যবেক্ষণে থাকুন (সম্ভব হলে)</li>
              <li>ইনজেকশন স্থানে ঠাণ্ডা সেঁক দিতে পারেন</li>
              <li>
                হালকা জ্বর হলে প্যারাসিটামল নিতে পারেন (প্রয়োজনে চিকিৎসকের
                পরামর্শ)
              </li>
              <li>
                অস্বাভাবিক প্রতিক্রিয়া হলে দ্রুত যোগাযোগ করুন: ০১৮৬৭৪৮৩৬৩১
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Vaccination Info section */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto text-center space-y-4 p-6 rounded-lg border border-yellow-200">
          <h2 className="text-3xl font-bold text-gray-800">ভ্যাকসিন তথ্য</h2>
          <p className="text-gray-700">
            HBV (সাধারণ ৫০০, শিক্ষার্থীদের জন্য ৪৫০) <br />
            HPV (২৫০০/)
          </p>
          <p className="text-gray-700 font-medium">
            ভ্যাক্সিনেশন এর জন্য যোগাযোগ: ০১৮৬৭৪৮৩৬৩১
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Admin Actions */}
          {isAdmin && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-blue-800">
                  Admin Panel
                </h3>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={openCreateDialog}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Vaccine</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingVaccine
                          ? "Edit Vaccine Inventory"
                          : "Create New Vaccine Inventory"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Vaccine type (e.g., Hepatitis B)"
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="available"
                          checked={formData.available}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, available: !!checked })
                          }
                        />
                        <label
                          htmlFor="available"
                          className="text-sm font-medium"
                        >
                          Available
                        </label>
                      </div>
                      <Button
                        onClick={
                          editingVaccine
                            ? handleEditVaccineInventory
                            : handleCreateVaccineInventory
                        }
                        className="w-full"
                      >
                        {editingVaccine
                          ? "Update Inventory"
                          : "Create Inventory"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaccineInventory.map((vaccine) => (
              <Card
                key={vaccine.id}
                className={`${
                  vaccine.available
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Syringe className="w-5 h-5 text-blue-500" />
                    <span>{vaccine.type}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant={vaccine.available ? "default" : "destructive"}
                    className={`mb-4 ${
                      vaccine.available ? "bg-green-500" : ""
                    }`}
                  >
                    {vaccine.available ? "Available" : "Out of Stock"}
                  </Badge>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(vaccine)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteVaccineInventory(vaccine.id)}
                        className="flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {/* FAQs */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                সাধারণ প্রশ্নোত্তর
              </h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-medium text-gray-800">
                    ১) এক সাথে একাধিক টিকা নেওয়া যায়?
                  </p>
                  <p>
                    হ্যাঁ, ডাক্তারি পরামর্শ অনুযায়ী একই দিনে ভিন্ন টিকা নেওয়া
                    নিরাপদ।
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    ২) টিকার কার্যকারিতা কবে থেকে শুরু হয়?
                  </p>
                  <p>
                    বেশিরভাগ টিকার সুরক্ষা ১-২ সপ্তাহে গড়ে ওঠে, কিছু ক্ষেত্রে
                    সিরিজ সম্পন্নের পর।
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    ৩) অ্যালার্জি থাকলে কী করবেন?
                  </p>
                  <p>
                    আগে থেকে অ্যালার্জির ইতিহাস অবশ্যই জানান; প্রয়োজন হলে বিকল্প
                    ব্যবস্থা নেওয়া হবে।
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-900">
            এই তথ্য সাধারণ সচেতনতার জন্য। ব্যক্তিগত শারীরিক অবস্থার ভিত্তিতে
            সিদ্ধান্ত নিতে যোগ্য চিকিৎসকের পরামর্শ নিন।
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default VaccineInventoryPage;
