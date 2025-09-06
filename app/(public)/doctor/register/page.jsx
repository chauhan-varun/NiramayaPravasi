'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { Loader2, Mail, Lock, User, Stethoscope, Briefcase } from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Form validation schema
const doctorSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string(),
  specialization: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
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

export default function DoctorRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      specialization: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          role: 'pending_doctor',
          specialization: data.specialization
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      toast.success('Registration successful! Your account is pending approval.');
      
      // Redirect to pending page instead of login
      setTimeout(() => {
        router.push('/doctor/pending');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signIn('google', {
        callbackUrl: '/doctor/dashboard'
      });
    } catch (error) {
      console.error('Google sign up error:', error);
      toast.error('An error occurred during Google sign up');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-to-b from-muted/50 to-background">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/nirmaya-pravasi-logo.png" 
            alt="Nirmaya Pravasi Logo" 
            className="w-10 h-10 object-contain"
          />
          <span className="font-bold text-xl text-primary hidden sm:inline-block">Nirmaya Pravasi</span>
        </Link>
      </div>
      
      <div className="container flex min-h-screen items-center justify-center py-20">
        <Card className="w-full max-w-md border shadow-md overflow-hidden">
          <div className="h-1 bg-primary"></div>
          <CardHeader className="text-center space-y-3 pb-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Doctor Registration</CardTitle>
              <CardDescription>Join our healthcare network</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Email Address</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="doctor@example.com" 
                          className="border-input bg-muted/5"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Password</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="border-input bg-muted/5"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Confirm Password</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="border-input bg-muted/5"
                          {...field} 
                        />
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
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Specialization</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-input bg-muted/5">
                            <SelectValue placeholder="Select your specialization" />
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
                      <FormDescription className="text-xs">
                        Your medical field of expertise
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full font-medium" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <User className="mr-2 h-4 w-4" />
                  )}
                  Create Doctor Account
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col bg-muted/5 mt-4">
            <div className="relative my-3 w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleGoogleSignup} 
              className="w-full bg-background hover:bg-muted/10 border-muted-foreground/20 text-foreground hover:text-foreground" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 48 48" className="mr-2">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0S12.1 2.38 7.74 6.25l6.85 6.85c2.5-2.38 5.67-3.6 9.21-3.6z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              )}
              Sign up with Google
            </Button>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/doctor/login" className="text-primary font-medium hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              By signing up, you agree to our{' '}
              <Link href="#" className="hover:underline">Terms of Service</Link> and{' '}
              <Link href="#" className="hover:underline">Privacy Policy</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
