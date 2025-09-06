'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Loader2, 
  TrendingUp, 
  Calendar, 
  Users, 
  BarChart3, 
  LineChart, 
  Clock, 
  UserCog,
  Download
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import ProtectedRoute from '@/components/protected-route';
import DoctorNavbar from '@/components/doctor-navbar';

export default function DoctorAnalytics() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for demonstration
  const stats = {
    totalPatients: 120,
    newPatients: 14,
    totalAppointments: 220,
    completedAppointments: 185,
    cancelledAppointments: 12,
    pendingAppointments: 23,
    averageRating: 4.8,
    satisfactionRate: 92,
    revenueGrowth: 15,
    patientRetention: 88,
  };

  const patientsByGender = [
    { gender: 'Male', count: 48 },
    { gender: 'Female', count: 69 },
    { gender: 'Others', count: 3 },
  ];
  
  const patientsByAge = [
    { age: '0-17', count: 12 },
    { age: '18-30', count: 38 },
    { age: '31-45', count: 42 },
    { age: '46-60', count: 18 },
    { age: '60+', count: 10 },
  ];

  const performanceMetrics = [
    { name: 'Patient Satisfaction', value: 92 },
    { name: 'Appointment Completion Rate', value: 84 },
    { name: 'On-time Arrival', value: 88 },
    { name: 'Follow-up Rate', value: 76 },
    { name: 'Treatment Success', value: 91 },
  ];

  const monthlyData = [
    { month: 'Jan', patients: 15, appointments: 28 },
    { month: 'Feb', patients: 18, appointments: 33 },
    { month: 'Mar', patients: 14, appointments: 29 },
    { month: 'Apr', patients: 17, appointments: 32 },
    { month: 'May', patients: 21, appointments: 38 },
    { month: 'Jun', patients: 25, appointments: 42 },
    { month: 'Jul', patients: 22, appointments: 39 },
    { month: 'Aug', patients: 19, appointments: 35 },
    { month: 'Sep', patients: 23, appointments: 40 },
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate percentages for progress bars
  const calculatePercentage = (value, total) => {
    return Math.round((value / total) * 100);
  };
  
  const completionPercentage = calculatePercentage(stats.completedAppointments, stats.totalAppointments);
  const pendingPercentage = calculatePercentage(stats.pendingAppointments, stats.totalAppointments);
  const cancelledPercentage = calculatePercentage(stats.cancelledAppointments, stats.totalAppointments);
  
  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="min-h-screen bg-background">
        <DoctorNavbar />
        
        <main className="container py-10">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your performance and patient metrics</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPatients}</div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+{stats.newPatients} new this month</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                    <div className="flex items-center text-xs mt-1">
                      <span className="text-green-600">{stats.completedAppointments} completed</span>
                      <span className="mx-1">·</span>
                      <span className="text-amber-600">{stats.pendingAppointments} pending</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Patient Retention</CardTitle>
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.patientRetention}%</div>
                    <Progress value={stats.patientRetention} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rating & Satisfaction</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageRating} / 5</div>
                    <div className="flex items-center text-xs mt-1">
                      <span className="text-green-600">{stats.satisfactionRate}% patient satisfaction</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="patients">Patient Analytics</TabsTrigger>
                  <TabsTrigger value="appointments">Appointment Analytics</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Trend</CardTitle>
                        <CardDescription>Patients and appointments over time</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <div className="h-full flex flex-col justify-center items-center text-center">
                          <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground max-w-sm">
                            Line chart showing the monthly trend of patients and appointments would be rendered here,
                            using a charting library like Chart.js or Recharts.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Appointment Distribution</CardTitle>
                        <CardDescription>Status of your total appointments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Completed</span>
                              <span className="font-medium">{completionPercentage}%</span>
                            </div>
                            <Progress value={completionPercentage} className="h-2 bg-muted" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Pending</span>
                              <span className="font-medium">{pendingPercentage}%</span>
                            </div>
                            <Progress value={pendingPercentage} className="h-2 bg-muted" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Cancelled</span>
                              <span className="font-medium">{cancelledPercentage}%</span>
                            </div>
                            <Progress value={cancelledPercentage} className="h-2 bg-muted" />
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t">
                          <h4 className="font-medium mb-4">Recent Growth</h4>
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                              <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">+{stats.revenueGrowth}%</p>
                              <p className="text-sm text-muted-foreground">Growth in appointments compared to last quarter</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Performance Indicators</CardTitle>
                      <CardDescription>Your performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {performanceMetrics.map((metric, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{metric.name}</span>
                              <span className="text-sm">{metric.value}%</span>
                            </div>
                            <Progress value={metric.value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex justify-end">
                      <Button variant="ghost" size="sm">View Detailed Report</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="patients" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Patient Demographics</CardTitle>
                        <CardDescription>Distribution by gender</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <div className="h-full flex flex-col justify-center items-center text-center">
                          <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground">
                            Pie chart showing patient distribution by gender would be rendered here.
                          </p>
                          <div className="mt-4 w-full space-y-2">
                            {patientsByGender.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{item.gender}</span>
                                <span className="font-medium">{item.count} ({Math.round((item.count / stats.totalPatients) * 100)}%)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Age Distribution</CardTitle>
                        <CardDescription>Patients by age group</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <div className="h-full flex flex-col justify-center items-center text-center">
                          <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground">
                            Bar chart showing patient distribution by age group would be rendered here.
                          </p>
                          <div className="mt-4 w-full space-y-2">
                            {patientsByAge.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{item.age} years</span>
                                <span className="font-medium">{item.count} patients</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Growth</CardTitle>
                      <CardDescription>Monthly patient acquisition</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <div className="h-full flex flex-col justify-center items-center text-center">
                        <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground max-w-sm">
                          Line chart showing the trend of monthly new patients would be rendered here.
                        </p>
                        <div className="mt-4 grid grid-cols-3 gap-4 w-full">
                          {monthlyData.slice(6).map((item, index) => (
                            <div key={index} className="flex flex-col items-center p-2 border rounded-md">
                              <span className="text-sm text-muted-foreground">{item.month}</span>
                              <span className="text-lg font-bold">{item.patients}</span>
                              <span className="text-xs text-muted-foreground">patients</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appointments" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Completion Rate</CardTitle>
                        <CardDescription>Appointment status distribution</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col justify-center items-center h-40">
                          <div className="w-20 h-20 rounded-full border-8 border-primary flex items-center justify-center mb-4">
                            <span className="text-xl font-bold">{completionPercentage}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Completion rate</p>
                        </div>
                        <div className="space-y-2 mt-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                              <span>Completed</span>
                            </div>
                            <span>{stats.completedAppointments}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                              <span>Pending</span>
                            </div>
                            <span>{stats.pendingAppointments}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                              <span>Cancelled</span>
                            </div>
                            <span>{stats.cancelledAppointments}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Appointment Trend</CardTitle>
                        <CardDescription>Monthly appointment count</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80">
                        <div className="h-full flex flex-col justify-center items-center text-center">
                          <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground max-w-sm">
                            Line chart showing the trend of monthly appointments would be rendered here.
                          </p>
                          <div className="mt-4 grid grid-cols-3 gap-4 w-full md:w-3/4">
                            {monthlyData.slice(-3).map((item, index) => (
                              <div key={index} className="flex flex-col items-center p-3 border rounded-md">
                                <span className="text-sm text-muted-foreground">{item.month}</span>
                                <span className="text-xl font-bold">{item.appointments}</span>
                                <span className="text-xs text-muted-foreground">appointments</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Time Analysis</CardTitle>
                      <CardDescription>Most popular appointment times</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                      <div className="h-full flex flex-col justify-center items-center text-center">
                        <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground max-w-sm">
                          Heat map showing popular appointment times by day and hour would be rendered here.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex justify-end">
                      <Button variant="ghost" size="sm">Export Time Data</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="performance" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription>Your key metrics compared to average</CardDescription>
                      </CardHeader>
                      <CardContent className="h-96">
                        <div className="h-full flex flex-col justify-center items-center text-center">
                          <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground max-w-sm">
                            Radar chart showing performance metrics compared to average would be rendered here.
                          </p>
                          <div className="mt-8 w-full space-y-4">
                            {performanceMetrics.map((metric, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{metric.name}</span>
                                  <span>{metric.value}%</span>
                                </div>
                                <div className="flex items-center">
                                  <Progress value={metric.value} className="h-2 flex-1" />
                                  <span className="text-xs ml-2 w-8 text-center text-muted-foreground">
                                    {metric.value > 85 ? "+5%" : metric.value < 80 ? "-3%" : "0%"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t px-6 py-4 flex justify-between">
                        <p className="text-sm text-muted-foreground">Last updated: Sep 24, 2023</p>
                        <Button variant="outline" size="sm">Download Full Report</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
