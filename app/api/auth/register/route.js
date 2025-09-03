import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { hashPassword, generateOtp, generateToken, sendOtp } from '../../../../lib/auth';
import Doctor from '../../../../models/Doctor';
import Patient from '../../../../models/Patient';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, phone, password, role } = await req.json();
    
    // Validate based on role
    if (role === 'doctor' || role === 'pending_doctor') {
      if (!email || !password) {
        return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
      }
      
      // Check if doctor already exists
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 409 });
      }
      
      // Hash the password
      const passwordHash = await hashPassword(password);
      
      // Create new doctor with pending status
      const doctor = await Doctor.create({
        email,
        passwordHash,
        role: 'pending_doctor',
        status: 'pending'
      });
      
      return NextResponse.json({
        success: true,
        message: 'Doctor registration successful. Pending admin approval.',
        user: {
          id: doctor._id,
          role: doctor.role,
          status: doctor.status,
          email: doctor.email
        }
      });
    } else if (role === 'patient') {
      if (!phone) {
        return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
      }
      
      // Check if patient already exists
      const existingPatient = await Patient.findOne({ phone });
      if (existingPatient) {
        return NextResponse.json({ success: false, message: 'Phone number already in use' }, { status: 409 });
      }
      
      let patientData = { phone, role: 'patient' };
      
      // If password is provided, hash it
      if (password) {
        patientData.passwordHash = await hashPassword(password);
      } 
      // Otherwise generate OTP for phone verification
      else {
        const otp = generateOtp();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes
        
        patientData.otpSecret = otp;
        patientData.otpExpires = otpExpiry;
        
        // Send OTP (mock function, in production use a real SMS service)
        sendOtp(phone, otp);
      }
      
      // Create new patient
      const patient = await Patient.create(patientData);
      
      // If registration is with password, generate token immediately
      if (password) {
        const token = generateToken({
          id: patient._id,
          role: patient.role
        });
        
        return NextResponse.json({
          success: true,
          message: 'Patient registration successful',
          token,
          user: {
            id: patient._id,
            role: patient.role,
            phone: patient.phone
          }
        });
      } else {
        // If OTP registration, return without token
        return NextResponse.json({
          success: true,
          message: 'Patient registration initiated. Please verify with OTP.',
          requireOtp: true,
          user: {
            id: patient._id,
            role: patient.role,
            phone: patient.phone
          }
        });
      }
    } else {
      // Super Admin and Admin cannot register through this endpoint
      return NextResponse.json({ success: false, message: 'Invalid role for registration' }, { status: 400 });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
