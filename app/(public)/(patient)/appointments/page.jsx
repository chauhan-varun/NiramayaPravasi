'use client';

import { useState } from 'react';
import Link from 'next/link';
import PatientNavbar from '@/components/patient-navbar';
import PatientProtectedRoute from '@/components/patient-protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, MapPin, Plus } from 'lucide-react';

export default function PatientAppointments() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Mock appointment data
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sharma',
      specialty: 'General Physician',
      date: '2023-10-15',
      time: '10:00 AM',
      location: 'Main Hospital, Room 105',
      status: 'confirmed'
    },
    {
      id: 2,
      doctorName: 'Dr. Patel',
      specialty: 'Dentist',
      date: '2023-10-20',
      time: '2:30 PM',
      location: 'Dental Clinic, 2nd Floor',
      status: 'pending'
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
      status: 'completed'
    },
    {
      id: 4,
      doctorName: 'Dr. Singh',
      specialty: 'Orthopedic',
      date: '2023-08-22',
      time: '9:00 AM',
      location: 'Main Hospital, Room 210',
      status: 'completed'
    }
  ];

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        <main className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Appointments</h1>
              <p className="text-gray-600">Manage your healthcare appointments</p>
            </div>
            <Link href="/appointments/schedule">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Schedule New
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {upcomingAppointments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingAppointments.map(appointment => (
                    <Card key={appointment.id} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between bg-gray-50 pb-2">
                        <CardTitle className="text-lg">{appointment.doctorName}</CardTitle>
                        <StatusBadge status={appointment.status} />
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.specialty}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.date}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.time}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.location}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">Reschedule</Button>
                          <Button variant="outline" size="sm" className="flex-1 text-red-500 hover:bg-red-50">Cancel</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mb-2 text-lg font-medium">No Upcoming Appointments</h3>
                  <p className="text-gray-500 mb-4">You don't have any scheduled appointments.</p>
                  <Link href="/appointments/schedule">
                    <Button>Schedule Appointment</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {pastAppointments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {pastAppointments.map(appointment => (
                    <Card key={appointment.id} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between bg-gray-50 pb-2">
                        <CardTitle className="text-lg">{appointment.doctorName}</CardTitle>
                        <StatusBadge status={appointment.status} />
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.specialty}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.date}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.time}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{appointment.location}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button variant="outline" size="sm" className="w-full">View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mb-2 text-lg font-medium">No Past Appointments</h3>
                  <p className="text-gray-500">Your appointment history will appear here.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}

