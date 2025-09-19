import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Award,
  Users,
  Heart,
  Activity,
  Shield,
  Star,
  CheckCircle,
  Trophy,
  UserCheck,
  HeartPulse,
} from "lucide-react";
import {
  aboutAPI,
  adminAPI,
  HomeAbout,
  MissionStatement,
  HomeAboutAchievement,
} from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AboutSection = () => {
  const [homeAbout, setHomeAbout] = useState<HomeAbout | null>(null);
  const [missionStatement, setMissionStatement] =
    useState<MissionStatement | null>(null);
  const [achievements, setAchievements] = useState<HomeAboutAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "homeAbout" | "mission" | "achievement" | null
  >(null);
  const [editingHomeAbout, setEditingHomeAbout] = useState<HomeAbout | null>(
    null
  );
  const [editingMission, setEditingMission] = useState<MissionStatement | null>(
    null
  );
  const [editingAchievement, setEditingAchievement] =
    useState<HomeAboutAchievement | null>(null);
  const [homeAboutForm, setHomeAboutForm] = useState({
    title: "",
    description: "",
  });
  const [missionForm, setMissionForm] = useState({ statement: "" });
  const [achievementForm, setAchievementForm] = useState({
    title: "",
    description: "",
    icon: "",
  });
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const quillRef = useRef<ReactQuill>(null);

  // Default filler values
  const defaultHomeAbout: HomeAbout = {
    id: 0,
    title: "About MediCare Plus",
    description:
      "For over 25 years, MediCare Plus has been at the forefront of providing exceptional healthcare services to our community.<br>Our team of board-certified physicians, nurses, and healthcare professionals is dedicated to delivering personalized care.",
    years_experience: 25,
    patients_served: "50K+",
    satisfaction_rate: "100%",
  };

  const defaultMissionStatement: MissionStatement = {
    id: 0,
    statement:
      "To provide accessible, high-quality healthcare services that improve the health and well-being of our community while maintaining the highest standards of medical excellence and compassionate care.",
  };

  const defaultAchievements: HomeAboutAchievement[] = [
    {
      id: 1,
      title: "Excellence Award",
      description: "Recognized for outstanding healthcare services",
      icon: "Award",
    },
    {
      id: 2,
      title: "Expert Team",
      description: "Board-certified specialists and caring staff",
      icon: "Users",
    },
    {
      id: 3,
      title: "Compassionate Care",
      description: "Patient-centered approach to healthcare",
      icon: "Heart",
    },
    {
      id: 4,
      title: "Advanced Technology",
      description: "State-of-the-art medical equipment and facilities",
      icon: "Activity",
    },
  ];

  // Icon options for admin dropdown
  const iconOptions = [
    "Award",
    "Users",
    "Heart",
    "Activity",
    "Shield",
    "Star",
    "CheckCircle",
    "Trophy",
    "UserCheck",
    "HeartPulse",
  ];

  // Map icon strings to Lucide components
  const iconMap: {
    [key: string]: React.ComponentType<{ className?: string }>;
  } = {
    Award,
    Users,
    Heart,
    Activity,
    Shield,
    Star,
    CheckCircle,
    Trophy,
    UserCheck,
    HeartPulse,
  };

  // Quill toolbar configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeAboutData, missionData, achievementData] = await Promise.all(
          [
            aboutAPI.getHomeAbout(),
            aboutAPI.getMissionStatement(),
            aboutAPI.getHomeAchievements(),
          ]
        );
        setHomeAbout(homeAboutData[0] || defaultHomeAbout);
        setMissionStatement(missionData[0] || defaultMissionStatement);
        setAchievements(
          achievementData.length > 0 ? achievementData : defaultAchievements
        );
      } catch (error: any) {
        console.error("Failed to fetch About section data:", error);
        toast({
          title: "Error",
          description:
            "Failed to fetch About section data, using default values",
          variant: "destructive",
        });
        setHomeAbout(defaultHomeAbout);
        setMissionStatement(defaultMissionStatement);
        setAchievements(defaultAchievements);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleCreateHomeAbout = async () => {
    try {
      await adminAPI.homeAbout.create({
        ...homeAboutForm,
        years_experience: 25,
        patients_served: "50K+",
        satisfaction_rate: "100%",
      });
      toast({
        title: "Success",
        description: "Home About created successfully",
      });
      setDialogOpen(false);
      setHomeAboutForm({
        title: "",
        description: "",
      });
      const data = await aboutAPI.getHomeAbout();
      setHomeAbout(data[0] || defaultHomeAbout);
    } catch (error: any) {
      console.error("Failed to create Home About:", error);
      toast({
        title: "Error",
        description: `Failed to create Home About: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleEditHomeAbout = async () => {
    if (!editingHomeAbout) return;
    try {
      await adminAPI.homeAbout.update(editingHomeAbout.id, {
        ...homeAboutForm,
        years_experience: editingHomeAbout.years_experience,
        patients_served: editingHomeAbout.patients_served,
        satisfaction_rate: editingHomeAbout.satisfaction_rate,
      });
      toast({
        title: "Success",
        description: "Home About updated successfully",
      });
      setDialogOpen(false);
      setEditingHomeAbout(null);
      setHomeAboutForm({
        title: "",
        description: "",
      });
      const data = await aboutAPI.getHomeAbout();
      setHomeAbout(data[0] || defaultHomeAbout);
    } catch (error: any) {
      console.error("Failed to update Home About:", error);
      toast({
        title: "Error",
        description: `Failed to update Home About: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteHomeAbout = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Home About section?"))
      return;
    try {
      await adminAPI.homeAbout.delete(id);
      toast({
        title: "Success",
        description: "Home About deleted successfully",
      });
      const data = await aboutAPI.getHomeAbout();
      setHomeAbout(data[0] || defaultHomeAbout);
    } catch (error: any) {
      console.error("Failed to delete Home About:", error);
      toast({
        title: "Error",
        description: `Failed to delete Home About: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleCreateMission = async () => {
    try {
      await adminAPI.missionStatement.create(missionForm);
      toast({
        title: "Success",
        description: "Mission Statement created successfully",
      });
      setDialogOpen(false);
      setMissionForm({ statement: "" });
      const data = await aboutAPI.getMissionStatement();
      setMissionStatement(data[0] || defaultMissionStatement);
    } catch (error: any) {
      console.error("Failed to create Mission Statement:", error);
      toast({
        title: "Error",
        description: `Failed to create Mission Statement: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleEditMission = async () => {
    if (!editingMission) return;
    try {
      await adminAPI.missionStatement.update(editingMission.id, missionForm);
      toast({
        title: "Success",
        description: "Mission Statement updated successfully",
      });
      setDialogOpen(false);
      setEditingMission(null);
      setMissionForm({ statement: "" });
      const data = await aboutAPI.getMissionStatement();
      setMissionStatement(data[0] || defaultMissionStatement);
    } catch (error: any) {
      console.error("Failed to update Mission Statement:", error);
      toast({
        title: "Error",
        description: `Failed to update Mission Statement: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMission = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Mission Statement?"))
      return;
    try {
      await adminAPI.missionStatement.delete(id);
      toast({
        title: "Success",
        description: "Mission Statement deleted successfully",
      });
      const data = await aboutAPI.getMissionStatement();
      setMissionStatement(data[0] || defaultMissionStatement);
    } catch (error: any) {
      console.error("Failed to delete Mission Statement:", error);
      toast({
        title: "Error",
        description: `Failed to delete Mission Statement: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleCreateAchievement = async () => {
    try {
      await adminAPI.homeAchievements.create(achievementForm);
      toast({
        title: "Success",
        description: "Achievement created successfully",
      });
      setDialogOpen(false);
      setAchievementForm({ title: "", description: "", icon: "" });
      const data = await aboutAPI.getHomeAchievements();
      setAchievements(data.length > 0 ? data : defaultAchievements);
    } catch (error: any) {
      console.error("Failed to create Achievement:", error);
      toast({
        title: "Error",
        description: `Failed to create Achievement: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleEditAchievement = async () => {
    if (!editingAchievement) return;
    try {
      await adminAPI.homeAchievements.update(
        editingAchievement.id,
        achievementForm
      );
      toast({
        title: "Success",
        description: "Achievement updated successfully",
      });
      setDialogOpen(false);
      setEditingAchievement(null);
      setAchievementForm({ title: "", description: "", icon: "" });
      const data = await aboutAPI.getHomeAchievements();
      setAchievements(data.length > 0 ? data : defaultAchievements);
    } catch (error: any) {
      console.error("Failed to update Achievement:", error);
      toast({
        title: "Error",
        description: `Failed to update Achievement: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAchievement = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Achievement?")) return;
    try {
      await adminAPI.homeAchievements.delete(id);
      toast({
        title: "Success",
        description: "Achievement deleted successfully",
      });
      const data = await aboutAPI.getHomeAchievements();
      setAchievements(data.length > 0 ? data : defaultAchievements);
    } catch (error: any) {
      console.error("Failed to delete Achievement:", error);
      toast({
        title: "Error",
        description: `Failed to delete Achievement: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = (type: "homeAbout" | "mission" | "achievement") => {
    setDialogType(type);
    setEditingHomeAbout(null);
    setEditingMission(null);
    setEditingAchievement(null);
    setHomeAboutForm({
      title: "",
      description: "",
    });
    setMissionForm({ statement: "" });
    setAchievementForm({ title: "", description: "", icon: "Award" });
    setDialogOpen(true);
  };

  const openEditHomeAboutDialog = (item: HomeAbout) => {
    setDialogType("homeAbout");
    setEditingHomeAbout(item);
    setHomeAboutForm({
      title: item.title,
      description: item.description,
    });
    setDialogOpen(true);
  };

  const openEditMissionDialog = (item: MissionStatement) => {
    setDialogType("mission");
    setEditingMission(item);
    setMissionForm({ statement: item.statement });
    setDialogOpen(true);
  };

  const openEditAchievementDialog = (item: HomeAboutAchievement) => {
    setDialogType("achievement");
    setEditingAchievement(item);
    setAchievementForm({
      title: item.title,
      description: item.description,
      icon: item.icon,
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-6"></div>
              <div className="w-24 h-1 bg-gray-200 rounded mb-8"></div>
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-8"></div>
              <div className="flex gap-4">
                <div className="h-12 w-40 bg-gray-200 rounded"></div>
                <div className="h-12 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-lg animate-pulse"
                >
                  <div className="h-16 w-16 bg-gray-200 rounded-xl mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Admin Actions for Home About */}
        {isAdmin && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-lg font-medium text-red-800">
                Admin Panel - Home About
              </h3>
              <Dialog
                open={dialogOpen && dialogType === "homeAbout"}
                onOpenChange={setDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => openCreateDialog("homeAbout")}
                    className="flex items-center space-x-2 sm:w-auto w-full text-sm"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Home About</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingHomeAbout
                        ? "Edit Home About"
                        : "Create Home About"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingHomeAbout
                        ? "Update the Home About details below."
                        : "Fill in the details to create a new Home About section."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter Home About title (e.g., About MediCare Plus)"
                      value={homeAboutForm.title}
                      onChange={(e) =>
                        setHomeAboutForm({
                          ...homeAboutForm,
                          title: e.target.value,
                        })
                      }
                    />
                    <ReactQuill
                      ref={quillRef}
                      value={homeAboutForm.description}
                      onChange={(content) =>
                        setHomeAboutForm({
                          ...homeAboutForm,
                          description: content,
                        })
                      }
                      modules={quillModules}
                      className="bg-white border border-gray-200 rounded"
                      placeholder="Write your Home About description here..."
                    />
                    <Button
                      onClick={
                        editingHomeAbout
                          ? handleEditHomeAbout
                          : handleCreateHomeAbout
                      }
                      className="w-full"
                    >
                      {editingHomeAbout ? "Update" : "Create"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {homeAbout && (
              <div className="mt-4 flex space-x-2 flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditHomeAboutDialog(homeAbout)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteHomeAbout(homeAbout.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {homeAbout?.title}
            </h2>
            <div className="w-24 h-1 medical-gradient rounded-full mb-8"></div>
            <div className="text-lg text-gray-600 mb-6 leading-relaxed">
              {homeAbout?.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: homeAbout.description }}
                />
              ) : (
                <p>
                  For over 25 years, MediCare Plus has been at the forefront of
                  providing exceptional healthcare services to our community.
                  <br />
                  Our team of board-certified physicians, nurses, and healthcare
                  professionals is dedicated to delivering personalized care.
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/about">
                <Button
                  size="lg"
                  className="medical-gradient text-white hover:opacity-90 px-8 py-3"
                >
                  বিস্তারিত জানুন
                </Button>
              </Link>
              <Link to="/blood-inventory">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3"
                >
                  রক্ত সেবা
                </Button>
              </Link>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="animate-slide-in-left">
            {isAdmin && (
              <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-lg font-medium text-red-800">
                    Admin Panel - Achievements
                  </h3>
                  <Dialog
                    open={dialogOpen && dialogType === "achievement"}
                    onOpenChange={setDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => openCreateDialog("achievement")}
                        className="flex items-center space-x-2 sm:w-auto w-full text-sm"
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Achievement</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingAchievement
                            ? "Edit Achievement"
                            : "Create Achievement"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingAchievement
                            ? "Update the achievement details below."
                            : "Fill in the details to create a new achievement."}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Enter achievement title (e.g., Excellence Award)"
                          value={achievementForm.title}
                          onChange={(e) =>
                            setAchievementForm({
                              ...achievementForm,
                              title: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Enter achievement description"
                          value={achievementForm.description}
                          onChange={(e) =>
                            setAchievementForm({
                              ...achievementForm,
                              description: e.target.value,
                            })
                          }
                          rows={4}
                        />
                        <Select
                          value={achievementForm.icon}
                          onValueChange={(value) =>
                            setAchievementForm({
                              ...achievementForm,
                              icon: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                {icon}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={
                            editingAchievement
                              ? handleEditAchievement
                              : handleCreateAchievement
                          }
                          className="w-full"
                        >
                          {editingAchievement ? "Update" : "Create"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement) => {
                const IconComponent = iconMap[achievement.icon] || Award;
                return (
                  <Card
                    key={achievement.id}
                    className="medical-card-hover border-0 shadow-lg text-center p-6"
                  >
                    <CardContent className="p-0 flex flex-col h-full justify-between">
                      <div>
                        <div className="medical-gradient w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                      {isAdmin && (
                        <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              openEditAchievementDialog(achievement)
                            }
                            className="w-full sm:w-auto"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDeleteAchievement(achievement.id)
                            }
                            className="w-full sm:w-auto"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
