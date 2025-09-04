import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';

export async function GET(request) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Missing or invalid Authorization header' }, { status: 401 });
    }
    
    // Extract token
    const token = authHeader.substring(7);
    
    try {
      // Decode the token payload without verification (for debugging)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return NextResponse.json({ success: false, message: 'Invalid token format' }, { status: 400 });
      }
      
      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = Buffer.from(base64Payload, 'base64').toString('utf8');
      const payload = JSON.parse(decodedPayload);
      
      return NextResponse.json({
        success: true,
        message: 'Token decoded (without verification)',
        decodedPayload: payload
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Error decoding token',
        error: error.message
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Server error',
      error: error.message
    }, { status: 500 });
  }
}
