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
import { Calendar, MapPin, Clock, Plus, Edit, Trash2, X } from "lucide-react";
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
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import {
  Dialog as ShadDialog,
  DialogContent as ShadDialogContent,
} from "@/components/ui/dialog";

type PastEvent = {
  title: string;
  description: string;
  images: string[];
};

const ImageLightbox: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  src: string;
  alt?: string;
}> = ({ open, onOpenChange, src, alt }) => {
  return (
    <ShadDialog open={open} onOpenChange={onOpenChange}>
      <ShadDialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
        <div className="relative w-full">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute -top-10 right-0 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={src}
            alt={alt || "Preview"}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
        </div>
      </ShadDialogContent>
    </ShadDialog>
  );
};

const PastEventCard: React.FC<PastEvent> = ({ title, description, images }) => {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prevImage = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden h-full flex flex-col">
      {/* Image Slider */}
      <div className="relative w-full h-48 sm:h-56 md:h-64">
        <img
          src={images[current]}
          alt={`${title} - ${current + 1}`}
          className="w-full h-full object-cover"
          onClick={() => setLightboxOpen(true)}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  idx === current ? "bg-white" : "bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Lightbox trigger icon */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded-md hover:bg-black/60"
          aria-label="Open image in lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Text */}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-900">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex-1" />

      {/* Lightbox */}
      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        src={images[current]}
        alt={`${title} - ${current + 1}`}
      />
    </Card>
  );
};

