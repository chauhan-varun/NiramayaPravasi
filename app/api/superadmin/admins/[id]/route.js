import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import { requireSuperAdmin } from '../../../../../middleware/auth';
import { hashPassword } from '../../../../../lib/auth';
import Admin from '../../../../../models/Admin';

// Get a specific admin
export async function GET(req, { params }) {
  const authResult = await requireSuperAdmin(req);
  if (!authResult.proceed) return authResult;
  
  try {
    await dbConnect();
    const { id } = params;
    
    const admin = await Admin.findById(id).select('-passwordHash');
    
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      admin
    });
  } catch (error) {
    console.error('Error fetching admin:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// Update an admin
export async function PATCH(req, { params }) {
  const authResult = await requireSuperAdmin(req);
  if (!authResult.proceed) return authResult;
  
  try {
    await dbConnect();
    const { id } = params;
    const { email, password } = await req.json();
    
    const admin = await Admin.findById(id);
    
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
    }
    
    // Update fields if provided
    if (email) admin.email = email;
    if (password) admin.passwordHash = await hashPassword(password);
    
    await admin.save();
    
    return NextResponse.json({
      success: true,
      message: 'Admin updated successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// Delete an admin
export async function DELETE(req, { params }) {
  const authResult = await requireSuperAdmin(req);
  if (!authResult.proceed) return authResult;
  
  try {
    await dbConnect();
    const { id } = params;
    
    const admin = await Admin.findByIdAndDelete(id);
    
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
