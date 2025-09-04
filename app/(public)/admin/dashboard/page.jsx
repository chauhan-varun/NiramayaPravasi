'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, User, LogOut } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/navbar';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [rejectedDoctors, setRejectedDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    // Get auth token from cookies
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      setAuthToken(token);
      fetchDoctors(token);
    } else if (session?.apiToken) {
      setAuthToken(session.apiToken);
      fetchDoctors(session.apiToken);
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const fetchDoctors = async (token) => {
    setIsLoading(true);
    try {
      console.log('Fetching doctors with token:', token ? token.substring(0, 15) + '...' : 'No token');
      
      const response = await fetch('/api/admin/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      
      const data = await response.json();
      console.log('Doctors data:', data);
      
      // Sort doctors by status
      setPendingDoctors(data.doctors?.filter(doc => doc.status === 'pending') || []);
      setApprovedDoctors(data.doctors?.filter(doc => doc.status === 'approved') || []);
      setRejectedDoctors(data.doctors?.filter(doc => doc.status === 'rejected') || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (doctorId, status) => {
    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${status} doctor`);
      }
      
      toast.success(`Doctor ${status} successfully`);
      fetchDoctors(authToken);
    } catch (error) {
      console.error(`Error ${status} doctor:`, error);
      toast.error(error.message);
    }
  };

  const renderDoctorList = (doctors, showActions = false) => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (doctors.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          No doctors found in this category
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2">
        {doctors.map(doctor => (
          <Card key={doctor._id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{doctor.name || 'Doctor'}</CardTitle>
                <Badge variant={
                  doctor.status === 'approved' ? 'success' : 
                  doctor.status === 'rejected' ? 'destructive' : 'default'
                }>
                  {doctor.status}
                </Badge>
              </div>
              <CardDescription>{doctor.email}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Registration date: {new Date(doctor.createdAt).toLocaleDateString()}</p>
              <p>Specialization: {doctor.specialization || 'Not specified'}</p>
            </CardContent>
            {showActions && (
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleStatusChange(doctor._id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleStatusChange(doctor._id, 'rejected')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    );
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending
              {pendingDoctors.length > 0 && (
                <Badge className="ml-2" variant="destructive">{pendingDoctors.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Pending Doctor Registrations</h2>
              <p className="text-muted-foreground">Review and approve/reject doctor registration requests</p>
            </div>
            {renderDoctorList(pendingDoctors, true)}
          </TabsContent>
          
          <TabsContent value="approved">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Approved Doctors</h2>
              <p className="text-muted-foreground">Doctors who have been approved</p>
            </div>
            {renderDoctorList(approvedDoctors)}
          </TabsContent>
          
          <TabsContent value="rejected">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Rejected Doctors</h2>
              <p className="text-muted-foreground">Doctors who have been rejected</p>
            </div>
            {renderDoctorList(rejectedDoctors)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}