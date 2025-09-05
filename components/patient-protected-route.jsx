'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function PatientProtectedRoute({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [customAuth, setCustomAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for custom auth token
    const token = getCookie('authToken');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp > Date.now() / 1000) {
        setCustomAuth({
          user: {
            role: decoded.role,
            id: decoded.id
          }
        });
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    // Check NextAuth.js session first
    if (status === 'authenticated' && session?.user?.role === 'patient') {
      setIsAuthorized(true);
    } 
    // Check custom auth if NextAuth.js is not authenticated
    else if (customAuth && customAuth.user.role === 'patient') {
      setIsAuthorized(true);
    }
    // If neither NextAuth.js nor custom auth is available or user is not a patient
    else if (status !== 'loading') {
      // Don't redirect from protected routes if there's already an auth process happening
      const isAuthPage = window.location.pathname.includes('login') || 
                          window.location.pathname.includes('register');
                          
      if (!isAuthPage) {
        console.log('No valid patient auth found, redirecting to login');
        router.replace('/login');
      }
    }
  }, [status, session, customAuth, router, isLoading]);

  if (isLoading || (status === 'loading' && !customAuth)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return isAuthorized ? children : null;
}

