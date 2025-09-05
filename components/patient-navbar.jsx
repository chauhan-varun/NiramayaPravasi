'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, LayoutDashboard, User, FileText, HeadphonesIcon } from 'lucide-react';

export default function PatientNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-bold text-xl text-primary">
            Nirmaya Pravasi
          </Link>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Patient Portal
          </span>
        </div>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/dashboard') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          
          <Link 
            href="/appointments" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/appointments') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Appointments
          </Link>
          
          <Link 
            href="/records" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/records') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <FileText className="h-4 w-4" />
            Records
          </Link>
          
          <Link 
            href="/profile" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/profile') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          
          <Link 
            href="/support" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/support') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <HeadphonesIcon className="h-4 w-4" />
            Support
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
