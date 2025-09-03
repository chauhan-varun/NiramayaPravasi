import { parseAuthHeader } from '../lib/auth';
import SuperAdmin from '../models/SuperAdmin';
import Admin from '../models/Admin';
import Doctor from '../models/Doctor';
import Patient from '../models/Patient';
import dbConnect from '../lib/db';
import { NextResponse } from 'next/server';

// Helper function to handle authentication errors
function authError(message = 'Authentication required') {
  return NextResponse.json(
    { success: false, message },
    { status: 401 }
  );
}

// Base middleware to extract user from JWT
export async function withAuth(req) {
  const authHeader = req.headers.get('authorization');
  const payload = parseAuthHeader(authHeader);
  
  if (!payload || !payload.id || !payload.role) {
    return { authenticated: false };
  }
  
  return { 
    authenticated: true, 
    userId: payload.id,
    role: payload.role 
  };
}

// Middleware for Super Admin role
export async function requireSuperAdmin(req) {
  await dbConnect();
  const authResult = await withAuth(req);
  
  if (!authResult.authenticated) {
    return authError();
  }
  
  if (authResult.role !== 'superadmin') {
    return authError('Super Admin privileges required');
  }
  
  // Verify the user exists in database
  const superAdmin = await SuperAdmin.findById(authResult.userId);
  if (!superAdmin) {
    return authError('Invalid Super Admin account');
  }
  
  return { 
    proceed: true, 
    superAdmin,
    req: Object.assign(req, { superAdmin })
  };
}

// Middleware for Admin role
export async function requireAdmin(req) {
  await dbConnect();
  const authResult = await withAuth(req);
  
  if (!authResult.authenticated) {
    return authError();
  }
  
  if (authResult.role !== 'admin') {
    return authError('Admin privileges required');
  }
  
  // Verify the user exists in database
  const admin = await Admin.findById(authResult.userId);
  if (!admin) {
    return authError('Invalid Admin account');
  }
  
  return { 
    proceed: true, 
    admin,
    req: Object.assign(req, { admin })
  };
}

// Middleware for Doctor role
export async function requireDoctor(req) {
  await dbConnect();
  const authResult = await withAuth(req);
  
  if (!authResult.authenticated) {
    return authError();
  }
  
  if (authResult.role !== 'doctor') {
    return authError('Doctor privileges required');
  }
  
  // Verify the user exists in database and is approved
  const doctor = await Doctor.findById(authResult.userId);
  if (!doctor || doctor.status !== 'approved') {
    return authError('Invalid or unapproved Doctor account');
  }
  
  return { 
    proceed: true, 
    doctor,
    req: Object.assign(req, { doctor })
  };
}

// Middleware for Patient role
export async function requirePatient(req) {
  await dbConnect();
  const authResult = await withAuth(req);
  
  if (!authResult.authenticated) {
    return authError();
  }
  
  if (authResult.role !== 'patient') {
    return authError('Patient privileges required');
  }
  
  // Verify the user exists in database
  const patient = await Patient.findById(authResult.userId);
  if (!patient) {
    return authError('Invalid Patient account');
  }
  
  return { 
    proceed: true, 
    patient,
    req: Object.assign(req, { patient })
  };
}
