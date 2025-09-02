import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret'

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12)
}

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateJWT = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export const generateMFASecret = () => {
  return speakeasy.generateSecret({
    name: 'Nirmaya Pravasi',
    length: 32
  })
}

export const verifyMFAToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1
  })
}

export const generateQRCode = async (secret) => {
  return await qrcode.toDataURL(secret.otpauth_url)
}
