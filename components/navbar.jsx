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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="font-bold text-xl">Nirmaya Pravasi</Link>
          <nav className="flex items-center gap-6">
            <Link href="/admin/login" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/admin/login') ? 'text-primary' : 'text-muted-foreground'}`}>
              Admin Login
            </Link>
            <Link href="/doctor/login" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/doctor/login') ? 'text-primary' : 'text-muted-foreground'}`}>
              Doctor Login
            </Link>
            <Link href="/patient/login" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/patient/login') ? 'text-primary' : 'text-muted-foreground'}`}>
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/super" className="font-bold text-xl">Nirmaya Pravasi</Link>
            <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">Super Admin</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin/super" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/admin/super') ? 'text-primary' : 'text-muted-foreground'}`}>
              Dashboard
            </Link>
            <Link href="/admin/super/admins" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/admin/super/admins') ? 'text-primary' : 'text-muted-foreground'}`}>
              Manage Admins
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="font-bold text-xl">Nirmaya Pravasi</Link>
            <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">Admin</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/admin/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
              Dashboard
            </Link>
            <Link href="/admin/doctors" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/admin/doctors') ? 'text-primary' : 'text-muted-foreground'}`}>
              Manage Doctors
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/doctor/dashboard" className="font-bold text-xl">Nirmaya Pravasi</Link>
            <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">Doctor</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/doctor/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/doctor/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
              Dashboard
            </Link>
            <Link href="/doctor/profile" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/doctor/profile') ? 'text-primary' : 'text-muted-foreground'}`}>
              Profile
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard" className="font-bold text-xl">Nirmaya Pravasi</Link>
            <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">Patient</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/patient/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/patient/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
              Dashboard
            </Link>
            <Link href="/patient/profile" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/patient/profile') ? 'text-primary' : 'text-muted-foreground'}`}>
              Profile
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
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
