import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { comparePassword, generateToken } from '../../../../lib/auth';
import SuperAdmin from '../../../../models/SuperAdmin';
import Admin from '../../../../models/Admin';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    
    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email and password are required' 
      }, { status: 400 });
    }
    
    // First check if the user is a SuperAdmin
    let user = await SuperAdmin.findOne({ email });
    let role = 'superadmin';
    
    // If not found as SuperAdmin, check if they are an Admin
    if (!user) {
      user = await Admin.findOne({ email });
      role = 'admin';
    }
    
    // If not found in either collection
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found or does not have admin privileges' 
      }, { status: 404 });
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // For super admin, check if MFA is enabled and validated (if needed)
    if (role === 'superadmin' && user.mfaEnabled) {
      // In a real app, you would check the MFA token here
      // For now, we'll just return a flag indicating MFA is required
      return NextResponse.json({
        success: true,
        requireMfa: true,
        userId: user._id,
        role: role
      });
    }
    
    // Generate token with the detected role
    const token = generateToken({
      id: user._id.toString(),
      role: role
    });
    
    console.log(`User ${email} logged in as ${role}`);
    
    // Return success with the token and user details
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        role: role,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error' 
    }, { status: 500 });
  }
}
