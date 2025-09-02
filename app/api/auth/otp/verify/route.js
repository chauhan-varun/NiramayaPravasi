import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { formatPhoneNumber } from '@/lib/twilio'

export async function POST(request) {
  try {
    const { phone, otp } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    const formattedPhone = formatPhoneNumber(phone)

    // Find the OTP record
    const otpRecord = await prisma.oTPVerification.findFirst({
      where: {
        phone: formattedPhone,
        otp,
        verified: false,
        expiresAt: { gt: new Date() }
      }
    })

    if (!otpRecord) {
      // Increment attempts if record exists
      await prisma.oTPVerification.updateMany({
        where: {
          phone: formattedPhone,
          verified: false
        },
        data: {
          attempts: { increment: 1 }
        }
      })

      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Check attempts limit
    if (otpRecord.attempts >= 3) {
      return NextResponse.json(
        { error: 'Too many attempts. Please request a new OTP.' },
        { status: 429 }
      )
    }

    // Mark OTP as verified
    await prisma.oTPVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    })

    return NextResponse.json({
      message: 'OTP verified successfully',
      verified: true
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
