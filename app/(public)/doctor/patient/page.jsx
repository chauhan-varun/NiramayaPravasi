'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  Loader2, 
  Search, 
  User, 
  Users,
  Plus, 
  FileText, 
  CalendarClock,
  ChevronDown,
  ArrowUpDown,
  Filter
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedRoute from '@/components/protected-route';
import DoctorNavbar from '@/components/doctor-navbar';

export default function PatientListPage() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterBloodType, setFilterBloodType] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  
  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading patients from API
    setTimeout(() => {
      const mockPatients = [
        {
          id: "101",
          name: "Alice Smith",
          email: "alice.smith@example.com",
          phone: "+91 98765 43210",
          dob: new Date(1985, 3, 15),
          gender: "Female",
          bloodType: "O+",
          lastVisit: new Date(2023, 8, 12),
          upcomingAppointment: new Date(2023, 8, 24),
          chronicConditions: ["Hypertension"],
          address: "123 Healthcare Avenue, Mumbai, Maharashtra"
        },
        {
          id: "102",
          name: "Bob Johnson",
          email: "bob.johnson@example.com",
          phone: "+91 98765 43211",
          dob: new Date(1978, 6, 23),
          gender: "Male",
          bloodType: "A+",
          lastVisit: new Date(2023, 8, 5),
          upcomingAppointment: new Date(2023, 8, 25),
          chronicConditions: ["Diabetes Type 2"],
          address: "456 Medical Road, Delhi"
        },
        {
          id: "103",
          name: "Carol Williams",
          email: "carol.williams@example.com",
          phone: "+91 98765 43212",
          dob: new Date(1990, 11, 7),
          gender: "Female",
          bloodType: "B-",
          lastVisit: new Date(2023, 7, 18),
          upcomingAppointment: new Date(2023, 8, 26),
          chronicConditions: [],
          address: "789 Wellness Street, Bangalore, Karnataka"
        },
        {
          id: "104",
          name: "David Wilson",
          email: "david.wilson@example.com",
          phone: "+91 98765 43213",
          dob: new Date(1965, 2, 12),
          gender: "Male",
          bloodType: "AB+",
          lastVisit: new Date(2023, 8, 10),
          upcomingAppointment: null,
          chronicConditions: ["Arthritis", "Hypertension"],
          address: "321 Health Park, Chennai, Tamil Nadu"
        },
        {
          id: "105",
          name: "Eva Brown",
          email: "eva.brown@example.com",
          phone: "+91 98765 43214",
          dob: new Date(1982, 9, 30),
          gender: "Female",
          bloodType: "O-",
          lastVisit: new Date(2023, 7, 25),
          upcomingAppointment: null,
          chronicConditions: ["Asthma"],
          address: "567 Care Lane, Kolkata, West Bengal"
        },
        {
          id: "106",
          name: "Frank Miller",
          email: "frank.miller@example.com",
          phone: "+91 98765 43215",
          dob: new Date(1975, 5, 18),
          gender: "Male",
          bloodType: "A-",
          lastVisit: null,
          upcomingAppointment: new Date(2023, 8, 27),
          chronicConditions: [],
          address: "890 Wellness Way, Hyderabad, Telangana"
        },
        {
          id: "107",
          name: "Grace Taylor",
          email: "grace.taylor@example.com",
          phone: "+91 98765 43216",
          dob: new Date(1992, 1, 5),
          gender: "Female",
          bloodType: "B+",
          lastVisit: new Date(2023, 8, 15),
          upcomingAppointment: null,
          chronicConditions: ["Migraine"],
          address: "432 Cure Street, Pune, Maharashtra"
        }
      ];
      
      setPatients(mockPatients);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter and sort patients
  const filteredPatients = patients.filter(patient => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone.includes(query) ||
        patient.address.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }
    
    // Blood type filter
    if (filterBloodType !== 'all' && patient.bloodType !== filterBloodType) {
      return false;
    }
    
    // Gender filter
    if (filterGender !== 'all' && patient.gender !== filterGender) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort logic
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'lastVisit':
        // Handle null values
        if (!a.lastVisit) return 1;
        if (!b.lastVisit) return -1;
        comparison = a.lastVisit - b.lastVisit;
        break;
      case 'upcomingAppointment':
        // Handle null values
        if (!a.upcomingAppointment) return 1;
        if (!b.upcomingAppointment) return -1;
        comparison = a.upcomingAppointment - b.upcomingAppointment;
        break;
      case 'dob':
        comparison = a.dob - b.dob;
        break;
    }
    
    // Apply sort direction
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      // If already sorting by this column, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise, sort by this column in ascending order
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const getAge = (dob) => {
    return new Date().getFullYear() - dob.getFullYear();
  };

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="min-h-screen bg-background bg-gradient-to-b from-muted/30 to-background">
        <DoctorNavbar />
        
        <main className="container py-10 px-4 md:px-6">
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <Users className="h-3.5 w-3.5" />
                <span>Patient Management</span>
              </div>
              <h1 className="text-3xl font-bold">Patients</h1>
              <p className="text-muted-foreground mt-1">Manage your patient records</p>
            </div>
            
            <Button 
              onClick={() => router.push('/doctor/patient/new')} 
              className="gap-2 h-10 px-4 shadow-sm self-start sm:self-center"
            >
              <Plus className="h-4 w-4" />
              Add New Patient
            </Button>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Patient Directory</CardTitle>
                      <CardDescription>
                        View and manage all your registered patients
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search and Filter Controls */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search patients by name, email, or phone..." 
                          className="pl-10 bg-card/50 border-input shadow-sm"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <Select value={filterBloodType} onValueChange={setFilterBloodType}>
                        <SelectTrigger className="w-full md:w-36 bg-card/50 border-input shadow-sm">
                          <SelectValue placeholder="Blood Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className="font-semibold">Blood Type</SelectLabel>
                            <SelectItem value="all">All Types</SelectItem>
                            <div className="grid grid-cols-2 gap-1">
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                            </div>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      
                      <Select value={filterGender} onValueChange={setFilterGender}>
                        <SelectTrigger className="w-full md:w-36 bg-card/50 border-input shadow-sm">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className="font-semibold">Gender</SelectLabel>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 border-input shadow-sm"
                        onClick={() => {
                          setSearchQuery('');
                          setFilterBloodType('all');
                          setFilterGender('all');
                        }}
                      >
                        <Filter className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Patient Table */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">
                            <Button 
                              variant="ghost" 
                              className="p-0 hover:bg-transparent"
                              onClick={() => handleSort('name')}
                            >
                              <span>Patient</span>
                              {sortBy === 'name' && (
                                <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="p-0 hover:bg-transparent"
                              onClick={() => handleSort('dob')}
                            >
                              <span>Age/Gender</span>
                              {sortBy === 'dob' && (
                                <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead className="hidden lg:table-cell">Conditions</TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="p-0 hover:bg-transparent"
                              onClick={() => handleSort('lastVisit')}
                            >
                              <span>Last Visit</span>
                              {sortBy === 'lastVisit' && (
                                <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="p-0 hover:bg-transparent"
                              onClick={() => handleSort('upcomingAppointment')}
                            >
                              <span>Upcoming</span>
                              {sortBy === 'upcomingAppointment' && (
                                <ArrowUpDown className={`ml-2 h-3.5 w-3.5 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map(patient => (
                            <TableRow 
                              key={patient.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => router.push(`/doctor/patient/${patient.id}`)}
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className={`rounded-full p-2 ${
                                    patient.gender === 'Male' ? 'bg-blue-50' : 
                                    patient.gender === 'Female' ? 'bg-pink-50' : 
                                    'bg-purple-50'
                                  }`}>
                                    <User className={`h-4 w-4 ${
                                      patient.gender === 'Male' ? 'text-blue-500' : 
                                      patient.gender === 'Female' ? 'text-pink-500' : 
                                      'text-purple-500'
                                    }`} />
                                  </div>
                                  <div>
                                    <div className="font-medium">{patient.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      ID: {patient.id}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="bg-muted/20 px-2 py-1 rounded text-sm">
                                    {getAge(patient.dob)} yrs
                                  </div>
                                  <Badge variant="outline" className={`${
                                    patient.gender === 'Male' ? 'border-blue-200 bg-blue-50 text-blue-700' : 
                                    patient.gender === 'Female' ? 'border-pink-200 bg-pink-50 text-pink-700' : 
                                    'border-purple-200 bg-purple-50 text-purple-700'
                                  }`}>
                                    {patient.gender}
                                  </Badge>
                                </div>
                                <div className="text-xs mt-1.5">
                                  <Badge variant="outline" className="text-xs font-medium bg-red-50 border-red-200 text-red-700">
                                    {patient.bloodType}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">{patient.phone}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {patient.email}
                                </div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                {patient.chronicConditions.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {patient.chronicConditions.map((condition, i) => (
                                      <Badge 
                                        key={i} 
                                        variant="outline" 
                                        className="bg-amber-50 text-amber-800 text-xs font-medium border-amber-200"
                                      >
                                        {condition}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">None</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {patient.lastVisit ? (
                                  <div className="flex items-center gap-1.5 bg-muted/20 px-2 py-1 rounded w-fit">
                                    <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-sm">{format(patient.lastVisit, 'MMM d, yyyy')}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">Never</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {patient.upcomingAppointment ? (
                                  <Badge className="bg-blue-100 text-blue-800 font-medium border-blue-200">
                                    {format(patient.upcomingAppointment, 'MMM d')}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded">None</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="outline" className="h-8 w-8 p-0 border-input shadow-sm">
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/doctor/patient/${patient.id}`);
                                    }}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/doctor/appointments/new?patient=${patient.id}`);
                                    }}>
                                      Schedule Appointment
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      // Functionality to add medical record
                                      router.push(`/doctor/patient/${patient.id}?action=add-record`);
                                    }}>
                                      Add Medical Record
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      // Functionality to add prescription
                                      router.push(`/doctor/patient/${patient.id}?action=add-prescription`);
                                    }}>
                                      Add Prescription
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <FileText className="h-8 w-8 mb-2" />
                                <p>No patients found</p>
                                <p className="text-sm">Try adjusting your search filters</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
