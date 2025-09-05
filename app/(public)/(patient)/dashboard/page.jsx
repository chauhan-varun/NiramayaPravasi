'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, User, Plus, Activity, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import PatientNavbar from '@/components/patient-navbar';

export default function PatientDashboard() {
  const { data: session } = useSession();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    setTimeout(() => {
      setUpcomingAppointments([
        {
          id: 1,
          doctor: 'Dr. Sarah Johnson',
          specialty: 'Cardiologist',
          date: '2025-09-08',
          time: '10:30 AM',
          status: 'confirmed'
        },
        {
          id: 2,
          doctor: 'Dr. Michael Chen',
          specialty: 'General Physician',
          date: '2025-09-15',
          time: '2:00 PM',
          status: 'pending'
        }
      ]);
      
      setRecentRecords([
        {
          id: 1,
          title: 'Blood Test Results',
          doctor: 'Dr. Sarah Johnson',
          date: '2025-08-28',
          type: 'Lab Report'
        },
        {
          id: 2,
          title: 'Cardiology Consultation',
          doctor: 'Dr. Sarah Johnson',
          date: '2025-08-25',
          type: 'Consultation Notes'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientNavbar />
      
      <main className="container mx-auto py-8 px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name || 'Patient'}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your health dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {upcomingAppointments.length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Health</p>
                  <p className="text-2xl font-bold text-green-600">Good</p>
                  <p className="text-xs text-gray-500">Status</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Records</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {recentRecords.length}
                  </p>
                  <p className="text-xs text-gray-500">Recent</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">0</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled medical appointments</CardDescription>
                </div>
                <Link href="/appointments/schedule">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Book New
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{appointment.specialty}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming appointments</p>
                  <Link href="/appointments/schedule">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Schedule Your First Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Medical Records */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">Recent Medical Records</CardTitle>
                  <CardDescription>Your latest health documents</CardDescription>
                </div>
                <Link href="/records">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {recentRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{record.title}</h4>
                        <Badge variant="outline">{record.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Dr. {record.doctor}</p>
                      <p className="text-xs text-gray-500">{record.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No medical records available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
            <CardDescription>Common tasks and services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/appointments/schedule">
                <Button variant="outline" className="w-full h-16 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Button>
              </Link>
              
              <Link href="/profile">
                <Button variant="outline" className="w-full h-16 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200">
                  <User className="h-5 w-5" />
                  Update Profile
                </Button>
              </Link>
              
              <Link href="/support">
                <Button variant="outline" className="w-full h-16 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200">
                  <AlertCircle className="h-5 w-5" />
                  Get Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
