import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import { requireAdmin } from '../../../../middleware/auth';
import Doctor from '../../../../models/Doctor';

// List all doctors
export async function GET(req) {
  const authResult = await requireAdmin(req);
  if (!authResult.proceed) return authResult;
  
  try {
    await dbConnect();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    // Find doctors based on status filter, or all doctors if no status is provided
    const filter = status ? { status } : {};
    const doctors = await Doctor.find(filter).select('-passwordHash');
    
    return NextResponse.json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
