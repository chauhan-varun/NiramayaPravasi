'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (session) {
      // Redirect based on user role
      switch (session.user.role) {
        case 'SUPERADMIN':
          router.push('/admin/super')
          break
        case 'ADMIN':
          router.push('/admin')
          break
        case 'DOCTOR':
          router.push('/doctor')
          break
        case 'PATIENT':
          router.push('/')
          break
        default:
          break
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nirmaya Pravasi
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive Patient Record Management System
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Secure, efficient, and user-friendly healthcare management platform 
            for patients, doctors, and healthcare administrators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/login')}>
            <CardHeader>
              <CardTitle className="text-green-600">For Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Access your medical records, book appointments, and communicate with doctors.
              </p>
              <div className="text-xs text-gray-500 mb-2">
                Login: Phone + OTP/Password
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Patient Login
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/doctor/login')}>
            <CardHeader>
              <CardTitle className="text-blue-600">For Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage patient records, create treatment plans, and prescriptions.
              </p>
              <div className="text-xs text-gray-500 mb-2">
                Login: Phone + OTP (After Approval)
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Doctor Login
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/login')}>
            <CardHeader>
              <CardTitle className="text-purple-600">For Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Approve doctors, manage users, and oversee system operations.
              </p>
              <div className="text-xs text-gray-500 mb-2">
                Login: Email + Password/Google
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Admin Login
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-red-600">Super Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Full system control, admin management, and system configuration.
              </p>
              <div className="text-xs text-gray-500 mb-2">
                Highest level access
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => router.push('/admin/login')}>
                Super Admin Login
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-x-4 mb-8">
          <Button 
            size="lg" 
            onClick={() => router.push('/login')}
            className="bg-green-600 hover:bg-green-700"
          >
            Patient Login
          </Button>
          <Button 
            size="lg" 
            onClick={() => router.push('/doctor/login')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Doctor Login
          </Button>
          <Button 
            size="lg" 
            onClick={() => router.push('/admin/login')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Admin Login
          </Button>
        </div>

        <div className="text-center space-x-4">
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => router.push('/register')}
          >
            Register as Patient
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => router.push('/doctor/register')}
          >
            Apply as Doctor
          </Button>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Authentication System Features</CardTitle>
              <CardDescription>Secure multi-role authentication with modern standards</CardDescription>
            </CardHeader>
            <CardContent className="text-left">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">For Healthcare Providers</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• SMS OTP authentication for doctors</li>
                    <li>• Admin approval workflow</li>
                    <li>• Secure patient data access</li>
                    <li>• Role-based permissions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">For Administrators</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Email + Password authentication</li>
                    <li>• Google OAuth integration</li>
                    <li>• MFA support (planned)</li>
                    <li>• Comprehensive user management</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
