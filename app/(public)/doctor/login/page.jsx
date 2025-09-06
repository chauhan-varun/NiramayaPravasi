'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, AlertTriangle, User, Stethoscope } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export default function DoctorLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Use our custom API endpoint instead of NextAuth credentials
      const response = await fetch('/api/auth/doctor-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      });

      const result = await response.json();

      if (!result.success) {
        // Handle different status cases
        if (result.status === 'pending') {
          setIsPending(true);
          toast.info('Your account is pending admin approval.');
          setTimeout(() => router.push('/doctor/pending'), 2000);
        } else if (result.status === 'rejected') {
          toast.error('Your account has been rejected.');
          setTimeout(() => router.push('/doctor/rejected'), 2000);
        } else {
          toast.error(result.message || 'Login failed');
        }
      } else {
        // Set auth token cookie
        document.cookie = `authToken=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        toast.success('Login successful!');
        router.push('/doctor/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect to our custom redirect page after Google login
      await signIn('google', {
        callbackUrl: '/doctor/login-redirect'
      });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('An error occurred during Google login');
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
              <CardTitle className="text-2xl font-bold">Doctor Login</CardTitle>
              <CardDescription>Access your medical dashboard</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isPending ? (
              <div className="rounded-md bg-yellow-50 p-4 mb-4 border border-yellow-200">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 text-yellow-500">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Account Pending Approval</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Your account is waiting for admin review. You'll receive an email once your account is approved.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
                        <div className="flex items-center justify-between">
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Password</span>
                          </FormLabel>
                          <Link 
                            href="#" 
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
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
                    Sign In to Dashboard
                  </Button>
                </form>
              </Form>
            )}
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
              onClick={handleGoogleLogin} 
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
              Sign in with Google
            </Button>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/doctor/register" className="text-primary font-medium hover:underline">
                  Create account
                </Link>
              </p>
            </div>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link href="#" className="hover:underline">Terms of Service</Link> and{' '}
              <Link href="#" className="hover:underline">Privacy Policy</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
