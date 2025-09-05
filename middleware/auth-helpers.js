import { NextResponse } from 'next/server';
import { getRoleFromToken } from './utils';

// Helper to require superadmin role for API routes
export async function requireSuperAdmin(request) {
  const token = request.cookies.get('authToken')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  try {
    const payload = getRoleFromToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if user is superadmin
    if (payload.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Super Admin privileges required' },
        { status: 403 }
      );
    }
    
    // Add user info to request for later use
    request.user = payload;
    
    // Allow the request to proceed
    return null;
  } catch (error) {
    console.error('Error in requireSuperAdmin middleware:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

// Helper to require admin role for API routes
export async function requireAdmin(request) {
  const token = request.cookies.get('authToken')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  try {
    const payload = getRoleFromToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if user is admin or superadmin
    if (payload.role !== 'admin' && payload.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }
    
    // Add user info to request for later use
    request.user = payload;
    
    // Allow the request to proceed
    return null;
  } catch (error) {
    console.error('Error in requireAdmin middleware:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

// Helper to require doctor role for API routes
export async function requireDoctor(request) {
  const token = request.cookies.get('authToken')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  try {
    const payload = getRoleFromToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if user is a doctor
    if (payload.role !== 'doctor') {
      return NextResponse.json(
        { error: 'Doctor privileges required' },
        { status: 403 }
      );
    }
    
    // Add user info to request for later use
    request.user = payload;
    
    // Allow the request to proceed
    return null;
  } catch (error) {
    console.error('Error in requireDoctor middleware:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

// Helper to require patient role for API routes
export async function requirePatient(request) {
  const token = request.cookies.get('authToken')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  try {
    const payload = getRoleFromToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Check if user is a patient
    if (payload.role !== 'patient') {
      return NextResponse.json(
        { error: 'Patient privileges required' },
        { status: 403 }
      );
    }
    
    // Add user info to request for later use
    request.user = payload;
    
    // Allow the request to proceed
    return null;
  } catch (error) {
    console.error('Error in requirePatient middleware:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

// Helper to check authentication for API routes (any role)
export async function requireAuth(request) {
  const token = request.cookies.get('authToken')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  try {
    const payload = getRoleFromToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Add user info to request for later use
    request.user = payload;
    
    // Allow the request to proceed
    return null;
  } catch (error) {
    console.error('Error in requireAuth middleware:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}
