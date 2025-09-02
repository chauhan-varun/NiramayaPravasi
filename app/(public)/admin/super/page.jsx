'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [admins, setAdmins] = useState([])
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'SUPERADMIN') {
      router.push('/auth/signin')
      return
    }

    fetchAdmins()
    fetchPendingDoctors()
  }, [session, status, router])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/admins')
      const data = await response.json()
      if (response.ok) {
        setAdmins(data.admins)
      }
    } catch (err) {
      setError('Failed to fetch admins')
    }
  }

  const fetchPendingDoctors = async () => {
    try {
      const response = await fetch('/api/admin/doctors')
      const data = await response.json()
      if (response.ok) {
        setPendingDoctors(data.pendingDoctors)
      }
    } catch (err) {
      setError('Failed to fetch pending doctors')
    }
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.target)
    const adminData = {
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name')
    }

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Admin created successfully')
        e.target.reset()
        fetchAdmins()
      } else {
        setError(data.error || 'Failed to create admin')
      }
    } catch (err) {
      setError('Failed to create admin')
    } finally {
      setLoading(false)
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
        fetchPendingDoctors()
        setSuccess(`Doctor ${action}d successfully`)
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
              <h1 className="text-xl font-semibold">Super Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {session.user.role}
              </Badge>
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

          {success && (
            <Alert className="mb-6">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Admins</CardTitle>
                <CardDescription>System administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{admins.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Doctors</CardTitle>
                <CardDescription>Awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingDoctors.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>All systems operational</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Healthy
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database</CardTitle>
                <CardDescription>Connected</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Online
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="admins" className="space-y-6">
            <TabsList>
              <TabsTrigger value="admins">Admin Management</TabsTrigger>
              <TabsTrigger value="doctors">Doctor Approvals</TabsTrigger>
            </TabsList>

            <TabsContent value="admins" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Admin</CardTitle>
                  <CardDescription>
                    Add a new administrator to the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="admin@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Strong password"
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Admin'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Admins</CardTitle>
                  <CardDescription>
                    List of all system administrators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {admins.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No admins found
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {admins.map((admin) => (
                        <div key={admin.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{admin.name}</h3>
                              <p className="text-sm text-gray-600">
                                {admin.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                Created: {new Date(admin.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline">{admin.role}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="doctors" className="space-y-6">
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
                    <div className="space-y-4">
                      {pendingDoctors.map((doctor) => (
                        <div key={doctor.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">
                                Phone: {doctor.phone}
                              </p>
                              <p className="text-sm text-gray-600">
                                License: {doctor.licenseNumber}
                              </p>
                              <p className="text-sm text-gray-600">
                                Specialty: {doctor.specialty}
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
