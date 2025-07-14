import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  Heart, 
  Shield, 
  Database,
  Plus 
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

const Admin: React.FC = () => {
  const { user } = useAuth();

  const adminSections = [
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      path: '/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Blog Management',
      description: 'Create and manage blog posts',
      icon: FileText,
      path: '/admin/blogs',
      color: 'bg-green-500',
    },
    {
      title: 'Event Management',
      description: 'Organize and manage events',
      icon: Calendar,
      path: '/admin/events',
      color: 'bg-purple-500',
    },
    {
      title: 'Service Management',
      description: 'Manage medical services',
      icon: Settings,
      path: '/admin/services',
      color: 'bg-orange-500',
    },
    {
      title: 'Blood Inventory',
      description: 'Monitor blood inventory levels',
      icon: Heart,
      path: '/admin/blood-inventory',
      color: 'bg-red-500',
    },
    {
      title: 'Vaccine Inventory',
      description: 'Track vaccine availability',
      icon: Shield,
      path: '/admin/vaccine-inventory',
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.email}. Manage your medical center from here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Card key={section.path} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${section.color} text-white`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={section.path}>
                  <Button className="w-full" variant="outline">
                    Manage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/admin/blogs/new">
                  <Button className="w-full medical-gradient text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Blog Post
                  </Button>
                </Link>
                <Link to="/admin/events/new">
                  <Button className="w-full medical-gradient text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </Link>
                <Link to="/admin/services/new">
                  <Button className="w-full medical-gradient text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Service
                  </Button>
                </Link>
                <Link to="/admin/users/new">
                  <Button className="w-full medical-gradient text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New User
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;