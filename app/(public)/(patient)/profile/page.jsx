'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneNumberInput } from '@/components/ui/phone-input';
import { User, Mail, Phone, Calendar, MapPin, Shield, Bell, Save, Edit, AlertTriangle, CheckCircle2, Info, Lock, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import PatientNavbar from '@/components/patient-navbar';
import PatientProtectedRoute from '@/components/patient-protected-route';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      bloodType: '',
      allergies: '',
      medications: '',
    }
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData = {
      name: session?.user?.name || 'John Doe',
      email: session?.user?.email || 'john.doe@email.com',
      phone: '+15551234567', // E164 format
      dateOfBirth: '1990-01-15',
      gender: 'male',
      address: '123 Main Street, Anytown, ST 12345',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+15559876543', // E164 format
      bloodType: 'O+',
      allergies: 'Penicillin, Shellfish',
      medications: 'Lisinopril 10mg daily',
      memberSince: '2023-01-15',
      lastVisit: '2025-08-28',
    };
    
    setProfileData(mockData);
    profileForm.reset(mockData);
  }, [session, profileForm]);

  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileData(data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      passwordForm.reset();
      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [currentDate] = useState(new Date());
  const [profileCompletion, setProfileCompletion] = useState(85);

  // Calculate profile completion percentage
  useEffect(() => {
    if (profileData) {
      const fields = Object.keys(profileData);
      const completedFields = fields.filter(field => Boolean(profileData[field])).length;
      const percentage = Math.round((completedFields / fields.length) * 100);
      setProfileCompletion(percentage);
    }
  }, [profileData]);

  // Get user initials for avatar
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

        {/* Hero header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="container py-8 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                  <AvatarFallback className="bg-blue-800 text-white text-xl">
                    {getInitials(profileData?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{profileData?.name || 'Loading...'}</h1>
                  <p className="text-blue-100 mt-1">
                    {format(currentDate, 'EEEE, MMMM do, yyyy')}
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-2">
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-blue-600 hover:bg-blue-50 border border-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="bg-white/20 text-white hover:bg-white/30 border border-white/40"
                      onClick={() => {
                        setIsEditing(false);
                        profileForm.reset(profileData);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={profileForm.handleSubmit(onProfileSubmit)}
                      disabled={loading}
                      className="bg-white text-blue-600 hover:bg-blue-50 border border-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      
        <main className="container py-6 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            {/* Profile Summary Card */}
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Profile Summary
                    </div>
                    <Badge variant={profileCompletion > 80 ? 'success' : 'outline'}>
                      {profileCompletion}% Complete
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium">Profile completion</p>
                      </div>
                      <Progress value={profileCompletion} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Email</span>
                        </div>
                        <span className="text-sm font-medium">{profileData?.email}</span>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Phone</span>
                        </div>
                        <span className="text-sm font-medium">{profileData?.phone}</span>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Member since</span>
                        </div>
                        <span className="text-sm font-medium">
                          {profileData?.memberSince ? new Date(profileData.memberSince).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Blood Type</span>
                        </div>
                        <Badge variant="outline" className="font-semibold">
                          {profileData?.bloodType || 'Not set'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-blue-600">5</div>
                      <div className="text-xs text-blue-600 font-medium">Appointments</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-green-600">3</div>
                      <div className="text-xs text-green-600 font-medium">Records</div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Security Status Card */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-500" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full p-1">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Phone verified</p>
                          <p className="text-xs text-gray-500">Primary phone number is verified</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 rounded-full p-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Password strength</p>
                          <p className="text-xs text-gray-500">Consider updating for better security</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full p-1">
                          <Info className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Last password change</p>
                          <p className="text-xs text-gray-500">30+ days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-white p-1 mb-6">
                <TabsTrigger value="personal" className="rounded-md px-5 py-2">Personal Info</TabsTrigger>
                <TabsTrigger value="medical" className="rounded-md px-5 py-2">Medical Info</TabsTrigger>
                <TabsTrigger value="security" className="rounded-md px-5 py-2">Security</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal">
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                      <User className="h-5 w-5 text-blue-600" />
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-blue-700/70">
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Form {...profileForm}>
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    disabled={!isEditing} 
                                    className={isEditing ? "border-2 focus-visible:ring-blue-500" : ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="email" 
                                    disabled={!isEditing} 
                                    className={isEditing ? "border-2 focus-visible:ring-blue-500" : ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <PhoneNumberInput 
                                    {...field} 
                                    disabled={!isEditing} 
                                    className={isEditing ? "border-2" : ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="date" 
                                    disabled={!isEditing} 
                                    className={isEditing ? "border-2 focus-visible:ring-blue-500" : ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                  <FormControl>
                                    <SelectTrigger className={isEditing ? "border-2" : ""}>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled={!isEditing} 
                                  className={isEditing ? "border-2 focus-visible:ring-blue-500" : ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="emergencyContact"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Emergency Contact Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    disabled={!isEditing} 
                                    className={isEditing ? "border-2 focus-visible:ring-blue-500" : ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="emergencyPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Emergency Contact Phone</FormLabel>
                                <FormControl>
                                  <PhoneNumberInput 
                                    {...field} 
                                    disabled={!isEditing} 
                                    className={isEditing ? "border-2" : ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                  
                  {isEditing && (
                    <CardFooter className="bg-gray-50 border-t flex justify-end py-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            profileForm.reset(profileData);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={profileForm.handleSubmit(onProfileSubmit)}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? (
                            <>Loading...</>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              {/* Medical Information Tab */}
              <TabsContent value="medical">
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                      <Heart className="h-5 w-5 text-green-600" />
                      Medical Information
                    </CardTitle>
                    <CardDescription className="text-green-700/70">
                      Manage your medical history and health information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Form {...profileForm}>
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="bloodType"
                            render={({ field }) => (
                              <FormItem className="sm:col-span-1">
                                <FormLabel>Blood Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                  <FormControl>
                                    <SelectTrigger className={isEditing ? "border-2" : ""}>
                                      <SelectValue placeholder="Select blood type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="allergies"
                            render={({ field }) => (
                              <FormItem className="sm:col-span-2">
                                <FormLabel>Known Allergies</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g., Penicillin, Shellfish, Nuts" 
                                    disabled={!isEditing} 
                                    className={isEditing ? "border-2 focus-visible:ring-blue-500" : ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="medications"
                            render={({ field }) => (
                              <FormItem className="sm:col-span-2">
                                <FormLabel>Current Medications</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g., Lisinopril 10mg daily" 
                                    disabled={!isEditing} 
                                    className={isEditing ? "border-2 focus-visible:ring-blue-500" : ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                  
                  {isEditing && (
                    <CardFooter className="bg-gray-50 border-t flex justify-end py-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            profileForm.reset(profileData);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={profileForm.handleSubmit(onProfileSubmit)}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? 'Saving...' : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
                
                {/* Health records reminder card */}
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-4 items-start">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Info className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Keep your health records updated</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Keeping your medical information current helps doctors provide better care during your visits.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="border-2">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg text-orange-800">
                      <Shield className="h-5 w-5 text-orange-600" />
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-orange-700/70">
                      Manage your account security and password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" className="border-2 focus-visible:ring-blue-500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" className="border-2 focus-visible:ring-blue-500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" className="border-2 focus-visible:ring-blue-500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Password strength tips */}
                        <div className="bg-gray-50 p-4 rounded-lg border text-sm">
                          <p className="font-medium mb-2">Password strength tips:</p>
                          <ul className="space-y-1 text-gray-600">
                            <li className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                              <span>Use at least 8 characters</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                              <span>Mix uppercase and lowercase letters</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                              <span>Include numbers and special characters</span>
                            </li>
                          </ul>
                        </div>
                        
                        <Button 
                          type="submit" 
                          disabled={loading} 
                          className="bg-blue-600 hover:bg-blue-700"
                          size="lg"
                        >
                          {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
    </PatientProtectedRoute>
  );
}
