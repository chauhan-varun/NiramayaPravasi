'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  ChevronDown, 
  User, 
  Stethoscope, 
  UserCog,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // If not logged in, show limited navigation
  if (!userRole) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all duration-300">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link 
            href="/" 
            className="font-bold text-xl md:text-2xl text-blue-600 transition-transform duration-300 hover:scale-105 flex items-center gap-2"
          >
            <img 
              src="/nirmaya-pravasi-logo.png" 
              alt="Nirmaya Pravasi" 
              className="h-8 w-auto hidden sm:block"
              onError={(e) => e.target.style.display = 'none'} 
            />
            Nirmaya Pravasi
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="w-6 h-6 flex items-center justify-center relative">
              <span 
                className={`absolute block h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'w-5 rotate-45' : 'w-5 -translate-y-1.5'
                }`}
              ></span>
              <span 
                className={`absolute block h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'w-0 opacity-0' : 'w-5'
                }`}
              ></span>
              <span 
                className={`absolute block h-0.5 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'w-5 -rotate-45' : 'w-5 translate-y-1.5'
                }`}
              ></span>
            </div>
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/about" 
              className="text-sm font-medium text-gray-600 transition-all duration-300 hover:text-blue-600"
            >
              About
            </Link>
            <Link 
              href="/services" 
              className="text-sm font-medium text-gray-600 transition-all duration-300 hover:text-blue-600"
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-gray-600 transition-all duration-300 hover:text-blue-600"
            >
              Contact
            </Link>
            
            {/* Login dropdown */}
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                className="gap-2 bg-blue-600 text-white border-transparent hover:bg-blue-700 transition-all duration-300 group"
              >
                Login
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${loginMenuOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {loginMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 animate-fadeIn">
                  <div className="py-1">
                    <Link 
                      href="/login" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                      onClick={() => setLoginMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Patient Login
                    </Link>
                    <Link 
                      href="/doctor/login" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                      onClick={() => setLoginMenuOpen(false)}
                    >
                      <Stethoscope className="h-4 w-4 mr-2" />
                      Doctor Login
                    </Link>
                    <Link 
                      href="/admin/login" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                      onClick={() => setLoginMenuOpen(false)}
                    >
                      <UserCog className="h-4 w-4 mr-2" />
              Admin Login
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
        
        {/* Mobile menu */}
        <div 
          className={`md:hidden border-t border-gray-200 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col py-2">
            <Link 
              href="/about" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/services" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <Link 
              href="/login" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-5 w-5 text-blue-600" />
              Patient Login
            </Link>
            <Link 
              href="/doctor/login" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Doctor Login
            </Link>
            <Link 
              href="/admin/login" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserCog className="h-5 w-5 text-blue-600" />
              Admin Login
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Super Admin Navigation
  if (userRole === 'superadmin') {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all duration-300">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/super" className="font-bold text-xl text-blue-600 pl-2 hover:scale-105 transition-transform duration-200">Nirmaya Pravasi</Link>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Super Admin</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin/super" className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive('/admin/super') ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
              Dashboard
            </Link>
            <Link href="/admin/super/admins" className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive('/admin/super/admins') ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
              Manage Admins
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 hover:scale-105">
              <LogOut className="h-4 w-4 transition-transform group-hover:rotate-12 duration-300" />
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
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all duration-300">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="font-bold text-xl text-blue-600 pl-2 hover:scale-105 transition-transform duration-200">Nirmaya Pravasi</Link>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Admin</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin/dashboard" className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive('/admin/dashboard') ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
              Dashboard
            </Link>
            <Link href="/admin/doctors" className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive('/admin/doctors') ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
              Manage Doctors
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 hover:scale-105">
              <LogOut className="h-4 w-4 transition-transform group-hover:rotate-12 duration-300" />
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
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all duration-300">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/doctor/dashboard" className="font-bold text-xl text-blue-600 pl-2 hover:scale-105 transition-transform duration-200">Nirmaya Pravasi</Link>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Doctor</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/doctor/dashboard" className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive('/doctor/dashboard') ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
              Dashboard
            </Link>
            <Link href="/doctor/profile" className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive('/doctor/profile') ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
              Profile
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 hover:scale-105">
              <LogOut className="h-4 w-4 transition-transform group-hover:rotate-12 duration-300" />
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
