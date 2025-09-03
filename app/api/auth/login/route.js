import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { comparePassword, generateToken } from '../../../../lib/auth';
import SuperAdmin from '../../../../models/SuperAdmin';
import Admin from '../../../../models/Admin';
import Doctor from '../../../../models/Doctor';
import Patient from '../../../../models/Patient';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, phone, password, role, otp } = await req.json();
    
    // Validate inputs based on role
    if (role === 'patient') {
      if (!phone) {
        return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
      }
      
      // Handle patient login (with password or OTP)
      const patient = await Patient.findOne({ phone });
      if (!patient) {
        return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
      }
      
      let isAuthenticated = false;
      
      // Check if login is with password or OTP
      if (password && patient.passwordHash) {
        isAuthenticated = await comparePassword(password, patient.passwordHash);
      } else if (otp && patient.otpSecret && patient.otpExpires > new Date()) {
        // In a real application, validate the OTP against the stored secret
        // For now, just check if it matches our mock OTP
        isAuthenticated = otp === patient.otpSecret;
      }
      
      if (!isAuthenticated) {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
      }
      
      const token = generateToken({
        id: patient._id,
        role: patient.role
      });
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: patient._id,
          role: patient.role,
          phone: patient.phone
        }
      });
    } else {
      // Handle email-based login for other roles
      if (!email || !password) {
        return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
      }
      
      let user;
      
      // Find the user based on role and email
      switch (role) {
        case 'superadmin':
          user = await SuperAdmin.findOne({ email });
          break;
        case 'admin':
          user = await Admin.findOne({ email });
          break;
        case 'doctor':
        case 'pending_doctor':
          user = await Doctor.findOne({ email });
          // Check if the doctor is approved
          if (user && user.status !== 'approved' && user.role !== 'doctor') {
            return NextResponse.json({ 
              success: false, 
              message: 'Your account is pending approval', 
              status: user.status 
            }, { status: 403 });
          }
          break;
        default:
          return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
      }
      
      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      
      const isPasswordValid = await comparePassword(password, user.passwordHash);
      
      if (!isPasswordValid) {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
      }
      
      // For super admin, check if MFA is enabled and validated
      if (role === 'superadmin' && user.mfaEnabled) {
        // In a real app, you would check the MFA token here
        // For now, we'll just return a flag indicating MFA is required
        return NextResponse.json({
          success: true,
          requireMfa: true,
          userId: user._id,
        });
      }
      
      const token = generateToken({
        id: user._id,
        role: user.role
      });
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user._id,
          role: user.role,
          email: user.email
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
