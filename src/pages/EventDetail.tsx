import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { eventAPI, Event, adminAPI } from "@/utils/api";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        console.log("Fetching event:", id);
        const eventData = await eventAPI.getEvent(parseInt(id));
        setEvent(eventData);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        toast({
          title: "Error",
          description: "Failed to load event. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, toast]);

  const handleDeleteEvent = async () => {
    if (!event || !confirm("Are you sure you want to delete this event?"))
      return;
    try {
      await adminAPI.events.delete(event.id);
      toast({ title: "Success", description: "Event deleted successfully" });
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = () => {
    if (event) {
      navigate("/events", { state: { event } });
    }
  };

  const handlePrevImage = () => {
    if (event && event.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? event.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (event && event.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === event.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
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
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Event Not Found
            </h1>
            <Link to="/events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { date, time } = formatDate(event.date);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/events"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-8 animate-fade-in-up transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Admin Actions
              </h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleEditEvent}>
                  <Edit className="w-3 h-3 mr-2" />
                  Edit Event
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteEvent}
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete Event
                </Button>
              </div>
            </div>
          )}

          <Card className="shadow-lg animate-fade-in-up">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              {/* Event Header */}
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
                  {event.title}
                </h1>
                <div className="space-y-2 sm:space-y-1">
                  <div className="flex items-center text-gray-500 text-sm animate-slide-in-left">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="break-words">{date}</span>
                  </div>
                  <div
                    className="flex items-center text-gray-500 text-sm animate-slide-in-left"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{time}</span>
                  </div>
                  <div
                    className="flex items-center text-gray-500 text-sm animate-slide-in-left"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="break-words">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Event Images Slider */}
              {event.images && event.images.length > 0 && (
                <div
                  className="mb-8 relative animate-fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-lg">
                    {event.images.map((image, index) => (
                      <img
                        key={index}
                        src={typeof image === "string" ? image : image.image}
                        alt={`Event image ${index + 1}`}
                        className={`w-full h-48 sm:h-56 md:h-64 object-cover absolute top-0 left-0 transition-opacity duration-500 ${
                          index === currentImageIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>
                  {event.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 hover:scale-110"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 hover:scale-110"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                      </button>
                      <div className="flex justify-center mt-4 space-x-2">
                        {event.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 hover:scale-125 ${
                              index === currentImageIndex
                                ? "bg-blue-600 scale-110"
                                : "bg-gray-300 hover:bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Event Content */}
              <div
                className="prose max-w-none animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div
                  className="text-gray-700 leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{
                    __html: event.description,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;
