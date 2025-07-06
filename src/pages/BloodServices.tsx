
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bloodInventoryAPI, vaccineInventoryAPI, bloodRequestAPI, bloodDonationAPI, BloodInventory, VaccineInventory } from '@/utils/api';
import { Heart, Activity, Calendar, User, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BloodServices = () => {
  const [bloodInventory, setBloodInventory] = useState<BloodInventory[]>([]);
  const [vaccineInventory, setVaccineInventory] = useState<VaccineInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'request' | 'donate' | 'inventory'>('inventory');
  const { toast } = useToast();

  // Form states
  const [requestForm, setRequestForm] = useState({
    blood_group: '',
    location: '',
    contact: '',
    date_required: ''
  });

  const [donateForm, setDonateForm] = useState({
    blood_group: '',
    available_date: '',
    contact_info: ''
  });

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

  const defaultVaccineInventory = [
    { id: 1, type: 'Hepatitis B', available: true },
    { id: 2, type: 'Influenza', available: true },
    { id: 3, type: 'Tetanus', available: false },
    { id: 4, type: 'COVID-19', available: true },
    { id: 5, type: 'Rabies', available: true }
  ];

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        console.log('Fetching blood and vaccine inventory...');
        const [bloodData, vaccineData] = await Promise.all([
          bloodInventoryAPI.getBloodInventory(),
          vaccineInventoryAPI.getVaccineInventory()
        ]);
        setBloodInventory(bloodData);
        setVaccineInventory(vaccineData);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
        setBloodInventory(defaultBloodInventory);
        setVaccineInventory(defaultVaccineInventory);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bloodRequestAPI.createBloodRequest(requestForm);
      toast({
        title: "Blood Request Submitted",
        description: "Your blood request has been submitted successfully. We will contact you soon."
      });
      setRequestForm({ blood_group: '', location: '', contact: '', date_required: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit blood request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bloodDonationAPI.createDonationInterest(donateForm);
      toast({
        title: "Donation Interest Registered",
        description: "Thank you for your interest in donating blood. We will contact you soon."
      });
      setDonateForm({ blood_group: '', available_date: '', contact_info: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register donation interest. Please try again.",
        variant: "destructive"
      });
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blood Services</h1>
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
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Blood Services</h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Save lives through blood donation or find the blood type you need. 
            Together, we can make a difference in our community's health.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'inventory', label: 'Blood Inventory', icon: Activity },
              { id: 'request', label: 'Request Blood', icon: Heart },
              { id: 'donate', label: 'Donate Blood', icon: User }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'request' | 'donate' | 'inventory')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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

      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Blood Inventory Tab */}
          {activeTab === 'inventory' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Current Blood Inventory</h2>
              
              {/* Blood Groups */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Blood Groups Available</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {bloodInventory.map((blood) => (
                    <Card key={blood.id} className={`text-center p-4 ${blood.available ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      <CardContent className="p-0">
                        <div className="text-2xl font-bold text-gray-900 mb-2">{blood.group}</div>
                        <Badge 
                          variant={blood.available ? "default" : "destructive"}
                          className={blood.available ? "bg-green-500" : ""}
                        >
                          {blood.available ? 'Available' : 'Not Available'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Vaccines */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Vaccines Available</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vaccineInventory.map((vaccine) => (
                    <Card key={vaccine.id} className={`${vaccine.available ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{vaccine.type}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge 
                          variant={vaccine.available ? "default" : "destructive"}
                          className={vaccine.available ? "bg-green-500" : ""}
                        >
                          {vaccine.available ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Request Blood Tab */}
          {activeTab === 'request' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Request Blood</h2>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    <span>Blood Request Form</span>
                  </CardTitle>
                  <CardDescription>
                    Fill out this form to request blood. We will contact you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRequestSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="blood_group">Blood Group Required</Label>
                      <Select 
                        value={requestForm.blood_group} 
                        onValueChange={(value) => setRequestForm(prev => ({ ...prev, blood_group: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
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
                          value={requestForm.location}
                          onChange={(e) => setRequestForm(prev => ({ ...prev, location: e.target.value }))}
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
                          value={requestForm.contact}
                          onChange={(e) => setRequestForm(prev => ({ ...prev, contact: e.target.value }))}
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
                          value={requestForm.date_required}
                          onChange={(e) => setRequestForm(prev => ({ ...prev, date_required: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full medical-gradient text-white hover:opacity-90 py-3">
                      Submit Blood Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Donate Blood Tab */}
          {activeTab === 'donate' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Donate Blood</h2>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    <span>Blood Donation Interest</span>
                  </CardTitle>
                  <CardDescription>
                    Register your interest in donating blood. Your contribution can save lives.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDonateSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="donor_blood_group">Your Blood Group</Label>
                      <Select 
                        value={donateForm.blood_group} 
                        onValueChange={(value) => setDonateForm(prev => ({ ...prev, blood_group: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="available_date">Available Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="available_date"
                          type="date"
                          value={donateForm.available_date}
                          onChange={(e) => setDonateForm(prev => ({ ...prev, available_date: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contact_info">Contact Information</Label>
                      <Textarea
                        id="contact_info"
                        placeholder="Please provide your phone number, email, and any other relevant contact information"
                        value={donateForm.contact_info}
                        onChange={(e) => setDonateForm(prev => ({ ...prev, contact_info: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full medical-gradient text-white hover:opacity-90 py-3">
                      Register Donation Interest
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BloodServices;
