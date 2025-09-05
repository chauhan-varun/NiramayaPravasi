'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Users, Settings, Shield, UserCheck } from 'lucide-react';

export default function AdminNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // Super Admin Navbar
  if (userRole === 'superadmin') {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/super" className="font-bold text-xl text-primary">
              Nirmaya Pravasi
            </Link>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              Super Admin
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/admin/super" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin/super') && !isActive('/admin/super/admins') ? 'text-primary font-semibold' : 'text-gray-600'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            
            <Link 
              href="/admin/super/admins" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin/super/admins') ? 'text-primary font-semibold' : 'text-gray-600'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Manage Admins
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

  // Regular Admin Navbar
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="font-bold text-xl text-primary">
            Nirmaya Pravasi
          </Link>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Admin Portal
          </span>
        </div>
        
        <nav className="flex items-center gap-6">
          <Link 
            href="/admin/dashboard" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/admin/dashboard') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          
          <Link 
            href="/admin/doctors" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive('/admin/doctors') ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            <Users className="h-4 w-4" />
            Manage Doctors
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
