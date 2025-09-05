'use client';

import { useState } from 'react';
import PatientNavbar from '@/components/patient-navbar';
import PatientProtectedRoute from '@/components/patient-protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { FileText, Download, Calendar, Search, User } from 'lucide-react';

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

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        
        <main className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Medical Records</h1>
            <p className="text-gray-600">Access and manage your medical records</p>
          </div>
          
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search records..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="reports" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="reports">Test Reports</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reports">
              {filteredReports.length > 0 ? (
                <div className="grid gap-4">
                  {filteredReports.map(report => (
                    <Card key={report.id}>
                      <CardContent className="p-5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{report.title}</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  <span>{report.doctorName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{report.date}</span>
                                </div>
                                <span className="rounded-full bg-gray-100 px-2 py-0.5">
                                  {report.type}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mb-2 text-lg font-medium">No Reports Found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? 'No reports match your search criteria.' : 'You don\'t have any test reports yet.'}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="prescriptions">
              {filteredPrescriptions.length > 0 ? (
                <div className="grid gap-4">
                  {filteredPrescriptions.map(prescription => (
                    <Card key={prescription.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span>{prescription.doctorName}</span>
                            <span className="text-sm text-gray-500">
                              {prescription.date}
                            </span>
                          </div>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {prescription.medications.map((med, idx) => (
                            <div key={idx} className="rounded-lg bg-gray-50 p-3">
                              <p className="font-medium">{med.name} - {med.dosage}</p>
                              <p className="text-sm text-gray-600">
                                {med.frequency} • {med.duration}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mb-2 text-lg font-medium">No Prescriptions Found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? 'No prescriptions match your search criteria.' : 'You don\'t have any prescriptions yet.'}
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

