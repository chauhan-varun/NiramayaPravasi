import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, sendOTP, formatPhoneNumber } from '@/lib/twilio'

export async function POST(request) {
  try {
    const { phone, purpose = 'LOGIN' } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    const formattedPhone = formatPhoneNumber(phone)
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Invalidate any existing OTPs for this phone
    await prisma.oTPVerification.updateMany({
      where: {
        phone: formattedPhone,
        verified: false
      },
      data: {
        verified: true // Mark as used
      }
    })

    // Create new OTP record
    await prisma.oTPVerification.create({
      data: {
        phone: formattedPhone,
        otp,
        purpose,
        expiresAt
      }
    })

    // Send OTP via SMS
    const smsResult = await sendOTP(formattedPhone, otp, purpose.toLowerCase())

    if (!smsResult.success) {
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'OTP sent successfully',
      messageId: smsResult.messageId
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
