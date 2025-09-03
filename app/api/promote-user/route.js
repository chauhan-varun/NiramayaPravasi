import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, role = 'ADMIN' } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        role: role,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({
      message: `User ${email} has been promoted to ${role}`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        status: updatedUser.status
      }
    })
  } catch (error) {
    console.error('Error promoting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
