'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Loader2, 
  User, 
  UserCog,
  Settings,
  LayoutDashboard,
  Mail, 
  Phone, 
  MapPin, 
  Stethoscope, 
  GraduationCap,
  Clock,
  DollarSign,
  FileText,
  Building2,
  Award,
  Save,
  Camera,
  Trash2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProtectedRoute from '@/components/protected-route';
import DoctorNavbar from '@/components/doctor-navbar';

// Form validation schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  specialization: z.string().min(1, { message: 'Please select a specialization.' }),
  bio: z.string().max(500, { message: 'Bio must not be more than 500 characters.' }).optional(),
  address: z.string().optional(),
  consultationFees: z.coerce.number().min(0, { message: 'Consultation fees must be a positive number.' }),
  experienceYears: z.coerce.number().min(0, { message: 'Experience years must be a positive number.' }),
  education: z.string().optional(),
  hospital: z.string().optional(),
  languages: z.string().optional(),
  certificates: z.string().optional(),
});

const specializations = [
  'General Practitioner',
  'Cardiologist',
  'Dermatologist',
  'Gynecologist',
  'Neurologist',
  'Oncologist',
  'Ophthalmologist',
  'Orthopedic Surgeon',
  'Pediatrician',
  'Psychiatrist',
  'Radiologist',
  'Urologist'
];

