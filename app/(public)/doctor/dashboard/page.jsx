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
  User,
  ChevronRight,
  Plus,
  DollarSign,
  TrendingUp
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
      <div className="min-h-screen bg-background overflow-x-hidden">
        <DoctorNavbar />
        
        <main className="container py-6 lg:py-10">
          <header className="relative mb-8 bg-gradient-to-r from-primary/10 via-transparent to-transparent p-6 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back, Dr. {doctorInfo?.name?.split(" ")[1] || "Smith"}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2 text-sm" 
                  onClick={() => router.push('/doctor/appointments/new')}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Appointment</span>
                </Button>
                <Button 
                  className="gap-2 text-sm"
                  onClick={() => router.push('/doctor/patient/new')}
                >
                  <Plus className="h-4 w-4" />
                  <span>New Patient</span>
                </Button>
              </div>
            </div>
          </header>
          
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.patients}</div>
                    <div className="flex items-center text-xs text-green-600 font-medium mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+2 this week</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.appointments}</div>
                    <div className="flex items-center text-xs text-muted-foreground font-medium mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Next 7 days</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98%</div>
                    <Progress value={98} className="h-2 mt-2 bg-purple-100">
                      <div className="bg-purple-500 h-full rounded-full transition-all"></div>
                    </Progress>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-amber-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{upcomingReminders.length}</div>
                    <div className="flex items-center text-xs text-muted-foreground font-medium mt-1">
                      <Bell className="h-3 w-3 mr-1" />
                      <span>Reminders & follow-ups</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Left Column (2/3 width on large screens) */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="overflow-hidden border border-muted transition-all hover:border-muted/80 hover:shadow-md">
                    <CardHeader className="bg-muted/5 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Today's Appointments</CardTitle>
                          <CardDescription>
                            Your scheduled appointments for the next 7 days
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => router.push('/doctor/appointments')}>
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">View Schedule</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {recentAppointments.length > 0 ? (
                        <div>
                          {recentAppointments.map((appointment, index) => (
                            <div 
                              key={appointment.id} 
                              className={`flex items-center justify-between p-4 hover:bg-muted/5 transition-colors cursor-pointer ${
                                index !== recentAppointments.length - 1 ? 'border-b' : ''
                              }`}
                              onClick={() => router.push(`/doctor/appointments/${appointment.id}`)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`
                                  h-10 w-10 rounded-full flex items-center justify-center
                                  ${appointment.status === 'upcoming' ? 'bg-blue-100' : 
                                    appointment.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}
                                `}>
                                  <User className={`h-5 w-5 
                                    ${appointment.status === 'upcoming' ? 'text-blue-600' : 
                                      appointment.status === 'completed' ? 'text-green-600' : 'text-red-600'}
                                  `} />
                                </div>
                                <div>
                                  <h4 className="font-medium">{appointment.patient}</h4>
                                  <div className="flex items-center text-sm text-muted-foreground gap-3">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {appointment.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {appointment.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(appointment.status)}
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                          <Calendar className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
                          <p className="text-muted-foreground font-medium">No upcoming appointments</p>
                          <p className="text-sm text-muted-foreground mb-4">Your schedule is clear for the week</p>
                          <Button size="sm" onClick={() => router.push('/doctor/appointments/new')}>
                            Schedule Appointment
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden border border-muted transition-all hover:border-muted/80 hover:shadow-md">
                    <CardHeader className="bg-muted/5 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Recent Activity</CardTitle>
                          <CardDescription>
                            Patient interactions and updates
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push('/doctor/patient')}>
                          <Users className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">View Patients</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div>
                        <div className="p-4 border-b hover:bg-muted/5 transition-colors">
                          <div className="flex gap-4">
                            <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Medical record updated</h4>
                                <Badge variant="outline" className="text-xs bg-green-50">Completed</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Added prescription details for <span className="text-primary hover:underline cursor-pointer">Alice Smith</span>
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>Today, 11:30 AM</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border-b hover:bg-muted/5 transition-colors">
                          <div className="flex gap-4">
                            <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Lab results received</h4>
                                <Badge variant="outline" className="text-xs bg-amber-50">Pending Review</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Blood work results for <span className="text-primary hover:underline cursor-pointer">Bob Johnson</span> need review
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>Yesterday, 3:45 PM</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 hover:bg-muted/5 transition-colors">
                          <div className="flex gap-4">
                            <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Appointment cancelled</h4>
                                <Badge variant="outline" className="text-xs bg-red-50">Cancelled</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                <span className="text-primary hover:underline cursor-pointer">David Wilson</span> cancelled his appointment
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>Sep 22, 9:15 AM</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column (1/3 width on large screens) */}
                <div className="space-y-6">
                  <Card className="overflow-hidden border border-muted transition-all hover:border-muted/80 hover:shadow-md">
                    <CardHeader className="bg-muted/5 border-b">
                      <CardTitle>Doctor Profile</CardTitle>
                      <CardDescription>
                        Your professional information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center mb-6">
                        <div className="relative mb-3">
                          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-12 w-12 text-primary" />
                          </div>
                          <div className="absolute bottom-0 right-0 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
                        </div>
                        <h3 className="font-bold text-lg">{doctorInfo.name}</h3>
                        <Badge className="mt-1 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                          {doctorInfo.specialization}
                        </Badge>
                        <div className="mt-2 flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg 
                              key={star} 
                              className={`h-4 w-4 ${star <= Math.floor(doctorInfo.rating) ? 'text-amber-500' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-muted-foreground text-sm ml-1">{doctorInfo.rating}/5</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center p-3 rounded-lg bg-muted/5">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <Clock className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Experience</p>
                            <p className="font-semibold">{doctorInfo.experienceYears} years</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 rounded-lg bg-muted/5">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Consultation Fee</p>
                            <p className="font-semibold">₹{doctorInfo.consultationFees}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 rounded-lg bg-muted/5">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Patients</p>
                            <p className="font-semibold">{doctorInfo.patients}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4 bg-muted/5">
                      <Button onClick={() => router.push('/doctor/profile')} variant="outline" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="overflow-hidden border border-muted transition-all hover:border-muted/80 hover:shadow-md">
                    <CardHeader className="bg-muted/5 border-b pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Reminders</CardTitle>
                          <CardDescription>
                            Upcoming tasks and follow-ups
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => router.push('/doctor/reminders')}
                          className="rounded-full h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {upcomingReminders.length > 0 ? (
                        <div>
                          {upcomingReminders.map((reminder, index) => (
                            <div 
                              key={reminder.id} 
                              className={`flex items-start gap-3 p-4 hover:bg-muted/5 transition-colors ${
                                index !== upcomingReminders.length - 1 ? 'border-b' : ''
                              }`}
                            >
                              <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <Bell className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{reminder.title}</h4>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{reminder.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 px-4">
                          <Bell className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                          <p className="text-muted-foreground">No upcoming reminders</p>
                          <Button size="sm" variant="outline" className="mt-4" onClick={() => router.push('/doctor/reminders')}>
                            Create Reminder
                          </Button>
                        </div>
                      )}
                    </CardContent>
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
