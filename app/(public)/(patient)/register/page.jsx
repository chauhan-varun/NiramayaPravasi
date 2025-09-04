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
      
      router.push('/patient/dashboard');
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
      
      router.push('/patient/dashboard');
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Patient Registration</CardTitle>
            <CardDescription>Create your patient account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="password" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="otp">OTP</TabsTrigger>
              </TabsList>
              
              <TabsContent value="password">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordRegister)} className="space-y-4 mt-4">
                    <FormField
                      control={passwordForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <PhoneNumberInput placeholder="+91 99999 99999" {...field} />
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
                            <Input type="password" placeholder="••••••••" {...field} />
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
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Register
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="otp">
                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(verifyOtp)} className="space-y-4 mt-4">
                    <FormField
                      control={otpForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <PhoneNumberInput placeholder="+91 99999 99999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {otpSent ? (
                      <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>OTP</FormLabel>
                            <FormControl>
                              <InputOTP maxLength={6} {...field}>
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </FormControl>
                            <FormDescription>
                              Enter the one-time password sent to your phone
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : null}
                    
                    {otpSent ? (
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Verify OTP
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        onClick={requestOtp} 
                        className="w-full" 
                        disabled={isLoading || otpTimer > 0}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Send OTP'}
                      </Button>
                    )}
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/patient/login" className="text-primary underline-offset-4 hover:underline">
                Login here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
