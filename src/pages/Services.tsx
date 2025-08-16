import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { serviceAPI, Service, adminAPI } from "@/utils/api";
import {
  Activity,
  Heart,
  Users,
  Calendar,
  Stethoscope,
  Shield,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
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

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  // Extended default services for demo
  const defaultServices = [
    {
      id: 1,
      name: "Emergency Care",
      description:
        "24/7 emergency medical services with rapid response and critical care facilities. Our emergency department is staffed with experienced physicians and equipped with advanced life support systems.",
    },
    {
      id: 2,
      name: "General Medicine",
      description:
        "Comprehensive primary healthcare and preventive medicine services including routine checkups, health screenings, and chronic disease management.",
    },
    {
      id: 3,
      name: "Specialized Consultations",
      description:
        "Expert consultations across various medical specialties including cardiology, neurology, orthopedics, gastroenterology, and more.",
    },
    {
      id: 4,
      name: "Diagnostic Services",
      description:
        "Advanced diagnostic imaging and laboratory testing services including X-rays, CT scans, MRI, ultrasound, and comprehensive blood work.",
    },
    {
      id: 5,
      name: "Surgical Services",
      description:
        "Modern surgical facilities with minimally invasive procedures and comprehensive pre and post-operative care.",
    },
    {
      id: 6,
      name: "Preventive Care",
      description:
        "Comprehensive health screenings, vaccinations, and wellness programs designed to prevent illness and maintain optimal health.",
    },
  ];

  const serviceIcons = [Activity, Heart, Users, Calendar, Stethoscope, Shield];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("Fetching services...");
        const data = await serviceAPI.getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleCreateService = async () => {
    try {
      await adminAPI.services.create(formData);
      toast({ title: "Success", description: "Service created successfully" });
      setDialogOpen(false);
      setFormData({ name: "", description: "" });
      // Refresh services
      const data = await serviceAPI.getServices();
      setServices(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive",
      });
    }
  };

  const handleEditService = async () => {
    if (!editingService) return;
    try {
      await adminAPI.services.update(editingService.id, formData);
      toast({ title: "Success", description: "Service updated successfully" });
      setDialogOpen(false);
      setEditingService(null);
      setFormData({ name: "", description: "" });
      // Refresh services
      const data = await serviceAPI.getServices();
      setServices(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await adminAPI.services.delete(id);
      toast({ title: "Success", description: "Service deleted successfully" });
      // Refresh services
      const data = await serviceAPI.getServices();
      setServices(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    setEditingService(null);
    setFormData({ name: "", description: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({ name: service.name, description: service.description });
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
                Our Services
              </h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-lg animate-pulse"
                >
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive healthcare services designed to meet all your medical
            needs with the highest standards of care and cutting-edge
            technology.
          </p>
        </div>
      </section>

      {/* Services Grid */}
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
                      <span>Add Service</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingService ? "Edit Service" : "Create New Service"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Service name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      <Textarea
                        placeholder="Service description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                      />
                      <Button
                        onClick={
                          editingService
                            ? handleEditService
                            : handleCreateService
                        }
                        className="w-full"
                      >
                        {editingService ? "Update Service" : "Create Service"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = serviceIcons[index % serviceIcons.length];
              return (
                <Card
                  key={service.id}
                  className="medical-card-hover border-0 shadow-lg h-full"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="medical-gradient w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center flex-1">
                    <CardDescription className="text-gray-600 leading-relaxed mb-4">
                      {service.description}
                    </CardDescription>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex space-x-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(service)}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteService(service.id)}
                          className="flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
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

      {/* Contact Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Need Medical Assistance?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today to schedule an appointment or learn more about our
            services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Emergency</h3>
              <p className="text-red-600 text-xl font-bold">
                +1 (555) 911-HELP
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Appointments</h3>
              <p className="text-red-600 text-xl font-bold">
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Services;
