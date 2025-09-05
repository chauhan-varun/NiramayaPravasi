'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, Download, Eye, Calendar, User, Filter, Upload, Plus } from 'lucide-react';
import PatientNavbar from '@/components/patient-navbar';

export default function RecordsPage() {
  const { data: session } = useSession();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    setTimeout(() => {
      setRecords([
        {
          id: 1,
          title: 'Blood Test Results',
          type: 'Lab Report',
          doctor: 'Dr. Sarah Johnson',
          date: '2025-08-28',
          category: 'laboratory',
          description: 'Complete blood count and lipid panel results',
          fileSize: '2.4 MB',
          status: 'completed',
          urgent: false
        },
        {
          id: 2,
          title: 'Cardiology Consultation',
          type: 'Consultation Notes',
          doctor: 'Dr. Sarah Johnson',
          date: '2025-08-25',
          category: 'consultation',
          description: 'Heart rhythm assessment and treatment plan',
          fileSize: '1.8 MB',
          status: 'completed',
          urgent: false
        },
        {
          id: 3,
          title: 'Chest X-Ray',
          type: 'Imaging Report',
          doctor: 'Dr. Michael Chen',
          date: '2025-08-20',
          category: 'imaging',
          description: 'Chest X-ray examination for respiratory symptoms',
          fileSize: '5.2 MB',
          status: 'completed',
          urgent: false
        },
        {
          id: 4,
          title: 'Prescription - Lisinopril',
          type: 'Prescription',
          doctor: 'Dr. Sarah Johnson',
          date: '2025-08-15',
          category: 'prescription',
          description: 'Blood pressure medication prescription',
          fileSize: '0.8 MB',
          status: 'active',
          urgent: false
        },
        {
          id: 5,
          title: 'Annual Physical Exam',
          type: 'Examination Report',
          doctor: 'Dr. Michael Chen',
          date: '2025-07-10',
          category: 'examination',
          description: 'Comprehensive annual health checkup',
          fileSize: '3.1 MB',
          status: 'completed',
          urgent: false
        },
        {
          id: 6,
          title: 'Allergy Test Results',
          type: 'Lab Report',
          doctor: 'Dr. Emily Davis',
          date: '2025-06-22',
          category: 'laboratory',
          description: 'Comprehensive allergy panel testing',
          fileSize: '1.9 MB',
          status: 'completed',
          urgent: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'lab report':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'consultation notes':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'imaging report':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'prescription':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'examination report':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'active':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && record.category === activeTab;
  });

  const recordCounts = {
    all: records.length,
    laboratory: records.filter(r => r.category === 'laboratory').length,
    imaging: records.filter(r => r.category === 'imaging').length,
    consultation: records.filter(r => r.category === 'consultation').length,
    prescription: records.filter(r => r.category === 'prescription').length,
    examination: records.filter(r => r.category === 'examination').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientNavbar />
      
      <main className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
            <p className="text-gray-600">Access and manage your health documents</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Record
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Request Record
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-blue-600">{records.length}</p>
                  <p className="text-xs text-gray-500">All Documents</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lab Reports</p>
                  <p className="text-2xl font-bold text-green-600">{recordCounts.laboratory}</p>
                  <p className="text-xs text-gray-500">Test Results</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Imaging</p>
                  <p className="text-2xl font-bold text-purple-600">{recordCounts.imaging}</p>
                  <p className="text-xs text-gray-500">X-rays, Scans</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prescriptions</p>
                  <p className="text-2xl font-bold text-orange-600">{recordCounts.prescription}</p>
                  <p className="text-xs text-gray-500">Active Meds</p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
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
                  Search Records
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by title, doctor, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Your Medical Records</CardTitle>
            <CardDescription>View and download your health documents</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All ({recordCounts.all})</TabsTrigger>
                <TabsTrigger value="laboratory">Lab ({recordCounts.laboratory})</TabsTrigger>
                <TabsTrigger value="imaging">Imaging ({recordCounts.imaging})</TabsTrigger>
                <TabsTrigger value="consultation">Consult ({recordCounts.consultation})</TabsTrigger>
                <TabsTrigger value="prescription">Rx ({recordCounts.prescription})</TabsTrigger>
                <TabsTrigger value="examination">Exam ({recordCounts.examination})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredRecords.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRecords.map((record) => (
                      <RecordCard key={record.id} record={record} getTypeColor={getTypeColor} getStatusColor={getStatusColor} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm ? 'Try adjusting your search terms' : 'Your medical records will appear here'}
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Request Medical Record
                    </Button>
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

function RecordCard({ record, getTypeColor, getStatusColor }) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-start gap-3 mb-4 md:mb-0">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-lg truncate">{record.title}</h3>
                {record.urgent && (
                  <Badge className="bg-red-100 text-red-700 border-red-200">Urgent</Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">{record.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getTypeColor(record.type)}>
                  {record.type}
                </Badge>
                <Badge className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{record.doctor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{record.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{record.fileSize}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
