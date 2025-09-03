import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request) {
  try {
    const { 
      email,
      password,
      phone, 
      name, 
      licenseNumber, 
      specialty, 
      experience 
    } = await request.json()

    if (!email || !password || !phone || !name || !licenseNumber) {
      return NextResponse.json(
        { error: 'Email, password, phone, name, and license number are required' },
        { status: 400 }
      )
    }

    // Check if user already exists with email or phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: phone }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone number already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create doctor with pending status
    const doctor = await prisma.user.create({
      data: {
        email,
        phone,
        name,
        passwordHash,
        emailVerified: new Date(), // Auto-verify for now, can be changed later
        role: 'PENDING_DOCTOR',
        status: 'PENDING',
        licenseNumber,
        specialty,
        experience: experience ? parseInt(experience) : null
      }
    })

    return NextResponse.json({
      message: 'Doctor registration successful. Waiting for admin approval.',
      user: {
        id: doctor.id,
        email: doctor.email,
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
