import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { generateOtp, sendOtp } from '../../../../lib/auth';
import Patient from '../../../../models/Patient';

export async function POST(req) {
  try {
    await dbConnect();
    const { phone } = await req.json();
    
    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
    }
    
    // Check if patient exists
    const patient = await Patient.findOne({ phone });
    if (!patient) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }
    
    // Generate new OTP for patient
    const otp = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes
    
    // Save OTP to patient record
    patient.otpSecret = otp;
    patient.otpExpires = otpExpiry;
    await patient.save();
    
    // Send OTP via Twilio SMS
    const smsSent = await sendOtp(phone, otp);
    
    if (!smsSent) {
      return NextResponse.json({ success: false, message: 'Failed to send OTP' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, include OTP for testing purposes
      debugOtp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('OTP request error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
