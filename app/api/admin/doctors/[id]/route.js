import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import { requireAdmin } from '../../../../../middleware/auth';
import Doctor from '../../../../../models/Doctor';

// Update doctor status (approve/reject)
export async function PATCH(req, { params }) {
  return handleStatusChange(req, params);
}

// Also support PUT for the same operation
export async function PUT(req, { params }) {
  const authResult = await requireAdmin(req);
  if (!authResult.proceed) return authResult;
  
  try {
    await dbConnect();
    const { id } = params;
    const { status } = await req.json();
    
    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }
    
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 });
    }
    
    // Update the status
    doctor.status = status;
    
    // If approved, change role from pending_doctor to doctor
    if (status === 'approved') {
      doctor.role = 'doctor';
    }
    
    await doctor.save();
    
    return NextResponse.json({
      success: true,
      message: `Doctor ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      doctor: {
        id: doctor._id,
        email: doctor.email,
        role: doctor.role,
        status: doctor.status
      }
    });
  } catch (error) {
    console.error('Error updating doctor status:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// Helper function to handle both PATCH and PUT requests
async function handleStatusChange(req, params) {
  const authResult = await requireAdmin(req);
  if (!authResult.proceed) return authResult;
  
  try {
    await dbConnect();
    const { id } = params;
    const { status } = await req.json();
    
    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }
    
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 });
    }
    
    // Update the status
    doctor.status = status;
    
    // If approved, change role from pending_doctor to doctor
    if (status === 'approved') {
      doctor.role = 'doctor';
    }
    
    await doctor.save();
    
    return NextResponse.json({
      success: true,
      message: `Doctor ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      doctor: {
        id: doctor._id,
        email: doctor.email,
        role: doctor.role,
        status: doctor.status
      }
    });
  } catch (error) {
    console.error('Error updating doctor status:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// Get a specific doctor
export async function GET(req, { params }) {
  const authResult = await requireAdmin(req);
  if (!authResult.proceed) return authResult;
  
  try {
    await dbConnect();
    const { id } = params;
    
    const doctor = await Doctor.findById(id).select('-passwordHash');
    
    if (!doctor) {
      return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
