import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        phone: { label: 'Phone', type: 'tel' },
        otp: { label: 'OTP', type: 'text' },
        loginType: { label: 'Login Type', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials) return null

        try {
          if (credentials.loginType === 'email') {
            // Email + Password login (for SuperAdmin and Admin)
            const user = await prisma.user.findUnique({
              where: { email: credentials.email }
            })

            if (!user || !user.passwordHash) {
              return null
            }

            const isPasswordValid = await verifyPassword(
              credentials.password,
              user.passwordHash
            )

            if (!isPasswordValid) {
              return null
            }

            // Only allow email login for SuperAdmin and Admin
            if (!['SUPERADMIN', 'ADMIN'].includes(user.role)) {
              return null
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              status: user.status
            }
          }

          if (credentials.loginType === 'phone') {
            // Phone + OTP login (for Doctor and Patient)
            const otpRecord = await prisma.oTPVerification.findFirst({
              where: {
                phone: credentials.phone,
                otp: credentials.otp,
                verified: false,
                expiresAt: { gt: new Date() }
              }
            })

            if (!otpRecord) {
              return null
            }

            // Mark OTP as verified
            await prisma.oTPVerification.update({
              where: { id: otpRecord.id },
              data: { verified: true }
            })

            // Find or create user
            let user = await prisma.user.findUnique({
              where: { phone: credentials.phone }
            })

            if (!user) {
              // Create new patient if not exists
              user = await prisma.user.create({
                data: {
                  phone: credentials.phone,
                  phoneVerified: new Date(),
                  role: 'PATIENT',
                  status: 'ACTIVE'
                }
              })
            }

            return {
              id: user.id,
              phone: user.phone,
              name: user.name,
              role: user.role,
              status: user.status
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.status = user.status
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.status = token.status
        session.user.phone = token.phone
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Handle Google OAuth sign-in
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email }
        })

        if (existingUser) {
          // Update user info from Google
          await prisma.user.update({
            where: { email: profile.email },
            data: {
              name: profile.name,
              image: profile.picture,
              emailVerified: new Date()
            }
          })
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
}

export default NextAuth(authOptions)
