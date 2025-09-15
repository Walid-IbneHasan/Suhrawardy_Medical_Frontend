import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  bloodAPI,
  adminAPI,
  BloodInventory,
  BloodRequest,
  BloodDonationInterest,
} from "@/utils/api";
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Activity,
  User,
  Calendar,
  MapPin,
  Phone,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
// import Image from "next/image"; // Next.js Image (recommended)
// import { Images } from "lucide-react"; // optional icon for the section header

const BloodInventoryPage = () => {
  // --- Gallery state ---
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  const openGalleryAt = (idx: number) => {
    setActiveImgIndex(idx);
    setGalleryOpen(true);
  };

  const nextImg = () =>
    setActiveImgIndex((i) => (i + 1) % bloodGalleryFiles.length);

  const prevImg = () =>
    setActiveImgIndex((i) =>
      i - 1 < 0 ? bloodGalleryFiles.length - 1 : i - 1
    );

  const [bloodInventory, setBloodInventory] = useState<BloodInventory[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [donationInterests, setDonationInterests] = useState<
    BloodDonationInterest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "inventory" | "request" | "donate" | "faq"
  >("inventory");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlood, setEditingBlood] = useState<BloodInventory | null>(null);
  const [editingRequest, setEditingRequest] = useState<BloodRequest | null>(
    null
  );
  const [editingDonation, setEditingDonation] =
    useState<BloodDonationInterest | null>(null);
  const [bloodFormData, setBloodFormData] = useState({
    group: "",
    available: false,
  });
  const [requestFormData, setRequestFormData] = useState({
    blood_group: "",
    location: "",
    contact: "",
    date_required: "",
  });
  const [donateFormData, setDonateFormData] = useState({
    blood_group: "",
    available_date: "",
    contact_info: "",
  });
  const { isAdmin, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Default data for demo
  const defaultBloodInventory = [
    { id: 1, group: "A+", available: true },
    { id: 2, group: "A-", available: false },
    { id: 3, group: "B+", available: true },
    { id: 4, group: "B-", available: true },
    { id: 5, group: "AB+", available: false },
    { id: 6, group: "AB-", available: true },
    { id: 7, group: "O+", available: true },
    { id: 8, group: "O-", available: false },
  ];

  const bloodGalleryFiles: string[] = [
    "WhatsApp Image 2025-09-11 at 12.50.57 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.04 PM.jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.16 PM (1).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.16 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM (1).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.17 PM (3).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.19 PM.jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.18 PM (1).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.18 PM (2).jpeg",
    "WhatsApp Image 2025-09-11 at 12.51.18 PM.jpeg",
  ];

  const bloodImgUrl = (name: string) =>
    `/gallery/blood/${encodeURIComponent(name)}`;

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  useEffect(() => {
    if (!galleryOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [galleryOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching blood inventory and related data...");
        const [bloodData, requestData, donationData] = await Promise.all([
          bloodAPI.getBloodInventory(),
          isAdmin ? adminAPI.bloodRequests.getAll() : Promise.resolve([]),
          isAdmin ? adminAPI.donationInterests.getAll() : Promise.resolve([]),
        ]);
        setBloodInventory(bloodData);
        setBloodRequests(requestData);
        setDonationInterests(donationData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setBloodInventory(defaultBloodInventory);
        setBloodRequests([]);
        setDonationInterests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleCreateBloodInventory = async () => {
    try {
      await adminAPI.bloodInventory.create(bloodFormData);
      toast({
        title: "Success",
        description: "Blood inventory created successfully",
      });
      setDialogOpen(false);
      setBloodFormData({ group: "", available: false });
      const data = await bloodAPI.getBloodInventory();
      setBloodInventory(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blood inventory",
        variant: "destructive",
      });
    }
  };

  const handleEditBloodInventory = async () => {
    if (!editingBlood) return;
    try {
      await adminAPI.bloodInventory.update(editingBlood.id, bloodFormData);
      toast({
        title: "Success",
        description: "Blood inventory updated successfully",
      });
      setDialogOpen(false);
      setEditingBlood(null);
      setBloodFormData({ group: "", available: false });
      const data = await bloodAPI.getBloodInventory();
      setBloodInventory(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blood inventory",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBloodInventory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blood inventory?"))
      return;
    try {
      await adminAPI.bloodInventory.delete(id);
      toast({
        title: "Success",
        description: "Blood inventory deleted successfully",
      });
      const data = await bloodAPI.getBloodInventory();
      setBloodInventory(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blood inventory",
        variant: "destructive",
      });
    }
  };

  const handleCreateBloodRequest = async () => {
    try {
      if (isAdmin) {
        await adminAPI.bloodRequests.create(requestFormData);
        toast({
          title: "Success",
          description: "Blood request created successfully",
        });
      } else {
        await bloodAPI.requestBlood(requestFormData);
        toast({
          title: "Success",
          description: "Blood request submitted successfully",
        });
      }
      setDialogOpen(false);
      setRequestFormData({
        blood_group: "",
        location: "",
        contact: "",
        date_required: "",
      });
      if (isAdmin) {
        const data = await adminAPI.bloodRequests.getAll();
        setBloodRequests(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blood request",
        variant: "destructive",
      });
    }
  };

  const handleEditBloodRequest = async () => {
    if (!editingRequest) return;
    try {
      await adminAPI.bloodRequests.update(editingRequest.id, requestFormData);
      toast({
        title: "Success",
        description: "Blood request updated successfully",
      });
      setDialogOpen(false);
      setEditingRequest(null);
      setRequestFormData({
        blood_group: "",
        location: "",
        contact: "",
        date_required: "",
      });
      const data = await adminAPI.bloodRequests.getAll();
      setBloodRequests(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blood request",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBloodRequest = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blood request?")) return;
    try {
      await adminAPI.bloodRequests.delete(id);
      toast({
        title: "Success",
        description: "Blood request deleted successfully",
      });
      const data = await adminAPI.bloodRequests.getAll();
      setBloodRequests(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blood request",
        variant: "destructive",
      });
    }
  };

  const handleCreateDonationInterest = async () => {
    try {
      if (isAdmin) {
        await adminAPI.donationInterests.create(donateFormData);
        toast({
          title: "Success",
          description: "Donation interest created successfully",
        });
      } else {
        await bloodAPI.donateInterest(donateFormData);
        toast({
          title: "Success",
          description: "Donation interest registered successfully",
        });
      }
      setDialogOpen(false);
      setDonateFormData({
        blood_group: "",
        available_date: "",
        contact_info: "",
      });
      if (isAdmin) {
        const data = await adminAPI.donationInterests.getAll();
        setDonationInterests(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create donation interest",
        variant: "destructive",
      });
    }
  };

  const handleEditDonationInterest = async () => {
    if (!editingDonation) return;
    try {
      await adminAPI.donationInterests.update(
        editingDonation.id,
        donateFormData
      );
      toast({
        title: "Success",
        description: "Donation interest updated successfully",
      });
      setDialogOpen(false);
      setEditingDonation(null);
      setDonateFormData({
        blood_group: "",
        available_date: "",
        contact_info: "",
      });
      const data = await adminAPI.donationInterests.getAll();
      setDonationInterests(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update donation interest",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDonationInterest = async (id: number) => {
    if (!confirm("Are you sure you want to delete this donation interest?"))
      return;
    try {
      await adminAPI.donationInterests.delete(id);
      toast({
        title: "Success",
        description: "Donation interest deleted successfully",
      });
      const data = await adminAPI.donationInterests.getAll();
      setDonationInterests(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete donation interest",
        variant: "destructive",
      });
    }
  };

  const openCreateBloodDialog = () => {
    setEditingBlood(null);
    setBloodFormData({ group: "", available: false });
    setDialogOpen(true);
  };

  const openEditBloodDialog = (blood: BloodInventory) => {
    setEditingBlood(blood);
    setBloodFormData({ group: blood.group, available: blood.available });
    setDialogOpen(true);
  };

  const openCreateRequestDialog = () => {
    setEditingRequest(null);
    setRequestFormData({
      blood_group: "",
      location: "",
      contact: "",
      date_required: "",
    });
    setDialogOpen(true);
  };

  const openEditRequestDialog = (request: BloodRequest) => {
    setEditingRequest(request);
    setRequestFormData({
      blood_group: request.blood_group,
      location: request.location,
      contact: request.contact,
      date_required: request.date_required,
    });
    setDialogOpen(true);
  };

  const openCreateDonationDialog = () => {
    setEditingDonation(null);
    setDonateFormData({
      blood_group: "",
      available_date: "",
      contact_info: "",
    });
    setDialogOpen(true);
  };

  const openEditDonationDialog = (donation: BloodDonationInterest) => {
    setEditingDonation(donation);
    setDonateFormData({
      blood_group: donation.blood_group,
      available_date: donation.available_date,
      contact_info: donation.contact_info,
    });
    setDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Blood Services
              </h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-lg animate-pulse"
                >
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blood Services
          </h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Check the current availability of different blood types, request
            blood, or register to donate blood.
          </p>
        </div>
      </section>
      {/* Blood Program Gallery */}
      {/* Blood Program Gallery */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              আমাদের রক্তদান কার্যক্রম – ছবি
            </h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mt-4"></div>
            <p className="text-gray-600 mt-4">
              সাম্প্রতিক রক্তদান ক্যাম্প ও প্রোগ্রামের কিছু মুহূর্ত।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {bloodGalleryFiles.map((file, idx) => (
              <button
                key={file + idx}
                onClick={() => openGalleryAt(idx)}
                className="group block overflow-hidden rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={`Open image ${idx + 1}`}
              >
                <img
                  src={bloodImgUrl(file)}
                  alt={`Blood program ${idx + 1}`}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "inventory", label: "Blood Inventory", icon: Activity },
              { id: "request", label: "Request Blood", icon: Heart },
              { id: "donate", label: "Donate Blood", icon: User },
              { id: "faq", label: "FAQ", icon: HelpCircle },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "inventory" | "request" | "donate" | "faq"
                    )
                  }
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Blood Inventory Tab */}
          {activeTab === "inventory" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Blood Inventory
              </h2>
              {isAdmin && (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-blue-800">
                      Admin Panel
                    </h3>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={openCreateBloodDialog}
                          className="flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Blood Group</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingBlood
                              ? "Edit Blood Inventory"
                              : "Create New Blood Inventory"}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Blood group (e.g., A+, O-)"
                            value={bloodFormData.group}
                            onChange={(e) =>
                              setBloodFormData({
                                ...bloodFormData,
                                group: e.target.value,
                              })
                            }
                          />
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="available"
                              checked={bloodFormData.available}
                              onCheckedChange={(checked) =>
                                setBloodFormData({
                                  ...bloodFormData,
                                  available: !!checked,
                                })
                              }
                            />
                            <label
                              htmlFor="available"
                              className="text-sm font-medium"
                            >
                              Available
                            </label>
                          </div>
                          <Button
                            onClick={
                              editingBlood
                                ? handleEditBloodInventory
                                : handleCreateBloodInventory
                            }
                            className="w-full"
                          >
                            {editingBlood
                              ? "Update Inventory"
                              : "Create Inventory"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {bloodInventory.map((blood) => (
                  <Card
                    key={blood.id}
                    className={`text-center p-4 ${
                      blood.available
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {blood.group}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Badge
                        variant={blood.available ? "default" : "destructive"}
                        className={`mb-3 ${
                          blood.available ? "bg-green-500" : ""
                        }`}
                      >
                        {blood.available ? "Available" : "Not Available"}
                      </Badge>
                      {isAdmin && (
                        <div className="flex flex-col space-y-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditBloodDialog(blood)}
                            className="flex items-center justify-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteBloodInventory(blood.id)}
                            className="flex items-center justify-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Request Blood Tab */}
          {activeTab === "request" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Request Blood
              </h2>
              {isAdmin ? (
                <>
                  <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-800">
                        Admin Panel
                      </h3>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={openCreateRequestDialog}
                            className="flex items-center space-x-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Blood Request</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {editingRequest
                                ? "Edit Blood Request"
                                : "Create New Blood Request"}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="blood_group">Blood Group</Label>
                              <Select
                                value={requestFormData.blood_group}
                                onValueChange={(value) =>
                                  setRequestFormData((prev) => ({
                                    ...prev,
                                    blood_group: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                                <SelectContent>
                                  {bloodGroups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                      {group}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                type="text"
                                placeholder="Enter location"
                                value={requestFormData.location}
                                onChange={(e) =>
                                  setRequestFormData((prev) => ({
                                    ...prev,
                                    location: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="contact">
                                Contact Information
                              </Label>
                              <Input
                                id="contact"
                                type="text"
                                placeholder="Phone number or email"
                                value={requestFormData.contact}
                                onChange={(e) =>
                                  setRequestFormData((prev) => ({
                                    ...prev,
                                    contact: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="date_required">
                                Date Required
                              </Label>
                              <Input
                                id="date_required"
                                type="date"
                                value={requestFormData.date_required}
                                onChange={(e) =>
                                  setRequestFormData((prev) => ({
                                    ...prev,
                                    date_required: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <Button
                              onClick={
                                editingRequest
                                  ? handleEditBloodRequest
                                  : handleCreateBloodRequest
                              }
                              className="w-full"
                            >
                              {editingRequest
                                ? "Update Request"
                                : "Create Request"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Blood Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {bloodRequests.length === 0 ? (
                        <p className="text-center text-gray-600">
                          No blood requests found.
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Blood Group</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Date Required</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bloodRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell>
                                  {request.user?.email || "N/A"}
                                </TableCell>
                                <TableCell>{request.blood_group}</TableCell>
                                <TableCell>{request.location}</TableCell>
                                <TableCell>{request.contact}</TableCell>
                                <TableCell>
                                  {formatDate(request.date_required)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        openEditRequestDialog(request)
                                      }
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        handleDeleteBloodRequest(request.id)
                                      }
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  {!isAuthenticated ? (
                    <Card className="shadow-xl">
                      <CardContent className="p-8 text-center">
                        <h3 className="text-xl font-semibold mb-4">
                          Login Required
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Please login to request blood services.
                        </p>
                        <Button>
                          <Link to="/login">Login</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Heart className="w-6 h-6 text-red-500" />
                          <span>Blood Request Form</span>
                        </CardTitle>
                        <CardDescription>
                          Fill out this form to request blood. We will contact
                          you as soon as possible.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateBloodRequest();
                          }}
                          className="space-y-6"
                        >
                          <div>
                            <Label htmlFor="blood_group">
                              Blood Group Required
                            </Label>
                            <Select
                              value={requestFormData.blood_group}
                              onValueChange={(value) =>
                                setRequestFormData((prev) => ({
                                  ...prev,
                                  blood_group: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                              <SelectContent>
                                {bloodGroups.map((group) => (
                                  <SelectItem key={group} value={group}>
                                    {group}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                id="location"
                                type="text"
                                placeholder="Enter your location"
                                value={requestFormData.location}
                                onChange={(e) =>
                                  setRequestFormData((prev) => ({
                                    ...prev,
                                    location: e.target.value,
                                  }))
                                }
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="contact">Contact Information</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                id="contact"
                                type="text"
                                placeholder="Phone number or email"
                                value={requestFormData.contact}
                                onChange={(e) =>
                                  setRequestFormData((prev) => ({
                                    ...prev,
                                    contact: e.target.value,
                                  }))
                                }
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="date_required">Date Required</Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                id="date_required"
                                type="date"
                                value={requestFormData.date_required}
                                onChange={(e) =>
                                  setRequestFormData((prev) => ({
                                    ...prev,
                                    date_required: e.target.value,
                                  }))
                                }
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <Button
                            type="submit"
                            className="w-full medical-gradient text-white hover:opacity-90 py-3"
                          >
                            Submit Blood Request
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}

          {/* Donate Blood Tab */}
          {activeTab === "donate" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Donate Blood
              </h2>
              {isAdmin ? (
                <>
                  <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-800">
                        Admin Panel
                      </h3>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={openCreateDonationDialog}
                            className="flex items-center space-x-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Donation Interest</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {editingDonation
                                ? "Edit Donation Interest"
                                : "Create New Donation Interest"}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="blood_group">Blood Group</Label>
                              <Select
                                value={donateFormData.blood_group}
                                onValueChange={(value) =>
                                  setDonateFormData((prev) => ({
                                    ...prev,
                                    blood_group: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                                <SelectContent>
                                  {bloodGroups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                      {group}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="available_date">
                                Available Date
                              </Label>
                              <Input
                                id="available_date"
                                type="date"
                                value={donateFormData.available_date}
                                onChange={(e) =>
                                  setDonateFormData((prev) => ({
                                    ...prev,
                                    available_date: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="contact_info">
                                Contact Information
                              </Label>
                              <Textarea
                                id="contact_info"
                                placeholder="Phone number, email, etc."
                                value={donateFormData.contact_info}
                                onChange={(e) =>
                                  setDonateFormData((prev) => ({
                                    ...prev,
                                    contact_info: e.target.value,
                                  }))
                                }
                                rows={4}
                                required
                              />
                            </div>
                            <Button
                              onClick={
                                editingDonation
                                  ? handleEditDonationInterest
                                  : handleCreateDonationInterest
                              }
                              className="w-full"
                            >
                              {editingDonation
                                ? "Update Donation Interest"
                                : "Create Donation Interest"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Blood Donation Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {donationInterests.length === 0 ? (
                        <p className="text-center text-gray-600">
                          No donation interests found.
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Blood Group</TableHead>
                              <TableHead>Available Date</TableHead>
                              <TableHead>Contact Info</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {donationInterests.map((donation) => (
                              <TableRow key={donation.id}>
                                <TableCell>
                                  {donation.user?.email || "N/A"}
                                </TableCell>
                                <TableCell>{donation.blood_group}</TableCell>
                                <TableCell>
                                  {formatDate(donation.available_date)}
                                </TableCell>
                                <TableCell>{donation.contact_info}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        openEditDonationDialog(donation)
                                      }
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        handleDeleteDonationInterest(
                                          donation.id
                                        )
                                      }
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  {!isAuthenticated ? (
                    <Card className="shadow-xl">
                      <CardContent className="p-8 text-center">
                        <h3 className="text-xl font-semibold mb-4">
                          Login Required
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Please login to register for blood donation.
                        </p>
                        <Button>
                          <Link to="/login">Login</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Heart className="w-6 h-6 text-red-500" />
                          <span>Blood Donation Interest</span>
                        </CardTitle>
                        <CardDescription>
                          Register your interest in donating blood. Your
                          contribution can save lives.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateDonationInterest();
                          }}
                          className="space-y-6"
                        >
                          <div>
                            <Label htmlFor="donor_blood_group">
                              Your Blood Group
                            </Label>
                            <Select
                              value={donateFormData.blood_group}
                              onValueChange={(value) =>
                                setDonateFormData((prev) => ({
                                  ...prev,
                                  blood_group: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your blood group" />
                              </SelectTrigger>
                              <SelectContent>
                                {bloodGroups.map((group) => (
                                  <SelectItem key={group} value={group}>
                                    {group}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="available_date">
                              Available Date
                            </Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <Input
                                id="available_date"
                                type="date"
                                value={donateFormData.available_date}
                                onChange={(e) =>
                                  setDonateFormData((prev) => ({
                                    ...prev,
                                    available_date: e.target.value,
                                  }))
                                }
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="contact_info">
                              Contact Information
                            </Label>
                            <Textarea
                              id="contact_info"
                              placeholder="Please provide your phone number, email, and any other relevant contact information"
                              value={donateFormData.contact_info}
                              onChange={(e) =>
                                setDonateFormData((prev) => ({
                                  ...prev,
                                  contact_info: e.target.value,
                                }))
                              }
                              rows={4}
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full medical-gradient text-white hover:opacity-90 py-3"
                          >
                            Register Donation Interest
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                রক্ত সংগ্রহ ও সংরক্ষণ সম্বন্ধে প্রশ্নোত্তর
              </h2>
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: রক্তদাতার নির্ধারিত বয়স কত?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: ১৮-৫৭ বছরের যে কোন সুস্থ পুরুষ বা মহিলা রক্তদান
                      করতে পারবেন।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: সুস্থতা বলতে কী বোঝায়?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>পুরুষের ক্ষেত্রে ন্যূনতম ওজন ১০০ পাউন্ড</li>
                      <li>মহিলার ক্ষেত্রে ন্যূনতম ওজন ৯৫ পাউন্ড</li>
                      <li>সিস্টোলিক রক্তচাপ: ১০০ – ১৬০ মিঃ মিঃ পারদচাপ</li>
                      <li>ডায়াস্টোলিক রক্তচাপ: ৬০ – ৯০ মিঃ মিঃ পারদচাপ</li>
                      <li>সম্প্রতি কোনো রোগে আক্রান্ত না থাকা</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: কোন কোন রোগে আক্রান্ত হলে রক্ত সংগ্রহ করা উচিত
                      নয়?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: ম্যালেরিয়া, কালাজ্বর, সিফিলিস, গনোরিয়া,
                      হেপাটাইটিস, এইডস ইত্যাদি রোগে আক্রান্ত হলে রক্ত সংগ্রহ করা
                      উচিত নয়।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: একবার রক্তদানে শরীর থেকে কতটুকু রক্ত সংগ্রহ করা
                      হয়?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: একজন মানুষের দেহে ৫-৬ লিটার রক্ত থাকে, যার মধ্যে
                      মাত্র ৩৫০-৪৬০ সিসি রক্ত সংগ্রহ করা হয়। রক্ত দেওয়ার পর
                      রক্তদাতাকে ১০ মিনিট শুয়ে বিশ্রাম নিতে হয় এবং দুই গ্লাস
                      পানি খেতে হয়।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: রক্ত দেওয়ার পর অতিরিক্ত খাবার কি দরকার আছে?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: না। শুধু রক্তদানের দিন অতিরিক্ত পরিশ্রম হয় এমন কাজ
                      না করাই ভালো।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: রক্ত সংগ্রহের সময় একটি সূঁচ কতবার ব্যবহার করা
                      হয়?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: একটি মাত্র সূঁচ কেবল একবার ব্যবহার করা হয়।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: রক্ত সংরক্ষণের ব্যাগের মধ্যে তরল পদার্থের কাজ কী?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: তরল পদার্থটি রক্ত জমাট বাঁধতে দেয় না।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: কত তাপমাত্রায় রক্ত সংরক্ষণ করা হয়?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      উত্তর: ২°-৮° সেলসিয়াস তাপমাত্রায় রক্ত সংরক্ষণ করা হয়।
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: সন্ধানীতে রক্তদানের সুবিধা কী?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>রক্তদাতাকে একটি রক্তদাতা কার্ড প্রদান করা হয়।</li>
                      <li>
                        প্রয়োজনে দেশের যেকোনো সন্ধানী ইউনিট থেকে সমপরিমাণ রক্ত
                        সংগ্রহ করা যায়।
                      </li>
                      <li>
                        বিনামূল্যে রোগ পরীক্ষার রিপোর্ট ও রক্তের গ্রুপ জানা
                        যায়।
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: সংগৃহীত রক্ত সন্ধানী কিভাবে বিতরণ করে?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>
                        হাসপাতালে, অসহায় গরীব রোগীদের মধ্যে বিনা শর্তে বিতরণ
                        করা হয়।
                      </li>
                      <li>
                        ডোনার কার্ডধারীদের যেকোনো সময় রক্ত সরবরাহ করা হয়।
                      </li>
                      <li>বিনিময় ভিত্তিতে রক্ত দেওয়া হয়।</li>
                      <li>জরুরি প্রয়োজনে বিনা শর্তে সরবরাহ করা হয়।</li>
                      <li>
                        <strong>সন্ধানী কোনোভাবেই রক্ত কেনাবেচা করে না।</strong>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      প্রশ্ন: পেশাদার রক্তদাতার রক্ত গ্রহণ করা উচিত নয় কেন?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-gray-600 list-disc list-inside space-y-2">
                      <li>তাদের অধিকাংশের হিমোগ্লোবিনের মাত্রা কম থাকে।</li>
                      <li>
                        অনেকে বিভিন্ন রোগে আক্রান্ত বা নেশাজাতীয় দ্রব্য গ্রহণ
                        করে।
                      </li>
                      <li>অনেকেই ৪ মাসের বিরতি না দিয়ে ঘন ঘন রক্ত দেয়।</li>
                      <li>
                        ফলস্বরূপ, এ ধরনের রক্ত রোগীর উপকারের চেয়ে অপকার বেশি
                        করে।
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/90 border-0">
          <div className="relative">
            {/* Image */}
            <img
              src={bloodImgUrl(bloodGalleryFiles[activeImgIndex])}
              alt={`Blood program large ${activeImgIndex + 1}`}
              className="w-full max-h-[80vh] object-contain bg-black"
            />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-4 py-2">
              {bloodGalleryFiles[activeImgIndex]}
            </div>

            {/* Prev / Next */}
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
              aria-label="Next image"
            >
              ›
            </button>

            {/* Thumbnails (optional) */}
            <div className="flex gap-2 overflow-x-auto p-3 bg-black/60">
              {bloodGalleryFiles.map((file, i) => (
                <button
                  key={file + i}
                  onClick={() => setActiveImgIndex(i)}
                  className={`relative h-14 w-20 flex-shrink-0 rounded overflow-hidden border
              ${
                i === activeImgIndex ? "border-red-500" : "border-transparent"
              }`}
                  aria-label={`Go to image ${i + 1}`}
                >
                  <img
                    src={bloodImgUrl(file)}
                    alt={`Thumb ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BloodInventoryPage;
