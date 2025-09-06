'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  Loader2, 
  User, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  ClipboardList,
  LayoutDashboard,
  Phone,
  Mail,
  MapPin,
  Cake,
  Heart,
  AlertCircle,
  FileText,
  Pill,
  Shield,
  Download,
  Plus
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import ProtectedRoute from '@/components/protected-route';
import DoctorNavbar from '@/components/doctor-navbar';

export default function PatientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id;
  const { data: session, status } = useSession();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // In a real app, fetch patient data from API using patientId
    // For demonstration, we'll simulate loading with mock data
    const timer = setTimeout(() => {
      setPatient({
        id: patientId,
        name: "Alice Smith",
        email: "alice.smith@example.com",
        phone: "+91 98765 43210",
        dob: new Date(1985, 3, 15), // April 15, 1985
        gender: "Female",
        bloodType: "O+",
        address: "123 Healthcare Avenue, Mumbai, Maharashtra 400001",
        emergencyContact: "John Smith (Husband) - +91 98765 43211",
        registeredDate: new Date(2022, 6, 10),
        allergies: ["Penicillin", "Peanuts"],
        chronicConditions: ["Hypertension"],
        avatar: "",
        appointments: [
          {
            id: 1,
            date: new Date(2023, 8, 12), // Sep 12, 2023
            time: "10:30 AM",
            reason: "Annual check-up",
            status: "completed",
            notes: "Patient reports feeling well. Blood pressure slightly elevated."
          },
          {
            id: 2,
            date: new Date(2023, 8, 24), // Sep 24, 2023
            time: "3:15 PM",
            reason: "Follow-up appointment",
            status: "upcoming",
            notes: ""
          }
        ],
        medicalRecords: [
          {
            id: 1,
            date: new Date(2023, 8, 12), // Sep 12, 2023
            type: "Physical Examination",
            doctor: "Dr. John Smith",
            summary: "Routine annual physical examination. Vital signs normal with slightly elevated blood pressure (135/85)."
          },
          {
            id: 2,
            date: new Date(2023, 7, 5), // Aug 5, 2023
            type: "Blood Test",
            doctor: "Dr. Sarah Johnson",
            summary: "Complete blood count and lipid profile. Cholesterol slightly elevated at 215 mg/dL."
          },
          {
            id: 3,
            date: new Date(2023, 5, 18), // June 18, 2023
            type: "X-Ray",
            doctor: "Dr. Michael Lee",
            summary: "Chest X-ray for persistent cough. No abnormalities detected."
          }
        ],
        prescriptions: [
          {
            id: 1,
            date: new Date(2023, 8, 12), // Sep 12, 2023
            medication: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "30 days",
            doctor: "Dr. John Smith",
            notes: "Take in the morning with food"
          },
          {
            id: 2,
            date: new Date(2023, 5, 18), // June 18, 2023
            medication: "Amoxicillin",
            dosage: "500mg",
            frequency: "Every 8 hours",
            duration: "7 days",
            doctor: "Dr. Michael Lee",
            notes: "Complete full course even if symptoms improve"
          }
        ]
      });
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [patientId]);

  if (!patientId) {
    router.push('/doctor/dashboard');
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="min-h-screen bg-background bg-gradient-to-b from-muted/30 to-background">
        <DoctorNavbar />
        
        <main className="container py-10 px-4 md:px-6">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="rounded-full hover:bg-muted/50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                  <User className="h-3.5 w-3.5" />
                  <span>Patient Profile</span>
                </div>
                <h1 className="text-2xl font-bold">Patient Details</h1>
              </div>
            </div>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Patient Information */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"></div>
                        <Avatar className="h-24 w-24 mb-4 border-2 border-primary/10 shadow-sm">
                          {patient.avatar ? (
                            <AvatarImage src={patient.avatar} alt={patient.name} />
                          ) : (
                            <AvatarFallback className={`${
                              patient.gender === 'Female' ? 'bg-pink-50' : 
                              patient.gender === 'Male' ? 'bg-blue-50' : 
                              'bg-primary/10'
                            }`}>
                              <User className={`h-12 w-12 ${
                                patient.gender === 'Female' ? 'text-pink-500' : 
                                patient.gender === 'Male' ? 'text-blue-500' : 
                                'text-primary'
                              }`} />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      
                      <h2 className="font-bold text-lg">{patient.name}</h2>
                      <p className="text-muted-foreground text-sm">
                        Patient ID: {patient.id}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={`${
                          patient.gender === 'Female' ? 'bg-pink-100 text-pink-800 border-pink-200' : 
                          patient.gender === 'Male' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                          ''
                        }`}>{patient.gender}</Badge>
                        <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">{patient.bloodType}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="p-1.5 rounded-full bg-primary/10">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{patient.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="p-1.5 rounded-full bg-primary/10">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{patient.email}</span>
                      </div>
                      
                      <div className="flex items-start gap-3 p-2 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm">{patient.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="p-1.5 rounded-full bg-primary/10">
                          <Cake className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">{format(patient.dob, 'MMM d, yyyy')}</div>
                          <div className="text-xs text-muted-foreground">{new Date().getFullYear() - patient.dob.getFullYear()} years old</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t mt-6 pt-6">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        Medical Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="p-3 bg-red-50/50 rounded-md border border-red-100">
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-700">Allergies</span>
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {patient.allergies.length > 0 ? (
                              patient.allergies.map((allergy, i) => (
                                <Badge key={i} variant="outline" className="bg-red-50 border-red-200 text-red-700 font-medium">
                                  {allergy}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-red-600/70 bg-red-50 px-2 py-1 rounded">No known allergies</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-amber-50/50 rounded-md border border-amber-100">
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                            <Heart className="h-4 w-4 text-amber-500" />
                            <span className="text-amber-700">Chronic Conditions</span>
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {patient.chronicConditions.length > 0 ? (
                              patient.chronicConditions.map((condition, i) => (
                                <Badge key={i} variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 font-medium">
                                  {condition}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-amber-600/70 bg-amber-50 px-2 py-1 rounded">None</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t mt-6 pt-6">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        Emergency Contact
                      </h3>
                      <div className="p-3 bg-blue-50/50 rounded-md border border-blue-100">
                        <p className="text-sm font-medium text-blue-700">{patient.emergencyContact}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t flex-col items-stretch gap-2 bg-muted/5 pt-4">
                    <Button variant="outline" className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10" onClick={() => router.push(`/doctor/appointments/new?patient=${patient.id}`)}>
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      Schedule Appointment
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                  <div className="border rounded-lg p-1 bg-muted/20 mb-2">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <LayoutDashboard className="h-4 w-4 mr-2 hidden sm:inline" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="appointments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Calendar className="h-4 w-4 mr-2 hidden sm:inline" />
                        Appointments
                      </TabsTrigger>
                      <TabsTrigger value="records" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <FileText className="h-4 w-4 mr-2 hidden sm:inline" />
                        Medical Records
                      </TabsTrigger>
                      <TabsTrigger value="prescriptions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Pill className="h-4 w-4 mr-2 hidden sm:inline" />
                        Prescriptions
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader className="pb-3 border-b">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <CardTitle>Patient Summary</CardTitle>
                            <CardDescription>
                              Overview of {patient.name}'s health profile
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Upcoming Appointments */}
                          <Card>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Upcoming Appointment</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              {patient.appointments.find(apt => apt.status === 'upcoming') ? (
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Date</span>
                                    <span className="text-sm font-medium">
                                      {format(patient.appointments.find(apt => apt.status === 'upcoming').date, 'MMM d, yyyy')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Time</span>
                                    <span className="text-sm font-medium">
                                      {patient.appointments.find(apt => apt.status === 'upcoming').time}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Reason</span>
                                    <span className="text-sm font-medium">
                                      {patient.appointments.find(apt => apt.status === 'upcoming').reason}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                                  <Button 
                                    variant="link" 
                                    className="mt-2 h-auto p-0" 
                                    onClick={() => router.push(`/doctor/appointments/new?patient=${patient.id}`)}
                                  >
                                    Schedule an appointment
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                          
                          {/* Latest Medical Record */}
                          <Card>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Latest Medical Record</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              {patient.medicalRecords.length > 0 ? (
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Date</span>
                                    <span className="text-sm font-medium">
                                      {format(patient.medicalRecords[0].date, 'MMM d, yyyy')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Type</span>
                                    <span className="text-sm font-medium">{patient.medicalRecords[0].type}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">Summary</span>
                                    <p className="text-sm mt-1">
                                      {patient.medicalRecords[0].summary}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <p className="text-sm text-muted-foreground">No medical records available</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Current Medications */}
                        <Card className="mt-6">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">Current Medications</CardTitle>
                              <Pill className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            {patient.prescriptions.length > 0 ? (
                              <div className="space-y-4">
                                {patient.prescriptions.map(prescription => (
                                  <div key={prescription.id} className="flex items-start gap-4 p-3 border rounded-md">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                      <Pill className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex flex-wrap justify-between gap-2">
                                        <h4 className="font-medium">{prescription.medication}</h4>
                                        <Badge variant="outline">{prescription.dosage}</Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {prescription.frequency} for {prescription.duration}
                                      </p>
                                      {prescription.notes && (
                                        <p className="text-xs mt-2 text-muted-foreground">
                                          Note: {prescription.notes}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <p className="text-sm text-muted-foreground">No active prescriptions</p>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="border-t pt-4">
                            <Button variant="outline" size="sm" className="ml-auto" onClick={() => setActiveTab('prescriptions')}>
                              View all prescriptions
                            </Button>
                          </CardFooter>
                        </Card>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Appointments Tab */}
                  <TabsContent value="appointments" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Appointment History</CardTitle>
                          <CardDescription>
                            View past and upcoming appointments
                          </CardDescription>
                        </div>
                        <Button onClick={() => router.push(`/doctor/appointments/new?patient=${patient.id}`)}>
                          <Plus className="h-4 w-4 mr-2" />
                          New Appointment
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {patient.appointments.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {patient.appointments.map(appointment => (
                                <TableRow key={appointment.id}>
                                  <TableCell>{format(appointment.date, 'MMM d, yyyy')}</TableCell>
                                  <TableCell>{appointment.time}</TableCell>
                                  <TableCell>{appointment.reason}</TableCell>
                                  <TableCell>
                                    <Badge className={
                                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                      appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-amber-100 text-amber-800'
                                    }>
                                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button variant="ghost" size="sm" onClick={() => router.push(`/doctor/appointments/${appointment.id}`)}>
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-10">
                            <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No appointment history</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Medical Records Tab */}
                  <TabsContent value="records" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Medical Records</CardTitle>
                          <CardDescription>
                            Patient's medical history and documentation
                          </CardDescription>
                        </div>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Record
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {patient.medicalRecords.length > 0 ? (
                          <div className="space-y-6">
                            {patient.medicalRecords.map(record => (
                              <div key={record.id} className="border rounded-lg p-4">
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                                  <div>
                                    <h3 className="font-medium">{record.type}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {format(record.date, 'MMM d, yyyy')} • {record.doctor}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                      <Download className="h-4 w-4 mr-2" />
                                      Export
                                    </Button>
                                  </div>
                                </div>
                                <div className="border-t pt-3">
                                  <p className="text-sm">{record.summary}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10">
                            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No medical records found</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Prescriptions Tab */}
                  <TabsContent value="prescriptions" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Prescriptions</CardTitle>
                          <CardDescription>
                            Medication history and current prescriptions
                          </CardDescription>
                        </div>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          New Prescription
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {patient.prescriptions.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Medication</TableHead>
                                <TableHead>Dosage</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {patient.prescriptions.map(prescription => (
                                <TableRow key={prescription.id}>
                                  <TableCell>{format(prescription.date, 'MMM d, yyyy')}</TableCell>
                                  <TableCell className="font-medium">{prescription.medication}</TableCell>
                                  <TableCell>{prescription.dosage}</TableCell>
                                  <TableCell>{prescription.frequency}</TableCell>
                                  <TableCell>{prescription.duration}</TableCell>
                                  <TableCell>
                                    <Button variant="ghost" size="sm">
                                      <Download className="h-4 w-4 mr-2" />
                                      Export
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-10">
                            <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No prescriptions found</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
