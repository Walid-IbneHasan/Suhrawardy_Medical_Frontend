import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { bloodAPI, BloodInventory, adminAPI } from '@/utils/api';
import { Heart, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const BloodInventoryPage = () => {
  const [bloodInventory, setBloodInventory] = useState<BloodInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlood, setEditingBlood] = useState<BloodInventory | null>(null);
  const [formData, setFormData] = useState({ group: '', available: false });
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  // Default data for demo
  const defaultBloodInventory = [
    { id: 1, group: 'A+', available: true },
    { id: 2, group: 'A-', available: false },
    { id: 3, group: 'B+', available: true },
    { id: 4, group: 'B-', available: true },
    { id: 5, group: 'AB+', available: false },
    { id: 6, group: 'AB-', available: true },
    { id: 7, group: 'O+', available: true },
    { id: 8, group: 'O-', available: false }
  ];

  useEffect(() => {
    const fetchBloodInventory = async () => {
      try {
        console.log('Fetching blood inventory...');
        const data = await bloodAPI.getBloodInventory();
        setBloodInventory(data);
      } catch (error) {
        console.error('Failed to fetch blood inventory:', error);
        setBloodInventory(defaultBloodInventory);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodInventory();
  }, []);

  const handleCreateBloodInventory = async () => {
    try {
      await adminAPI.bloodInventory.create(formData);
      toast({ title: "Success", description: "Blood inventory created successfully" });
      setDialogOpen(false);
      setFormData({ group: '', available: false });
      // Refresh inventory
      const data = await bloodAPI.getBloodInventory();
      setBloodInventory(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create blood inventory", variant: "destructive" });
    }
  };

  const handleEditBloodInventory = async () => {
    if (!editingBlood) return;
    try {
      await adminAPI.bloodInventory.update(editingBlood.id, formData);
      toast({ title: "Success", description: "Blood inventory updated successfully" });
      setDialogOpen(false);
      setEditingBlood(null);
      setFormData({ group: '', available: false });
      // Refresh inventory
      const data = await bloodAPI.getBloodInventory();
      setBloodInventory(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update blood inventory", variant: "destructive" });
    }
  };

  const handleDeleteBloodInventory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blood inventory?')) return;
    try {
      await adminAPI.bloodInventory.delete(id);
      toast({ title: "Success", description: "Blood inventory deleted successfully" });
      // Refresh inventory
      const data = await bloodAPI.getBloodInventory();
      setBloodInventory(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete blood inventory", variant: "destructive" });
    }
  };

  const openCreateDialog = () => {
    setEditingBlood(null);
    setFormData({ group: '', available: false });
    setDialogOpen(true);
  };

  const openEditDialog = (blood: BloodInventory) => {
    setEditingBlood(blood);
    setFormData({ group: blood.group, available: blood.available });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blood Inventory</h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Blood Inventory</h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Check the current availability of different blood types in our inventory.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Admin Actions */}
          {isAdmin && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-blue-800">Admin Panel</h3>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateDialog} className="flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Blood Group</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingBlood ? 'Edit Blood Inventory' : 'Create New Blood Inventory'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Blood group (e.g., A+, O-)"
                        value={formData.group}
                        onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="available"
                          checked={formData.available}
                          onCheckedChange={(checked) => setFormData({ ...formData, available: !!checked })}
                        />
                        <label htmlFor="available" className="text-sm font-medium">
                          Available
                        </label>
                      </div>
                      <Button
                        onClick={editingBlood ? handleEditBloodInventory : handleCreateBloodInventory}
                        className="w-full"
                      >
                        {editingBlood ? 'Update Inventory' : 'Create Inventory'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {bloodInventory.map((blood) => (
              <Card key={blood.id} className={`text-center p-4 ${blood.available ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-gray-900">{blood.group}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Badge 
                    variant={blood.available ? "default" : "destructive"}
                    className={`mb-3 ${blood.available ? "bg-green-500" : ""}`}
                  >
                    {blood.available ? 'Available' : 'Not Available'}
                  </Badge>
                  
                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex flex-col space-y-1">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(blood)} className="flex items-center justify-center space-x-1">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteBloodInventory(blood.id)} className="flex items-center justify-center space-x-1">
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
      </section>
    </div>
  );
};

export default BloodInventoryPage;