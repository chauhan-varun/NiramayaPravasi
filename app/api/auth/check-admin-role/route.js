import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { generateToken } from '../../../../lib/auth';
import SuperAdmin from '../../../../models/SuperAdmin';
import Admin from '../../../../models/Admin';

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email is required' 
      }, { status: 400 });
    }
    
    // First check if user is a SuperAdmin
    let user = await SuperAdmin.findOne({ email });
    let role = 'superadmin';
    
    // If not found as SuperAdmin, check if Admin
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
    
    // Generate a new token with the correct role
    const token = generateToken({
      id: user._id.toString(),
      role: role
    });
    
    return NextResponse.json({
      success: true,
      role: role,
      token: token,
      user: {
        id: user._id,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Error checking admin role:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error' 
    }, { status: 500 });
  }
}
