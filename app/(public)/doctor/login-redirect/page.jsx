'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function DoctorLoginRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState('Checking your doctor account...');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const checkRoleAndRedirect = async () => {
        try {
          const response = await fetch('/api/auth/check-doctor-role', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: session.user.email }),
          });

          const result = await response.json();

          if (result.success && result.token && result.user?.role === 'doctor') {
            // Set auth token cookie
            document.cookie = `authToken=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            toast.success('Login successful!');
            router.push('/doctor/dashboard');
          } else {
            // Handle different status cases
            if (result.status === 'pending') {
              setStatusMessage('Your account is pending approval.');
              toast.info('Your account is waiting for admin approval.');
              setTimeout(() => router.push('/doctor/pending'), 2000);
            } else if (result.status === 'rejected') {
              setStatusMessage('Your account has been rejected.');
              toast.error('Your account has been rejected by the admin.');
              setTimeout(() => router.push('/doctor/rejected'), 2000);
            } else {
              setStatusMessage('Access denied.');
              toast.error(result.message || 'You do not have doctor privileges.');
              setTimeout(() => router.push('/login'), 2000);
            }
          }
        } catch (error) {
          console.error('Error checking doctor role:', error);
          toast.error('An error occurred during role check.');
          setStatusMessage('Error checking account status.');
          setTimeout(() => router.push('/login'), 2000);
        }
      };
      checkRoleAndRedirect();
    } else if (status === 'unauthenticated') {
      toast.error('Authentication failed.');
      router.push('/doctor/login');
    }
  }, [session, status, router]);

  // Track progress for the loading indicator
  const [progress, setProgress] = useState(10);
  
  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 700);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-muted/5 items-center justify-center p-4">
      <Card className="w-full max-w-md border shadow-md">
        <CardContent className="pt-6 pb-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center mb-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-20">
                  <Shield className="h-16 w-16 text-primary" />
                </div>
                <Shield className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold">Authenticating Doctor Access</h2>
            
            <div className="flex flex-col gap-1.5 max-w-xs mx-auto">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{statusMessage}</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying credentials and access level...</span>
            </div>
            
            <div className="mt-8 text-xs text-muted-foreground flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>You'll be redirected automatically once verified</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
