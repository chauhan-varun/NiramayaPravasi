'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function DoctorRegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [phone, setPhone] = useState('')
  const router = useRouter()

  // Send OTP for registration
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const phoneNumber = formData.get('phone')
    setPhone(phoneNumber)

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

  // Complete registration
  const handleRegistration = async (e) => {
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
        setTimeout(() => router.push('/doctor/login'), 5000)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Doctor Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Apply to join our healthcare platform as a medical professional
          </p>
          <Badge variant="outline" className="mt-2 bg-amber-50 text-amber-700 border-amber-200">
            Requires Admin Approval
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Apply for Doctor Account</CardTitle>
            <CardDescription>
              Submit your credentials for verification and approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be your login credential after approval
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-800 mb-2">⚠️ Approval Process</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Application submitted to admin</li>
                    <li>• Credentials verified manually</li>
                    <li>• Medical license validated</li>
                    <li>• Approval notification sent</li>
                    <li>• Access granted after approval</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Start Application Process'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    placeholder="123456"
                    maxLength={6}
                    className="mt-1 text-center text-lg tracking-widest"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the code sent to {phone}
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
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Include your professional title (Dr./Prof.)
                  </p>
                </div>

                <div>
                  <Label htmlFor="licenseNumber">Medical License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    placeholder="MCI123456 or State License Number"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your valid medical practice license
                  </p>
                </div>

                <div>
                  <Label htmlFor="specialty">Medical Specialty</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    type="text"
                    required
                    placeholder="e.g., Cardiology, Pediatrics, General Medicine"
                    className="mt-1"
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
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Total years of medical practice (optional)
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">📋 What happens next?</h3>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Application submitted for review</li>
                    <li>2. Admin verifies your credentials</li>
                    <li>3. You receive approval notification</li>
                    <li>4. Login access granted</li>
                  </ol>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Submitting Application...' : 'Submit for Approval'}
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

            <div className="text-center mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Already have an approved account?{' '}
                <Link href="/doctor/login" className="text-blue-600 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Are you a patient?{' '}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Register as Patient
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
