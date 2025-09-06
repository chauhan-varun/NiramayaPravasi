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
  Download,
  FileText,
  LayoutDashboard
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/protected-route';
import DoctorNavbar from '@/components/doctor-navbar';

export default function DoctorAnalytics() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('3m');
  
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
  
  // Mock disease trends data
  const diseaseTrends = [
    { disease: "Influenza", cases: 45, trend: "increasing", percentage: 18 },
    { disease: "Diabetes Type 2", cases: 32, trend: "stable", percentage: 12 },
    { disease: "Hypertension", cases: 78, trend: "increasing", percentage: 31 },
    { disease: "Common Cold", cases: 65, trend: "decreasing", percentage: 26 },
    { disease: "COVID-19", cases: 15, trend: "decreasing", percentage: 6 },
    { disease: "Asthma", cases: 23, trend: "stable", percentage: 9 },
    { disease: "Dengue", cases: 12, trend: "increasing", percentage: 5 },
    { disease: "Malaria", cases: 8, trend: "stable", percentage: 3 },
    { disease: "Typhoid", cases: 5, trend: "decreasing", percentage: 2 },
  ];
  
  // Disease distribution by demographic
  const diseaseByDemographic = {
    "0-17": {
      "Common Cold": 35,
      "Asthma": 15,
      "Influenza": 20,
      "Dengue": 5,
      "Others": 25
    },
    "18-30": {
      "Influenza": 28,
      "COVID-19": 12,
      "Hypertension": 5,
      "Diabetes": 3,
      "Others": 52
    },
    "31-45": {
      "Hypertension": 22,
      "Diabetes": 15,
      "Influenza": 18,
      "COVID-19": 8,
      "Others": 37
    },
    "46-60": {
      "Hypertension": 35,
      "Diabetes": 28,
      "Heart Disease": 12,
      "Arthritis": 10,
      "Others": 15
    },
    "60+": {
      "Hypertension": 45,
      "Diabetes": 30,
      "Heart Disease": 25,
      "Arthritis": 20,
      "Others": 10
    }
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
      <div className="min-h-screen bg-background bg-gradient-to-b from-muted/30 to-background">
        <DoctorNavbar />
        
        <main className="container py-10 px-4 md:px-6">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Analytics</span>
              </div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your performance and patient metrics</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 self-start sm:self-center">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    <div className="p-2 bg-blue-50 rounded-full">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPatients}</div>
                    <div className="flex items-center text-xs text-green-600 mt-1 font-medium">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+{stats.newPatients} new this month</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                    <div className="p-2 bg-green-50 rounded-full">
                      <Calendar className="h-4 w-4 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                    <div className="flex items-center text-xs mt-1">
                      <span className="text-green-600 font-medium">{stats.completedAppointments} completed</span>
                      <span className="mx-1">·</span>
                      <span className="text-amber-600 font-medium">{stats.pendingAppointments} pending</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Patient Retention</CardTitle>
                    <div className="p-2 bg-purple-50 rounded-full">
                      <UserCog className="h-4 w-4 text-purple-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.patientRetention}%</div>
                    <Progress value={stats.patientRetention} className="h-2 mt-2 bg-purple-100" indicatorClassName="bg-purple-500" />
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rating & Satisfaction</CardTitle>
                    <div className="p-2 bg-amber-50 rounded-full">
                      <BarChart3 className="h-4 w-4 text-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageRating} / 5</div>
                    <div className="flex items-center text-xs mt-1">
                      <span className="text-green-600 font-medium">{stats.satisfactionRate}% patient satisfaction</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <div className="border rounded-lg p-1 bg-muted/20">
                  <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-1">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <LayoutDashboard className="h-4 w-4 mr-2 hidden sm:inline" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="patients" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Users className="h-4 w-4 mr-2 hidden sm:inline" />
                      Patient Analytics
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Calendar className="h-4 w-4 mr-2 hidden sm:inline" />
                      Appointments
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <BarChart3 className="h-4 w-4 mr-2 hidden sm:inline" />
                      Performance
                    </TabsTrigger>
                    <TabsTrigger value="diseases" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <FileText className="h-4 w-4 mr-2 hidden sm:inline" />
                      Disease Trends
                    </TabsTrigger>
                  </TabsList>
                </div>
                
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
                
                <TabsContent value="diseases" className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mb-2">
                        <TrendingUp className="h-3 w-3" />
                        <span>Health Insights</span>
                      </div>
                      <h3 className="text-lg font-medium">Disease Prevalence Analytics</h3>
                    </div>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Time Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">Last Month</SelectItem>
                        <SelectItem value="3m">Last 3 Months</SelectItem>
                        <SelectItem value="6m">Last 6 Months</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="border-b pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-blue-100">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                          </div>
                          Disease Trends
                        </CardTitle>
                        <CardDescription>
                          Common diseases and their prevalence
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-96 pt-6">
                        <div className="h-full flex flex-col justify-center items-center text-center">
                          <div className="bg-blue-50/50 p-6 rounded-lg mb-6">
                            <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground max-w-sm">
                              Bar chart showing disease prevalence would be rendered here.
                            </p>
                          </div>
                          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                            {diseaseTrends.slice(0, 6).map((disease, index) => (
                              <div key={index} className="space-y-2 bg-muted/10 p-3 rounded-md">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{disease.disease}</span>
                                  <div className="flex items-center">
                                    <span className="font-semibold">{disease.cases} cases</span>
                                    {disease.trend === "increasing" && (
                                      <span className="ml-2 text-red-500 font-bold">↑</span>
                                    )}
                                    {disease.trend === "decreasing" && (
                                      <span className="ml-2 text-green-500 font-bold">↓</span>
                                    )}
                                  </div>
                                </div>
                                <Progress 
                                  value={disease.percentage} 
                                  className="h-2" 
                                  indicatorClassName={
                                    disease.trend === "increasing" ? "bg-red-500" : 
                                    disease.trend === "decreasing" ? "bg-green-500" : 
                                    "bg-blue-500"
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Diseases</CardTitle>
                        <CardDescription>
                          Most prevalent conditions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {diseaseTrends.slice(0, 5).map((disease, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <span className="text-primary font-bold">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{disease.disease}</h4>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <span>{disease.cases} cases</span>
                                  <span className="mx-1">•</span>
                                  <span>{disease.percentage}%</span>
                                </div>
                              </div>
                              <Badge
                                className={
                                  disease.trend === "increasing"
                                    ? "bg-red-100 text-red-800"
                                    : disease.trend === "decreasing"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {disease.trend === "increasing"
                                  ? "↑ Rising"
                                  : disease.trend === "decreasing"
                                  ? "↓ Falling"
                                  : "→ Stable"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Disease Distribution by Age Group</CardTitle>
                      <CardDescription>
                        How different diseases affect various age demographics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <div className="h-full flex flex-col justify-center items-center text-center">
                        <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground max-w-sm mb-4">
                          Stacked bar chart showing disease distribution by age group would be rendered here.
                        </p>
                        
                        <div className="grid grid-cols-5 gap-2 w-full mt-4 text-xs">
                          {Object.keys(diseaseByDemographic).map((ageGroup, index) => (
                            <div key={index} className="text-center">
                              <div className="font-medium mb-2">{ageGroup}</div>
                              {Object.entries(diseaseByDemographic[ageGroup])
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 3)
                                .map(([disease, percentage], i) => (
                                  <div key={i} className="mb-1">
                                    {disease}: {percentage}%
                                  </div>
                                ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex justify-between">
                      <p className="text-sm text-muted-foreground">Based on {stats.totalPatients} patient records</p>
                      <Button variant="outline" size="sm">Download Report</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Disease Outbreak Map</CardTitle>
                      <CardDescription>
                        Geographical distribution of disease prevalence
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-96">
                      <div className="h-full flex flex-col justify-center items-center text-center">
                        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground max-w-sm mb-8">
                          Heat map showing geographical disease distribution would be rendered here.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Hot Spot Areas</h4>
                            <ul className="space-y-1 text-sm">
                              <li>Mumbai Central - Influenza</li>
                              <li>Andheri East - Dengue</li>
                              <li>Bandra West - COVID-19</li>
                            </ul>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Emerging Concerns</h4>
                            <ul className="space-y-1 text-sm">
                              <li>Rise in respiratory conditions</li>
                              <li>Seasonal allergies (18% increase)</li>
                              <li>Gastroenteritis cases</li>
                            </ul>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Recommendations</h4>
                            <ul className="space-y-1 text-sm">
                              <li>Influenza vaccination campaign</li>
                              <li>Dengue awareness in affected areas</li>
                              <li>Respiratory health screenings</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4 flex justify-end">
                      <Button>Contact Public Health Department</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
