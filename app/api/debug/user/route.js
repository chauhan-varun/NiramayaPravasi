import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No session' }, { status: 401 })
    }

    // Get the full user data from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      session: session,
      userFromDB: user
    })
  } catch (error) {
    console.error('Debug user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
