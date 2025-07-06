
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { eventAPI, Event } from '@/utils/api';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Default events for demo
  const defaultEvents = [
    {
      id: 1,
      title: "Free Health Screening Camp",
      description: "Join us for a comprehensive health screening including blood pressure, diabetes, and cholesterol checks. Our medical team will be available for consultations.",
      location: "MediCare Plus Main Campus",
      date: "2024-02-15T09:00:00Z",
      images: [{ image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }]
    },
    {
      id: 2,
      title: "Blood Donation Drive",
      description: "Help save lives by donating blood. All donors will receive free health checkups and refreshments. Every donation can help save up to three lives.",
      location: "Community Center Downtown",
      date: "2024-02-20T10:00:00Z",
      images: [{ image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }]
    },
    {
      id: 3,
      title: "Vaccination Camp for Children",
      description: "Ensure your children are protected with our vaccination camp. We'll provide all routine childhood vaccines in a comfortable, child-friendly environment.",
      location: "MediCare Plus Pediatric Wing",
      date: "2024-02-25T08:00:00Z",
      images: [{ image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }]
    }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events...');
        const data = await eventAPI.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents(defaultEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Upcoming Events</h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join us for health camps, educational seminars, and community wellness programs 
            designed to promote health and well-being in our community.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const { date, time } = formatDate(event.date);
                return (
                  <Card key={event.id} className="medical-card-hover border-0 shadow-lg overflow-hidden h-full">
                    <div className="relative">
                      <img
                        src={event.images[0]?.image || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="medical-gradient text-white">Event</Badge>
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
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col">
                      <CardDescription className="text-gray-600 leading-relaxed mb-4 flex-1">
                        {event.description}
                      </CardDescription>
                      <div className="flex items-center text-sm text-blue-600 mt-auto">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
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
