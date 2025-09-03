import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

// JWT token generation
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// JWT token verification
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Password hashing
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Password comparison
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// MFA functions for Super Admin
export function generateMfaSecret() {
  // Generate a random string without crypto (Edge Runtime compatible)
  const randomValues = new Uint8Array(10);
  
  // Use browser's crypto API if available (works in Edge Runtime)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    // Fallback to less secure Math.random for environments without crypto
    for (let i = 0; i < randomValues.length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }
  
  // Convert to base32-like string
  return Array.from(randomValues)
    .map(byte => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[byte % 32])
    .join('');
}

export function generateMfaTotpUri(secret, email) {
  // Create a URI for TOTP apps like Google Authenticator
  const issuer = encodeURIComponent('NirmayaPravasi');
  const user = encodeURIComponent(email);
  return `otpauth://totp/${issuer}:${user}?secret=${secret}&issuer=${issuer}`;
}

export function verifyMfaToken(token, secret) {
  // For development purposes, we'll accept any token
  // In production, you would implement proper TOTP verification
  // For example, by using crypto.timingSafeEqual to compare against a generated TOTP
  console.log('Verifying MFA token:', token, 'with secret:', secret);
  return true; // Mock implementation - REPLACE IN PRODUCTION
}

// OTP functions for Patient
export function generateOtp() {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Twilio function to send OTP via SMS
export async function sendOtp(phoneNumber, otp) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    
    if (!accountSid || !authToken || !twilioPhone) {
      throw new Error('Twilio credentials not configured');
    }
    
    const client = require('twilio')(accountSid, authToken);
    
    await client.messages.create({
      body: `Your Nirmaya Pravasi verification code is: ${otp}`,
      from: twilioPhone,
      to: phoneNumber
    });
    
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}

// Parse authorization header
export function parseAuthHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token);
}

// Safely extract user data from JWT claims
export function extractUserFromToken(payload) {
  if (!payload) return null;
  
  return {
    id: payload.id,
    role: payload.role,
  };
}
