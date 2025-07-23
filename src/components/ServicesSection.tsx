
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { serviceAPI, Service } from '@/utils/api';
import { Activity, Heart, Users, Calendar } from 'lucide-react';

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Default services for demo purposes
  const defaultServices = [
    {
      id: 1,
      name: "Emergency Care",
      description: "24/7 emergency medical services with rapid response and critical care."
    },
    {
      id: 2,
      name: "General Medicine",
      description: "Comprehensive primary healthcare and preventive medicine services."
    },
    {
      id: 3,
      name: "Specialized Consultations",
      description: "Expert consultations across various medical specialties."
    },
    {
      id: 4,
      name: "Diagnostic Services",
      description: "Advanced diagnostic imaging and laboratory testing services."
    }
  ];

  const serviceIcons = [Activity, Heart, Users, Calendar];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Fetching services...');
        const data = await serviceAPI.getServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        // Use default services if API fails
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 sm:p-6 animate-pulse">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 sm:h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare services designed to meet all your medical needs with excellence and compassion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.slice(0, 4).map((service, index) => {
            const IconComponent = serviceIcons[index % serviceIcons.length];
            return (
              <Card key={service.id} className="medical-card-hover border-0 shadow-lg bg-white animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader className="text-center pb-4">
                  <div className="medical-gradient w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-200 hover:scale-110">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-gray-900">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Link to="/services">
            <Button size="lg" className="medical-gradient text-white hover:opacity-90 px-8 py-3 transition-all duration-200 hover:scale-105">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
