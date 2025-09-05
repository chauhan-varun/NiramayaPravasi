'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PatientNavbar from '@/components/patient-navbar';
import PatientProtectedRoute from '@/components/patient-protected-route';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Activity, User } from 'lucide-react';

export default function PatientDashboard() {
  const [patientName, setPatientName] = useState('');
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  
  useEffect(() => {
    // Fetch patient data
    // This would normally come from an API call
    setPatientName('Patient');
    
    // Mock upcoming appointment data
    setUpcomingAppointment({
      doctorName: 'Dr. Sharma',
      date: '2023-10-15',
      time: '10:00 AM',
      specialty: 'General Physician'
    });
  }, []);

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome, {patientName}</h1>
            <p className="text-gray-600">Your health dashboard</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Upcoming Appointment Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointment ? (
                  <div className="space-y-2">
                    <p className="font-medium">{upcomingAppointment.doctorName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{upcomingAppointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{upcomingAppointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{upcomingAppointment.specialty}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No upcoming appointments</p>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/appointments" passHref>
                  <Button variant="outline" className="w-full">
                    {upcomingAppointment ? 'View Details' : 'Schedule Appointment'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Recent Records Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recent Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Access your medical records and test results</p>
              </CardContent>
              <CardFooter>
                <Link href="/records" passHref>
                  <Button variant="outline" className="w-full">View Records</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Health Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Health Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Complete your health profile to get personalized care</p>
              </CardContent>
              <CardFooter>
                <Link href="/profile" passHref>
                  <Button variant="outline" className="w-full">Update Profile</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}

