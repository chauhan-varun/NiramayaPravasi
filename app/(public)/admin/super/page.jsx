'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Trash2, PencilLine, LogOut } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/components/navbar';

// Form validation schema
const adminSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Debugging - check if we have the token in cookie
  useEffect(() => {
    // Get the authToken cookie
    const cookies = document.cookie.split(';');
    const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
    console.log('Auth token cookie found:', !!authTokenCookie);
    
    // Manual check of token from cookies
    if (!authTokenCookie) {
      setAuthError('No auth token found in cookies');
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Fetch admins on component mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAdmins();
    }
  }, [status]);

  // Reset form when editing admin changes
  useEffect(() => {
    if (editingAdmin) {
      form.reset({
        email: editingAdmin.email,
        password: '' // Don't populate password for security reasons
      });
    } else {
      form.reset({
        email: '',
        password: ''
      });
    }
  }, [editingAdmin, form]);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      // Get auth token from cookies
      const cookies = document.cookie.split(';');
      const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
      const token = authTokenCookie ? authTokenCookie.split('=')[1] : null;
      
      if (!token) {
        throw new Error('No auth token found in cookies');
      }
      
      const response = await fetch('/api/superadmin/admins', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }
      
      const data = await response.json();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to fetch admins');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const url = editingAdmin
        ? `/api/superadmin/admins/${editingAdmin._id}`
        : '/api/superadmin/admins';
      
      const method = editingAdmin ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.apiToken}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(editingAdmin ? 'Failed to update admin' : 'Failed to create admin');
      }
      
      toast.success(editingAdmin ? 'Admin updated successfully' : 'Admin created successfully');
      setEditingAdmin(null);
      form.reset({
        email: '',
        password: ''
      });
      fetchAdmins();
    } catch (error) {
      console.error('Error saving admin:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const response = await fetch(`/api/superadmin/admins/${adminId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.apiToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete admin');
        }
        
        toast.success('Admin deleted successfully');
        fetchAdmins();
      } catch (error) {
        console.error('Error deleting admin:', error);
        toast.error(error.message);
      }
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
  };

  const handleCancelEdit = () => {
    setEditingAdmin(null);
    form.reset({
      email: '',
      password: ''
    });
  };

  const handleLogout = async () => {
    try {
      // Clear the auth token cookie
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      // Sign out from next-auth session
      await signOut({ redirect: false });
      
      toast.success("Logged out successfully");
      
      // Redirect to login page
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</CardTitle>
                <CardDescription>
                  {editingAdmin 
                    ? 'Update the admin information below' 
                    : 'Create a new admin account by filling in the details below'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Password {editingAdmin && <span className="text-xs text-muted-foreground">(Leave blank to keep current password)</span>}
                          </FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingAdmin ? 'Update Admin' : 'Create Admin'}
                      </Button>
                      {editingAdmin && (
                        <Button type="button" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Admin Accounts</CardTitle>
                <CardDescription>Manage existing admin accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : admins.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No admin accounts found. Create one to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {admins.map((admin) => (
                      <div key={admin._id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{admin.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(admin.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(admin)}>
                            <PencilLine className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(admin._id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}