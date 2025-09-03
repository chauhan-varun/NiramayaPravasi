'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Calendar, User, FileText, Phone } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/protected-route';
import Navbar from '@/components/navbar';

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const [patientInfo, setPatientInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (status === 'authenticated' && session?.apiToken) {
      fetchPatientInfo();
    }
  }, [status, session]);

  const fetchPatientInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/patient/profile', {
        headers: {
          'Authorization': `Bearer ${session.apiToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient information');
      }
      
      const data = await response.json();
      setPatientInfo(data.patient);
    } catch (error) {
      console.error('Error fetching patient info:', error);
      toast.error('Failed to load your profile information');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container py-10">
          <h1 className="text-3xl font-bold mb-8">Patient Dashboard</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3 mb-8">
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
                    <p className="text-xs text-muted-foreground">Available records</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Your Doctors</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Assigned doctors</p>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="medicalRecords">Medical Records</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Welcome, {patientInfo?.name || 'Patient'}</CardTitle>
                      <CardDescription>
                        This is your health dashboard. You can book appointments, view your medical records, 
                        and manage your health profile here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Your Profile</h4>
                        <div className="rounded-md bg-secondary p-4">
                          <div className="grid gap-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="font-medium">Phone</div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {patientInfo?.phone}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="font-medium">Member Since</div>
                              <div>{patientInfo?.createdAt ? new Date(patientInfo.createdAt).toLocaleDateString() : 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Quick Actions</h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          <Button variant="outline" className="justify-start">
                            <Calendar className="mr-2 h-4 w-4" />
                            Book New Appointment
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <FileText className="mr-2 h-4 w-4" />
                            View Medical History
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appointments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Appointments</CardTitle>
                      <CardDescription>
                        View and manage your upcoming and past appointments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-10 text-muted-foreground">
                        No appointments scheduled yet.
                      </div>
                      <div className="flex justify-center mt-4">
                        <Button>
                          <Calendar className="mr-2 h-4 w-4" />
                          Book New Appointment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="medicalRecords" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Records</CardTitle>
                      <CardDescription>
                        Access your medical history, prescriptions, and test results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-10 text-muted-foreground">
                        No medical records available yet.
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
