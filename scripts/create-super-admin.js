import { prisma } from '../lib/prisma.js'
import { hashPassword } from '../lib/auth.js'

async function createSuperAdmin() {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL || 'root@system.com'
    const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123'

    // Check if super admin already exists
    const existingSuperAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingSuperAdmin) {
      console.log('Super admin already exists')
      return
    }

    const passwordHash = await hashPassword(password)

    const superAdmin = await prisma.user.create({
      data: {
        email,
        name: 'Super Administrator',
        passwordHash,
        emailVerified: new Date(),
        role: 'SUPERADMIN',
        status: 'ACTIVE'
      }
    })

    console.log('Super admin created successfully:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('ID:', superAdmin.id)

  } catch (error) {
    console.error('Error creating super admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSuperAdmin()
