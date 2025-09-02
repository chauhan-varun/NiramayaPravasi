import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    // Only admin and superadmin can view pending doctors
    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const pendingDoctors = await prisma.user.findMany({
      where: {
        role: 'PENDING_DOCTOR',
        status: 'PENDING'
      },
      select: {
        id: true,
        phone: true,
        name: true,
        licenseNumber: true,
        specialty: true,
        experience: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ pendingDoctors })

  } catch (error) {
    console.error('Get pending doctors error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    // Only admin and superadmin can approve doctors
    if (!session || !['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { doctorId, action } = await request.json() // action: 'approve' or 'reject'

    if (!doctorId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Doctor ID and valid action (approve/reject) are required' },
        { status: 400 }
      )
    }

    const doctor = await prisma.user.findUnique({
      where: { id: doctorId }
    })

    if (!doctor || doctor.role !== 'PENDING_DOCTOR') {
      return NextResponse.json(
        { error: 'Doctor not found or not pending approval' },
        { status: 404 }
      )
    }

    const updatedDoctor = await prisma.user.update({
      where: { id: doctorId },
      data: {
        role: action === 'approve' ? 'DOCTOR' : 'PENDING_DOCTOR',
        status: action === 'approve' ? 'ACTIVE' : 'INACTIVE'
      }
    })

    return NextResponse.json({
      message: `Doctor ${action}d successfully`,
      doctor: {
        id: updatedDoctor.id,
        name: updatedDoctor.name,
        role: updatedDoctor.role,
        status: updatedDoctor.status
      }
    })

  } catch (error) {
    console.error('Approve/reject doctor error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
