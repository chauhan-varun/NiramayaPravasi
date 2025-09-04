'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const isActive = (path) => pathname === path;

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // If not logged in, show limited navigation
  if (!userRole) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="font-bold text-xl">Nirmaya Pravasi</Link>
          <nav className="flex items-center gap-6">
            <Link href="/admin/login" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/admin/login') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Admin Login
            </Link>
            <Link href="/doctor/login" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/doctor/login') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Doctor Login
            </Link>
            <Link href="/login" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/login') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Patient Login
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  // Super Admin Navigation
  if (userRole === 'superadmin') {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/super" className="font-bold text-xl">Nirmaya Pravasi</Link>
            <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">Super Admin</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin/super" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/admin/super') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Dashboard
            </Link>
            <Link href="/admin/super/admins" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/admin/super/admins') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Manage Admins
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </nav>
        </div>
      </header>
    );
  }

  // Admin Navigation
  if (userRole === 'admin') {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="font-bold text-xl">Nirmaya Pravasi</Link>
            <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">Admin</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin/dashboard" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/admin/dashboard') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Dashboard
            </Link>
            <Link href="/admin/doctors" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/admin/doctors') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Manage Doctors
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </nav>
        </div>
      </header>
    );
  }

  // Doctor Navigation
  if (userRole === 'doctor') {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/doctor/dashboard" className="font-bold text-xl">Nirmaya Pravasi</Link>
            <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">Doctor</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/doctor/dashboard" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/doctor/dashboard') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Dashboard
            </Link>
            <Link href="/doctor/profile" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/doctor/profile') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Profile
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </nav>
        </div>
      </header>
    );
  }

  // Patient Navigation
  if (userRole === 'patient') {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-bold text-xl">Nirmaya Pravasi</Link>
            <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">Patient</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/dashboard') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Dashboard
            </Link>
            <Link href="/profile" className={`text-sm font-medium transition-colors hover:text-white ${isActive('/profile') ? 'text-white font-bold' : 'text-primary-foreground/80'}`}>
              Profile
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </nav>
        </div>
      </header>
    );
  }

  return null;
}
