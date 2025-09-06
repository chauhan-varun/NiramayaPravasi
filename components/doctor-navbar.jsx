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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and brand */}
        <div className="flex items-center gap-2">
          <Link 
            href="/doctor/dashboard" 
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
          >
            <img 
              src="/nirmaya-pravasi-logo.png" 
              alt="Nirmaya Pravasi Logo" 
              className="w-8 h-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary">Nirmaya Pravasi</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Doctor Portal</span>
            </div>
          </Link>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hidden sm:inline-block animate-pulse">
            Doctor Portal
          </span>
        </div>
        
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
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isActive(link.href) 
                  ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <span className={`transition-transform duration-300 ${isActive(link.href) ? 'scale-110' : ''}`}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
          
          <div className="border-l h-8 mx-2"></div>
          
          {/* User profile and dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 p-1 px-2 hover:scale-105 transition-all duration-300">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={session?.user?.image} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {doctorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">Dr. {doctorName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border shadow-lg">
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
      </div>
      
      {/* Mobile menu - slides down from navbar */}
      <div 
        className={`md:hidden border-t border-gray-200 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? 'bg-primary/10 text-primary font-semibold translate-x-1'
                  : 'text-gray-600 hover:translate-x-1'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className={`transition-transform duration-300 ${isActive(link.href) ? 'scale-110' : ''}`}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
          
          {/* Profile link on mobile */}
          <Link
            href="/doctor/profile"
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive('/doctor/profile')
                ? 'bg-primary/10 text-primary font-semibold translate-x-1'
                : 'text-gray-600 hover:translate-x-1'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          
          <div className="border-t border-gray-200 my-2"></div>
          
          {/* User profile section on mobile */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={session?.user?.image} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {doctorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Dr. {doctorName}</div>
                <div className="text-xs text-gray-500">{session?.user?.email}</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="gap-1 border-gray-200 text-gray-600 transition-all duration-300 hover:scale-105"
            >
              <LogOut className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}