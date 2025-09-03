import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';
import { JwtPayload } from 'jsonwebtoken';

// Define the JWT payload structure
interface UserJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  console.log('🔒 Middleware processing path:', path);
  
  // Define our protected routes by role
  const isSuperAdminRoute = path.startsWith('/admin/super');
  const isAdminRoute = path.startsWith('/admin/dashboard');
  const isDoctorRoute = path.startsWith('/doctor/dashboard');
  const isPatientRoute = path.startsWith('/patient/dashboard');
  
  // Check if the route is protected
  const isProtectedRoute = isSuperAdminRoute || isAdminRoute || isDoctorRoute || isPatientRoute;
  
  if (!isProtectedRoute) {
    console.log('✅ Not a protected route, proceeding...');
    return NextResponse.next();
  }
  
  console.log('🔐 Protected route detected:', path);
  
  // Get all cookies for debugging
  const cookies = request.cookies.getAll();
  console.log('🍪 All cookies:', cookies.map(c => c.name));
  
  // Get the token from cookies
  const token = request.cookies.get('authToken')?.value;
  console.log('🔑 Auth token found:', !!token);

  // Redirect to login if no token
  if (!token) {
    console.log('⚠️ No auth token, redirecting to login');
    return redirectToLogin(request);
  }

  try {
    // Verify the token
    const payload = verifyToken(token) as UserJwtPayload | null;
    console.log('🔎 Token verification result:', payload ? '✅ Valid' : '❌ Invalid');
    if (payload) console.log('👤 User role:', payload.role);
    
    if (!payload || typeof payload === 'string') {
      console.log('❌ Invalid token payload, redirecting to login');
      return redirectToLogin(request);
    }
  } catch (error) {
    console.error('🛑 Error verifying token:', error);
    return redirectToLogin(request);
  }

  // Check role-based access
  const userRole = payload.role;

  // Super Admin routes check
  if (isSuperAdminRoute && userRole !== 'superadmin') {
    return redirectBasedOnRole(request, userRole);
  }

  // Admin routes check
  if (isAdminRoute && userRole !== 'admin') {
    return redirectBasedOnRole(request, userRole);
  }

  // Doctor routes check
  if (isDoctorRoute && userRole !== 'doctor') {
    // Special case for pending doctors
    if (userRole === 'pending_doctor') {
      // Allow access to the dashboard where they will see the pending message
      return NextResponse.next();
    }
    return redirectBasedOnRole(request, userRole);
  }

  // Patient routes check
  if (isPatientRoute && userRole !== 'patient') {
    return redirectBasedOnRole(request, userRole);
  }

  return NextResponse.next();
}

// Helper function to redirect to appropriate login page
function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Determine which login page to redirect to based on the requested path
  if (url.pathname.includes('/admin')) {
    url.pathname = '/admin/login';
  } else if (url.pathname.includes('/doctor')) {
    url.pathname = '/doctor/login';
  } else if (url.pathname.includes('/patient')) {
    url.pathname = '/patient/login';
  } else {
    url.pathname = '/';
  }
  
  return NextResponse.redirect(url);
}

// Helper function to redirect based on user's role
function redirectBasedOnRole(request: NextRequest, role: string) {
  const url = request.nextUrl.clone();
  
  switch (role) {
    case 'superadmin':
      url.pathname = '/admin/super';
      break;
    case 'admin':
      url.pathname = '/admin/dashboard';
      break;
    case 'doctor':
    case 'pending_doctor':
      url.pathname = '/doctor/dashboard';
      break;
    case 'patient':
      url.pathname = '/patient/dashboard';
      break;
    default:
      url.pathname = '/';
      break;
  }
  
  return NextResponse.redirect(url);
}

// Specify which paths this middleware should run for
export const config = {
  matcher: [
    '/admin/:path*', 
    '/doctor/dashboard/:path*', 
    '/patient/dashboard/:path*'
  ],
};
