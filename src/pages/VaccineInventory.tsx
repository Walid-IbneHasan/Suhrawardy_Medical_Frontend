import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { vaccineAPI, VaccineInventory } from '@/utils/api';
import { Syringe, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const VaccineInventoryPage = () => {
  const [vaccineInventory, setVaccineInventory] = useState<VaccineInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  // Default data for demo
  const defaultVaccineInventory = [
    { id: 1, type: 'Hepatitis B', available: true },
    { id: 2, type: 'Influenza', available: true },
    { id: 3, type: 'Tetanus', available: false },
    { id: 4, type: 'COVID-19', available: true },
    { id: 5, type: 'Rabies', available: true },
    { id: 6, type: 'Typhoid', available: false },
    { id: 7, type: 'Pneumonia', available: true },
    { id: 8, type: 'Meningitis', available: true }
  ];

  useEffect(() => {
    const fetchVaccineInventory = async () => {
      try {
        console.log('Fetching vaccine inventory...');
        const data = await vaccineAPI.getVaccineInventory();
        setVaccineInventory(data);
      } catch (error) {
        console.error('Failed to fetch vaccine inventory:', error);
        setVaccineInventory(defaultVaccineInventory);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccineInventory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Vaccine Inventory</h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="bg-gradient-to-br from-blue-50 to-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Vaccine Inventory</h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Check the current availability of vaccines in our inventory for immunization services.
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
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Vaccine</span>
                </Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaccineInventory.map((vaccine) => (
              <Card key={vaccine.id} className={`${vaccine.available ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Syringe className="w-5 h-5 text-blue-500" />
                    <span>{vaccine.type}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge 
                    variant={vaccine.available ? "default" : "destructive"}
                    className={`mb-4 ${vaccine.available ? "bg-green-500" : ""}`}
                  >
                    {vaccine.available ? 'Available' : 'Out of Stock'}
                  </Badge>
                  
                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex items-center space-x-1">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>
                      <Button size="sm" variant="destructive" className="flex items-center space-x-1">
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

export default VaccineInventoryPage;