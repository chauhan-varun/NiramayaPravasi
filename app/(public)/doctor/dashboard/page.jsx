'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { 
  Loader2, 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  Activity, 
  Bell, 
  CheckCircle2,
  XCircle, 
  AlertCircle,
  User
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import ProtectedRoute from '@/components/protected-route';
import DoctorNavbar from '@/components/doctor-navbar';

export default function DoctorDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for demonstration
  const stats = {
    patients: 14,
    appointments: 5,
    completedAppointments: 43,
    pendingAppointments: 2
  };

  const recentAppointments = [
    { id: 1, patient: "Alice Smith", date: "2023-09-24", time: "10:30 AM", status: "completed" },
    { id: 2, patient: "Bob Johnson", date: "2023-09-25", time: "2:15 PM", status: "upcoming" },
    { id: 3, patient: "Carol Williams", date: "2023-09-26", time: "11:00 AM", status: "upcoming" },
  ];

  const upcomingReminders = [
    { id: 1, title: "Follow up with Mr. Kumar", time: "Tomorrow, 10:00 AM" },
    { id: 2, title: "Review lab results for Jane Doe", time: "Sep 27, 3:00 PM" }
  ];

  useEffect(() => {
    if (status === 'authenticated') {
      // For demonstration, we'll set a timeout to simulate loading
      const timer = setTimeout(() => {
        setDoctorInfo({
          email: session?.user?.email || "doctor@example.com",
          name: "Dr. John Smith",
          specialization: "Cardiologist",
          status: "approved",
          createdAt: new Date("2023-01-15"),
          consultationFees: 1500,
          experienceYears: 8,
          patients: 120,
          rating: 4.8
        });
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [status, session]);

  // Show pending approval state if doctor is not approved
  if (session?.user?.status === 'pending' || (doctorInfo && doctorInfo.status === 'pending')) {
    router.push('/doctor/pending');
    return null;
  }
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="min-h-screen bg-background">
        <DoctorNavbar />
        
        <main className="container py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, Dr. {doctorInfo?.name?.split(" ")[1] || "Smith"}</p>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.patients}</div>
                    <p className="text-xs text-muted-foreground">+2 this week</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.appointments}</div>
                    <p className="text-xs text-muted-foreground">Next 7 days</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98%</div>
                    <Progress value={98} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{upcomingReminders.length}</div>
                    <p className="text-xs text-muted-foreground">Reminders & follow-ups</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (2/3 width on large screens) */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>
                        Your scheduled appointments for the next 7 days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recentAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {recentAppointments.map(appointment => (
                            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{appointment.patient}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {appointment.date}, {appointment.time}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(appointment.status)}
                                <Button variant="ghost" size="sm" onClick={() => router.push(`/doctor/appointments/${appointment.id}`)}>
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No upcoming appointments
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button variant="outline" onClick={() => router.push('/doctor/appointments')}>
                        View All Appointments
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Activity</CardTitle>
                      <CardDescription>
                        Recent patient interactions and records
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="mt-0.5">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Medical record updated</h4>
                            <p className="text-sm text-muted-foreground">
                              Added prescription details for Alice Smith
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Today, 11:30 AM
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="mt-0.5">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Lab results received</h4>
                            <p className="text-sm text-muted-foreground">
                              Blood work results for Bob Johnson need review
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Yesterday, 3:45 PM
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="mt-0.5">
                            <XCircle className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">Appointment cancelled</h4>
                            <p className="text-sm text-muted-foreground">
                              David Wilson cancelled his appointment
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Sep 22, 9:15 AM
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column (1/3 width on large screens) */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Doctor Profile</CardTitle>
                      <CardDescription>
                        Your professional information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                          <User className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg">{doctorInfo.name}</h3>
                        <p className="text-muted-foreground">{doctorInfo.specialization}</p>
                        <div className="mt-1 flex items-center">
                          <span className="text-amber-500 font-semibold">{doctorInfo.rating}</span>
                          <span className="text-muted-foreground text-sm ml-1">/ 5 rating</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 space-y-2">
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          <span className="text-muted-foreground">Experience</span>
                          <span className="font-medium">{doctorInfo.experienceYears} years</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          <span className="text-muted-foreground">Consultation Fee</span>
                          <span className="font-medium">₹{doctorInfo.consultationFees}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          <span className="text-muted-foreground">Total Patients</span>
                          <span className="font-medium">{doctorInfo.patients}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          <span className="text-muted-foreground">Member Since</span>
                          <span className="font-medium">{doctorInfo.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button onClick={() => router.push('/doctor/profile')} variant="outline" className="w-full">
                        Edit Profile
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Reminders</CardTitle>
                      <CardDescription>
                        Upcoming tasks and follow-ups
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {upcomingReminders.length > 0 ? (
                        <div className="space-y-3">
                          {upcomingReminders.map(reminder => (
                            <div key={reminder.id} className="flex items-start gap-3 p-3 border rounded-lg">
                              <Bell className="h-4 w-4 text-primary mt-0.5" />
                              <div>
                                <h4 className="font-medium text-sm">{reminder.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {reminder.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          No upcoming reminders
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button variant="outline" onClick={() => router.push('/doctor/reminders')} size="sm" className="w-full">
                        View All Reminders
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
