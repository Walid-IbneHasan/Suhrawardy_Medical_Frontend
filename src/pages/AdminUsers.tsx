import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Users, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { adminAPI, User } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    username: "",
    is_superuser: false,
  });
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!isAdmin) {
          throw new Error("Unauthorized access");
        }
        const data = await adminAPI.users.getAll();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, toast]);

  const handleCreateUser = async () => {
    if (formData.password !== formData.confirm_password) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      await adminAPI.users.create({
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        username: formData.username || undefined,
        is_staff: formData.is_superuser, // Set is_staff to true if is_superuser is true
        is_superuser: formData.is_superuser,
      });
      toast({ title: "Success", description: "User created successfully" });
      setDialogOpen(false);
      setFormData({
        email: "",
        password: "",
        confirm_password: "",
        username: "",
        is_superuser: false,
      });
      const data = await adminAPI.users.getAll();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminAPI.users.delete(id);
      toast({ title: "Success", description: "User deleted successfully" });
      const data = await adminAPI.users.getAll();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  // NEW: Promote/Demote handlers
  const handlePromoteToSuperuser = async (u: User) => {
    try {
      await adminAPI.users.update(u.id, { is_superuser: true, is_staff: true });
      toast({
        title: "Promoted",
        description: `${u.email} is now a super admin.`,
      });
      const data = await adminAPI.users.getAll();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to make the user admin",
        variant: "destructive",
      });
    }
  };

  const handleDemoteFromSuperuser = async (u: User) => {
    if (!confirm(`Remove admin privileges from ${u.email}?`)) return;
    try {
      await adminAPI.users.update(u.id, { is_superuser: false });
      toast({
        title: "Demoted",
        description: `${u.email} is no longer a super admin.`,
      });
      const data = await adminAPI.users.getAll();
      setUsers(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to remove admin privileges",
        variant: "destructive",
      });
    }
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <span>User Management</span>
              </h1>
              <p className="text-gray-600">
                Manage user accounts and permissions
              </p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="medical-gradient text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username (optional)</Label>
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirm_password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirm_password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_superuser"
                    checked={formData.is_superuser}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_superuser: !!checked })
                    }
                  />
                  <Label htmlFor="is_superuser">Super Admin</Label>
                </div>
                <Button
                  onClick={handleCreateUser}
                  className="w-full medical-gradient text-white"
                  disabled={
                    !formData.email ||
                    !formData.password ||
                    !formData.confirm_password
                  }
                >
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-gray-600">No users found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.email}
                      </TableCell>
                      <TableCell>{user.username || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {user.is_superuser && (
                            <Badge variant="destructive">Super Admin</Badge>
                          )}
                          {user.is_staff && !user.is_superuser && (
                            <Badge variant="secondary">Staff</Badge>
                          )}
                          {!user.is_staff && (
                            <Badge variant="outline">User</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.date_joined)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.is_superuser ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDemoteFromSuperuser(user)}
                            >
                              Remove Admin
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="medical-gradient text-white"
                              onClick={() => handlePromoteToSuperuser(user)}
                            >
                              Make Admin
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      </div>
      <Footer />
    </div>
  );
};

export default AdminUsers;
