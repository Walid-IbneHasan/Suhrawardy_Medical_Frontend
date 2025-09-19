import { useEffect, useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import { eventAPI, Event, adminAPI } from "@/utils/api";
import { Calendar, MapPin, Clock, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// --- Small helper: prefix media host when backend returns /media/relative/paths ---
const withMediaHost = (src: string) => {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  // ensure leading slash
  const path = src.startsWith("/") ? src : `/${src}`;
  return `http://localhost:8000${path}`;
};

// --- Reusable image slider for event cards ---
const EventCarousel: React.FC<{
  images: Array<string | { image: string }>;
  alt: string;
  heightClass?: string; // e.g. "h-48"
}> = ({ images, alt, heightClass = "h-48" }) => {
  const normalized = (images || [])
    .map((im) => (typeof im === "string" ? im : im?.image))
    .filter(Boolean) as string[];

  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i === 0 ? normalized.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === normalized.length - 1 ? 0 : i + 1));

  const current = normalized[idx];

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden`}>
      <img
        src={
          current
            ? withMediaHost(current)
            : "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=60"
        }
        alt={alt}
        className="w-full h-full object-cover"
      />

      {normalized.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="পূর্বের ছবি"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="পরের ছবি"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
            {normalized.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === idx ? "bg-white" : "bg-white/60 hover:bg-white"
                }`}
                aria-label={`ছবি ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Events = () => {
  // Data
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    is_active: true,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const quillRef = useRef<ReactQuill>(null);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  // Pick up "edit" navigation from EventDetail
  useEffect(() => {
    const state = location.state as { event?: Event };
    if (state?.event) {
      const ev = state.event;
      setEditingEvent(ev);
      setFormData({
        title: ev.title,
        description: ev.description,
        location: ev.location,
        date: ev.date.substring(0, 16),
        is_active: (ev as any).is_active ?? true,
      });
      setImageFiles([]);
      setDialogOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadEvents = async () => {
    try {
      const [u, p] = await Promise.all([
        // assumes you added these endpoints
        eventAPI.getUpcoming(),
        eventAPI.getPast(),
      ]);
      setUpcoming(u);
      setPast(p);
    } catch (error) {
      console.error(error);
      toast({
        title: "ত্রুটি",
        description: "ইভেন্ট লোড করা যায়নি।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Admin actions ---
  const handleCreateEvent = async () => {
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("location", formData.location);
      fd.append("date", formData.date);
      fd.append("is_active", String(formData.is_active));
      imageFiles.forEach((file) => fd.append("image_files", file));

      await adminAPI.events.create(fd);
      toast({ title: "সফল", description: "ইভেন্ট তৈরি হয়েছে।" });
      setDialogOpen(false);
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        location: "",
        date: "",
        is_active: true,
      });
      setImageFiles([]);
      await loadEvents();
    } catch (e) {
      console.error(e);
      toast({
        title: "ত্রুটি",
        description: "ইভেন্ট তৈরি ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent) return;
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("location", formData.location);
      fd.append("date", formData.date);
      fd.append("is_active", String(formData.is_active));
      imageFiles.forEach((file) => fd.append("image_files", file));

      await adminAPI.events.update(editingEvent.id, fd);
      toast({ title: "সফল", description: "ইভেন্ট আপডেট হয়েছে।" });
      setDialogOpen(false);
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        location: "",
        date: "",
        is_active: true,
      });
      setImageFiles([]);
      await loadEvents();
    } catch (e) {
      console.error(e);
      toast({
        title: "ত্রুটি",
        description: "ইভেন্ট আপডেট ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে ইভেন্টটি মুছে ফেলতে চান?")) return;
    try {
      await adminAPI.events.delete(id);
      toast({ title: "সফল", description: "ইভেন্ট মুছে ফেলা হয়েছে।" });
      await loadEvents();
    } catch (e) {
      console.error(e);
      toast({
        title: "ত্রুটি",
        description: "ইভেন্ট মুছতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      date: "",
      is_active: true,
    });
    setImageFiles([]);
    setDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.substring(0, 16),
      is_active: (event as any).is_active ?? true,
    });
    setImageFiles([]);
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setImageFiles((prev) => [...prev, ...Array.from(files)]);
  };
  const removeImage = (i: number) =>
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                আসন্ন আয়োজন
              </h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            আসন্ন আয়োজন
          </h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            স্বাস্থ্য শিবির, শিক্ষামূলক সেমিনার আর কমিউনিটি ওয়েলনেস প্রোগ্রামে
            যোগ দিন—আমাদের সবার সুস্বাস্থ্য আর মঙ্গলেই সব আয়োজন।
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Admin */}
          {isAdmin && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-blue-800">
                  অ্যাডমিন প্যানেল
                </h3>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={openCreateDialog}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ইভেন্ট যোগ করুন</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingEvent ? "ইভেন্ট আপডেট" : "নতুন ইভেন্ট তৈরি"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingEvent
                          ? "নিচের তথ্য আপডেট করুন।"
                          : "নতুন ইভেন্ট তৈরির জন্য তথ্য দিন।"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="ইভেন্টের শিরোনাম"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                      <ReactQuill
                        ref={quillRef}
                        value={formData.description}
                        onChange={(html) =>
                          setFormData({ ...formData, description: html })
                        }
                        modules={quillModules}
                        className="bg-white border border-gray-200 rounded"
                        placeholder="ইভেন্টের বিবরণ লিখুন..."
                      />
                      <Input
                        placeholder="স্থান"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                      />

                      {/* Active toggle */}
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_active: e.target.checked,
                            })
                          }
                        />
                        <span>সক্রিয় (আসন্ন আয়োজন-এ দেখাও)</span>
                      </label>

                      {/* Upload preview */}
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="border-dashed border-2 border-gray-300 p-2"
                        />
                        {imageFiles.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {imageFiles.map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                                <button
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                >
                                  ✕
                                </button>
                                <p className="text-xs truncate">{file.name}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={
                          editingEvent ? handleEditEvent : handleCreateEvent
                        }
                        className="w-full"
                      >
                        {editingEvent ? "আপডেট করুন" : "তৈরি করুন"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          {upcoming.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                এই মুহূর্তে কোনো আসন্ন আয়োজন নেই। শিগগিরই আবার দেখুন!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcoming.map((ev) => {
                const { date, time } = formatDate(ev.date);
                return (
                  <Card
                    key={ev.id}
                    className="medical-card-hover border-0 shadow-lg overflow-hidden h-full"
                  >
                    <div className="relative">
                      <EventCarousel images={ev.images} alt={ev.title} />
                      <div className="absolute top-4 left-4">
                        <Badge className="medical-gradient text-white">
                          আয়োজন
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-4">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        {date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        {time}
                      </div>
                      <CardTitle className="text-xl text-gray-900 leading-tight">
                        <Link
                          to={`/events/${ev.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {ev.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <CardDescription className="text-gray-600 leading-relaxed mb-4 flex-1">
                        <div
                          dangerouslySetInnerHTML={{ __html: ev.description }}
                        />
                      </CardDescription>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-sm text-blue-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {ev.location}
                        </div>

                        {isAdmin && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(ev)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              সম্পাদনা
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteEvent(ev.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              মুছে ফেলুন
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Programs article (unchanged) */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900">
                সন্ধানীর কর্মসূচী
              </CardTitle>
              <CardDescription className="text-gray-600">
                আর্তমানবতার সেবায় আমাদের ধারাবাহিক উদ্যোগ
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed space-y-6 font-noto-sans-bengali">
              <p>
                প্রতিষ্ঠালগ্ন থেকেই সন্ধানী মানবকল্যাণে চারটি প্রধান কর্মসূচী
                বাস্তবায়ন করে আসছে। আমাদের প্রতিটি কার্যক্রম স্বেচ্ছাসেবার
                চেতনা ও বিজ্ঞানভিত্তিক জনস্বাস্থ্য ভাবনার ওপর দাঁড়িয়ে পরিচালিত
                হয়।
              </p>
              <ol className="list-decimal pl-6 space-y-3 text-base">
                <li>
                  জনগণকে <strong>স্বেচ্ছায় রক্তদানে</strong> উৎসাহ প্রদান ও
                  উদ্বুদ্ধকরণ।
                </li>
                <li>
                  জনগণকে <strong>মরণোত্তর চক্ষুদানে</strong> উৎসাহ প্রদান ও
                  উদ্বুদ্ধকরণ।
                </li>
                <li>
                  হাসপাতালের গরীব ও অসহায় রোগীদের{" "}
                  <strong>আর্থিক ও অন্যান্য সাহায্য</strong> প্রদান (যেমন: রক্ত,
                  ঔষধ, পথ্য ইত্যাদি)।
                </li>
                <li>
                  মেডিকেল ও ডেন্টাল কলেজের গরীব ছাত্র-ছাত্রীদের{" "}
                  <strong>মাসিক বা এককালীন</strong> আর্থিক ও অন্যান্য সাহায্য
                  প্রদান।
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Past with slider */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              আমাদের পূর্ববর্তী কার্যক্রম
            </h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mt-4"></div>
            <p className="text-gray-600 mt-4">
              অতীতের কিছু স্মরণীয় উদ্যোগ যা আমাদের অঙ্গীকারের প্রমাণ বহন করে।
            </p>
          </div>

          {past.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              এখনও কোনো পূর্ববর্তী কার্যক্রম দেখানোর মতো নেই।
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {past.map((ev) => {
                const { date, time } = formatDate(ev.date);
                return (
                  <Card
                    key={ev.id}
                    className="border-0 shadow-lg overflow-hidden h-full"
                  >
                    <div className="relative">
                      <EventCarousel images={ev.images} alt={ev.title} />
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className="bg-white/90">
                          সম্পন্ন
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-4">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        {date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        {time}
                      </div>
                      <CardTitle className="text-xl text-gray-900 leading-tight">
                        <Link
                          to={`/events/${ev.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {ev.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <CardDescription className="text-gray-600 leading-relaxed mb-4 flex-1">
                        <div
                          dangerouslySetInnerHTML={{ __html: ev.description }}
                        />
                      </CardDescription>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-sm text-blue-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {ev.location}
                        </div>

                        {isAdmin && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(ev)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              সম্পাদনা
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteEvent(ev.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              মুছে ফেলুন
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
