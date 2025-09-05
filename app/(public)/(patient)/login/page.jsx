'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhoneNumberInput } from '@/components/ui/phone-input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// Form validation schemas
const passwordSchema = z.object({
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  password: z.string().min(1, { message: 'Password is required' })
});

const otpSchema = z.object({
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
});

export default function PatientLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      phone: '',
      password: ''
    }
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      phone: '',
      otp: ''
    }
  });

  const onPasswordLogin = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: data.phone,
          password: data.password,
          role: 'patient'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store the token in a cookie
      document.cookie = `authToken=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      toast.success('Login successful!');
      router.replace('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async () => {
    const { phone } = otpForm.getValues();
    
    if (!phone || phone.length < 10) {
      otpForm.setError('phone', {
        type: 'manual',
        message: 'Please enter a valid phone number'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send OTP');
      }

      toast.success('OTP sent to your phone');
      setOtpSent(true);
      startOtpTimer();
      
      // For development, display the OTP if it's included in the response
      if (result.debugOtp) {
        toast.info(`Development OTP: ${result.debugOtp}`);
      }
    } catch (error) {
      console.error('OTP request error:', error);
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: data.phone,
          otp: data.otp,
          role: 'patient'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'OTP verification failed');
      }

      // Store the token in a cookie
      document.cookie = `authToken=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      toast.success('Login successful!');
      router.replace('/dashboard');
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const startOtpTimer = () => {
    setOtpTimer(30);
    const interval = setInterval(() => {
      setOtpTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Illustration/branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Nirmaya Pravasi</h1>
          <p className="text-blue-100">Your Health, Our Priority</p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-xl font-medium mb-4">Welcome to Patient Portal</h2>
            <p className="text-blue-100 mb-4">
              Access your healthcare information, schedule appointments, and manage your medical records with ease.
            </p>
            <div className="flex items-start space-x-3 mt-6">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Easy Appointment Booking</h3>
                <p className="text-xs text-blue-200">Schedule and manage your doctor appointments online</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 mt-4">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Medical Records Access</h3>
                <p className="text-xs text-blue-200">View and download your medical reports anytime</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 mt-4">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Personal Health Dashboard</h3>
                <p className="text-xs text-blue-200">Track your health metrics and care plans</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-blue-200">
            Need help? Contact our support at <span className="text-white font-medium">support@nirmayapravasi.com</span>
          </p>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-600">Nirmaya Pravasi</h1>
            <p className="text-gray-600 mt-1">Your Health, Our Priority</p>
          </div>
          
          <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Patient Login</CardTitle>
              <CardDescription className="text-center">
                Sign in to access your patient account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="password" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="otp">OTP</TabsTrigger>
                </TabsList>
                
                <TabsContent value="password">
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordLogin)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="phone-input-wrapper rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                <PhoneNumberInput 
                                  placeholder="9999 999 999" 
                                  {...field} 
                                  international 
                                  defaultCountry="IN"
                                  className="phone-input-enhanced"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Password</FormLabel>
                              <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                                Forgot password?
                              </Link>
                            </div>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} className="focus-visible:ring-blue-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 mt-2" 
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Sign In
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="otp">
                  <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(verifyOtp)} className="space-y-4">
                      <FormField
                        control={otpForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="phone-input-wrapper rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                <PhoneNumberInput 
                                  placeholder="9999 999 999" 
                                  {...field} 
                                  international 
                                  defaultCountry="IN"
                                  className="phone-input-enhanced"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {otpSent ? (
                        <div className="space-y-4">
                          <FormField
                            control={otpForm.control}
                            name="otp"
                            render={({ field }) => (
                              <FormItem className="space-y-2">
                                <FormLabel>OTP Verification</FormLabel>
                                <FormControl>
                                  <InputOTP maxLength={6} {...field} className="justify-center gap-2">
                                    <InputOTPGroup>
                                      <InputOTPSlot index={0} className="border-2 rounded-md h-10 w-10" />
                                      <InputOTPSlot index={1} className="border-2 rounded-md h-10 w-10" />
                                      <InputOTPSlot index={2} className="border-2 rounded-md h-10 w-10" />
                                      <InputOTPSlot index={3} className="border-2 rounded-md h-10 w-10" />
                                      <InputOTPSlot index={4} className="border-2 rounded-md h-10 w-10" />
                                      <InputOTPSlot index={5} className="border-2 rounded-md h-10 w-10" />
                                    </InputOTPGroup>
                                  </InputOTP>
                                </FormControl>
                                <FormDescription className="text-center text-sm">
                                  We've sent a verification code to your phone
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700" 
                            size="lg" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Verify & Login
                          </Button>
                          
                          <div className="text-center text-sm">
                            Didn't receive code?{' '}
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-blue-600"
                              disabled={otpTimer > 0}
                              onClick={() => {
                                setOtpSent(false);
                                setOtpTimer(0);
                              }}
                            >
                              {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend OTP'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          type="button" 
                          onClick={requestOtp} 
                          className="w-full bg-blue-600 hover:bg-blue-700 mt-2" 
                          size="lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Send OTP
                        </Button>
                      )}
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <div className="w-full text-center space-y-2">
                <div className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Register here
                  </Link>
                </div>
                <div className="text-xs text-gray-400">
                  By signing in, you agree to our{' '}
                  <Link href="/terms" className="text-gray-600 hover:underline">Terms</Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-gray-600 hover:underline">Privacy Policy</Link>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
