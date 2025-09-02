'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PatientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'PATIENT') {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Patient Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{session.user.role}</Badge>
              <span className="text-sm text-gray-700">
                {session.user.name || session.user.phone}
              </span>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Records</CardTitle>
                <CardDescription>View your medical records</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Access your medical history, prescriptions, and treatment records.
                </p>
                <Button className="mt-4" disabled>
                  View Records (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Schedule new appointments or view existing ones.
                </p>
                <Button className="mt-4" disabled>
                  Book Appointment (Coming Soon)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Manage your personal information and preferences.
                </p>
                <Button className="mt-4" disabled>
                  Edit Profile (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Welcome to Nirmaya Pravasi</CardTitle>
              <CardDescription>Your health records are secure with us</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                As a patient, you have access to your complete medical history, 
                prescription records, and can communicate with your healthcare providers. 
                Your data is encrypted and stored securely.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
