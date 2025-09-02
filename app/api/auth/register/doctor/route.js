import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatPhoneNumber } from '@/lib/twilio'

export async function POST(request) {
  try {
    const { 
      phone, 
      otp, 
      name, 
      licenseNumber, 
      specialty, 
      experience 
    } = await request.json()

    if (!phone || !otp || !name) {
      return NextResponse.json(
        { error: 'Phone, OTP, and name are required' },
        { status: 400 }
      )
    }

    const formattedPhone = formatPhoneNumber(phone)

    // Verify OTP first
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

    // Create doctor with pending status
    const doctor = await prisma.user.create({
      data: {
        phone: formattedPhone,
        name,
        phoneVerified: new Date(),
        role: 'PENDING_DOCTOR',
        status: 'PENDING',
        licenseNumber,
        specialty,
        experience: experience ? parseInt(experience) : null
      }
    })

    // Mark OTP as verified
    await prisma.oTPVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    })

    return NextResponse.json({
      message: 'Doctor registration successful. Waiting for admin approval.',
      user: {
        id: doctor.id,
        phone: doctor.phone,
        name: doctor.name,
        role: doctor.role,
        status: doctor.status
      }
    })

  } catch (error) {
    console.error('Doctor registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
