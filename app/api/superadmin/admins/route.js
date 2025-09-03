import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { requireSuperAdmin } from '../../../../middleware/auth';
import { hashPassword } from '../../../../lib/auth';
import Admin from '../../../../models/Admin';

// List all admins
export async function GET(req) {
  const authResult = await requireSuperAdmin(req);
  if (!authResult.proceed) return authResult;
  
  try {
    await dbConnect();
    const admins = await Admin.find().select('-passwordHash');
    
    return NextResponse.json({
      success: true,
      admins
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// Create a new admin
export async function POST(req) {
  const authResult = await requireSuperAdmin(req);
  if (!authResult.proceed) return authResult;
  
  try {
    await dbConnect();
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 409 });
    }
    
    // Hash the password
    const passwordHash = await hashPassword(password);
    
    // Create new admin
    const admin = await Admin.create({
      email,
      passwordHash,
      role: 'admin',
      createdBy: authResult.superAdmin._id
    });
    
    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
