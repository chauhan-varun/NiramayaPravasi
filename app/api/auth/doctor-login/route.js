import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { comparePassword, generateToken } from '../../../../lib/auth';
import Doctor from '../../../../models/Doctor';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return NextResponse.json({ success: false, message: 'Doctor not found' }, { status: 404 });
    }

    const isPasswordValid = await comparePassword(password, doctor.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Check doctor status
    if (doctor.status === 'pending') {
      return NextResponse.json({ 
        success: false, 
        message: 'Your account is pending approval',
        status: 'pending'
      }, { status: 403 });
    }

    if (doctor.status === 'rejected') {
      return NextResponse.json({ 
        success: false, 
        message: 'Your account has been rejected',
        status: 'rejected'
      }, { status: 403 });
    }

    if (doctor.status !== 'approved') {
      return NextResponse.json({ 
        success: false, 
        message: 'Access denied',
        status: doctor.status
      }, { status: 403 });
    }

    const token = generateToken({
      id: doctor._id.toString(),
      role: doctor.role
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: doctor._id,
        role: doctor.role,
        email: doctor.email,
        status: doctor.status
      }
    });
  } catch (error) {
    console.error('Doctor login API error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
