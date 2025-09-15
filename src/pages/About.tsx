import React, { useEffect, useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, Users, Heart, Activity, Shield, Clock } from "lucide-react";
import {
  aboutAPI,
  adminAPI,
  type About,
  Achievement,
  TeamMember,
  Mission,
} from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Badge } from "@/components/ui/badge";
const milestones = [
  {
    date: "৬ মে, ২০০৬",
    title: "কলেজ আত্মপ্রকাশ",
    detail:
      "দেশের ১৪তম সরকারি মেডিকেল কলেজ হিসেবে আত্মপ্রকাশ করে তৎকালীন বেগম খালেদা জিয়া মেডিকেল কলেজ (বর্তমান শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ)। মানবসেবার মহান ব্রত নিয়ে ভর্তি হন একদল উদ্যমী প্রাণ।",
  },
  {
    date: "২৩ জুন, ২০০৭",
    title: "ইউনিট অনুমোদন",
    detail:
      "শের-ই-বাংলা মেডিকেল কলেজে অনুষ্ঠিত সন্ধানীর ২৬তম কেন্দ্রীয় মাসিক সভায় আমাদের মেডিকেলে ইউনিট খোলার অনুমোদন মেলে— আবেগঘন সেই ভোর ৫টায় হাবিব ভাই ও মেহেদী ভাই ঘোষণা দেন: জন্ম নিল সন্ধানীর ১৮তম ইউনিট।",
  },
  {
    date: "২৭ মার্চ, ২০০৮",
    title: "পূর্ণাঙ্গ কমিটি ঘোষণা",
    detail:
      "সন্ধানী কেন্দ্রীয় পরিষদের তত্ত্বাবধানে পূর্ণাঙ্গ কমিটি ঘোষণা করা হয়— সভাপতি তানভীর ভাই, সহ-সভাপতি সাব্বির ভাই এবং সাধারণ সম্পাদক ইশতিয়াক ভাই।",
  },
  {
    date: "২০০৯",
    title: "ইউনিটের নাম পরিবর্তন",
    detail:
      "কলেজের নাম পরিবর্তনের পর সন্ধানী কেন্দ্রীয় পরিষদের ২০০৯–১০ কার্যকরী পরিষদের ৩য় মাসিক সভায় ইউনিটের নাম পরিবর্তিত হয়— বেগম খালেদা জিয়া মেডিকেল কলেজ ইউনিট থেকে শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ ইউনিট।",
  },
];
const About = () => {
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
  const [about, setAbout] = useState<About | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "about" | "achievement" | "teamMember" | "mission" | null
  >(null);
  const [editingItem, setEditingItem] = useState<
    About | Achievement | TeamMember | Mission | null
  >(null);
  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const quillRef = useRef<ReactQuill>(null);

  // Icon mapping for achievements
  const iconMap: { [key: string]: React.ComponentType<{ className: string }> } =
    {
      Award,
      Users,
      Heart,
      Activity,
      Shield,
      Clock,
    };
  const bloodGalleryFiles: string[] = [
    "WhatsApp Image 2025-09-11 at 12.51.11 PM.jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.09 PM.jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.07 PM (1).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.07 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM (1).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM (3).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM.jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.18 PM (1).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.18 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.18 PM.jpeg",
  ];

  const bloodImgUrl = (name: string) =>
    `/gallery/${encodeURIComponent(name)}`;
  // Icon options for dropdown
  const iconOptions = Object.keys(iconMap);

  // Quill toolbar configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutData, achievementsData, teamData, missionData] =
          await Promise.all([
            aboutAPI.getAbout(),
            aboutAPI.getAchievements(),
            aboutAPI.getTeamMembers(),
            aboutAPI.getMission(),
          ]);
        setAbout(aboutData[0] || null);
        setAchievements(achievementsData);
        setTeam(teamData);
        setMission(missionData[0] || null);
        if (aboutData[0]?.image) {
          console.log("About image URL:", aboutData[0].image);
        } else {
          console.log("No About image provided by backend, using default.");
        }
      } catch (error: any) {
        console.error("Failed to load About page data:", error);
        toast({
          title: "Error",
          description: "Failed to load About page data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreate = async () => {
    try {
      const formDataPayload = new FormData();
      for (const key in formData) {
        formDataPayload.append(key, formData[key]);
      }
      if (
        (dialogType === "teamMember" || dialogType === "about") &&
        imageFile
      ) {
        formDataPayload.append("image", imageFile);
      }

      console.log("FormData contents:");
      for (const [key, value] of formDataPayload.entries()) {
        console.log(`${key}: ${value}`);
      }

      if (dialogType === "about") {
        await adminAPI.about.create(formDataPayload);
        toast({
          title: "Success",
          description: "About section created successfully",
        });
        const aboutResponse = await aboutAPI.getAbout();
        setAbout(aboutResponse[0] || null);
      } else if (dialogType === "achievement") {
        await adminAPI.achievements.create(formData);
        toast({
          title: "Success",
          description: "Achievement created successfully",
        });
        const achievementsResponse = await aboutAPI.getAchievements();
        setAchievements(achievementsResponse);
      } else if (dialogType === "teamMember") {
        await adminAPI.teamMembers.create(formDataPayload);
        toast({
          title: "Success",
          description: "Team Member created successfully",
        });
        const teamResponse = await aboutAPI.getTeamMembers();
        setTeam(teamResponse);
      } else if (dialogType === "mission") {
        await adminAPI.mission.create(formData);
        toast({
          title: "Success",
          description: "Mission section created successfully",
        });
        const missionResponse = await aboutAPI.getMission();
        setMission(missionResponse[0] || null);
      }
      setDialogOpen(false);
      setFormData({});
      setDialogType(null);
      setImageFile(null);
    } catch (error: any) {
      console.error(`Failed to create ${dialogType}:`, error);
      toast({
        title: "Error",
        description: `Failed to create ${dialogType}: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editingItem || !dialogType) return;
    try {
      const formDataPayload = new FormData();
      for (const key in formData) {
        formDataPayload.append(key, formData[key]);
      }
      if (
        (dialogType === "teamMember" || dialogType === "about") &&
        imageFile
      ) {
        formDataPayload.append("image", imageFile);
      }

      console.log("FormData contents for update:");
      for (const [key, value] of formDataPayload.entries()) {
        console.log(`${key}: ${value}`);
      }

      if (dialogType === "about") {
        await adminAPI.about.update(editingItem.id, formDataPayload);
        toast({
          title: "Success",
          description: "About section updated successfully",
        });
        const aboutResponse = await aboutAPI.getAbout();
        setAbout(aboutResponse[0] || null);
      } else if (dialogType === "achievement") {
        await adminAPI.achievements.update(editingItem.id, formData);
        toast({
          title: "Success",
          description: "Achievement updated successfully",
        });
        const achievementsResponse = await aboutAPI.getAchievements();
        setAchievements(achievementsResponse);
      } else if (dialogType === "teamMember") {
        await adminAPI.teamMembers.update(editingItem.id, formDataPayload);
        toast({
          title: "Success",
          description: "Team Member updated successfully",
        });
        const teamResponse = await aboutAPI.getTeamMembers();
        setTeam(teamResponse);
      } else if (dialogType === "mission") {
        await adminAPI.mission.update(editingItem.id, formData);
        toast({
          title: "Success",
          description: "Mission section created successfully",
        });
        const missionResponse = await aboutAPI.getMission();
        setMission(missionResponse[0] || null);
      }
      setDialogOpen(false);
      setEditingItem(null);
      setFormData({});
      setDialogType(null);
      setImageFile(null);
    } catch (error: any) {
      console.error(`Failed to update ${dialogType}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${dialogType}: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (
    type: "about" | "achievement" | "teamMember" | "mission",
    id: number
  ) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      if (type === "about") {
        await adminAPI.about.delete(id);
        toast({
          title: "Success",
          description: "About section deleted successfully",
        });
        const aboutResponse = await aboutAPI.getAbout();
        setAbout(aboutResponse[0] || null);
      } else if (type === "achievement") {
        await adminAPI.achievements.delete(id);
        toast({
          title: "Success",
          description: "Achievement deleted successfully",
        });
        const achievementsResponse = await aboutAPI.getAchievements();
        setAchievements(achievementsResponse);
      } else if (type === "teamMember") {
        await adminAPI.teamMembers.delete(id);
        toast({
          title: "Success",
          description: "Team Member deleted successfully",
        });
        const teamResponse = await aboutAPI.getTeamMembers();
        setTeam(teamResponse);
      } else if (type === "mission") {
        await adminAPI.mission.delete(id);
        toast({
          title: "Success",
          description: "Mission section deleted successfully",
        });
        const missionResponse = await aboutAPI.getMission();
        setMission(missionResponse[0] || null);
      }
    } catch (error: any) {
      console.error(`Failed to delete ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = (
    type: "about" | "achievement" | "teamMember" | "mission"
  ) => {
    setEditingItem(null);
    setDialogType(type);
    setFormData(
      type === "about"
        ? {
            title: "",
            description: "",
            years_experience: 0,
            patients_served: "",
            satisfaction_rate: "",
          }
        : type === "achievement"
        ? { title: "", description: "", icon: "Award" }
        : type === "teamMember"
        ? { name: "", role: "", specialty: "" }
        : { title: "", description: "", phone: "", email: "", address: "" }
    );
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEditDialog = (
    type: "about" | "achievement" | "teamMember" | "mission",
    item: About | Achievement | TeamMember | Mission
  ) => {
    setEditingItem(item);
    setDialogType(type);
    setFormData(
      type === "about"
        ? {
            title: (item as About).title,
            description: (item as About).description,
            years_experience: (item as About).years_experience,
            patients_served: (item as About).patients_served,
            satisfaction_rate: (item as About).satisfaction_rate,
          }
        : type === "achievement"
        ? {
            title: (item as Achievement).title,
            description: (item as Achievement).description,
            icon: (item as Achievement).icon,
          }
        : type === "teamMember"
        ? {
            name: (item as TeamMember).name,
            role: (item as TeamMember).role,
            specialty: (item as TeamMember).specialty,
          }
        : {
            title: (item as Mission).title,
            description: (item as Mission).description,
            phone: (item as Mission).phone,
            email: (item as Mission).email,
            address: (item as Mission).address,
          }
    );
    setImageFile(null);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Loading...
              </h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section (About) */}
      <section className="bg-gradient-to-br from-blue-50 to-white section-padding">
        <div className="max-w-7xl mx-auto">
          {isAdmin && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-blue-800">
                  Admin Actions - About
                </h3>
                <div className="flex space-x-2">
                  {about && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog("about", about)}
                      >
                        <Edit className="w-3 h-3 mr-2" />
                        Edit About
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete("about", about.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete About
                      </Button>
                    </>
                  )}
                  {!about && (
                    <Button size="sm" onClick={() => openCreateDialog("about")}>
                      <Plus className="w-3 h-3 mr-2" />
                      Create About
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {about?.title || "About Sandhani"}
              </h1>
              <div className="w-24 h-1 medical-gradient rounded-full mb-8"></div>

              <div className="text-xl text-gray-600 mb-6 leading-relaxed">
                {about?.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: about.description }}
                  />
                ) : (
                  <p>
                    Sandhani is a medical students' organization dedicated to
                    serving humanity through voluntary blood donation,
                    posthumous eye donation, and support for the
                    underprivileged. For decades, we have worked tirelessly to
                    uplift communities and save lives.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {about?.patients_served || "50K+"}
                  </div>
                  <div className="text-sm text-gray-600">Patients Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {about?.years_experience || "25+"}
                  </div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {about?.satisfaction_rate || "100%"}
                  </div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            <div className="animate-slide-in-left">
              <img
                src={
                  about?.image ||
                  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                }
                alt="Sandhani team"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      {/* History Section */}
      <section id="history" className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              আমাদের ইউনিট প্রতিষ্ঠার ইতিহাস
            </h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mt-4"></div>
          </div>

          {/* Narrative Card */}
          <Card className="border-0 shadow-md mb-8">
            <CardHeader>
              <CardTitle className="text-xl">একটি স্বপ্নের শুরু</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                ৬ মে, ২০০৬ সালে দেশের ১৪তম সরকারি মেডিকেল কলেজ হিসেবে আত্মপ্রকাশ
                করে তৎকালীন বেগম খালেদা জিয়া মেডিকেল কলেজ (বর্তমান শহীদ
                সোহরাওয়ার্দী মেডিকেল কলেজ)। মানবসেবার মহান ব্রত নিয়ে এখানে ভর্তি
                হয় একদল উদ্যমী প্রাণ।
              </p>
              <p>
                কিছু শিক্ষার্থী রোগীর কান্না ও অসহায়ের আহাজারিতে ব্যথিত হয়ে
                এগিয়ে আসে রক্তদানে। শয্যাশায়ী রোগীর প্রয়োজনে রক্ত দিতে তারা কখনও
                পিছপা হয়নি। এই ত্যাগ ও উপলব্ধি থেকেই তারা ছুটে যায় ঢাকা মেডিকেল
                কলেজের সন্ধানী ইউনিটে। সেখানে তাপস ভাই, সজীব ভাই, চয়ন ভাই, অভি
                ভাই, সানোয়ার ভাইয়ের মতো প্রাণবন্ত ব্যক্তিত্বরা তাদেরকে
                অনুপ্রাণিত করেন।
              </p>
              <p>
                এরপর আমাদের মেডিকেলে সন্ধানী প্রতিষ্ঠার উদ্যোগ নেন ঢাকা মেডিকেল
                কলেজের কাউসার ভাইয়ের সহযোগিতায় সাব্বির ভাই। অবশেষে ২৩ জুন, ২০০৭
                তারিখে, শের-ই-বাংলা মেডিকেল কলেজে অনুষ্ঠিত সন্ধানীর ২৬তম
                কেন্দ্রীয় মাসিক সভায় আমাদের মেডিকেলে ইউনিট খোলার অনুমোদন মেলে।
                দীর্ঘ প্রতীক্ষার পর ভোর ৫টায় আবেগে আপ্লুত হয়ে হাবিব ভাই ও মেহেদী
                ভাই ঘোষণা দেন— জন্ম নিল সন্ধানীর ১৮তম ইউনিট।
              </p>
              <p>
                শুরু হলো আমাদের পথচলা। প্রথমে ১৫ সদস্যের আহ্বায়ক কমিটি গঠিত হয়।
                পরে ২৭ মার্চ, ২০০৮ তারিখে সন্ধানী কেন্দ্রীয় পরিষদের তত্ত্বাবধানে
                পূর্ণাঙ্গ কমিটি ঘোষণা করা হয়— সভাপতি তানভীর ভাই, সহ-সভাপতি
                সাব্বির ভাই এবং সাধারণ সম্পাদক ইশতিয়াক ভাই।
              </p>
              <p>
                ২০০৯ সালে কলেজের নাম পরিবর্তনের পর সন্ধানী কেন্দ্রীয় পরিষদের
                ২০০৯-১০ কার্যকরী পরিষদের ৩য় মাসিক সভায় আমাদের ইউনিটের নামও
                আনুষ্ঠানিকভাবে পরিবর্তিত হয়— বেগম খালেদা জিয়া মেডিকেল কলেজ ইউনিট
                থেকে শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ ইউনিট।
              </p>
              <Separator />
              <p className="text-lg font-semibold text-gray-900">
                আজ এক যুগের বেশি সময় ধরে আমরা একঝাঁক নিবেদিতপ্রাণ তরুণ-তরুণীর
                স্বপ্নকে বাস্তবে রূপ দিচ্ছি। সন্ধানীর এই এগিয়ে চলার লক্ষ্য—
                মানুষের চোখের কান্না মুছে ফেলা আর মুখে এক গাল হাসি ফোটানো। 🌸
              </p>
            </CardContent>
          </Card>

          {/* Timeline / Milestones */}
          <div className="bg-gray-50 border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Milestones</Badge>
              <span className="text-sm text-gray-500">
                সময়ের ধারায় গুরুত্বপূর্ণ পদক্ষেপ
              </span>
            </div>

            <ol className="relative border-s pl-6 space-y-6">
              {milestones.map((m, idx) => (
                <li key={idx} className="ms-4">
                  <span className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-red-500 to-red-400"></span>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{m.date}</span>
                    <span className="text-gray-400">•</span>
                    <span>{m.title}</span>
                  </div>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {m.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Values & Achievements */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values & Achievements
            </h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are committed to excellence in everything we do, from patient
              care to community service.
            </p>
          </div>
          {isAdmin && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-blue-800">
                  Admin Actions - Achievements
                </h3>
                <Button
                  size="sm"
                  onClick={() => openCreateDialog("achievement")}
                >
                  <Plus className="w-3 h-3 mr-2" />
                  Create Achievement
                </Button>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement) => {
              const IconComponent = iconMap[achievement.icon] || Award;
              return (
                <Card
                  key={achievement.id}
                  className="medical-card-hover border-0 shadow-lg text-center h-full"
                >
                  <CardHeader className="pb-4">
                    <div className="medical-gradient w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {achievement.description}
                    </CardDescription>
                    {isAdmin && (
                      <div className="mt-4 flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openEditDialog("achievement", achievement)
                          }
                        >
                          <Edit className="w-3 h-3 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete("achievement", achievement.id)
                          }
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Leadership Team
            </h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated medical students who lead Sandhani’s mission to
              serve humanity.
            </p>
          </div>
          {isAdmin && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-blue-800">
                  Admin Actions - Team Members
                </h3>
                <Button
                  size="sm"
                  onClick={() => openCreateDialog("teamMember")}
                >
                  <Plus className="w-3 h-3 mr-2" />
                  Create Team Member
                </Button>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card
                key={member.id}
                className="medical-card-hover border-0 shadow-lg text-center overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={
                      member.images[0]?.image ||
                      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    }
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-gray-900">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-red-600 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.specialty}</p>
                  {isAdmin && (
                    <div className="mt-4 flex justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog("teamMember", member)}
                      >
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete("teamMember", member.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto text-center">
          {isAdmin && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-blue-800">
                  Admin Actions - Mission
                </h3>
                <div className="flex space-x-2">
                  {mission && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog("mission", mission)}
                      >
                        <Edit className="w-3 h-3 mr-2" />
                        Edit Mission
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete("mission", mission.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete Mission
                      </Button>
                    </>
                  )}
                  {!mission && (
                    <Button
                      size="sm"
                      onClick={() => openCreateDialog("mission")}
                    >
                      <Plus className="w-3 h-3 mr-2" />
                      Create Mission
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {mission?.title || "সন্ধানীর লক্ষ্য ও উদ্দেশ্য"}
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-noto-sans-bengali">
              {mission?.description ||
                "বিভিন্ন সেবামূলক কাজের মাধ্যমে আর্তমানবতার সেবার মানসিকতা গড়ে তোলা।"}
            </p>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Us
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                <div>
                  <strong>Phone:</strong>
                  <br />
                  {mission?.phone || "+880 123 456 7890"}
                </div>
                <div>
                  <strong>Email:</strong>
                  <br />
                  {mission?.email || "info@sandhani.org"}
                </div>
                <div>
                  <strong>Address:</strong>
                  <br />
                  {mission?.address ||
                    "Dhaka Medical College, Dhaka, Bangladesh"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dialog for Create/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? `Edit ${dialogType}` : `Create ${dialogType}`}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? `Update the ${dialogType} details below.`
                : `Fill in the details to create a new ${dialogType}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {dialogType === "about" && (
              <>
                <Input
                  placeholder="Enter About title (e.g., About Sandhani)"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <ReactQuill
                  ref={quillRef}
                  value={formData.description || ""}
                  onChange={(content) =>
                    setFormData({ ...formData, description: content })
                  }
                  modules={quillModules}
                  className="bg-white border border-gray-200 rounded"
                  placeholder="Write your About description here..."
                />
                <Input
                  type="number"
                  placeholder="Enter years of experience (e.g., 25)"
                  value={formData.years_experience || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      years_experience: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <Input
                  placeholder="Enter patients served (e.g., 50K+)"
                  value={formData.patients_served || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      patients_served: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Enter satisfaction rate (e.g., 98%)"
                  value={formData.satisfaction_rate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      satisfaction_rate: e.target.value,
                    })
                  }
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  placeholder="Upload About image"
                />
              </>
            )}
            {dialogType === "achievement" && (
              <>
                <Input
                  placeholder="Enter achievement title (e.g., Blood Donation Campaign Success)"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Enter achievement description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
                <Select
                  value={formData.icon || "Award"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, icon: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {dialogType === "teamMember" && (
              <>
                <Input
                  placeholder="Enter team member name (e.g., Dr. John Doe)"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Enter role (e.g., President)"
                  value={formData.role || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                />
                <Input
                  placeholder="Enter specialty (e.g., Medical Student)"
                  value={formData.specialty || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  placeholder="Upload team member image"
                />
              </>
            )}
            {dialogType === "mission" && (
              <>
                <Input
                  placeholder="Enter mission title (e.g., সন্ধানীর লক্ষ্য ও উদ্দেশ্য)"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Enter mission description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
                <Input
                  placeholder="Enter phone number (e.g., +880 123 456 7890)"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <Input
                  placeholder="Enter email (e.g., info@sandhani.org)"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Enter address (e.g., Dhaka Medical College, Dhaka, Bangladesh)"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={2}
                />
              </>
            )}
            <Button
              onClick={editingItem ? handleEdit : handleCreate}
              className="w-full"
            >
              {editingItem ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              আমাদের কার্যক্রম – ছবি
            </h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mt-4"></div>
            <p className="text-gray-600 mt-4">
              সাম্প্রতিক ক্যাম্প ও প্রোগ্রামের কিছু মুহূর্ত।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {bloodGalleryFiles.map((file, idx) => (
              <button
                key={file + idx}
                onClick={() => openGalleryAt(idx)}
                className="group block overflow-hidden rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={`Open image ${idx + 1}`}
              >
                <img
                  src={bloodImgUrl(file)}
                  alt={`Blood program ${idx + 1}`}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/90 border-0">
          <div className="relative">
            {/* Image */}
            <img
              src={bloodImgUrl(bloodGalleryFiles[activeImgIndex])}
              alt={`Blood program large ${activeImgIndex + 1}`}
              className="w-full max-h-[80vh] object-contain bg-black"
            />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-4 py-2">
              {bloodGalleryFiles[activeImgIndex]}
            </div>

            {/* Prev / Next */}
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
              aria-label="Next image"
            >
              ›
            </button>

            {/* Thumbnails (optional) */}
            <div className="flex gap-2 overflow-x-auto p-3 bg-black/60">
              {bloodGalleryFiles.map((file, i) => (
                <button
                  key={file + i}
                  onClick={() => setActiveImgIndex(i)}
                  className={`relative h-14 w-20 flex-shrink-0 rounded overflow-hidden border
                    ${
                      i === activeImgIndex
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  aria-label={`Go to image ${i + 1}`}
                >
                  <img
                    src={bloodImgUrl(file)}
                    alt={`Thumb ${i + 1}`}
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

export default About;
