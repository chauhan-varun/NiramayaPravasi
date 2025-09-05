import { NextResponse } from 'next/server';

// Helper function to redirect to login
function redirectToLogin(request) {
  const url = request.nextUrl.clone();
  url.pathname = '/doctor/login';
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

// Doctor auth middleware
export function doctorAuthMiddleware(request) {
  // Get the token from cookies
  const token = request.cookies.get('authToken')?.value;

  // Check if this is direct access to doctor dashboard vs. navigation within the app
  const referer = request.headers.get("referer") || "";
  
  // Only for referers that are from our app but not from the login page
  const isInternalNavigation = referer.includes(request.nextUrl.origin) && 
                             !referer.includes("/doctor/login") &&
                             !referer.includes("/login");
                             
  // Check if it's a logout redirect to homepage
  const isLogoutToHome = !token && referer.includes("/doctor/dashboard") && 
                       request.nextUrl.pathname === "/";
                       
  // If it's a logout redirect to home, allow it
  if (isLogoutToHome) {
    console.log('Post-logout navigation to home detected, allowing');
    return NextResponse.next();
  }

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

    // Check if user is a doctor
    if (payload.role !== 'doctor') {
      console.log('Non-doctor trying to access doctor route');
      return redirectBasedOnRole(request, payload.role);
    }
    
    // Check doctor status if available
    if (payload.status && payload.status !== 'approved') {
      // Redirect to appropriate status page
      const url = request.nextUrl.clone();
      if (payload.status === 'pending') {
        url.pathname = '/doctor/pending';
        return NextResponse.redirect(url);
      } else if (payload.status === 'rejected') {
        url.pathname = '/doctor/rejected';
        return NextResponse.redirect(url);
      }
    }
    
    // Allow access for doctors
    return NextResponse.next();
  } catch (error) {
    console.log('Error processing request:', error);
    return redirectToLogin(request);
  }
}
