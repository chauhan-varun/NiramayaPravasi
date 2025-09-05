'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Search, Filter, Plus, User, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import PatientNavbar from '@/components/patient-navbar';

export default function AppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    setTimeout(() => {
      setAppointments([
        {
          id: 1,
          doctor: 'Dr. Sarah Johnson',
          specialty: 'Cardiologist',
          date: '2025-09-08',
          time: '10:30 AM',
          status: 'confirmed',
          type: 'upcoming',
          location: 'Heart Care Clinic, Room 201',
          phone: '+15551234567',
          notes: 'Regular heart checkup and ECG'
        },
        {
          id: 2,
          doctor: 'Dr. Michael Chen',
          specialty: 'General Physician',
          date: '2025-09-15',
          time: '2:00 PM',
          status: 'pending',
          type: 'upcoming',
          location: 'Primary Care Center, Room 105',
          phone: '+15559876543',
          notes: 'Annual physical examination'
        },
        {
          id: 3,
          doctor: 'Dr. Emily Davis',
          specialty: 'Dermatologist',
          date: '2025-08-20',
          time: '11:00 AM',
          status: 'completed',
          type: 'past',
          location: 'Skin Health Clinic, Room 301',
          phone: '+15554567890',
          notes: 'Skin cancer screening completed'
        },
        {
          id: 4,
          doctor: 'Dr. Robert Wilson',
          specialty: 'Orthopedist',
          date: '2025-08-10',
          time: '3:30 PM',
          status: 'completed',
          type: 'past',
          location: 'Bone & Joint Center, Room 150',
          phone: '+15553210987',
          notes: 'Knee pain consultation completed'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || appointment.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const upcomingCount = appointments.filter(apt => apt.type === 'upcoming').length;
  const pastCount = appointments.filter(apt => apt.type === 'past').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientNavbar />
      
      <main className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-600">Manage your medical appointments and schedules</p>
          </div>
          <Link href="/appointments/schedule">
            <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
                  <p className="text-xs text-gray-500">Appointments</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{pastCount}</p>
                  <p className="text-xs text-gray-500">Appointments</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-purple-600">{appointments.length}</p>
                  <p className="text-xs text-gray-500">All Time</p>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                  Search Appointments
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by doctor name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Appointments</CardTitle>
            <CardDescription>View and manage your medical appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">Upcoming ({upcomingCount})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastCount})</TabsTrigger>
                <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredAppointments.filter(apt => apt.type === 'upcoming').length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments
                      .filter(apt => apt.type === 'upcoming')
                      .map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} getStatusColor={getStatusColor} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                    <p className="text-gray-500 mb-6">Schedule your next appointment to stay on top of your health</p>
                    <Link href="/appointments/schedule">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Book Your First Appointment
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {filteredAppointments.filter(apt => apt.type === 'past').length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments
                      .filter(apt => apt.type === 'past')
                      .map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} getStatusColor={getStatusColor} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No past appointments</h3>
                    <p className="text-gray-500">Your appointment history will appear here</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {filteredAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} getStatusColor={getStatusColor} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                    <p className="text-gray-500">Try adjusting your search terms</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function AppointmentCard({ appointment, getStatusColor }) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{appointment.doctor}</h3>
              <p className="text-gray-600">{appointment.specialty}</p>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{appointment.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{appointment.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span className="text-sm">{appointment.phone}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Notes:</span> {appointment.notes}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {appointment.type === 'upcoming' && (
            <>
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                Cancel
              </Button>
            </>
          )}
          {appointment.type === 'past' && (
            <Button variant="outline" size="sm">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
