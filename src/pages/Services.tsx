import { useEffect, useMemo, useState } from "react";
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
  HelpCircle,
  Search as SearchIcon,
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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

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

  // -----------------------------
  // Q&A (FAQ) — Eye Donation (বাংলা)
  // -----------------------------
  const faqItems = [
    {
      q: "মরণোত্তর চক্ষুদান কী?",
      a: "মৃত্যুর ৪–৬ ঘন্টার মধ্যে দুটি চোখ সংগ্রহ করার জন্য জীবিত অবস্থায় চক্ষুদানের অঙ্গীকার করাকে মরণোত্তর চক্ষুদান বলা হয়।",
    },
    {
      q: "চক্ষুদানের ব্যাপারে বাংলাদেশের আইন কী?",
      a: `অন্ধত্ব মোচন (চক্ষুদান) অর্ডিন্যান্স ১৯৮৫ অনুযায়ী—\n\n• জীবিত অবস্থায় কেউ মৃত্যুর পর চক্ষুদানের অনুমতি দিতে পারেন।\n• জীবিত অবস্থায়ও নিজের চোখ দান করা যায়।`,
    },
    {
      q: "ধর্ম চক্ষুদানকে কীভাবে ব্যাখ্যা করেছে?",
      a: "সব ধর্মেই মানবকল্যাণে মরণোত্তর চক্ষুদানকে উৎসাহিত করা হয়েছে। ইসলামী ফিকাহ একাডেমি বলেছে, মরণোত্তর অঙ্গ দান শরীয়তবিরোধী নয়—অতএব ইসলামেও এটি উৎসাহিত।",
    },
    {
      q: "মৃত্যুর কত ঘন্টার মধ্যে চোখ সংগ্রহ করতে হয়?",
      a: "মৃত্যুর ৪–৬ ঘন্টার মধ্যে চোখ সংগ্রহ করে সংরক্ষণ করতে হয়।",
    },
    {
      q: "চশমা ব্যবহারকারী ও ছানি অপারেশন করা ব্যক্তিরা কি চক্ষুদান করতে পারবেন?",
      a: "হ্যাঁ। কর্ণিয়া (চোখের সামনের স্বচ্ছ পর্দা) অক্ষত ও উপযুক্ত থাকলে দান করা সম্ভব।",
    },
    {
      q: "চক্ষুদানের জন্য প্রয়োজনীয় ব্যবস্থা কী?",
      a: `• সন্ধানী জাতীয় চক্ষুদান সমিতি বা মেডিকেল কলেজ হাসপাতাল থেকে অঙ্গীকারপত্র সংগ্রহ করুন।\n• যথাযথভাবে পূরণ করে দুইজন নিকট আত্মীয়ের স্বাক্ষরসহ জমা দিন।`,
    },
    {
      q: "কর্ণিয়া গ্রহণের জন্য প্রয়োজনীয় ব্যবস্থা কী?",
      a: `• চক্ষু বিশেষজ্ঞের প্রেসক্রিপশন\n• রোগীর ১০ কপি ছবি\n• ৫০০ টাকা সার্ভিস চার্জ (অত্যন্ত গরীব রোগীর ক্ষেত্রে মওকুফযোগ্য)\n• নির্ধারিত ফরম পূরণ`,
    },
    {
      q: "কর্ণিয়া সরবরাহের পদ্ধতি কীভাবে হয়?",
      a: `• আবেদনপত্রের ক্রমানুসারে রোগীদের সাথে যোগাযোগ করা হয়।\n• চক্ষু সার্জনের সাথে সমন্বয় করে নির্ধারিত সময়ে কর্ণিয়া সরবরাহ করা হয়।\n• সংগৃহীত চক্ষু সর্বোচ্চ ২৪ ঘন্টা (বিশেষ ক্ষেত্রে ৪৮ ঘন্টা) পর্যন্ত সংরক্ষণযোগ্য।`,
    },
    {
      q: "মরণোত্তর চক্ষুদানের অঙ্গীকার করবেন কীভাবে?",
      a: `প্রথমে অঙ্গীকারপত্র সংগ্রহ করুন (সন্ধানী জাতীয় চক্ষুদান সমিতি/যে কোনো মেডিকেল ও ডেন্টাল কলেজ ইউনিট/সন্ধানী ডোনার ক্লাব)।\n\n👉 যে কোনো ধরনের চশমা ব্যবহারকারীও চক্ষুদান করতে পারবেন, যদি কর্ণিয়া সুস্থ ও স্বচ্ছ থাকে।\n👉 অঙ্গীকারপত্রে পরিবারের অন্তর্ভুক্ত দুইজন প্রথম শ্রেণীর গেজেটেড কর্মকর্তার স্বাক্ষর ও সত্যায়ন আবশ্যক।\n👉 পূরণকৃত অঙ্গীকারপত্র ডাকযোগে বা সরাসরি সন্ধানী চক্ষু ব্যাংকে প্রেরণ করতে হবে।\n👉 পরে সন্ধানী চক্ষু ব্যাংক থেকে “মরণোত্তর চক্ষুদাতা” হিসেবে একটি লেমিনেটেড পকেট ডোনার কার্ড প্রদান করা হবে—কার্ডটি সাথে রাখুন এবং পরিবারের সদস্যদের জানান।`,
    },
  ];

  const [faqQuery, setFaqQuery] = useState("");
  const filteredFaq = useMemo(() => {
    if (!faqQuery) return faqItems;
    const q = faqQuery.toLowerCase();
    return faqItems.filter((item) =>
      (item.q + " " + item.a).toLowerCase().includes(q)
    );
  }, [faqQuery]);

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: i.a.replace(/\n/g, " "),
        },
      })),
    }),
    [faqItems]
  );

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

      {/* Eye Donation Q&A Section (বাংলা) */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="medical-gradient w-12 h-12 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                চক্ষুদান সম্বন্ধে প্রশ্নোত্তর
              </h2>
              <p className="text-gray-600 mt-1">
                কর্ণিয়া প্রতিস্থাপন, আইন, ধর্মীয় ব্যাখ্যা ও প্রক্রিয়া—সব এক
                জায়গায়।
              </p>
            </div>
          </div>

          {/* Context Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">মরণোত্তর চক্ষুদান</Badge>
            <Badge variant="secondary">কর্ণিয়া প্রতিস্থাপন</Badge>
            <Badge variant="secondary">বাংলাদেশের আইন (১৯৮৫)</Badge>
          </div>

          {/* Search Within FAQ */}
          <div className="relative mb-6">
            <Input
              placeholder="প্রশ্ন খুঁজুন... (যেমন: আইন, ধর্ম, সময়)"
              value={faqQuery}
              onChange={(e) => setFaqQuery(e.target.value)}
              className="pl-10"
              aria-label="FAQ search"
            />
            <SearchIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Helpful Context Block */}
          <div className="bg-white p-5 rounded-xl shadow-sm border mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              কেন কর্ণিয়া গুরুত্বপূর্ণ?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              কর্ণিয়া হলো চোখের সামনের স্বচ্ছ গোলাকার অংশ। এটি ক্ষতিগ্রস্ত হলে
              দৃষ্টিশক্তি ঝাপসা বা সম্পূর্ণ নষ্ট হতে পারে। কর্ণিয়া প্রতিস্থাপনে
              দাতা কর্ণিয়া ব্যবহার করা হয়—তাই চক্ষুদান জীবন বদলে দিতে পারে।
            </p>
          </div>

          {/* Accordion FAQ */}
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-xl shadow-sm border divide-y"
          >
            {filteredFaq.map((item, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left px-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 whitespace-pre-line text-gray-700">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
            {filteredFaq.length === 0 && (
              <div className="px-4 py-6 text-gray-500">
                কোনো ফল পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।
              </div>
            )}
          </Accordion>

          {/* How to pledge & contact */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h4 className="text-xl font-semibold mb-2">অঙ্গীকার ও সহায়তা</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>অঙ্গীকারপত্র পূরণ করে নিরাপদে সংরক্ষণ করুন।</li>
                <li>পরিবার/নিকট আত্মীয়কে আপনার সিদ্ধান্ত জানিয়ে রাখুন।</li>
                <li>
                  মৃত্যুর পর ৪–৬ ঘন্টার মধ্যে যোগাযোগের অনুরোধ লিখিতভাবে রেখে
                  দিন।
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h4 className="text-xl font-semibold mb-2">
                দ্রুত যোগাযোগ (উদাহরণ)
              </h4>
              <p className="text-gray-700">
                সন্ধানী চক্ষু ব্যাংক (ঢাকা):{" "}
                <a className="text-blue-600 underline" href="tel:+880000000000">
                  +880-XXXXXXXXXX
                </a>
              </p>
              <p className="text-gray-700">
                নিকটস্থ মেডিকেল কলেজ হাসপাতাল:{" "}
                <span className="text-gray-500">ইমারজেন্সি ডেস্কে জানান</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                ※ উপরের নম্বরগুলো স্থলাভিষিক্ত করুন—আপনার প্রতিষ্ঠানের অফিসিয়াল
                নম্বর/লিংক যুক্ত করুন।
              </p>
            </div>
          </div>
        </div>

        {/* SEO: FAQ Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
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
