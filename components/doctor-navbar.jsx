'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, LayoutDashboard, Users, FileText, Clock, Bell } from 'lucide-react';

export default function DoctorNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  const handleSignOut = async () => {
    // Remove the auth token cookie before redirecting
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Then sign out from NextAuth and redirect directly to home page
    // This helps avoid middleware redirections during sign-out
    await signOut({ 
      redirect: true, 
      callbackUrl: '/'
    });
    
    // For extra safety, force a navigation to home after a brief delay
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/doctor/dashboard" className="font-bold text-xl text-primary">
            Nirmaya Pravasi
          </Link>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Doctor Portal
          </span>
        </div>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/doctor/dashboard" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/doctor/dashboard') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          
          <Link 
            href="/doctor/appointments" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/doctor/appointments') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Appointments
          </Link>
          
          <Link 
            href="/doctor/patient" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/doctor/patient') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <Users className="h-4 w-4" />
            Patients
          </Link>
          
          <Link 
            href="/doctor/analytics" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/doctor/analytics') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <FileText className="h-4 w-4" />
            Analytics
          </Link>
          
          <Link 
            href="/doctor/reminders" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/doctor/reminders') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <Bell className="h-4 w-4" />
            Reminders
          </Link>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut} 
            className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
