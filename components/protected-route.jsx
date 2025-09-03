'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated and has the required role
    if (status === 'authenticated') {
      if (allowedRoles.length === 0 || allowedRoles.includes(session?.user?.role)) {
        setIsAuthorized(true);
      } else {
        // Redirect to appropriate dashboard based on role
        if (session?.user?.role === 'superadmin') {
          router.replace('/admin/super');
        } else if (session?.user?.role === 'admin') {
          router.replace('/admin/dashboard');
        } else if (session?.user?.role === 'doctor') {
          router.replace('/doctor/dashboard');
        } else if (session?.user?.role === 'patient') {
          router.replace('/patient/dashboard');
        } else {
          router.replace('/');
        }
      }
    } else if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, session, allowedRoles, router]);

  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return children;
}
