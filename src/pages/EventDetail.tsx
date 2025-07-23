import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
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
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDeleteEvent = async () => {
    if (!event || !confirm("Are you sure you want to delete this event?"))
      return;
    try {
      await adminAPI.events.delete(event.id);
      toast({ title: "Success", description: "Event deleted successfully" });
      navigate("/events");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
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
      </div>
    );
  }

  const { date, time } = formatDate(event.date);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/events"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
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

          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* Event Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>

              {/* Event Images Slider */}
              {event.images && event.images.length > 0 && (
                <div className="mb-8 relative">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    {event.images.map((image, index) => (
                      <img
                        key={image.id}
                        src={image.image}
                        alt={`Event image ${index + 1}`}
                        className={`w-full h-64 object-cover absolute top-0 left-0 transition-opacity duration-500 ${
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
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="flex justify-center mt-4 space-x-2">
                        {event.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Event Content */}
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: event.description.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
