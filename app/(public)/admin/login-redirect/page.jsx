'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AdminLoginRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState('Checking your account...');

  useEffect(() => {
    async function checkUserRole() {
      try {
        if (status === 'authenticated' && session?.user?.email) {
          setMessage('Verifying admin status...');
          
          // Call our API to check the user's role
          const response = await fetch('/api/auth/check-admin-role', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: session.user.email,
              token: session.apiToken
            }),
          });

          const data = await response.json();
          
          if (response.ok && data.success) {
            // Set auth token cookie if it exists
            if (data.token) {
              document.cookie = `authToken=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            }
            
            if (data.role === 'superadmin') {
              setMessage('Redirecting to Super Admin dashboard...');
              router.push('/admin/super');
            } else if (data.role === 'admin') {
              setMessage('Redirecting to Admin dashboard...');
              router.push('/admin/dashboard');
            } else {
              toast.error('You do not have admin privileges');
              router.push('/patient/login');
            }
          } else {
            toast.error(data.message || 'Failed to verify admin status');
            router.push('/admin/login');
          }
        } else if (status === 'unauthenticated') {
          toast.error('Authentication failed');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error checking role:', error);
        toast.error('An error occurred. Please try again.');
        router.push('/admin/login');
      }
    }

    if (status !== 'loading') {
      checkUserRole();
    }
  }, [status, session, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-xl">{message}</p>
    </div>
  );
}
