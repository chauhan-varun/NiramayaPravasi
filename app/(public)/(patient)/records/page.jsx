'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import PatientNavbar from '@/components/patient-navbar';
import PatientProtectedRoute from '@/components/patient-protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, Download, Calendar, Search, User, Filter, X, FileBarChart, PieChart, 
         Pill, FileImage, Eye, Share2, Clock, ArrowUpDown, ChevronRight } from 'lucide-react';

export default function PatientRecords() {
  const [activeTab, setActiveTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock record data
  const reportData = [
    {
      id: 1,
      title: 'Blood Test Results',
      doctorName: 'Dr. Sharma',
      date: '2023-09-12',
      type: 'Laboratory',
      fileUrl: '#'
    },
    {
      id: 2,
      title: 'X-Ray Report - Chest',
      doctorName: 'Dr. Singh',
      date: '2023-08-05',
      type: 'Radiology',
      fileUrl: '#'
    },
    {
      id: 3,
      title: 'Annual Health Checkup',
      doctorName: 'Dr. Patel',
      date: '2023-07-22',
      type: 'General',
      fileUrl: '#'
    }
  ];
  
  const prescriptionData = [
    {
      id: 1,
      doctorName: 'Dr. Sharma',
      date: '2023-09-12',
      medications: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', duration: '7 days' },
        { name: 'Paracetamol', dosage: '650mg', frequency: 'As needed', duration: 'For fever' }
      ],
      fileUrl: '#'
    },
    {
      id: 2,
      doctorName: 'Dr. Gupta',
      date: '2023-08-18',
      medications: [
        { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '14 days' }
      ],
      fileUrl: '#'
    }
  ];

  // Filter data based on search query
  const filteredReports = reportData.filter(report => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPrescriptions = prescriptionData.filter(prescription => 
    prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.medications.some(med => 
      med.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const [currentDate] = useState(new Date());
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  
  // Report categories with icons
  const reportCategories = {
    'Laboratory': <FileBarChart className="h-4 w-4 text-blue-600" />,
    'Radiology': <FileImage className="h-4 w-4 text-purple-600" />,
    'General': <PieChart className="h-4 w-4 text-green-600" />
  };
  
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
  
  // Additional filtering based on type
  const finalFilteredReports = filteredReports.filter(report => 
    !filterType || report.type === filterType
  );
  
  // Sort reports based on user preference
  const sortedReports = [...finalFilteredReports].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return a.title.localeCompare(b.title);
    }
  });
  
  // Sort prescriptions by date
  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return a.doctorName.localeCompare(b.doctorName);
    }
  });
  
  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        {/* Hero header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="container py-8 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Medical Records</h1>
                <p className="text-blue-100 mt-1">
                  {format(currentDate, 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    {filteredReports.length} Reports
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    {filteredPrescriptions.length} Prescriptions
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="container py-6 px-4 sm:px-6">
          {/* Search and filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search records..." 
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
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setSortBy(sortBy === 'recent' ? 'name' : 'recent')}
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortBy === 'recent' ? 'Latest First' : 'Name'}
              </Button>
            </div>
          </div>
          
          {/* Type filters */}
          {showFilters && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <h3 className="font-medium mb-2">Filter by type</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filterType === '' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilterType('')}
                >
                  All Types
                </Button>
                {Object.keys(reportCategories).map(type => (
                  <Button 
                    key={type} 
                    variant={filterType === type ? 'default' : 'outline'} 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setFilterType(type)}
                  >
                    <span className="flex items-center justify-center">
                      {reportCategories[type]}
                    </span>
                    <span>{type}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <Tabs defaultValue="reports" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-white p-1">
                <TabsTrigger value="reports" className="rounded-md px-5 py-2">
                  Reports ({finalFilteredReports.length})
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="rounded-md px-5 py-2">
                  Prescriptions ({filteredPrescriptions.length})
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Reports tab */}
            <TabsContent value="reports">
              {sortedReports.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedReports.map(report => (
                    <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow border-2">
                      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white border-b">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-white font-medium">
                            {report.type}
                          </Badge>
                          <div className="text-sm text-gray-500">
                            {report.date}
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-1">
                          {report.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 bg-blue-100">
                            <AvatarFallback className="bg-blue-500 text-white">
                              {getInitials(report.doctorName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{report.doctorName}</p>
                            <p className="text-sm text-gray-500">Attending Physician</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <span>Created on {report.date}</span>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="bg-gray-50 border-t py-3 flex justify-between">
                        <Button variant="ghost" size="sm" className="gap-1 text-blue-600">
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Share2 className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-dashed p-8 text-center">
                  <div className="inline-flex h-12 w-12 rounded-full bg-blue-100 p-2 mb-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
                  <p className="text-gray-500 mb-4 max-w-md mx-auto">
                    {searchQuery || filterType ? 
                      'No reports match your search criteria.' : 
                      'You don\'t have any test reports in your medical records yet.'
                    }
                  </p>
                  {(searchQuery || filterType) && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Prescriptions tab */}
            <TabsContent value="prescriptions">
              {sortedPrescriptions.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedPrescriptions.map(prescription => (
                    <Card key={prescription.id} className="border-2">
                      <CardHeader className="pb-3 border-b bg-gradient-to-r from-green-50 to-white">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="border-green-200 bg-white text-green-700">
                            Prescription
                          </Badge>
                          <div className="text-sm text-gray-500">
                            {prescription.date}
                          </div>
                        </div>
                        <CardTitle className="mt-2 text-lg">
                          <div className="flex items-center gap-2">
                            <span>{prescription.doctorName}</span>
                          </div>
                        </CardTitle>
                        <CardDescription>
                          Medication Prescription
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {prescription.medications.map((med, idx) => (
                            <div key={idx} className="flex items-center gap-3 pb-2 border-b last:border-0 last:pb-0">
                              <div className="bg-green-100 p-2 rounded-full">
                                <Pill className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{med.name} - {med.dosage}</p>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">{med.frequency}</span>
                                  <span className="text-gray-500">{med.duration}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="bg-gray-50 border-t py-3 flex justify-between">
                        <Button variant="ghost" size="sm" className="gap-1 text-green-600">
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4 text-gray-500" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-dashed p-8 text-center">
                  <div className="inline-flex h-12 w-12 rounded-full bg-green-100 p-2 mb-3">
                    <Pill className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Prescriptions Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchQuery ? 
                      'No prescriptions match your search criteria.' : 
                      'Your prescriptions will appear here when doctors prescribe medications.'
                    }
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline"
                      onClick={() => setSearchQuery('')}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}

