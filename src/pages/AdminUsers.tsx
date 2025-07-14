import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Users, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    email: 'admin@medicare.com',
    username: 'admin',
    is_staff: true,
    is_superuser: true,
    date_joined: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    email: 'doctor@medicare.com',
    username: 'doctor1',
    is_staff: true,
    is_superuser: false,
    date_joined: '2024-02-20T14:15:00Z',
  },
  {
    id: 3,
    email: 'nurse@medicare.com',
    username: 'nurse1',
    is_staff: false,
    is_superuser: false,
    date_joined: '2024-03-10T09:45:00Z',
  },
];

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
              <p className="text-gray-600">Manage user accounts and permissions</p>
            </div>
          </div>
          <Link to="/admin/users/new">
            <Button className="medical-gradient text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
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
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.username || 'N/A'}</TableCell>
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
                      <div className="flex space-x-2">
                        <Link to={`/admin/users/${user.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;