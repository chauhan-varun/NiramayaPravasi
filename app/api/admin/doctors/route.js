import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Fetch pending doctors (applications awaiting approval)
    const pendingDoctors = await prisma.user.findMany({
      where: {
        role: 'PENDING_DOCTOR'
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        licenseNumber: true,
        specialty: true,
        experience: true,
        createdAt: true,
        status: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch approved doctors for reference
    const approvedDoctors = await prisma.user.findMany({
      where: {
        role: 'DOCTOR'
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        licenseNumber: true,
        specialty: true,
        experience: true,
        createdAt: true,
        status: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      pendingDoctors,
      approvedDoctors,
      stats: {
        pending: pendingDoctors.length,
        approved: approvedDoctors.length,
        total: pendingDoctors.length + approvedDoctors.length
      }
    })

  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const { doctorId, action } = await request.json()

    if (!doctorId || !action) {
      return NextResponse.json(
        { error: 'Doctor ID and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be approve or reject' },
        { status: 400 }
      )
    }

    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      select: { id: true, email: true, name: true, role: true }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    if (doctor.role !== 'PENDING_DOCTOR') {
      return NextResponse.json(
        { error: 'Doctor is not pending approval' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      // Approve the doctor by changing role from PENDING_DOCTOR to DOCTOR
      await prisma.user.update({
        where: { id: doctorId },
        data: { 
          role: 'DOCTOR',
          status: 'ACTIVE'
        }
      })

      return NextResponse.json({
        message: 'Doctor approved successfully',
        doctor: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email
        }
      })
    } else {
      // Reject the doctor (delete the application)
      await prisma.user.delete({
        where: { id: doctorId }
      })

      return NextResponse.json({
        message: 'Doctor application rejected and removed',
        doctor: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email
        }
      })
    }

  } catch (error) {
    console.error('Error handling doctor action:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
