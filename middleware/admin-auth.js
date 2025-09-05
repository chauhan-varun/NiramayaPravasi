import { NextResponse } from 'next/server';

// Helper function to redirect to login
function redirectToLogin(request) {
  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  return NextResponse.redirect(url);
}

// Helper function to get role from token
function getRoleFromToken(token) {
  try {
    // Basic decode without validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice(0, (4 - base64.length % 4) % 4);
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString());
    
    return payload;
  } catch (error) {
    console.log('Decode error');
    return null;
  }
}

// Redirect based on role
function redirectBasedOnRole(request, role) {
  const url = request.nextUrl.clone();
  
  switch (role) {
    case 'superadmin':
      url.pathname = '/admin/super';
      break;
    case 'admin':
      url.pathname = '/admin/dashboard';
      break;
    case 'doctor':
      url.pathname = '/doctor/dashboard';
      break;
    case 'patient':
      url.pathname = '/dashboard';
      break;
    default:
      url.pathname = '/';
      break;
  }
  
  return NextResponse.redirect(url);
}

// Admin auth middleware
export function adminAuthMiddleware(request) {
  // Check if it's a super admin route
  const isSuperAdminRoute = request.nextUrl.pathname.startsWith('/admin/super');
  
  // Get the token from cookies
  const token = request.cookies.get('authToken')?.value;

  // Redirect to login if no token
  if (!token) {
    console.log('No token found');
    return redirectToLogin(request);
  }

  try {
    const payload = getRoleFromToken(token);
    
    if (!payload) {
      return redirectToLogin(request);
    }

    // For super admin pages
    if (isSuperAdminRoute && payload.role !== 'superadmin') {
      console.log('Redirecting non-superadmin to appropriate dashboard');
      return redirectBasedOnRole(request, payload.role);
    }
    
    // For regular admin pages
    if (!isSuperAdminRoute && payload.role !== 'admin' && payload.role !== 'superadmin') {
      console.log('Non-admin trying to access admin route');
      return redirectBasedOnRole(request, payload.role);
    }
    
    // Allow access for admin/superadmin
    return NextResponse.next();
  } catch (error) {
    console.log('Error processing request:', error);
    return redirectToLogin(request);
  }
}
