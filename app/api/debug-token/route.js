import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';

export async function POST(req) {
  try {
    // Get the token from the request body
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Token is required' 
      }, { status: 400 });
    }
    
    // Attempt to verify the token
    const decoded = verifyToken(token);
    
    if (decoded) {
      return NextResponse.json({ 
        success: true, 
        message: 'Token is valid', 
        decoded,
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasJwtSecret: !!process.env.JWT_SECRET,
          jwtSecretPrefix: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 3) + '...' : 'undefined'
        }
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Token is invalid',
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasJwtSecret: !!process.env.JWT_SECRET,
          jwtSecretPrefix: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 3) + '...' : 'undefined'
        } 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Debug token error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error processing token',
      error: error.message,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        jwtSecretPrefix: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 3) + '...' : 'undefined'
      }
    }, { status: 500 });
  }
}

