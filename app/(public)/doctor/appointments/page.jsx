'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { 
  Loader2, 
  Calendar as CalendarIcon, 
  Clock, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Filter,
  Download,
  User
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProtectedRoute from '@/components/protected-route';
import DoctorNavbar from '@/components/doctor-navbar';

export default function DoctorAppointments() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [date, setDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for demonstration
  const appointments = [
    { 
      id: 1, 
      patient: "Alice Smith", 
      date: new Date(2023, 8, 24), // Sep 24, 2023
      time: "10:30 AM", 
      status: "upcoming",
      reason: "General check-up",
      phone: "+91 9876543210",
      email: "alice@example.com",
      duration: 30
    },
    { 
      id: 2, 
      patient: "Bob Johnson", 
      date: new Date(2023, 8, 25), // Sep 25, 2023
      time: "2:15 PM", 
      status: "upcoming",
      reason: "Follow-up consultation",
      phone: "+91 9876543211",
      email: "bob@example.com",
      duration: 45
    },
    { 
      id: 3, 
      patient: "Carol Williams", 
      date: new Date(2023, 8, 26), // Sep 26, 2023
      time: "11:00 AM", 
      status: "upcoming",
      reason: "Blood test results discussion",
      phone: "+91 9876543212",
      email: "carol@example.com",
      duration: 30
    },
    { 
      id: 4, 
      patient: "David Wilson", 
      date: new Date(2023, 8, 23), // Sep 23, 2023
      time: "9:15 AM", 
      status: "completed",
      reason: "Annual physical",
      phone: "+91 9876543213",
      email: "david@example.com",
      duration: 60
    },
    { 
      id: 5, 
      patient: "Eva Brown", 
      date: new Date(2023, 8, 22), // Sep 22, 2023
      time: "4:00 PM", 
      status: "cancelled",
      reason: "Skin consultation",
      phone: "+91 9876543214",
      email: "eva@example.com",
      duration: 30
    },
    { 
      id: 6, 
      patient: "Frank Miller", 
      date: new Date(2023, 8, 27), // Sep 27, 2023
      time: "3:30 PM", 
      status: "upcoming",
      reason: "Vaccination",
      phone: "+91 9876543215",
      email: "frank@example.com",
      duration: 15
    },
  ];

  // Schedule view data - times of the day
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  // Filter appointments based on active tab and search query
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by tab
    if (activeTab === 'upcoming' && appointment.status !== 'upcoming') return false;
    if (activeTab === 'completed' && appointment.status !== 'completed') return false;
    if (activeTab === 'cancelled' && appointment.status !== 'cancelled') return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        appointment.patient.toLowerCase().includes(query) ||
        appointment.reason.toLowerCase().includes(query) ||
        appointment.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Get appointments for the selected date
  const appointmentsForDate = appointments.filter(appointment => 
    isSameDay(appointment.date, date)
  );

  // Get weekly schedule
  const startOfCurrentWeek = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
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
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Appointments</h1>
              <p className="text-muted-foreground mt-1">Manage your patient appointments</p>
            </div>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 cursor-pointer">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(date, 'PPP')}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Appointment
              </Button>
            </div>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search and Filter Row */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search patients, email or reason..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="30">
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Durations</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Tab View */}
              <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 lg:w-auto">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4 mt-6">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id}
                        appointment={appointment}
                        getStatusBadge={getStatusBadge}
                        router={router}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-muted rounded-lg">
                      <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">No upcoming appointments</h3>
                      <p className="text-muted-foreground">
                        {searchQuery ? 'Try adjusting your search query' : 'You have no upcoming appointments scheduled'}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4 mt-6">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id}
                        appointment={appointment}
                        getStatusBadge={getStatusBadge}
                        router={router}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-muted rounded-lg">
                      <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">No completed appointments</h3>
                      <p className="text-muted-foreground">
                        {searchQuery ? 'Try adjusting your search query' : 'You have no completed appointments yet'}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="cancelled" className="space-y-4 mt-6">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id}
                        appointment={appointment}
                        getStatusBadge={getStatusBadge}
                        router={router}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-muted rounded-lg">
                      <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">No cancelled appointments</h3>
                      <p className="text-muted-foreground">
                        {searchQuery ? 'Try adjusting your search query' : 'You have no cancelled appointments'}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              {/* Calendar View */}
              <Card className="mt-8">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Weekly Schedule</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {format(weekDays[0], 'MMMM d')} - {format(weekDays[6], 'MMMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Calendar Header */}
                  <div className="grid grid-cols-8 gap-2">
                    <div className="p-2 text-xs font-medium text-muted-foreground"></div>
                    {weekDays.map((day, i) => (
                      <div 
                        key={i} 
                        className={`p-2 text-center ${
                          isSameDay(day, new Date()) ? 'bg-primary/10 rounded-md' : ''
                        }`}
                      >
                        <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                        <div className={`text-sm ${isSameDay(day, new Date()) ? 'font-medium' : ''}`}>
                          {format(day, 'd')}
                        </div>
                      </div>
                    ))}
                    
                    {/* Time Slots */}
                    {timeSlots.map((time, i) => (
                      <React.Fragment key={i}>
                        <div className="p-2 text-xs text-muted-foreground text-right">
                          {time}
                        </div>
                        {weekDays.map((day, dayIndex) => {
                          // Find appointment at this time slot
                          const appointmentAtSlot = appointments.find(a => 
                            isSameDay(a.date, day) && a.time === time
                          );
                          
                          return (
                            <div 
                              key={`${i}-${dayIndex}`} 
                              className={`border rounded-md p-1 text-xs ${
                                appointmentAtSlot ? getAppointmentClass(appointmentAtSlot.status) : ''
                              }`}
                            >
                              {appointmentAtSlot && (
                                <div className="truncate">
                                  {appointmentAtSlot.patient}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-200 mr-2"></div>
                      <span className="text-sm">Upcoming</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-200 mr-2"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-200 mr-2"></div>
                      <span className="text-sm">Cancelled</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Schedule
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Helper component for appointment cards
function AppointmentCard({ appointment, getStatusBadge, router }) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${
        appointment.status === 'upcoming' ? 'bg-blue-500' :
        appointment.status === 'completed' ? 'bg-green-500' :
        'bg-red-500'
      }`}></div>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-full p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{appointment.patient}</h3>
              <p className="text-sm text-muted-foreground">{appointment.reason}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-1.5 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{format(appointment.date, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.time} ({appointment.duration} min)</span>
            </div>
            {getStatusBadge(appointment.status)}
          </div>
          
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push(`/doctor/appointments/${appointment.id}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get class names for calendar appointments
function getAppointmentClass(status) {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-50 border-blue-200';
    case 'completed':
      return 'bg-green-50 border-green-200';
    case 'cancelled':
      return 'bg-red-50 border-red-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}
