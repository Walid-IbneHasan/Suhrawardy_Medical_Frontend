import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

  // Default events for demo
  const defaultEvents = [
    {
      id: 1,
      title: "Free Health Screening Camp",
      description:
        "Join us for a comprehensive health screening including blood pressure, diabetes, and cholesterol checks. Our medical team will be available for consultations.",
      location: "MediCare Plus Main Campus",
      date: "2024-02-15T09:00:00Z",
      images: [
        {
          id: 1,
          image:
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 2,
      title: "Blood Donation Drive",
      description:
        "Help save lives by donating blood. All donors will receive free health checkups and refreshments. Every donation can help save up to three lives.",
      location: "Community Center Downtown",
      date: "2024-02-20T10:00:00Z",
      images: [
        {
          id: 2,
          image:
            "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 3,
      title: "Vaccination Camp for Children",
      description:
        "Ensure your children are protected with our vaccination camp. We'll provide all routine childhood vaccines in a comfortable, child-friendly environment.",
      location: "MediCare Plus Pediatric Wing",
      date: "2024-02-25T08:00:00Z",
      images: [
        {
          id: 3,
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
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
      toast({
        title: "Error",
        description: "Failed to create event",
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
      toast({
        title: "Error",
        description: "Failed to update event",
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
      toast({
        title: "Error",
        description: "Failed to delete event",
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
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Event title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                      <Textarea
                        placeholder="Event description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
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
                        {event.description}
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
    </div>
  );
};

export default Events;
