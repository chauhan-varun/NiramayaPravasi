import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import crypto from 'crypto';

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
  return authenticator.generateSecret();
}

export function generateMfaTotpUri(secret, email) {
  return authenticator.keyuri(email, 'NirmayaPravasi', secret);
}

export function verifyMfaToken(token, secret) {
  return authenticator.verify({ token, secret });
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
