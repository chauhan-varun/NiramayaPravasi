import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { generateToken } from '../../../../lib/auth';
import Patient from '../../../../models/Patient';

export async function POST(req) {
  try {
    await dbConnect();
    const { phone, otp } = await req.json();
    
    if (!phone || !otp) {
      return NextResponse.json({ success: false, message: 'Phone and OTP are required' }, { status: 400 });
    }
    
    // Find patient with matching phone
    const patient = await Patient.findOne({ phone });
    
    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }
    
    // Check if OTP is valid and not expired
    if (!patient.otpSecret || patient.otpSecret !== otp || patient.otpExpires < new Date()) {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 401 });
    }
    
    // Clear OTP fields after successful verification
    patient.otpSecret = undefined;
    patient.otpExpires = undefined;
    await patient.save();
    
    // Generate token for authenticated user
    const token = generateToken({
      id: patient._id,
      role: patient.role
    });
    
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: patient._id,
        role: patient.role,
        phone: patient.phone
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
