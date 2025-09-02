import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatPhoneNumber } from '@/lib/twilio'
import { hashPassword } from '@/lib/auth'

export async function POST(request) {
  try {
    const { phone, password, name, otp } = await request.json()

    if (!phone || !name) {
      return NextResponse.json(
        { error: 'Phone and name are required' },
        { status: 400 }
      )
    }

    const formattedPhone = formatPhoneNumber(phone)

    // If OTP is provided, verify it (for OTP registration)
    if (otp) {
      const otpRecord = await prisma.oTPVerification.findFirst({
        where: {
          phone: formattedPhone,
          otp,
          verified: false,
          expiresAt: { gt: new Date() },
          purpose: 'REGISTRATION'
        }
      })

      if (!otpRecord) {
        return NextResponse.json(
          { error: 'Invalid or expired OTP' },
          { status: 400 }
        )
      }

      // Mark OTP as verified
      await prisma.oTPVerification.update({
        where: { id: otpRecord.id },
        data: { verified: true }
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: formattedPhone }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 409 }
      )
    }

    // Hash password if provided
    let passwordHash = null
    if (password) {
      passwordHash = await hashPassword(password)
    }

    // Create patient
    const patient = await prisma.user.create({
      data: {
        phone: formattedPhone,
        name,
        passwordHash,
        phoneVerified: otp ? new Date() : null,
        role: 'PATIENT',
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({
      message: 'Patient registration successful',
      user: {
        id: patient.id,
        phone: patient.phone,
        name: patient.name,
        role: patient.role,
        status: patient.status
      }
    })

  } catch (error) {
    console.error('Patient registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
