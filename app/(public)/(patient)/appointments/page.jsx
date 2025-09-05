'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import PatientNavbar from '@/components/patient-navbar';
import PatientProtectedRoute from '@/components/patient-protected-route';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, User, MapPin, Plus, Search, Phone,
  Filter, ArrowUpDown, X, Download, FileText, ChevronRight
} from 'lucide-react';

export default function PatientAppointments() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [currentDate] = useState(new Date());
  
  // Mock appointment data
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sharma',
      specialty: 'General Physician',
      date: '2023-10-15',
      time: '10:00 AM',
      location: 'Main Hospital, Room 105',
      status: 'confirmed',
      notes: 'Regular checkup',
      image: null
    },
    {
      id: 2,
      doctorName: 'Dr. Patel',
      specialty: 'Dentist',
      date: '2023-10-20',
      time: '2:30 PM',
      location: 'Dental Clinic, 2nd Floor',
      status: 'pending',
      notes: 'Teeth cleaning',
      image: null
    }
  ];
  
  const pastAppointments = [
    {
      id: 3,
      doctorName: 'Dr. Gupta',
      specialty: 'Cardiologist',
      date: '2023-09-05',
      time: '11:15 AM',
      location: 'Cardiac Center',
      status: 'completed',
      notes: 'Heart checkup',
      report: 'Available',
      image: null
    },
    {
      id: 4,
      doctorName: 'Dr. Singh',
      specialty: 'Orthopedic',
      date: '2023-08-22',
      time: '9:00 AM',
      location: 'Main Hospital, Room 210',
      status: 'completed',
      notes: 'Knee pain consultation',
      report: 'Available',
      image: null
    }
  ];

  // Filter appointments based on search and specialty filter
  const filteredUpcomingAppointments = upcomingAppointments.filter(appointment => {
    const matchesSearch = !searchQuery || 
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSpecialty = !selectedSpecialty || appointment.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });
  
  const filteredPastAppointments = pastAppointments.filter(appointment => {
    const matchesSearch = !searchQuery || 
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSpecialty = !selectedSpecialty || appointment.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  // Get all unique specialties from appointments
  const allSpecialties = [...new Set([
    ...upcomingAppointments.map(a => a.specialty),
    ...pastAppointments.map(a => a.specialty)
  ])];

  // Get doctor initials for avatar
  const getInitials = (name) => {
    if (!name) return 'Dr';
    return name
      .split(' ')
      .filter(part => part.startsWith('Dr'))
      .map(part => part.charAt(3) || part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Render appointment status badge
  const StatusBadge = ({ status }) => {
    const statusVariants = {
      confirmed: 'success',
      pending: 'outline',
      completed: 'secondary',
      cancelled: 'destructive'
    };
    
    return (
      <Badge variant={statusVariants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        {/* Page header with blue gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="container py-6 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">My Appointments</h1>
                <p className="text-blue-100 mt-1">
                  {format(currentDate, 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
              <Link href="/appointments/schedule">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 border border-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <main className="container py-6 px-4 sm:px-6">
          {/* Search and filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search appointments..." 
                className="pl-9 pr-4" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>
          
          {/* Specialty filter */}
          {filterOpen && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <h3 className="font-medium mb-2">Filter by specialty</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={selectedSpecialty === '' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedSpecialty('')}
                >
                  All
                </Button>
                {allSpecialties.map(specialty => (
                  <Button 
                    key={specialty} 
                    variant={selectedSpecialty === specialty ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedSpecialty(specialty)}
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Tabs */}
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="upcoming" className="rounded-full">
                  Upcoming ({filteredUpcomingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="rounded-full">
                  Past ({filteredPastAppointments.length})
                </TabsTrigger>
              </TabsList>
              
              <div className="text-xs text-gray-500">
                {activeTab === 'upcoming' ? 
                  filteredUpcomingAppointments.length > 0 ? `${filteredUpcomingAppointments.length} upcoming appointments` : 'No upcoming appointments' :
                  filteredPastAppointments.length > 0 ? `${filteredPastAppointments.length} past appointments` : 'No past appointments'
                }
              </div>
            </div>
            
            {/* Upcoming appointments tab */}
            <TabsContent value="upcoming">
              {filteredUpcomingAppointments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredUpcomingAppointments.map(appointment => (
                    <Card key={appointment.id} className="overflow-hidden border-2 hover:border-blue-200 transition-colors">
                      <div className={`${appointment.status === 'confirmed' ? 'bg-green-50' : 'bg-yellow-50'} px-6 py-3`}>
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <span>{appointment.doctorName}</span>
                          </h3>
                          <StatusBadge status={appointment.status} />
                        </div>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      </div>
                      
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 bg-blue-100 border-2 border-blue-200">
                            <AvatarFallback className="bg-blue-500 text-white text-lg">
                              {getInitials(appointment.doctorName)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-blue-500" />
                              <span className="font-medium">{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-3.5 w-3.5 text-blue-500" />
                              <span className="font-medium">{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                            <p className="text-gray-700">{appointment.notes}</p>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="bg-gray-50 border-t py-3 gap-2 flex">
                        <Link href={`/appointments/${appointment.id}`} className="flex-1">
                          <Button variant="default" size="sm" className="w-full">
                            Details
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="flex-none px-2">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="flex-none text-red-500 px-2">
                          <X className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-dashed p-8 text-center">
                  <div className="inline-flex h-12 w-12 rounded-full bg-blue-100 p-2 mb-3">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery || selectedSpecialty ? 
                      'No appointments match your search criteria.' :
                      'You don\'t have any scheduled appointments at the moment.'}
                  </p>
                  <Link href="/appointments/schedule">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Schedule Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            {/* Past appointments tab */}
            <TabsContent value="past">
              {filteredPastAppointments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredPastAppointments.map(appointment => (
                    <Card key={appointment.id} className="overflow-hidden border">
                      <div className="bg-gray-50 px-6 py-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                          <StatusBadge status={appointment.status} />
                        </div>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      </div>
                      
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 bg-gray-100 border-2 border-gray-200">
                            <AvatarFallback className="bg-gray-500 text-white text-lg">
                              {getInitials(appointment.doctorName)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-gray-500" />
                              <span className="font-medium">{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-3.5 w-3.5 text-gray-500" />
                              <span className="font-medium">{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                            <p className="text-gray-700">{appointment.notes}</p>
                          </div>
                        )}
                        
                        {appointment.report && (
                          <div className="mt-4 flex items-center justify-between text-sm border-t pt-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span>Medical Report</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 p-0">
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Download
                            </Button>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="bg-gray-50 border-t py-3">
                        <Link href={`/appointments/${appointment.id}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full flex justify-between">
                            <span>View Details</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-dashed p-8 text-center">
                  <div className="inline-flex h-12 w-12 rounded-full bg-gray-100 p-2 mb-3">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Past Appointments</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchQuery || selectedSpecialty ? 
                      'No past appointments match your search criteria.' :
                      'Your appointment history will appear here once you have completed appointments.'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}

