
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { serviceAPI, Service } from '@/utils/api';
import { Activity, Heart, Users, Calendar, Stethoscope, Shield } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Extended default services for demo
  const defaultServices = [
    {
      id: 1,
      name: "Emergency Care",
      description: "24/7 emergency medical services with rapid response and critical care facilities. Our emergency department is staffed with experienced physicians and equipped with advanced life support systems."
    },
    {
      id: 2,
      name: "General Medicine",
      description: "Comprehensive primary healthcare and preventive medicine services including routine checkups, health screenings, and chronic disease management."
    },
    {
      id: 3,
      name: "Specialized Consultations",
      description: "Expert consultations across various medical specialties including cardiology, neurology, orthopedics, gastroenterology, and more."
    },
    {
      id: 4,
      name: "Diagnostic Services",
      description: "Advanced diagnostic imaging and laboratory testing services including X-rays, CT scans, MRI, ultrasound, and comprehensive blood work."
    },
    {
      id: 5,
      name: "Surgical Services",
      description: "Modern surgical facilities with minimally invasive procedures and comprehensive pre and post-operative care."
    },
    {
      id: 6,
      name: "Preventive Care",
      description: "Comprehensive health screenings, vaccinations, and wellness programs designed to prevent illness and maintain optimal health."
    }
  ];

  const serviceIcons = [Activity, Heart, Users, Calendar, Stethoscope, Shield];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Fetching services...');
        const data = await serviceAPI.getServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive healthcare services designed to meet all your medical needs with 
            the highest standards of care and cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[index % serviceIcons.length];
              return (
                <Card key={service.id} className="medical-card-hover border-0 shadow-lg h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="medical-gradient w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center flex-1">
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Need Medical Assistance?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today to schedule an appointment or learn more about our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Emergency</h3>
              <p className="text-blue-600 text-xl font-bold">+1 (555) 911-HELP</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Appointments</h3>
              <p className="text-blue-600 text-xl font-bold">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
