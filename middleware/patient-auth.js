import { NextResponse } from 'next/server';

// Helper function to redirect to login
function redirectToLogin(request) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
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

// Patient auth middleware
export function patientAuthMiddleware(request) {
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

    // Check if user is patient
    if (payload.role !== 'patient') {
      console.log('Non-patient trying to access patient route');
      // Redirect based on role
      const url = request.nextUrl.clone();
      
      switch (payload.role) {
        case 'superadmin':
          url.pathname = '/admin/super';
          break;
        case 'admin':
          url.pathname = '/admin/dashboard';
          break;
        case 'doctor':
          url.pathname = '/doctor/dashboard';
          break;
        default:
          url.pathname = '/';
          break;
      }
      
      return NextResponse.redirect(url);
    }
    
    // Allow access for patients
    return NextResponse.next();
  } catch (error) {
    console.log('Error processing request:', error);
    return redirectToLogin(request);
  }
}
