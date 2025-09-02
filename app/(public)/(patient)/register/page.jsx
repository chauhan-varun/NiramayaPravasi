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

export default function PatientRegisterPage() {
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
        setTimeout(() => router.push('/patient/login'), 3000)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Patient Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to access healthcare services
          </p>
          <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
            Instant Access
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Patient Account</CardTitle>
            <CardDescription>
              Join our healthcare platform to manage your medical records
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
                    We'll send a verification code to this number
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">✓ Patient Benefits</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Instant account activation</li>
                    <li>• Access to medical records</li>
                    <li>• Book appointments online</li>
                    <li>• Secure health data storage</li>
                    <li>• Communication with doctors</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send Verification Code'}
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
                    Enter the 6-digit code sent to {phone}
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
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password (Optional)</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password for backup login"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can login with either phone OTP or password
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Complete Registration'}
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
                Already have an account?{' '}
                <Link href="/patient/login" className="text-blue-600 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Are you a healthcare provider?{' '}
                <Link href="/doctor/register" className="text-blue-600 hover:underline">
                  Register as Doctor
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
