'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [phone, setPhone] = useState('')
  const [registrationType, setRegistrationType] = useState('')
  const router = useRouter()

  // Send OTP for registration
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const phoneNumber = formData.get('phone')
    const regType = formData.get('registrationType')
    
    setPhone(phoneNumber)
    setRegistrationType(regType)

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, purpose: 'REGISTRATION' })
      })

      const data = await response.json()

      if (response.ok) {
        setOtpSent(true)
        setSuccess('OTP sent successfully!')
      } else {
        setError(data.error || 'Failed to send OTP')
      }
    } catch (err) {
      setError('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Doctor registration
  const handleDoctorRegistration = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const data = {
      phone,
      otp: formData.get('otp'),
      name: formData.get('name'),
      licenseNumber: formData.get('licenseNumber'),
      specialty: formData.get('specialty'),
      experience: formData.get('experience')
    }

    try {
      const response = await fetch('/api/auth/register/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('Registration successful! Please wait for admin approval.')
        setTimeout(() => router.push('/auth/signin'), 3000)
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (err) {
      setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // Patient registration
  const handlePatientRegistration = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const data = {
      phone,
      otp: formData.get('otp'),
      name: formData.get('name'),
      password: formData.get('password') || undefined
    }

    try {
      const response = await fetch('/api/auth/register/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('Registration successful! You can now sign in.')
        setTimeout(() => router.push('/auth/signin'), 3000)
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (err) {
      setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account to access the system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Register as a doctor or patient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="doctor" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="doctor">
                  Doctor
                  <Badge variant="outline" className="ml-2">Approval Required</Badge>
                </TabsTrigger>
                <TabsTrigger value="patient">
                  Patient
                  <Badge variant="outline" className="ml-2">Instant Access</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="doctor" className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <input type="hidden" name="registrationType" value="doctor" />
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                      <strong>Note:</strong> Doctor registration requires admin approval. 
                      You'll be notified once your account is approved.
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleDoctorRegistration} className="space-y-4">
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        placeholder="123456"
                        maxLength={6}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        OTP sent to {phone}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Dr. John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">Medical License Number</Label>
                      <Input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        required
                        placeholder="MCI123456"
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        name="specialty"
                        type="text"
                        required
                        placeholder="Cardiology"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        max="50"
                        placeholder="5"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Registering...' : 'Complete Registration'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setOtpSent(false)}
                    >
                      Change Phone Number
                    </Button>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="patient" className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <input type="hidden" name="registrationType" value="patient" />
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                      <strong>Note:</strong> Patient registration provides immediate access 
                      to the system once verified.
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handlePatientRegistration} className="space-y-4">
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        placeholder="123456"
                        maxLength={6}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        OTP sent to {phone}
                      </p>
                    </div>
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
                      <Label htmlFor="password">Password (Optional)</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Set a password for backup login"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        You can login with phone OTP or password
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Registering...' : 'Complete Registration'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setOtpSent(false)}
                    >
                      Change Phone Number
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="text-center mt-6">
              <a href="/auth/signin" className="text-sm text-blue-600 hover:underline">
                Already have an account? Sign in here
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
