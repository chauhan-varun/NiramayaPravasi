'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg">{statusMessage}</p>
      </div>
    </div>
  );
}
