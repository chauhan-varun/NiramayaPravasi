import { NextResponse } from 'next/server';
import { patientAuthMiddleware } from './middleware/patient-auth';
import { adminAuthMiddleware } from './middleware/admin-auth';
import { doctorAuthMiddleware } from './middleware/doctor-auth';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  console.log('Path check:', path);
  
  // Define our protected routes by role
  const isSuperAdminRoute = path.startsWith('/admin/super');
  const isAdminRoute = path.startsWith('/admin/dashboard');
  const isDoctorRoute = path.startsWith('/doctor/dashboard') ||
                      path.startsWith('/doctor/appointments') ||
                      path.startsWith('/doctor/analytics') ||
                      path.startsWith('/doctor/profile') ||
                      path.startsWith('/doctor/reminders') ||
                      path.startsWith('/doctor/patients');
  // Note: Patient routes are under /patient in the directory structure but URLs are direct
  const isPatientRoute = path === '/dashboard' || 
                        path === '/appointments' || 
                        path.startsWith('/appointments/') || 
                        path === '/profile' || 
                        path === '/records' || 
                        path === '/support';
  
  // Use dedicated middleware for specific routes
  if (isPatientRoute) {
    return patientAuthMiddleware(request);
  }
  
  if (isAdminRoute || isSuperAdminRoute) {
    return adminAuthMiddleware(request);
  }
  
  if (isDoctorRoute) {
    return doctorAuthMiddleware(request);
  }
  
  // For all other routes, proceed normally
  return NextResponse.next();
}

// Specify which paths this middleware should run for
export const config = {
  matcher: [
    '/admin/:path*', 
    '/doctor/dashboard',
    '/doctor/dashboard/:path*',
    '/doctor/appointments',
    '/doctor/appointments/:path*',
    '/doctor/patients',
    '/doctor/patients/:path*',
    '/doctor/analytics',
    '/doctor/analytics/:path*',
    '/doctor/profile',
    '/doctor/profile/:path*',
    '/doctor/reminders',
    '/doctor/reminders/:path*',
    '/dashboard',
    '/appointments',
    '/appointments/:path*',
    '/profile',
    '/records',
    '/support',
    // Don't add the status pages to the matcher as they should be accessible
    // even without authentication to show the appropriate messages
  ],
};