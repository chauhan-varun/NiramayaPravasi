'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, LayoutDashboard, User, FileText, HeadphonesIcon } from 'lucide-react';

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

export default function PatientNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const [customAuth, setCustomAuth] = useState(null);

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
  }, []);

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  const handleSignOut = async () => {
    // Clear custom auth cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Also sign out from NextAuth.js if applicable
    if (session) {
      await signOut({ redirect: false });
    }
    
    // Redirect to home
    router.push('/');
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    // Get user initials from session or custom auth
    const name = session?.user?.name || customAuth?.user?.name || '';
    if (name) {
      const initials = name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      setUserInitials(initials);
    } else {
      setUserInitials('P');
    }
  }, [session, customAuth]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all duration-300">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link 
            href="/dashboard" 
            className="font-bold text-xl text-blue-600 pl-2 hover:scale-105 transition-transform duration-200"
          >
            Nirmaya Pravasi
          </Link>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hidden sm:inline-block animate-fadeIn">
            Patient Portal
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
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
              isActive('/dashboard') 
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <LayoutDashboard className={`h-4 w-4 transition-transform duration-300 ${isActive('/dashboard') ? 'scale-110' : ''}`} />
            Dashboard
          </Link>
          
          <Link 
            href="/appointments" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
              isActive('/appointments') 
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <Calendar className={`h-4 w-4 transition-transform duration-300 ${isActive('/appointments') ? 'scale-110' : ''}`} />
            Appointments
          </Link>
          
          <Link 
            href="/records" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
              isActive('/records') 
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <FileText className={`h-4 w-4 transition-transform duration-300 ${isActive('/records') ? 'scale-110' : ''}`} />
            Records
          </Link>
          
          <Link 
            href="/profile" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
              isActive('/profile') 
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <User className={`h-4 w-4 transition-transform duration-300 ${isActive('/profile') ? 'scale-110' : ''}`} />
            Profile
          </Link>
          
          <Link 
            href="/support" 
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
              isActive('/support') 
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <HeadphonesIcon className={`h-4 w-4 transition-transform duration-300 ${isActive('/support') ? 'scale-110' : ''}`} />
            Support
          </Link>
          
          <div className="border-l h-8 mx-2"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm transition-all duration-300 hover:scale-110 hover:shadow-md cursor-pointer">
              {userInitials}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut} 
              className="gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 hover:scale-105"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:rotate-12 duration-300" />
              <span>Sign out</span>
            </Button>
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
            href="/dashboard" 
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive('/dashboard') 
                ? 'bg-blue-50 text-blue-600 font-semibold translate-x-1' 
                : 'text-gray-600 hover:translate-x-1'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutDashboard className={`h-5 w-5 transition-transform duration-300 ${isActive('/dashboard') ? 'scale-110' : ''}`} />
            Dashboard
          </Link>
          
          <Link 
            href="/appointments" 
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive('/appointments') 
                ? 'bg-blue-50 text-blue-600 font-semibold translate-x-1' 
                : 'text-gray-600 hover:translate-x-1'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Calendar className={`h-5 w-5 transition-transform duration-300 ${isActive('/appointments') ? 'scale-110' : ''}`} />
            Appointments
          </Link>
          
          <Link 
            href="/records" 
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive('/records') 
                ? 'bg-blue-50 text-blue-600 font-semibold translate-x-1' 
                : 'text-gray-600 hover:translate-x-1'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FileText className={`h-5 w-5 transition-transform duration-300 ${isActive('/records') ? 'scale-110' : ''}`} />
            Records
          </Link>
          
          <Link 
            href="/profile" 
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive('/profile') 
                ? 'bg-blue-50 text-blue-600 font-semibold translate-x-1' 
                : 'text-gray-600 hover:translate-x-1'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <User className={`h-5 w-5 transition-transform duration-300 ${isActive('/profile') ? 'scale-110' : ''}`} />
            Profile
          </Link>
          
          <Link 
            href="/support" 
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive('/support') 
                ? 'bg-blue-50 text-blue-600 font-semibold translate-x-1' 
                : 'text-gray-600 hover:translate-x-1'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <HeadphonesIcon className={`h-5 w-5 transition-transform duration-300 ${isActive('/support') ? 'scale-110' : ''}`} />
            Support
          </Link>
          
          <div className="border-t border-gray-200 my-2"></div>
          
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium transition-all duration-300 hover:scale-110 hover:shadow-md">
                {userInitials}
              </div>
              <div>
                <div className="font-medium">{session?.user?.name || 'Patient'}</div>
                <div className="text-xs text-gray-500">{session?.user?.email || customAuth?.user?.id || ''}</div>
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
