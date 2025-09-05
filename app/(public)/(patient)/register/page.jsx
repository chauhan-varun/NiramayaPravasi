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
import Navbar from '@/components/navbar';

// Form validation schemas
const passwordSchema = z.object({
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const otpSchema = z.object({
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
});

export default function PatientRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      phone: '',
      otp: ''
    }
  });

  const onPasswordRegister = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
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
        throw new Error(result.message || 'Registration failed');
      }

      toast.success('Registration successful!');
      
      // Login after successful registration
      const loginResponse = await fetch('/api/auth/login', {
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

      const loginResult = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginResult.message || 'Login failed');
      }

      // Store the token in a cookie or local storage
      document.cookie = `authToken=${loginResult.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
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
        if (response.status === 404) {
          // If user doesn't exist, register them first
          const registerResponse = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              phone,
              role: 'patient'
            })
          });

          if (!registerResponse.ok) {
            const registerResult = await registerResponse.json();
            throw new Error(registerResult.message || 'Registration failed');
          }

          // Request OTP again after successful registration
          const newOtpResponse = await fetch('/api/auth/request-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
          });

          const newOtpResult = await newOtpResponse.json();

          if (!newOtpResponse.ok) {
            throw new Error(newOtpResult.message || 'Failed to send OTP');
          }

          toast.success('Account created! OTP sent to your phone');
          setOtpSent(true);
          startOtpTimer();

          // For development, display the OTP if it's included in the response
          if (newOtpResult.debugOtp) {
            toast.info(`Development OTP: ${newOtpResult.debugOtp}`);
          }
          
          return;
        }

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
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: data.phone,
          otp: data.otp
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'OTP verification failed');
      }

      toast.success('Registration successful!');
      
      // Store the token in a cookie
      document.cookie = `authToken=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      router.push('/dashboard');
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
            <h2 className="text-xl font-medium mb-4">Join Our Healthcare Platform</h2>
            <p className="text-blue-100 mb-4">
              Register to access our comprehensive healthcare services designed for your wellbeing.
            </p>
            <div className="flex items-start space-x-3 mt-6">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Easy Appointment Booking</h3>
                <p className="text-xs text-blue-200">Schedule appointments with top specialists</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 mt-4">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Digital Medical Records</h3>
                <p className="text-xs text-blue-200">Access your health records anytime, anywhere</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 mt-4">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Personalized Care</h3>
                <p className="text-xs text-blue-200">Get healthcare tailored to your specific needs</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-blue-200">
            Already registered? <Link href="/login" className="text-white font-medium hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
      
      {/* Right side - Registration form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-600">Nirmaya Pravasi</h1>
            <p className="text-gray-600 mt-1">Your Health, Our Priority</p>
          </div>
          
          <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Register to access patient services
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
                    <form onSubmit={passwordForm.handleSubmit(onPasswordRegister)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <PhoneNumberInput 
                                placeholder="+91 99999 99999" 
                                {...field} 
                                className="border-2 focus-visible:ring-blue-500"
                              />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="border-2 focus-visible:ring-blue-500"
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Must be at least 6 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="border-2 focus-visible:ring-blue-500"
                              />
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
                        Create Account
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
                              <PhoneNumberInput 
                                placeholder="+91 99999 99999" 
                                {...field} 
                                className="border-2 focus-visible:ring-blue-500"
                              />
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
                            Verify & Register
                          </Button>
                          
                          <div className="text-center text-sm">
                            Didn't receive code?{' '}
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-blue-600"
                              disabled={otpTimer > 0}
                              onClick={() => {
                                if (otpTimer === 0) {
                                  requestOtp();
                                }
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
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
                <div className="text-xs text-gray-400">
                  By registering, you agree to our{' '}
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
