'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Calendar, Clock, Users, FileText } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/components/navbar';

export default function DoctorDashboard() {
  const { data: session, status } = useSession();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (status === 'authenticated' && session?.apiToken) {
      fetchDoctorInfo();
    }
  }, [status, session]);

  const fetchDoctorInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/doctor/profile', {
        headers: {
          'Authorization': `Bearer ${session.apiToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctor information');
      }
      
      const data = await response.json();
      setDoctorInfo(data.doctor);
    } catch (error) {
      console.error('Error fetching doctor info:', error);
      toast.error('Failed to load your profile information');
    } finally {
      setIsLoading(false);
    }
  };

  // Show pending approval state if doctor is not approved
  if (session?.user?.status === 'pending' || (doctorInfo && doctorInfo.status === 'pending')) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container flex flex-col items-center justify-center h-[80vh]">
          <div className="max-w-md text-center">
            <div className="rounded-full bg-yellow-100 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
            <p className="text-muted-foreground mb-6">
              Your doctor account is currently under review by our admin team.
              You'll receive an email once your account has been approved.
            </p>
            <Badge variant="outline" className="mx-auto">Status: Pending</Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container py-10">
          <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Registered patients</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Scheduled for next 7 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Records created</p>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="patients">Patients</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Welcome, Dr. {doctorInfo?.name || doctorInfo?.email}</CardTitle>
                      <CardDescription>
                        This is your dashboard overview. You currently have no appointments scheduled.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Your Profile</h4>
                          <div className="rounded-md bg-secondary p-4">
                            <div className="grid gap-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="font-medium">Email</div>
                                <div>{doctorInfo?.email}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="font-medium">Specialization</div>
                                <div>{doctorInfo?.specialization || 'Not specified'}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="font-medium">Status</div>
                                <div><Badge variant="success">Approved</Badge></div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="font-medium">Member Since</div>
                                <div>{doctorInfo?.createdAt ? new Date(doctorInfo.createdAt).toLocaleDateString() : 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="appointments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appointments</CardTitle>
                      <CardDescription>
                        View and manage your upcoming appointments
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-center py-10 text-muted-foreground">
                        No appointments scheduled yet.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="patients" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Patients</CardTitle>
                      <CardDescription>
                        View and manage your patient records
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-center py-10 text-muted-foreground">
                        No patients registered yet.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