export default function DoctorProfile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Initialize form with default values
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialization: '',
      bio: '',
      address: '',
      consultationFees: 0,
      experienceYears: 0,
      education: '',
      hospital: '',
      languages: '',
      certificates: ''
    }
  });

  useEffect(() => {
    if (status === 'authenticated') {
      // In a real app, fetch doctor data from API
      // For demonstration, we'll simulate loading with mock data
      const timer = setTimeout(() => {
        const mockDoctorData = {
          name: 'Dr. John Smith',
          email: session?.user?.email || 'doctor@example.com',
          phone: '+91 9876543210',
          specialization: 'Cardiologist',
          bio: 'Experienced cardiologist with over 8 years of clinical practice. Specializing in interventional cardiology and heart disease prevention.',
          address: '123 Medical Center, Healthcare Avenue, Mumbai, 400001',
          consultationFees: 1500,
          experienceYears: 8,
          education: 'MBBS, MD - Cardiology, DNB - Cardiology',
          hospital: 'City Medical Center',
          languages: 'English, Hindi, Marathi',
          certificates: 'Board Certified in Cardiology, Advanced Cardiac Life Support (ACLS)',
          status: 'approved',
          profilePicture: '',
          joinedDate: new Date('2021-05-15')
        };
        
        setDoctorInfo(mockDoctorData);
        
        // Update form with fetched data
        Object.entries(mockDoctorData).forEach(([key, value]) => {
          if (form.getValues(key) !== undefined) {
            form.setValue(key, value);
          }
        });
        
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [status, session, form]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    
    try {
      // In a real app, send update to API
      // For demonstration, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setDoctorInfo({
        ...doctorInfo,
        ...data
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="min-h-screen bg-background bg-gradient-to-b from-muted/30 to-background">
        <DoctorNavbar />
        
        <main className="container py-10 px-4 md:px-6">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <UserCog className="h-3.5 w-3.5" />
              <span>Profile Settings</span>
            </div>
            <h1 className="text-3xl font-bold">Doctor Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your professional information</p>
          </header>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar */}
              <div className="lg:col-span-1">
                <Card className="border shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"></div>
                        <Avatar className="h-24 w-24 border-2 border-primary/10 shadow-sm">
                          {doctorInfo.profilePicture ? (
                            <AvatarImage src={doctorInfo.profilePicture} alt={doctorInfo.name} />
                          ) : (
                            <AvatarFallback className="bg-primary/10">
                              <User className="h-12 w-12 text-primary" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <button className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-white shadow-sm hover:bg-primary/90 transition-colors">
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <h3 className="font-bold text-lg mt-2">{doctorInfo.name}</h3>
                      <p className="text-muted-foreground">{doctorInfo.specialization}</p>
                      
                      <Badge 
                        variant={doctorInfo.status === 'approved' ? 'outline' : 'secondary'}
                        className={`mt-2 ${
                          doctorInfo.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 
                          'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        {doctorInfo.status === 'approved' ? 'Approved' : doctorInfo.status}
                      </Badge>
                      
                      <div className="w-full mt-6 space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="p-1.5 rounded-full bg-primary/10">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <span className="truncate text-sm font-medium">{doctorInfo.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 p-2 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="p-1.5 rounded-full bg-primary/10">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{doctorInfo.phone}</span>
                        </div>
                        
                        <div className="flex items-start gap-3 p-2 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                          <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-left text-sm">{doctorInfo.address}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4 flex justify-center bg-muted/5">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push('/doctor/dashboard')}
                      className="border-primary/20 bg-primary/5 hover:bg-primary/10 gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      View Dashboard
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="mt-6 border shadow-sm">
                  <CardHeader className="border-b bg-muted/5 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-blue-100">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <CardTitle className="text-base">Account Information</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm pt-4">
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                      <span className="font-medium">Account Status</span>
                      <Badge 
                        variant="outline" 
                        className={`${
                          doctorInfo.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 
                          'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        {doctorInfo.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                      <span className="font-medium">Joined Date</span>
                      <span className="bg-blue-50 px-2 py-1 rounded text-blue-700 text-xs">
                        {doctorInfo.joinedDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                      <span className="font-medium">Last Updated</span>
                      <span className="bg-green-50 px-2 py-1 rounded text-green-700 text-xs">Today</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                  <div className="border rounded-lg p-1 bg-muted/20 mb-2">
                    <TabsList className="grid w-full grid-cols-2 gap-1">
                      <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <User className="h-4 w-4 mr-2 hidden sm:inline" />
                        Profile Information
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Settings className="h-4 w-4 mr-2 hidden sm:inline" />
                        Account Settings
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="profile" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Update your personal and professional details
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Dr. Full Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="email" 
                                        placeholder="doctor@example.com" 
                                        {...field} 
                                        disabled
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Email cannot be changed
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="+91 1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="specialization"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Specialization</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select specialization" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {specializations.map((specialization) => (
                                          <SelectItem key={specialization} value={specialization}>
                                            {specialization}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio / About</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Write a short bio about your professional experience and expertise" 
                                      className="min-h-32" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Maximum 500 characters
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Your clinic or hospital address" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="consultationFees"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Consultation Fees (₹)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="0" 
                                        step="100" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="experienceYears"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Years of Experience</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="0" 
                                        max="100" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="education"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Education & Qualifications</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="MBBS, MD, etc." 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="hospital"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Hospital / Clinic</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Hospital or clinic name" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="languages"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Languages Spoken</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="English, Hindi, etc." 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="certificates"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Certifications</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Professional certifications" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="flex justify-end">
                              <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center">
                        <div className="space-y-1.5">
                          <CardTitle>Professional Highlights</CardTitle>
                          <CardDescription>
                            Your professional expertise and achievements
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <Stethoscope className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Specialization</h4>
                                <p className="text-sm text-muted-foreground">{doctorInfo.specialization}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <GraduationCap className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Education</h4>
                                <p className="text-sm text-muted-foreground">{doctorInfo.education || 'Not specified'}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <Building2 className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Hospital/Clinic</h4>
                                <p className="text-sm text-muted-foreground">{doctorInfo.hospital || 'Not specified'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <Clock className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Experience</h4>
                                <p className="text-sm text-muted-foreground">{doctorInfo.experienceYears} years</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <DollarSign className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Consultation Fee</h4>
                                <p className="text-sm text-muted-foreground">₹{doctorInfo.consultationFees}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <Award className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">Certifications</h4>
                                <p className="text-sm text-muted-foreground">{doctorInfo.certificates || 'Not specified'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>
                          Manage your account settings and preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="font-medium">Email Notifications</h3>
                          <div className="flex items-center justify-between border p-4 rounded-lg">
                            <div>
                              <h4 className="font-medium">Appointment Reminders</h4>
                              <p className="text-sm text-muted-foreground">Receive email notifications for appointment reminders</p>
                            </div>
                            <div>
                              <Button variant="outline" size="sm">Enable</Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border p-4 rounded-lg">
                            <div>
                              <h4 className="font-medium">Patient Updates</h4>
                              <p className="text-sm text-muted-foreground">Receive updates when patients book or cancel appointments</p>
                            </div>
                            <div>
                              <Button variant="outline" size="sm">Enable</Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6 space-y-4">
                          <h3 className="font-medium">Change Password</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Current Password</label>
                              <Input type="password" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">New Password</label>
                              <Input type="password" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Confirm New Password</label>
                              <Input type="password" />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button variant="outline">Change Password</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-red-200">
                      <CardHeader>
                        <CardTitle>Danger Zone</CardTitle>
                        <CardDescription>
                          Careful, these actions cannot be undone
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between border border-red-200 p-4 rounded-lg">
                          <div>
                            <h4 className="font-medium">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete your account and all associated data
                            </p>
                          </div>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
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