const PastEventsSection: React.FC = () => {
  const pastEvents: PastEvent[] = [
    {
      title: "বৃক্ষরোপণ কর্মসূচি 🌱",
      description:
        "পরিবেশ রক্ষায় কলেজ প্রাঙ্গণ ও পার্শ্ববর্তী এলাকায় বৃক্ষরোপণ।",
      images: [
        "/gallery/WhatsApp Image 2025-09-11 at 12.50.57 PM.jpeg",
        "/gallery/WhatsApp Image 2025-09-11 at 12.50.57 PM (1).jpeg",
      ],
    },
    {
      title: "বার্ষিক সভা 📝",
      description:
        "এক বছরের কার্যক্রমের মূল্যায়ন ও ভবিষ্যৎ পরিকল্পনা নির্ধারণ।",
      images: [
        "/gallery/WhatsApp Image 2025-09-11 at 12.50.58 PM.jpeg",
        "/gallery/WhatsApp Image 2025-09-11 at 12.50.58 PM (1).jpeg",
        "/gallery/WhatsApp Image 2025-09-11 at 12.50.58 PM (2).jpeg",
      ],
    },
    {
      title: "অসহায় মানুষের পাশে 🤝",
      description: "গরীব ও অসহায়দের মাঝে শীতবস্ত্র, ঔষধ ও খাদ্য বিতরণ।",
      images: [
        "/gallery/WhatsApp Image 2025-09-11 at 12.50.59 PM.jpeg",
        "/gallery/past/help2.jpg",
        "/gallery/past/help3.jpg",
      ],
    },
  ];

  return (
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((e) => (
            <PastEventCard
              key={e.title}
              title={e.title}
              description={e.description}
              images={e.images}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const quillRef = useRef<ReactQuill>(null);

  // Quill toolbar configuration (same as Blogs.tsx)
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  // Default events for demo
  const defaultEvents: Event[] = [
    {
      id: 1,
      title: "Free Health Screening Camp",
      description:
        "<p>Join us for a <strong>comprehensive health screening</strong> including blood pressure, diabetes, and cholesterol checks. Our medical team will be available for consultations.</p>",
      location: "MediCare Plus Main Campus",
      date: "2024-02-15T09:00:00Z",
      images: [
        {
          image:
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 2,
      title: "Blood Donation Drive",
      description:
        "<p>Help <strong>save lives</strong> by donating blood. All donors will receive <em>free health checkups</em> and refreshments. Every donation can help save up to three lives.</p>",
      location: "Community Center Downtown",
      date: "2024-02-20T10:00:00Z",
      images: [
        {
          image:
            "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 3,
      title: "Vaccination Camp for Children",
      description:
        "<p>Ensure your children are protected with our <strong>vaccination camp</strong>. We'll provide all routine childhood vaccines in a <em>child-friendly environment</em>.</p>",
      location: "MediCare Plus Pediatric Wing",
      date: "2024-02-25T08:00:00Z",
      images: [
        {
          image:
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
  ];

  // Handle navigation from EventDetail for editing
  useEffect(() => {
    const state = location.state as { event?: Event };
    if (state?.event) {
      setEditingEvent(state.event);
      setFormData({
        title: state.event.title,
        description: state.event.description,
        location: state.event.location,
        date: state.event.date.substring(0, 16),
      });
      setImageFiles([]);
      setDialogOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events...");
        const data = await eventAPI.getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents(defaultEvents);
        toast({
          title: "Error",
          description: "Failed to load events. Showing default events.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const handleCreateEvent = async () => {
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("title", formData.title);
      formDataPayload.append("description", formData.description);
      formDataPayload.append("location", formData.location);
      formDataPayload.append("date", formData.date);
      imageFiles.forEach((file) => {
        formDataPayload.append("image_files", file);
      });

      console.log("FormData contents:");
      for (const [key, value] of formDataPayload.entries()) {
        console.log(`${key}: ${value}`);
      }

      await adminAPI.events.create(formDataPayload);
      toast({ title: "Success", description: "Event created successfully" });
      setDialogOpen(false);
      setFormData({ title: "", description: "", location: "", date: "" });
      setImageFiles([]);
      const data = await eventAPI.getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent) return;
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("title", formData.title);
      formDataPayload.append("description", formData.description);
      formDataPayload.append("location", formData.location);
      formDataPayload.append("date", formData.date);
      imageFiles.forEach((file) => {
        formDataPayload.append("image_files", file);
      });

      console.log("FormData contents for update:");
      for (const [key, value] of formDataPayload.entries()) {
        console.log(`${key}: ${value}`);
      }

      await adminAPI.events.update(editingEvent.id, formDataPayload);
      toast({ title: "Success", description: "Event updated successfully" });
      setDialogOpen(false);
      setEditingEvent(null);
      setFormData({ title: "", description: "", location: "", date: "" });
      setImageFiles([]);
      const data = await eventAPI.getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await adminAPI.events.delete(id);
      toast({ title: "Success", description: "Event deleted successfully" });
      const data = await eventAPI.getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    setEditingEvent(null);
    setFormData({ title: "", description: "", location: "", date: "" });
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
    });
    setImageFiles([]);
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImageFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
                Upcoming Events
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Upcoming Events
          </h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join us for health camps, educational seminars, and community
            wellness programs designed to promote health and well-being in our
            community.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="section-padding bg-white">
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
                      <span>Add Event</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingEvent ? "Edit Event" : "Create New Event"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingEvent
                          ? "Update the event details below."
                          : "Fill in the details to create a new event."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Event title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                      <ReactQuill
                        ref={quillRef}
                        value={formData.description}
                        onChange={(content) =>
                          setFormData({ ...formData, description: content })
                        }
                        modules={quillModules}
                        className="bg-white border border-gray-200 rounded"
                        placeholder="Write your event description here..."
                      />
                      <Input
                        placeholder="Event location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                      <Input
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                      />
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
                                  <X className="w-4 h-4" />
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
                        {editingEvent ? "Update Event" : "Create Event"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
          {events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const { date, time } = formatDate(event.date);
                return (
                  <Card
                    key={event.id}
                    className="medical-card-hover border-0 shadow-lg overflow-hidden h-full"
                  >
                    <div className="relative">
                      <img
                        src={
                          event.images[0]?.image ||
                          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="medical-gradient text-white">
                          Event
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
                          to={`/events/${event.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {event.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <CardDescription className="text-gray-600 leading-relaxed mb-4 flex-1">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: event.description,
                          }}
                        />
                      </CardDescription>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-sm text-blue-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>

                        {/* Admin Actions */}
                        {isAdmin && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(event)}
                              className="flex items-center space-x-1"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="flex items-center space-x-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
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
      {/* Sandhani Programs — Article Section */}
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
              <p className="">
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

              <p className="text-sm text-gray-500">
                ※ আপনার প্রয়োজন অনুযায়ী এই অংশে যোগাযোগের তথ্য/CTA বাটন যোগ
                করা যেতে পারে।
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <PastEventsSection />
      <Footer />
    </div>
  );
};

export default Events;
