'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import PatientNavbar from '@/components/patient-navbar';
import PatientProtectedRoute from '@/components/patient-protected-route';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, Clock, FileText, Activity, User, Bell, HeadphonesIcon, 
  Pill, Heart, CheckCircle2, MapPin, Phone, BarChart2
} from 'lucide-react';

export default function PatientDashboard() {
  const [patientName, setPatientName] = useState('');
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [vitalStats, setVitalStats] = useState(null);
  const [recentMedications, setRecentMedications] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [recentRecords, setRecentRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentDate] = useState(new Date());
  
  useEffect(() => {
    // Fetch patient data
    // This would normally come from an API call
    setPatientName('John Doe');
    
    // Mock upcoming appointment
    setUpcomingAppointment({
      doctorName: 'Dr. Sharma',
      date: '2023-10-15',
      time: '10:00 AM',
      specialty: 'General Physician',
      location: 'Main Hospital, Room 105'
    });

    // Mock vital stats
    setVitalStats({
      bloodPressure: '120/80 mmHg',
      heartRate: '72 bpm',
      temperature: '98.6°F',
      oxygenLevel: '98%',
      lastUpdated: '2023-09-28'
    });

    // Mock medications
    setRecentMedications([
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', remaining: 12 },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', remaining: 8 }
    ]);

    // Mock recent records
    setRecentRecords([
      { type: 'Blood Test', date: '2023-09-10' },
      { type: 'X-Ray Report', date: '2023-08-22' }
    ]);

    // Mock notifications
    setNotifications([
      { type: 'reminder', message: 'Appointment tomorrow at 10:00 AM', date: '2023-10-14' },
      { type: 'info', message: 'Your lab results are ready', date: '2023-09-12' }
    ]);
  }, []);

  // Get patient initials for avatar
  const getInitials = (name) => {
    if (!name) return 'P';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        {/* Hero section with greeting and key stats */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white animate-gradient-x">
          <div className="container py-8 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 animate-fadeIn">
                <Avatar className="h-16 w-16 border-2 border-white hover:scale-110 transition-transform duration-300 hover:shadow-lg">
                  <AvatarFallback className="bg-blue-800 text-white text-xl">
                    {getInitials(patientName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Welcome, {patientName}</h1>
                  <p className="text-blue-100 mt-1">
                    {format(currentDate, 'EEEE, MMMM do, yyyy')}
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 w-full sm:w-auto animate-slideInRight">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex flex-col sm:flex-row gap-2 sm:gap-6 hover:bg-white/20 transition-all duration-300 hover:shadow-lg">
                  <div>
                    <p className="text-xs text-blue-100">Profile</p>
                    <div className="flex items-center gap-2">
                      <Progress value={profileCompletion} className="w-24 h-2 animate-pulse" />
                      <span className="text-sm font-medium">{profileCompletion}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-blue-100">Appointments</p>
                    <p className="font-semibold">{upcomingAppointment ? '1 upcoming' : 'None'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="container py-6 px-4 sm:px-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fadeInUp">
            <Link href="/appointments" passHref className="no-underline">
              <Button 
                variant="outline" 
                className="h-full w-full flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:shadow-md hover:scale-105 group"
              >
                <Calendar className="h-6 w-6 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                <span>Schedule<span className="hidden sm:inline"> Appointment</span></span>
              </Button>
            </Link>
            <Link href="/records" passHref className="no-underline">
              <Button 
                variant="outline" 
                className="h-full w-full flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:shadow-md hover:scale-105 group"
              >
                <FileText className="h-6 w-6 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                <span>Records</span>
              </Button>
            </Link>
            <Link href="/profile" passHref className="no-underline">
              <Button 
                variant="outline" 
                className="h-full w-full flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:shadow-md hover:scale-105 group"
              >
                <User className="h-6 w-6 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                <span>Profile</span>
              </Button>
            </Link>
            <Link href="/support" passHref className="no-underline">
              <Button 
                variant="outline" 
                className="h-full w-full flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:shadow-md hover:scale-105 group"
              >
                <HeadphonesIcon className="h-6 w-6 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                <span>Support</span>
              </Button>
            </Link>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1 - Upcoming Appointment & Health Vitals */}
            <div className="space-y-6">
              {/* Upcoming Appointment Card */}
              <Card className="overflow-hidden border-2">
                <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-3">
                  <h2 className="font-semibold text-lg flex items-center gap-2 text-blue-800">
                    <Calendar className="h-5 w-5" />
                    Upcoming Appointment
                  </h2>
                </div>
                <CardContent className="pt-4">
                  {upcomingAppointment ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{upcomingAppointment.doctorName}</h3>
                          <p className="text-gray-500">{upcomingAppointment.specialty}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-gray-500 mt-1" />
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-medium">{upcomingAppointment.date}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-gray-500 mt-1" />
                          <div>
                            <p className="text-xs text-gray-500">Time</p>
                            <p className="font-medium">{upcomingAppointment.time}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 mt-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-medium">{upcomingAppointment.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3">
                        <Link href="/appointments" passHref className="flex-1">
                          <Button className="w-full" variant="default">View Details</Button>
                        </Link>
                        <Button variant="outline" className="flex-none">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="bg-blue-100 p-3 rounded-full mb-3">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-gray-500 mb-4">No upcoming appointments</p>
                      <Link href="/appointments/schedule" passHref>
                        <Button>Schedule New Appointment</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Health Vitals Card */}
              {vitalStats && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Health Vitals
                    </CardTitle>
                    <CardDescription>Last updated: {vitalStats.lastUpdated}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Blood Pressure</p>
                        <p className="font-medium">{vitalStats.bloodPressure}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Heart Rate</p>
                        <p className="font-medium">{vitalStats.heartRate}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Temperature</p>
                        <p className="font-medium">{vitalStats.temperature}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Oxygen Level</p>
                        <p className="font-medium">{vitalStats.oxygenLevel}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Column 2 - Medications & Records */}
            <div className="space-y-6">
              {/* Medications Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary" />
                      <span>Current Medications</span>
                    </div>
                    <Badge variant="outline" className="font-normal">
                      {recentMedications.length} active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentMedications.length > 0 ? (
                    <div className="space-y-3">
                      {recentMedications.map((med, index) => (
                        <div key={index} className="flex items-start justify-between border-b pb-3 last:border-0">
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-gray-500">{med.dosage} • {med.frequency}</p>
                          </div>
                          <Badge variant={med.remaining < 10 ? "destructive" : "secondary"} className="ml-2">
                            {med.remaining} left
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No active medications</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Medications
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Recent Records Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Recent Medical Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentRecords.length > 0 ? (
                    <div className="space-y-3">
                      {recentRecords.map((record, index) => (
                        <div key={index} className="flex items-center justify-between pb-3 border-b last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{record.type}</p>
                              <p className="text-xs text-gray-500">{record.date}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No recent records</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/records" passHref className="w-full">
                    <Button variant="outline" className="w-full">View All Records</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            {/* Column 3 - Notifications & Health Tips */}
            <div className="space-y-6">
              {/* Notifications Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      <span>Notifications</span>
                    </div>
                    {notifications.length > 0 && (
                      <Badge>{notifications.length}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.length > 0 ? (
                    <div className="space-y-3">
                      {notifications.map((notification, index) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                          <div className={`p-2 rounded-full ${
                            notification.type === 'reminder' ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}>
                            {notification.type === 'reminder' ? (
                              <Clock className={`h-4 w-4 ${
                                notification.type === 'reminder' ? 'text-yellow-600' : 'text-blue-600'
                              }`} />
                            ) : (
                              <Bell className={`h-4 w-4 ${
                                notification.type === 'reminder' ? 'text-yellow-600' : 'text-blue-600'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.date}</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No new notifications</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Health Tips Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    Health Summary
                  </CardTitle>
                  <CardDescription>
                    Complete your health profile to get personalized care
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">Profile completion</p>
                        <p className="text-sm font-medium">{profileCompletion}%</p>
                      </div>
                      <Progress value={profileCompletion} className="h-2" />
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Complete your health profile to receive more accurate care recommendations and better prepare for your appointments.
                      </p>
                      <Link href="/profile" passHref>
                        <Button variant="link" className="text-blue-600 p-0 h-auto mt-2">
                          Update Profile →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}

