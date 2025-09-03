'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, User } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/components/navbar';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [rejectedDoctors, setRejectedDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (session?.apiToken) {
      fetchDoctors();
    }
  }, [session]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/doctors', {
        headers: {
          'Authorization': `Bearer ${session.apiToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      
      const data = await response.json();
      
      // Sort doctors by status
      setPendingDoctors(data.doctors.filter(doc => doc.status === 'pending') || []);
      setApprovedDoctors(data.doctors.filter(doc => doc.status === 'approved') || []);
      setRejectedDoctors(data.doctors.filter(doc => doc.status === 'rejected') || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors');
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
          'Authorization': `Bearer ${session.apiToken}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${status} doctor`);
      }
      
      toast.success(`Doctor ${status} successfully`);
      fetchDoctors();
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

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container py-10">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
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
    </ProtectedRoute>
  );
}
