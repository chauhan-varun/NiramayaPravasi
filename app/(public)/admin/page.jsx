'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [approvedDoctors, setApprovedDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('Admin Dashboard Check:', { status, session })
    if (status === 'loading') return
    
    if (!session) {
      console.log('No session, redirecting to login')
      router.push('/admin/login')
      return
    }

    console.log('User role:', session.user?.role, 'User email:', session.user?.email)
    if (!['ADMIN', 'SUPERADMIN'].includes(session.user.role)) {
      console.log('Role check failed, redirecting to login')
      router.push('/admin/login')
      return
    }

    console.log('Access granted, fetching doctors')
    fetchPendingDoctors()
  }, [session, status, router])

  const fetchPendingDoctors = async () => {
    try {
      const response = await fetch('/api/admin/doctors')
      const data = await response.json()
      if (response.ok) {
        setPendingDoctors(data.pendingDoctors)
        setApprovedDoctors(data.approvedDoctors)
      }
    } catch (err) {
      setError('Failed to fetch doctors')
    }
  }

  const handleDoctorAction = async (doctorId, action) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, action })
      })

      const data = await response.json()

      if (response.ok) {
        fetchPendingDoctors() // Refresh the list
      } else {
        setError(data.error || 'Action failed')
      }
    } catch (err) {
      setError('Action failed')
    } finally {
      setLoading(false)
    }
  }

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
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{session.user.role}</Badge>
              <span className="text-sm text-gray-700">
                {session.user.name || session.user.email}
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
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Doctors waiting for approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingDoctors.length}</div>
                <p className="text-sm text-gray-600">New doctor registrations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approved Doctors</CardTitle>
                <CardDescription>Currently active doctors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedDoctors.length}</div>
                <p className="text-sm text-gray-600">Active healthcare providers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>System analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  View system usage and analytics.
                </p>
                <Button className="mt-4" disabled>
                  View Reports (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Doctor Approvals</CardTitle>
                <CardDescription>
                  Review and approve doctor registration requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingDoctors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No pending doctor approvals
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {pendingDoctors.map((doctor) => (
                      <div key={doctor.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                PENDING_DOCTOR
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Email: {doctor.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              Phone: {doctor.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              License: {doctor.licenseNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              Specialty: {doctor.specialty || 'Not specified'}
                            </p>
                            {doctor.experience && (
                              <p className="text-sm text-gray-600">
                                Experience: {doctor.experience} years
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Applied: {new Date(doctor.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => handleDoctorAction(doctor.id, 'approve')}
                              disabled={loading}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDoctorAction(doctor.id, 'reject')}
                              disabled={loading}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approved Doctors</CardTitle>
                <CardDescription>
                  Currently active healthcare providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {approvedDoctors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No approved doctors yet
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {approvedDoctors.map((doctor) => (
                      <div key={doctor.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                DOCTOR
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Email: {doctor.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              Phone: {doctor.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              License: {doctor.licenseNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              Specialty: {doctor.specialty || 'Not specified'}
                            </p>
                            {doctor.experience && (
                              <p className="text-sm text-gray-600">
                                Experience: {doctor.experience} years
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Status: {doctor.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
