import React, { useEffect, useMemo, useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  bloodAPI,
  adminAPI,
  meAPI,
  BloodInventory,
  BloodRequest,
  BloodDonationInterest,
  Donation,
} from "../utils/api";
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Activity,
  User,
  Calendar,
  MapPin,
  Phone,
  HelpCircle,
  Medal,
  FileText,
  List,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";
import AdminDonorRegistry from "../components/AdminDonorRegistry";
import AdminPDFManager from "../components/AdminPDFManager";

const BloodInventoryPage = () => {
  // --- Gallery state ---
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  const openGalleryAt = (idx: number) => {
    setActiveImgIndex(idx);
    setGalleryOpen(true);
  };

  const nextImg = () =>
    setActiveImgIndex((i) => (i + 1) % bloodGalleryFiles.length);

  const prevImg = () =>
    setActiveImgIndex((i) =>
      i - 1 < 0 ? bloodGalleryFiles.length - 1 : i - 1
    );

  // Data state
  const [bloodInventory, setBloodInventory] = useState<BloodInventory[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [donationInterests, setDonationInterests] = useState<
    BloodDonationInterest[]
  >([]);
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [allDonations, setAllDonations] = useState<Donation[]>([]); // admin-only

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "inventory" | "request" | "donate" | "faq" | "registry" | "pdfs"
  >("inventory");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"blood" | "request" | "donate">(
    "blood"
  );

  // Admin edit states
  const [editingBlood, setEditingBlood] = useState<BloodInventory | null>(null);
  const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(
    null
  );
  const [editingDonation, setEditingDonation] =
    useState<BloodDonationInterest | null>(null);

  // Forms
  const [bloodFormData, setBloodFormData] = useState({
    group: "",
    available: false,
  });
  const [requestFormData, setRequestFormData] = useState({
    blood_group: "",
    location: "",
    contact: "",
    date_required: "",
    collection_location: "",
    reason: "",
  });
  const [donateFormData, setDonateFormData] = useState({
    blood_group: "",
    available_date: "",
    contact_info: "",
  });

  // Eligibility inputs (NEW)
  const [lastDonationDate, setLastDonationDate] = useState<string>("");
  const [recordLastDonationNow, setRecordLastDonationNow] =
    useState<boolean>(true);

  const { isAdmin, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Default data for demo fallback
  const defaultBloodInventory = [
    { id: 1, group: "A+", available: true },
    { id: 2, group: "A-", available: false },
    { id: 3, group: "B+", available: true },
    { id: 4, group: "B-", available: true },
    { id: 5, group: "AB+", available: false },
    { id: 6, group: "AB-", available: true },
    { id: 7, group: "O+", available: true },
    { id: 8, group: "O-", available: false },
  ];

  const bloodGalleryFiles: string[] = [
    "WhatsApp Image 2025-09-11 at 12.50.57 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.04 PM.jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.16 PM (1).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.16 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM (1).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM (3).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM.jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.18 PM (1).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.18 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.18 PM.jpeg",
  ];

  const bloodImgUrl = (name: string) =>
    `/gallery/blood/${encodeURIComponent(name)}`;

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Tabs config (mobile dropdown + desktop tabs)
  const allTabs = useMemo(() => {
    const tabs: {
      id: "inventory" | "request" | "donate" | "faq" | "registry" | "pdfs";
      label: string;
      icon: any;
    }[] = [
      { id: "inventory", label: "রক্তের মজুত", icon: Activity },
      { id: "request", label: "রক্তের অনুরোধ", icon: Heart },
      { id: "donate", label: "রক্তদান", icon: User },
      { id: "faq", label: "প্রশ্নোত্তর", icon: HelpCircle },
    ];
    if (isAdmin) {
      tabs.push(
        { id: "registry", label: "রক্তদাতা নিবন্ধন ", icon: List },
        { id: "pdfs", label: "পিডিএফ ডকুমেন্ট ", icon: FileText }
      );
    }
    return tabs;
  }, [isAdmin]);

  // Keyboard nav for gallery
  useEffect(() => {
    if (!galleryOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [galleryOpen]);

  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bloodData, requestData, donationInterestData] =
          await Promise.all([
            bloodAPI.getBloodInventory(),
            isAdmin ? adminAPI.bloodRequests.getAll() : meAPI.myBloodRequests(),
            isAdmin ? adminAPI.donationInterests.getAll() : Promise.resolve([]),
          ]);
        setBloodInventory(bloodData);
        setBloodRequests(requestData);
        setDonationInterests(donationInterestData);

        if (isAdmin) {
          const d = await adminAPI.donations.getAll();
          setAllDonations(d);
        } else if (isAuthenticated) {
          const mine = await meAPI.myDonations();
          setMyDonations(mine);

          // Prefill last donation date from latest record (if any)
          if (mine.length) {
            const latest = [...mine].sort(
              (a, b) =>
                new Date(b.donation_date).getTime() -
                new Date(a.donation_date).getTime()
            )[0];
            if (latest?.donation_date) {
              setLastDonationDate(latest.donation_date.slice(0, 10));
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setBloodInventory(defaultBloodInventory);
        setBloodRequests([]);
        setDonationInterests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, isAuthenticated]);

  // --- Helpers: eligibility (90 days ~ 3 months) ---
  const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d;
  };

  const daysBetween = (from: Date, to: Date) => {
    const ms = to.getTime() - from.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  };

  // If user picked a future available_date, use that as the "target date".
  const targetDonationDate = useMemo(() => {
    return donateFormData.available_date
      ? new Date(donateFormData.available_date)
      : new Date();
  }, [donateFormData.available_date]);

  const eligibility = useMemo(() => {
    if (!lastDonationDate) {
      return {
        eligible: false,
        reason: "অনুগ্রহ করে আপনার শেষ রক্তদানের তারিখ দিন।",
      };
    }
    const last = new Date(lastDonationDate);
    const diff = daysBetween(last, targetDonationDate);
    if (diff >= 90) {
      return { eligible: true, reason: "" };
    }
    const eligibleFrom = addDays(lastDonationDate, 90);
    return {
      eligible: false,
      reason: `আপনি ${eligibleFrom.toLocaleDateString()} তারিখ থেকে আবার রক্তদান করতে পারবেন। (বাকি ${
        90 - diff
      } দিন)`,
    };
  }, [lastDonationDate, targetDonationDate]);

  // --- Admin Handlers for Blood Inventory ---
  const handleCreateBloodInventory = async () => {
    try {
      await adminAPI.bloodInventory.create(bloodFormData);
      toast({
        title: "সফল",
        description: "রক্তের মজুত সফলভাবে তৈরি হয়েছে।",
      });
      setDialogOpen(false);
      setBloodFormData({ group: "", available: false });
      const data = await bloodAPI.getBloodInventory();
      setBloodInventory(data);
    } catch {
      toast({
        title: "ত্রুটি",
        description: "রক্তের মজুত তৈরি করতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  const handleEditBloodInventory = async () => {
    if (!editingBlood) return;
    try {
      await adminAPI.bloodInventory.update(editingBlood.id, bloodFormData);
      toast({
        title: "সফল",
        description: "রক্তের মজুত সফলভাবে আপডেট হয়েছে।",
      });
      setDialogOpen(false);
      setEditingBlood(null);
      setBloodFormData({ group: "", available: false });
      const data = await bloodAPI.getBloodInventory();
      setBloodInventory(data);
    } catch {
      toast({
        title: "ত্রুটি",
        description: "রক্তের মজুত আপডেট করতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBloodInventory = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই মজুত মুছে ফেলতে চান?")) return;
    try {
      await adminAPI.bloodInventory.delete(id);
      toast({
        title: "সফল",
        description: "রক্তের মজুত সফলভাবে মুছে ফেলা হয়েছে।",
      });
      const data = await bloodAPI.getBloodInventory();
      setBloodInventory(data);
    } catch {
      toast({
        title: "ত্রুটি",
        description: "রক্তের মজুত মুছতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  // --- Handlers for Blood Requests ---
  const handleCreateBloodRequest = async () => {
    try {
      if (isAdmin) {
        await adminAPI.bloodRequests.create(requestFormData);
        toast({
          title: "সফল",
          description: "রক্তের অনুরোধ সফলভাবে তৈরি হয়েছে।",
        });
        const data = await adminAPI.bloodRequests.getAll();
        setBloodRequests(data);
      } else {
        await bloodAPI.requestBlood(requestFormData);
        toast({
          title: "সফল",
          description: "রক্তের অনুরোধ সফলভাবে জমা হয়েছে।",
        });
        const data = await meAPI.myBloodRequests();
        setBloodRequests(data);
      }
      setDialogOpen(false);
      setRequestFormData({
        blood_group: "",
        location: "",
        contact: "",
        date_required: "",
        collection_location: "",
        reason: "",
      });
    } catch {
      toast({
        title: "ত্রুটি",
        description: "রক্তের অনুরোধ তৈরি করতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  const handleEditBloodRequest = async () => {
    if (!editingRequest) return;
    try {
      await adminAPI.bloodRequests.update(editingRequest.id, requestFormData);
      toast({
        title: "সফল",
        description: "রক্তের অনুরোধ সফলভাবে আপডেট হয়েছে।",
      });
      setDialogOpen(false);
      setEditingRequest(null);
      setRequestFormData({
        blood_group: "",
        location: "",
        contact: "",
        date_required: "",
        collection_location: "",
        reason: "",
      });
      const data = await adminAPI.bloodRequests.getAll();
      setBloodRequests(data);
    } catch {
      toast({
        title: "ত্রুটি",
        description: "রক্তের অনুরোধ আপডেট করতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBloodRequest = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই অনুরোধ মুছে ফেলতে চান?")) return;
    try {
      await adminAPI.bloodRequests.delete(id);
      toast({
        title: "সফল",
        description: "রক্তের অনুরোধ সফলভাবে মুছে ফেলা হয়েছে।",
      });
      const data = await adminAPI.bloodRequests.getAll();
      setBloodRequests(data);
    } catch {
      toast({
        title: "ত্রুটি",
        description: "রক্তের অনুরোধ মুছতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  // --- Handlers for Donation Interests ---
  const handleCreateDonationInterest = async () => {
    try {
      // ----- ADMIN FLOW -----
      if (isAdmin) {
        // Minimal validation for admin form fields
        if (
          !donateFormData.blood_group ||
          !donateFormData.available_date ||
          !donateFormData.contact_info
        ) {
          toast({
            title: "তথ্য অসম্পূর্ণ",
            description: "রক্তের গ্রুপ, উপস্থিতির তারিখ ও যোগাযোগের তথ্য দিন।",
            variant: "destructive",
          });
          return;
        }

        await adminAPI.donationInterests.create(donateFormData);

        toast({
          title: "সফল",
          description: "রক্তদানের আগ্রহ সফলভাবে তৈরি হয়েছে।",
        });

        setDialogOpen(false);
        setDonateFormData({
          blood_group: "",
          available_date: "",
          contact_info: "",
        });

        // Refresh admin table
        const data = await adminAPI.donationInterests.getAll();
        setDonationInterests(data);
        return;
      }

      // ----- USER FLOW -----
      if (!isAuthenticated) {
        toast({
          title: "লগইন প্রয়োজন",
          description: "রক্তদানে নিবন্ধনের জন্য অনুগ্রহ করে লগইন করুন।",
          variant: "destructive",
        });
        return;
      }

      if (!donateFormData.blood_group) {
        toast({
          title: "তথ্য অসম্পূর্ণ",
          description: "অনুগ্রহ করে আপনার রক্তের গ্রুপ নির্বাচন করুন।",
          variant: "destructive",
        });
        return;
      }

      if (!lastDonationDate) {
        toast({
          title: "তারিখ প্রয়োজন",
          description: "শেষ কবে রক্ত দিয়েছেন তা দিন।",
          variant: "destructive",
        });
        return;
      }

      if (!eligibility.eligible) {
        toast({
          title: "এখনও যোগ্য নন",
          description:
            eligibility.reason ||
            "দুই দানের মধ্যে ন্যূনতম ৯০ দিন বিরতি রাখা জরুরি।",
          variant: "destructive",
        });
        return;
      }

      // Optionally record last donation first
      if (recordLastDonationNow) {
        await meAPI.createDonation({
          blood_group: donateFormData.blood_group,
          donation_date: lastDonationDate,
          notes: "রক্তদানের আগ্রহ দেওয়ার আগে ব্যবহারকারী নিজে রেকর্ড করেছেন।",
        });
      }

      await bloodAPI.donateInterest(donateFormData);

      toast({
        title: "ধন্যবাদ!",
        description: "আপনার রক্তদানের আগ্রহ সফলভাবে নিবন্ধিত হয়েছে।",
      });

      if (!recordLastDonationNow) {
        await meAPI.createDonation({
          blood_group: donateFormData.blood_group,
          donation_date: lastDonationDate,
          notes:
            "রক্তদানের আগ্রহ জমা দেওয়ার সময় স্বপ্রণোদিত শেষ দানের তারিখ রেকর্ড।",
        });
      }

      setDonateFormData({
        blood_group: "",
        available_date: "",
        contact_info: "",
      });

      const mine = await meAPI.myDonations();
      setMyDonations(mine);
    } catch (error) {
      console.error(error);
      toast({
        title: "ত্রুটি",
        description: "রক্তদানের আগ্রহ জমা দিতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  const handleEditDonationInterest = async () => {
    if (!editingDonation) return;
    try {
      await adminAPI.donationInterests.update(
        editingDonation.id,
        donateFormData
      );
      toast({
        title: "সফল",
        description: "রক্তদানের আগ্রহ সফলভাবে আপডেট হয়েছে।",
      });
      setDialogOpen(false);
      setEditingDonation(null);
      setDonateFormData({
        blood_group: "",
        available_date: "",
        contact_info: "",
      });
      const data = await adminAPI.donationInterests.getAll();
      setDonationInterests(data);
    } catch {
      toast({
        title: "ত্রুটি",
        description: "রক্তদানের আগ্রহ আপডেট করতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDonationInterest = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই আগ্রহ মুছে ফেলতে চান?")) return;
    try {
      await adminAPI.donationInterests.delete(id);
      toast({
        title: "সফল",
        description: "রক্তদানের আগ্রহ সফলভাবে মুছে ফেলা হয়েছে।",
      });
      const data = await adminAPI.donationInterests.getAll();
      setDonationInterests(data);
    } catch {
      toast({
        title: "ত্রুটি",
        description: "রক্তদানের আগ্রহ মুছতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  // Dialog openers
  const openCreateBloodDialog = () => {
    setDialogType("blood");
    setEditingBlood(null);
    setBloodFormData({ group: "", available: false });
    setDialogOpen(true);
  };

  const openEditBloodDialog = (blood: BloodInventory) => {
    setDialogType("blood");
    setEditingBlood(blood);
    setBloodFormData({ group: blood.group, available: blood.available });
    setDialogOpen(true);
  };

  const openCreateRequestDialog = () => {
    setDialogType("request");
    setEditingRequest(null);
    setRequestFormData({
      blood_group: "",
      location: "",
      contact: "",
      date_required: "",
      collection_location: "",
      reason: "",
    });
    setDialogOpen(true);
  };

  const openEditRequestDialog = (request: BloodRequest) => {
    setDialogType("request");
    setEditingRequest(request);
    setRequestFormData({
      blood_group: request.blood_group,
      location: request.location,
      contact: request.contact,
      date_required: request.date_required,
      collection_location: request.collection_location || "",
      reason: request.reason || "",
    });
    setDialogOpen(true);
  };

  const openCreateDonationDialog = () => {
    setDialogType("donate");
    setEditingDonation(null);
    setDonateFormData({
      blood_group: "",
      available_date: "",
      contact_info: "",
    });
    setDialogOpen(true);
  };

  const openEditDonationDialog = (donation: BloodDonationInterest) => {
    setDialogType("donate");
    setEditingDonation(donation);
    setDonateFormData({
      blood_group: donation.blood_group,
      available_date: donation.available_date,
      contact_info: donation.contact_info,
    });
    setDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Admin: top donors (by total donation records)
  const topDonors = useMemo(() => {
    if (!isAdmin || !allDonations.length) return [];
    const map = new Map<string, number>();
    for (const d of allDonations) {
      const email = d.user?.email || "অজানা";
      map.set(email, (map.get(email) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [isAdmin, allDonations]);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                রক্ত সেবা
              </h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="bg-gradient-to-br from-red-50 to-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            রক্ত সেবা
          </h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            বিভিন্ন রক্তের গ্রুপের বর্তমান প্রাপ্যতা দেখুন, রক্তের জন্য অনুরোধ
            করুন, অথবা রক্তদানের জন্য নিবন্ধন করুন।
          </p>
        </div>
      </section>

      {/* Blood Program Gallery */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              আমাদের রক্তদান কার্যক্রম – ছবি
            </h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mt-4"></div>
            <p className="text-gray-600 mt-4">
              সাম্প্রতিক রক্তদান ক্যাম্প ও প্রোগ্রামের কিছু মুহূর্ত।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {bloodGalleryFiles.map((file, idx) => (
              <button
                key={file + idx}
                onClick={() => openGalleryAt(idx)}
                className="group block overflow-hidden rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={`ছবি ${idx + 1} খুলুন`}
              >
                <img
                  src={bloodImgUrl(file)}
                  alt={`রক্তদান ছবি ${idx + 1}`}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200">
        {/* Mobile: Dropdown selector for tabs */}
        <div className="md:hidden px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
          <Select
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(
                value as
                  | "inventory"
                  | "request"
                  | "donate"
                  | "faq"
                  | "registry"
                  | "pdfs"
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="একটি সেকশন নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {allTabs.map((tab) => (
                <SelectItem key={tab.id} value={tab.id}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop/Tablet: Original horizontal tabs */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {allTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isPrimary = [
                  "inventory",
                  "request",
                  "donate",
                  "faq",
                ].includes(tab.id);
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(
                        tab.id as
                          | "inventory"
                          | "request"
                          | "donate"
                          | "faq"
                          | "registry"
                          | "pdfs"
                      )
                    }
                    className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                      isActive
                        ? isPrimary
                          ? "border-red-500 text-red-600"
                          : "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Blood Inventory Tab */}
          {activeTab === "inventory" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                রক্তের মজুত
              </h2>
              {isAdmin && (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
                    <h3 className="text-lg font-medium text-blue-800">
                      অ্যাডমিন প্যানেল
                    </h3>
                    <Button
                      onClick={openCreateBloodDialog}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Blood Group</span>
                    </Button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {bloodInventory.map((blood) => (
                  <Card
                    key={blood.id}
                    className={`text-center p-4 ${
                      blood.available
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {blood.group}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Badge
                        variant={blood.available ? "default" : "destructive"}
                        className={`mb-3 ${
                          blood.available ? "bg-green-500" : ""
                        }`}
                      >
                        {blood.available ? "Available" : "অনুপলভ্য"}
                      </Badge>
                      {isAdmin && (
                        <div className="flex flex-col space-y-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditBloodDialog(blood)}
                            className="flex items-center justify-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteBloodInventory(blood.id)}
                            className="flex items-center justify-center space-x-1"
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
            </div>
          )}

          {/* Request Blood Tab */}
          {activeTab === "request" && (
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                রক্তের অনুরোধ
              </h2>
              {isAdmin ? (
                <Card>
                  <CardHeader className="flex flex-col gap-2 lg:flex-row items-center justify-between">
                    <CardTitle>রক্তের অনুরোধসমূহ</CardTitle>
                    <Button
                      onClick={openCreateRequestDialog}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন অনুরোধ যোগ করুন</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {bloodRequests.length === 0 ? (
                      <p className="text-center text-gray-600">
                        কোনো রক্তের অনুরোধ পাওয়া যায়নি।
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[120px]">
                                নাম
                              </TableHead>
                              <TableHead className="min-w-[150px]">
                                ইমেইল
                              </TableHead>
                              <TableHead className="min-w-[80px]">
                                রক্তের গ্রুপ
                              </TableHead>
                              <TableHead className="min-w-[100px]">
                                অবস্থান
                              </TableHead>
                              <TableHead className="min-w-[120px]">
                                সংগ্রহের স্থান
                              </TableHead>
                              <TableHead className="min-w-[100px]">
                                যোগাযোগ
                              </TableHead>
                              <TableHead className="min-w-[120px]">
                                প্রয়োজনের তারিখ
                              </TableHead>
                              <TableHead className="min-w-[150px]">
                                কারণ
                              </TableHead>
                              <TableHead className="min-w-[120px]">
                                অ্যাকশন
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bloodRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell className="font-medium">
                                  {request.user?.name || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {request.user?.email || "N/A"}
                                </TableCell>
                                <TableCell>{request.blood_group}</TableCell>
                                <TableCell>{request.location}</TableCell>
                                <TableCell>
                                  {request.collection_location || "-"}
                                </TableCell>
                                <TableCell>{request.contact}</TableCell>
                                <TableCell>
                                  {formatDate(request.date_required)}
                                </TableCell>
                                <TableCell className="max-w-[200px]">
                                  <div
                                    className="truncate"
                                    title={request.reason || "-"}
                                  >
                                    {request.reason || "-"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        openEditRequestDialog(request)
                                      }
                                      className="flex items-center gap-1"
                                    >
                                      <Edit className="w-3 h-3" />
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        handleDeleteBloodRequest(request.id)
                                      }
                                      className="flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <>
                  {!isAuthenticated ? (
                    <Card className="shadow-xl">
                      <CardContent className="p-8 text-center">
                        <h3 className="text-xl font-semibold mb-4">
                          লগইন প্রয়োজন
                        </h3>
                        <p className="text-gray-600 mb-6">
                          রক্তের অনুরোধ করতে লগইন করুন।
                        </p>
                        <Button>
                          <Link to="/login">লগইন</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <Card className="shadow-xl mb-8">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Heart className="w-6 h-6 text-red-500" />
                            <span>রক্তের অনুরোধ ফর্ম</span>
                          </CardTitle>
                          <CardDescription>
                            রক্তের প্রয়োজন জানাতে ফর্মটি পূরণ করুন। আমরা দ্রুত
                            যোগাযোগ করব।
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleCreateBloodRequest();
                            }}
                            className="space-y-6"
                          >
                            <div>
                              <Label htmlFor="blood_group">
                                প্রয়োজনীয় রক্তের গ্রুপ
                              </Label>
                              <Select
                                value={requestFormData.blood_group}
                                onValueChange={(value) =>
                                  setRequestFormData((prev) => ({
                                    ...prev,
                                    blood_group: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="রক্তের গ্রুপ নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                  {bloodGroups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                      {group}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="location">অবস্থান</Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                  id="location"
                                  type="text"
                                  placeholder="আপনার অবস্থান লিখুন"
                                  value={requestFormData.location}
                                  onChange={(e) =>
                                    setRequestFormData((prev) => ({
                                      ...prev,
                                      location: e.target.value,
                                    }))
                                  }
                                  className="pl-10"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="collection_location">
                                রক্ত প্রয়োজনের স্থান
                              </Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                  id="collection_location"
                                  type="text"
                                  placeholder="রক্ত প্রয়োজনের স্থান লিখুন"
                                  value={requestFormData.collection_location}
                                  onChange={(e) =>
                                    setRequestFormData((prev) => ({
                                      ...prev,
                                      collection_location: e.target.value,
                                    }))
                                  }
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="contact">যোগাযোগের তথ্য</Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                  id="contact"
                                  type="text"
                                  placeholder="ফোন নম্বর বা ইমেইল"
                                  value={requestFormData.contact}
                                  onChange={(e) =>
                                    setRequestFormData((prev) => ({
                                      ...prev,
                                      contact: e.target.value,
                                    }))
                                  }
                                  className="pl-10"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="date_required">
                                প্রয়োজনের তারিখ
                              </Label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                  id="date_required"
                                  type="date"
                                  value={requestFormData.date_required}
                                  onChange={(e) =>
                                    setRequestFormData((prev) => ({
                                      ...prev,
                                      date_required: e.target.value,
                                    }))
                                  }
                                  onClick={(e) =>
                                    (e.target as HTMLInputElement).showPicker()
                                  }
                                  className="pl-10 cursor-pointer"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="reason">
                                রক্তের প্রয়োজনের কারণ
                              </Label>
                              <Textarea
                                id="reason"
                                placeholder="রক্ত কেন প্রয়োজন সে সম্পর্কে বিস্তারিত লিখুন (যেমন: অপারেশন, দুর্ঘটনা, রোগের চিকিৎসা ইত্যাদি)"
                                value={requestFormData.reason}
                                onChange={(e) =>
                                  setRequestFormData((prev) => ({
                                    ...prev,
                                    reason: e.target.value,
                                  }))
                                }
                                rows={4}
                                required
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full medical-gradient text-white hover:opacity-90 py-3"
                            >
                              রক্তের অনুরোধ জমা দিন
                            </Button>
                          </form>
                        </CardContent>
                      </Card>

                      {/* My Blood Requests Table for Users */}
                      <Card>
                        <CardHeader>
                          <CardTitle>আমার রক্তের অনুরোধসমূহ</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {bloodRequests.length === 0 ? (
                            <p className="text-center text-gray-600">
                              কোনো রক্তের অনুরোধ পাওয়া যায়নি।
                            </p>
                          ) : (
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="min-w-[80px]">
                                      রক্তের গ্রুপ
                                    </TableHead>
                                    <TableHead className="min-w-[100px]">
                                      অবস্থান
                                    </TableHead>
                                    <TableHead className="min-w-[120px]">
                                      সংগ্রহের স্থান
                                    </TableHead>
                                    <TableHead className="min-w-[100px]">
                                      যোগাযোগ
                                    </TableHead>
                                    <TableHead className="min-w-[120px]">
                                      প্রয়োজনের তারিখ
                                    </TableHead>
                                    <TableHead className="min-w-[150px]">
                                      কারণ
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {bloodRequests.map((request) => (
                                    <TableRow key={request.id}>
                                      <TableCell className="font-medium">
                                        {request.blood_group}
                                      </TableCell>
                                      <TableCell>{request.location}</TableCell>
                                      <TableCell>
                                        {request.collection_location || "-"}
                                      </TableCell>
                                      <TableCell>{request.contact}</TableCell>
                                      <TableCell>
                                        {formatDate(request.date_required)}
                                      </TableCell>
                                      <TableCell className="max-w-[200px]">
                                        <div
                                          className="truncate"
                                          title={request.reason || "-"}
                                        >
                                          {request.reason || "-"}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Donate Blood Tab */}
          {activeTab === "donate" && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                রক্তদান
              </h2>

              {isAdmin ? (
                <>
                  {/* Admin Panel for Donation Interests */}
                  <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-800">
                        অ্যাডমিন প্যানেল
                      </h3>
                      <Button
                        onClick={openCreateDonationDialog}
                        className="flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>রক্তদানের আগ্রহ যোগ করুন</span>
                      </Button>
                    </div>
                  </div>

                  {/* Admin: Donation Interests table */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>রক্তদানের আগ্রহসমূহ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {donationInterests.length === 0 ? (
                        <p className="text-center text-gray-600">
                          কোনো রক্তদানের আগ্রহ পাওয়া যায়নি।
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="min-w-[120px]">
                                  নাম
                                </TableHead>
                                <TableHead className="min-w-[150px]">
                                  ইমেইল
                                </TableHead>
                                <TableHead className="min-w-[80px]">
                                  রক্তের গ্রুপ
                                </TableHead>
                                <TableHead className="min-w-[120px]">
                                  উপস্থিতির তারিখ
                                </TableHead>
                                <TableHead className="min-w-[150px]">
                                  যোগাযোগের তথ্য
                                </TableHead>
                                <TableHead className="min-w-[120px]">
                                  অ্যাকশন
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {donationInterests.map((donation) => (
                                <TableRow key={donation.id}>
                                  <TableCell className="font-medium">
                                    {donation.user?.name || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {donation.user?.email || "N/A"}
                                  </TableCell>
                                  <TableCell>{donation.blood_group}</TableCell>
                                  <TableCell>
                                    {formatDate(donation.available_date)}
                                  </TableCell>
                                  <TableCell className="max-w-[200px]">
                                    <div
                                      className="truncate"
                                      title={donation.contact_info}
                                    >
                                      {donation.contact_info}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          openEditDonationDialog(donation)
                                        }
                                        className="flex items-center gap-1"
                                      >
                                        <Edit className="w-3 h-3" />
                                        Edit
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          handleDeleteDonationInterest(
                                            donation.id
                                          )
                                        }
                                        className="flex items-center gap-1"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Admin: All Donations + Top Donors */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>সব রেকর্ডকৃত রক্তদান</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {allDonations.length === 0 ? (
                          <p className="text-center text-gray-600">
                            কোনো রক্তদানের রেকর্ড নেই।
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="min-w-[120px]">
                                    নাম
                                  </TableHead>
                                  <TableHead className="min-w-[150px]">
                                    ইমেইল
                                  </TableHead>
                                  <TableHead className="min-w-[80px]">
                                    রক্তের গ্রুপ
                                  </TableHead>
                                  <TableHead className="min-w-[120px]">
                                    রক্তদানের তারিখ
                                  </TableHead>
                                  <TableHead className="min-w-[150px]">
                                    নোট
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {allDonations
                                  .slice()
                                  .sort(
                                    (a, b) =>
                                      new Date(b.donation_date).getTime() -
                                      new Date(a.donation_date).getTime()
                                  )
                                  .map((d) => (
                                    <TableRow key={d.id}>
                                      <TableCell className="font-medium">
                                        {d.user?.name || "N/A"}
                                      </TableCell>
                                      <TableCell>
                                        {d.user?.email || "N/A"}
                                      </TableCell>
                                      <TableCell>{d.blood_group}</TableCell>
                                      <TableCell>
                                        {formatDate(d.donation_date)}
                                      </TableCell>
                                      <TableCell className="max-w-[200px]">
                                        <div
                                          className="truncate"
                                          title={d.notes || "-"}
                                        >
                                          {d.notes || "-"}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Medal className="w-5 h-5 text-yellow-500" />
                          সেরা দাতা
                        </CardTitle>
                        <CardDescription>
                          সর্বাধিক রক্তদান রেকর্ড রয়েছে যাদের
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {topDonors.length === 0 ? (
                          <p className="text-gray-600">ডাটা নেই।</p>
                        ) : (
                          <ol className="space-y-2">
                            {topDonors.map(([email, count], idx) => (
                              <li
                                key={email}
                                className="flex items-center justify-between"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-6 text-right font-semibold">
                                    {idx + 1}.
                                  </span>
                                  <span className="truncate">{email}</span>
                                </span>
                                <Badge>{count} বার</Badge>
                              </li>
                            ))}
                          </ol>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <>
                  {!isAuthenticated ? (
                    <Card className="shadow-xl">
                      <CardContent className="p-8 text-center">
                        <h3 className="text-xl font-semibold mb-4">
                          লগইন প্রয়োজন
                        </h3>
                        <p className="text-gray-600 mb-6">
                          রক্তদানে নিবন্ধনের জন্য লগইন করুন।
                        </p>
                        <Button>
                          <Link to="/login">লগইন</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {/* NEW: Donation Eligibility Section */}
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle>রক্তদানের যোগ্যতা</CardTitle>
                          <CardDescription>
                            আপনার সুরক্ষার জন্য দুই দানের মধ্যে অন্তত ৯০ দিন
                            বিরতি থাকা জরুরি।
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="last_donation_date">
                              আপনার শেষ রক্তদান কবে হয়েছিল?
                            </Label>
                            <Input
                              id="last_donation_date"
                              type="date"
                              value={lastDonationDate}
                              onChange={(e) =>
                                setLastDonationDate(e.target.value)
                              }
                              onClick={(e) =>
                                (e.target as HTMLInputElement).showPicker()
                              }
                              className="cursor-pointer"
                              max={todayISO}
                              required
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="record_last_now"
                              checked={recordLastDonationNow}
                              onCheckedChange={(c) =>
                                setRecordLastDonationNow(!!c)
                              }
                            />
                            <Label htmlFor="record_last_now">
                              শেষ রক্তদানের রেকর্ড সংরক্ষণ করতে চান?
                            </Label>
                          </div>

                          {lastDonationDate && (
                            <div
                              className={`text-sm p-3 rounded-lg ${
                                eligibility.eligible
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {eligibility.eligible ? (
                                <>আপনি রক্তদানের জন্য যোগ্য।</>
                              ) : (
                                <>{eligibility.reason}</>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Donation Interest Form */}
                      <Card className="shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Heart className="w-6 h-6 text-red-500" />
                            <span>রক্তদানের আগ্রহ</span>
                          </CardTitle>
                          <CardDescription>
                            রক্তদানে আপনার আগ্রহ নিবন্ধন করুন—আপনার অবদানই কারও
                            জীবন বাঁচাতে পারে।
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleCreateDonationInterest();
                            }}
                            className="space-y-6"
                          >
                            <div>
                              <Label htmlFor="donor_blood_group">
                                আপনার রক্তের গ্রুপ
                              </Label>
                              <Select
                                value={donateFormData.blood_group}
                                onValueChange={(value) =>
                                  setDonateFormData((prev) => ({
                                    ...prev,
                                    blood_group: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="রক্তের গ্রুপ নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                  {bloodGroups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                      {group}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="available_date">
                                উপস্থিতির তারিখ
                              </Label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                  id="available_date"
                                  type="date"
                                  value={donateFormData.available_date}
                                  onChange={(e) =>
                                    setDonateFormData((prev) => ({
                                      ...prev,
                                      available_date: e.target.value,
                                    }))
                                  }
                                  onClick={(e) =>
                                    (e.target as HTMLInputElement).showPicker()
                                  }
                                  className="pl-10 cursor-pointer"
                                  min={todayISO}
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="contact_info">
                                যোগাযোগের তথ্য
                              </Label>
                              <Textarea
                                id="contact_info"
                                placeholder="ফোন নম্বর, ইমেইলসহ প্রয়োজনীয় তথ্য লিখুন"
                                value={donateFormData.contact_info}
                                onChange={(e) =>
                                  setDonateFormData((prev) => ({
                                    ...prev,
                                    contact_info: e.target.value,
                                  }))
                                }
                                rows={4}
                                required
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full medical-gradient text-white hover:opacity-90 py-3"
                              disabled={!eligibility.eligible}
                              title={
                                !eligibility.eligible
                                  ? eligibility.reason
                                  : undefined
                              }
                            >
                              রক্তদানের আগ্রহ জমা দিন
                            </Button>
                          </form>
                        </CardContent>
                      </Card>

                      {/* My Donation History */}
                      <Card className="mt-8">
                        <CardHeader>
                          <CardTitle>আমার রক্তদানের ইতিহাস</CardTitle>
                          <CardDescription>
                            আপনি আমাদের সাথে যে যে রক্তদানের রেকর্ড করেছেন।
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {myDonations.length === 0 ? (
                            <p className="text-gray-600">
                              এখনও কোনো রক্তদানের রেকর্ড নেই।
                            </p>
                          ) : (
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="min-w-[120px]">
                                      রক্তদানের তারিখ
                                    </TableHead>
                                    <TableHead className="min-w-[80px]">
                                      রক্তের গ্রুপ
                                    </TableHead>
                                    <TableHead className="min-w-[150px]">
                                      নোট
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {myDonations
                                    .slice()
                                    .sort(
                                      (a, b) =>
                                        new Date(b.donation_date).getTime() -
                                        new Date(a.donation_date).getTime()
                                    )
                                    .map((d) => (
                                      <TableRow key={d.id}>
                                        <TableCell className="font-medium">
                                          {formatDate(d.donation_date)}
                                        </TableCell>
                                        <TableCell>{d.blood_group}</TableCell>
                                        <TableCell className="max-w-[200px]">
                                          <div
                                            className="truncate"
                                            title={d.notes || "-"}
                                          >
                                            {d.notes || "-"}
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                রক্ত সংগ্রহ ও সংরক্ষণ সম্বন্ধে প্রশ্নোত্তর
              </h2>
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: রক্তদাতার নির্ধারিত বয়স কত?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: ১৮-৫৭ বছরের যে কোন সুস্থ পুরুষ বা মহিলা রক্তদান
                      করতে পারবেন।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: সুস্থতা বলতে কী বোঝায়?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>পুরুষের ক্ষেত্রে ন্যূনতম ওজন ১০০ পাউন্ড</li>
                      <li>মহিলার ক্ষেত্রে ন্যূনতম ওজন ৯৫ পাউন্ড</li>
                      <li>সিস্টোলিক রক্তচাপ: ১০০ – ১৬০ মিঃ মিঃ পারদচাপ</li>
                      <li>ডায়াস্টোলিক রক্তচাপ: ৬০ – ৯০ মিঃ মিঃ পারদচাপ</li>
                      <li>সম্প্রতি কোনো রোগে আক্রান্ত না থাকা</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: কোন কোন রোগে আক্রান্ত হলে রক্ত সংগ্রহ করা উচিত
                      নয়?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: ম্যালেরিয়া, কালাজ্বর, সিফিলিস, গনোরিয়া,
                      হেপাটাইটিস, এইডস ইত্যাদি রোগে আক্রান্ত হলে রক্ত সংগ্রহ করা
                      উচিত নয়।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: একবার রক্তদানে শরীর থেকে কতটুকু রক্ত সংগ্রহ করা
                      হয়?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: একজন মানুষের দেহে ৫-৬ লিটার রক্ত থাকে, যার মধ্যে
                      মাত্র ৩৫০-৪৬০ সিসি রক্ত সংগ্রহ করা হয়। রক্ত দেওয়ার পর
                      রক্তদাতাকে ১০ মিনিট শুয়ে বিশ্রাম নিতে হয় এবং দুই গ্লাস
                      পানি খেতে হয়।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: রক্ত দেওয়ার পর অতিরিক্ত খাবার কি দরকার আছে?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: না। শুধু রক্তদানের দিন অতিরিক্ত পরিশ্রম হয় এমন কাজ
                      না করাই ভালো।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: রক্ত সংগ্রহের সময় একটি সূঁচ কতবার ব্যবহার করা
                      হয়?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: একটি মাত্র সূঁচ কেবল একবার ব্যবহার করা হয়।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: রক্ত সংরক্ষণের ব্যাগের মধ্যে তরল পদার্থের কাজ কী?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: তরল পদার্থটি রক্ত জমাট বাঁধতে দেয় না।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: কত তাপমাত্রায় রক্ত সংরক্ষণ করা হয়?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: ২°-৮° সেলসিয়াস তাপমাত্রায় রক্ত সংরক্ষণ করা হয়।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: সন্ধানীতে রক্তদানের সুবিধা কী?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>রক্তদাতাকে একটি রক্তদাতা কার্ড প্রদান করা হয়।</li>
                      <li>
                        প্রয়োজনে দেশের যেকোনো সন্ধানী ইউনিট থেকে সমপরিমাণ রক্ত
                        সংগ্রহ করা যায়।
                      </li>
                      <li>
                        বিনামূল্যে রোগ পরীক্ষার রিপোর্ট ও রক্তের গ্রুপ জানা
                        যায়।
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: সংগৃহীত রক্ত সন্ধানী কিভাবে বিতরণ করে?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>
                        হাসপাতালে, অসহায় গরীব রোগীদের মধ্যে বিনা শর্তে বিতরণ
                        করা হয়।
                      </li>
                      <li>
                        ডোনার কার্ডধারীদের যেকোনো সময় রক্ত সরবরাহ করা হয়।
                      </li>
                      <li>বিনিময় ভিত্তিতে রক্ত দেওয়া হয়।</li>
                      <li>জরুরি প্রয়োজনে বিনা শর্তে সরবরাহ করা হয়।</li>
                      <li>
                        <strong>সন্ধানী কোনোভাবেই রক্ত কেনাবেচা করে না।</strong>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: পেশাদার রক্তদাতার রক্ত গ্রহণ করা উচিত নয় কেন?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>তাদের অধিকাংশের হিমোগ্লোবিনের মাত্রা কম থাকে।</li>
                      <li>
                        অনেকে বিভিন্ন রোগে আক্রান্ত বা নেশাজাতীয় দ্রব্য গ্রহণ
                        করে।
                      </li>
                      <li>অনেকেই ৪ মাসের বিরতি না দিয়ে ঘন ঘন রক্ত দেয়।</li>
                      <li>
                        ফলস্বরূপ, এ ধরনের রক্ত রোগীর উপকারের চেয়ে অপকার বেশি
                        করে।
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "registry" && isAdmin && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                রক্তদাতা নিবন্ধন
              </h2>
              <AdminDonorRegistry />
            </div>
          )}

          {activeTab === "pdfs" && isAdmin && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                পিডিএফ ডকুমেন্ট ম্যানেজমেন্ট
              </h2>
              <AdminPDFManager />
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Unified Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {dialogType === "blood" && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {editingBlood
                    ? "রক্তের মজুত সম্পাদনা"
                    : "নতুন রক্তের মজুত তৈরি"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="রক্তের গ্রুপ (যেমন: A+, O-)"
                  value={bloodFormData.group}
                  onChange={(e) =>
                    setBloodFormData({
                      ...bloodFormData,
                      group: e.target.value,
                    })
                  }
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={bloodFormData.available}
                    onCheckedChange={(checked) =>
                      setBloodFormData({
                        ...bloodFormData,
                        available: !!checked,
                      })
                    }
                  />
                  <label htmlFor="available" className="text-sm font-medium">
                    Available
                  </label>
                </div>
                <Button
                  onClick={
                    editingBlood
                      ? handleEditBloodInventory
                      : handleCreateBloodInventory
                  }
                  className="w-full"
                >
                  {editingBlood ? "আপডেট করুন" : "তৈরি করুন"}
                </Button>
              </div>
            </>
          )}

          {dialogType === "request" && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {editingRequest
                    ? "রক্তের অনুরোধ সম্পাদনা"
                    : "নতুন রক্তের অনুরোধ তৈরি"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="blood_group">রক্তের গ্রুপ</Label>
                  <Select
                    value={requestFormData.blood_group}
                    onValueChange={(value) =>
                      setRequestFormData((prev) => ({
                        ...prev,
                        blood_group: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="রক্তের গ্রুপ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">অবস্থান</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="আপনার অবস্থান লিখুন"
                    value={requestFormData.location}
                    onChange={(e) =>
                      setRequestFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="collection_location">সংগ্রহের স্থান</Label>
                  <Input
                    id="collection_location"
                    type="text"
                    placeholder="রক্ত প্রয়োজনের স্থান লিখুন"
                    value={requestFormData.collection_location}
                    onChange={(e) =>
                      setRequestFormData((prev) => ({
                        ...prev,
                        collection_location: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contact">যোগাযোগের তথ্য</Label>
                  <Input
                    id="contact"
                    type="text"
                    placeholder="ফোন নম্বর বা ইমেইল"
                    value={requestFormData.contact}
                    onChange={(e) =>
                      setRequestFormData((prev) => ({
                        ...prev,
                        contact: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date_required">প্রয়োজনের তারিখ</Label>
                  <Input
                    id="date_required"
                    type="date"
                    value={requestFormData.date_required}
                    onChange={(e) =>
                      setRequestFormData((prev) => ({
                        ...prev,
                        date_required: e.target.value,
                      }))
                    }
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reason">রক্তের প্রয়োজনের কারণ</Label>
                  <Textarea
                    id="reason"
                    placeholder="রক্ত কেন প্রয়োজন সে সম্পর্কে বিস্তারিত লিখুন (যেমন: অপারেশন, দুর্ঘটনা, রোগের চিকিৎসা ইত্যাদি)"
                    value={requestFormData.reason}
                    onChange={(e) =>
                      setRequestFormData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    rows={4}
                    required
                  />
                </div>
                <Button
                  onClick={
                    editingRequest
                      ? handleEditBloodRequest
                      : handleCreateBloodRequest
                  }
                  className="w-full"
                >
                  {editingRequest ? "আপডেট করুন" : "তৈরি করুন"}
                </Button>
              </div>
            </>
          )}

          {dialogType === "donate" && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {editingDonation
                    ? "রক্তদানের আগ্রহ সম্পাদনা"
                    : "নতুন রক্তদানের আগ্রহ তৈরি"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="blood_group">রক্তের গ্রুপ</Label>
                  <Select
                    value={donateFormData.blood_group}
                    onValueChange={(value) =>
                      setDonateFormData((prev) => ({
                        ...prev,
                        blood_group: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="রক্তের গ্রুপ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="available_date">উপস্থিতির তারিখ</Label>
                  <Input
                    id="available_date"
                    type="date"
                    value={donateFormData.available_date}
                    onChange={(e) =>
                      setDonateFormData((prev) => ({
                        ...prev,
                        available_date: e.target.value,
                      }))
                    }
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_info">যোগাযোগের তথ্য</Label>
                  <Textarea
                    id="contact_info"
                    placeholder="ফোন নম্বর, ইমেইলসহ প্রয়োজনীয় তথ্য লিখুন"
                    value={donateFormData.contact_info}
                    onChange={(e) =>
                      setDonateFormData((prev) => ({
                        ...prev,
                        contact_info: e.target.value,
                      }))
                    }
                    rows={4}
                    required
                  />
                </div>
                <Button
                  onClick={
                    editingDonation
                      ? handleEditDonationInterest
                      : handleCreateDonationInterest
                  }
                  className="w-full"
                >
                  {editingDonation ? "আপডেট করুন" : "তৈরি করুন"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Gallery Lightbox */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/90 border-0">
          <div className="relative">
            <img
              src={bloodImgUrl(bloodGalleryFiles[activeImgIndex])}
              alt={`বড় ছবি ${activeImgIndex + 1}`}
              className="w-full max-h-[80vh] object-contain bg-black"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-4 py-2">
              {bloodGalleryFiles[activeImgIndex]}
            </div>
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
              aria-label="পূর্ববর্তী ছবি"
            >
              ‹
            </button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
              aria-label="পরবর্তী ছবি"
            >
              ›
            </button>
            <div className="flex gap-2 overflow-x-auto p-3 bg-black/60">
              {bloodGalleryFiles.map((file, i) => (
                <button
                  key={file + i}
                  onClick={() => setActiveImgIndex(i)}
                  className={`relative h-14 w-20 flex-shrink-0 rounded overflow-hidden border ${
                    i === activeImgIndex
                      ? "border-red-500"
                      : "border-transparent"
                  }`}
                  aria-label={`ছবি ${i + 1}-এ যান`}
                >
                  <img
                    src={bloodImgUrl(file)}
                    alt={`থাম্ব ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BloodInventoryPage;
