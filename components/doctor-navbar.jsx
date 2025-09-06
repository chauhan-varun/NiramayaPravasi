'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, LayoutDashboard, Users, FileText, Clock, Bell, Menu, X, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DoctorNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [doctorName, setDoctorName] = useState("Doctor");
  
  // Handle scroll effect for elevated header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Extract doctor name from session (with fallback)
  useEffect(() => {
    if (session?.user?.name) {
      // If full name exists, extract first name or use the full name
      const nameParts = session.user.name.split(' ');
      if (nameParts.length > 0 && nameParts[0].trim() !== '') {
        setDoctorName(nameParts[0]);
      } else {
        setDoctorName(session.user.name);
      }
    } else if (session?.user?.email) {
      // If no name but email exists, use part before @
      const emailName = session.user.email.split('@')[0];
      setDoctorName(emailName);
    }
  }, [session]);

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  const handleSignOut = async () => {
    // Remove the auth token cookie before redirecting
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Then sign out from NextAuth and redirect directly to home page
    await signOut({ 
      redirect: true, 
      callbackUrl: '/'
    });
    
    // For extra safety, force a navigation to home after a brief delay
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Navigation links data for DRY approach
  const navLinks = [
    {
      href: '/doctor/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      href: '/doctor/appointments',
      label: 'Appointments',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      href: '/doctor/patient',
      label: 'Patients',
      icon: <Users className="h-4 w-4" />
    },
    {
      href: '/doctor/analytics',
      label: 'Analytics',
      icon: <FileText className="h-4 w-4" />
    },
    {
      href: '/doctor/reminders',
      label: 'Reminders',
      icon: <Bell className="h-4 w-4" />
    }
  ];

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 transition-all duration-200 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      <div className="container px-4 sm:px-6 md:px-8 w-full flex h-16 items-center justify-between">
        {/* Logo and brand */}
        <div className="flex items-center gap-3">
          <Link href="/doctor/dashboard" className="flex items-center gap-2">
            <img 
              src="/nirmaya-pravasi-logo.png" 
              alt="Nirmaya Pravasi Logo" 
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary inline-block">Nirmaya Pravasi</span>
              <span className="text-xs text-muted-foreground md:hidden">Doctor Portal</span>
            </div>
          </Link>
          <div className="hidden md:flex">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 animate-pulse">
              Doctor Portal
            </span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                isActive(link.href) 
                  ? 'text-primary font-semibold bg-primary/5 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          
          {/* User profile and dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 ml-2 p-1 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={session?.user?.image} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {doctorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">Dr. {doctorName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border shadow-lg animate-in fade-in-80 slide-in-from-top-5 duration-200">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/doctor/profile" className="cursor-pointer w-full">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/doctor/appointments" className="cursor-pointer w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>My Schedule</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/doctor/reminders" className="cursor-pointer w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Reminders</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden animate-in fade-in-0 duration-150" onClick={toggleMobileMenu}>
          <div 
            className="absolute right-0 top-16 w-full h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-md shadow-2xl p-6 animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2 h-full">
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMobileMenu}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* User profile on mobile */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={session?.user?.image} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {doctorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-base">Dr. {doctorName}</p>
                  <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                </div>
              </div>
              
              {/* Mobile navigation links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={toggleMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-all duration-200 ${
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary font-medium shadow-sm'
                        : 'hover:bg-gray-100 hover:shadow-sm'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                
                {/* Profile link on mobile */}
                <Link
                  href="/doctor/profile"
                  onClick={toggleMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-all duration-200 ${
                    isActive('/doctor/profile')
                      ? 'bg-primary/10 text-primary font-medium shadow-sm'
                      : 'hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </div>
              
              {/* Spacer to push sign out to bottom */}
              <div className="flex-grow" />
              
              {/* Sign out button */}
              <Button
                variant="destructive"
                className="mt-6 w-full gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
