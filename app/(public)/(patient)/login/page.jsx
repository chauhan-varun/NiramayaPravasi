'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function PatientLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [phone, setPhone] = useState('')
  const [loginMethod, setLoginMethod] = useState('otp') // 'otp' or 'password'
  const router = useRouter()

  // Send OTP
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
        body: JSON.stringify({ phone: phoneNumber, purpose: 'LOGIN' })
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

  // Login with OTP
  const handleOTPLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const otp = formData.get('otp')

    try {
      const result = await signIn('credentials', {
        phone,
        otp,
        loginType: 'phone',
        redirect: false
      })

      if (result?.error) {
        setError('Invalid OTP')
      } else {
        const session = await getSession()
        if (session?.user?.role === 'PATIENT') {
          router.push('/patient')
        } else {
          setError('Access denied: Invalid user role')
        }
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Login with Password
  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const phoneNumber = formData.get('phone')
    const password = formData.get('password')

    try {
      const result = await signIn('credentials', {
        phone: phoneNumber,
        password,
        loginType: 'phone_password',
        redirect: false
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else {
        const session = await getSession()
        if (session?.user?.role === 'PATIENT') {
          router.push('/patient')
        } else {
          setError('Access denied: Invalid user role')
        }
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Patient Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your medical records and health information
          </p>
          <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
            For Patients Only
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In to Your Account</CardTitle>
            <CardDescription>
              Choose your preferred login method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Method Selection */}
            <div className="flex space-x-2">
              <Button
                variant={loginMethod === 'otp' ? 'default' : 'outline'}
                onClick={() => {
                  setLoginMethod('otp')
                  setOtpSent(false)
                  setError('')
                }}
                className="flex-1"
              >
                Phone + OTP
              </Button>
              <Button
                variant={loginMethod === 'password' ? 'default' : 'outline'}
                onClick={() => {
                  setLoginMethod('password')
                  setOtpSent(false)
                  setError('')
                }}
                className="flex-1"
              >
                Phone + Password
              </Button>
            </div>

            {/* OTP Login */}
            {loginMethod === 'otp' && (
              <>
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
                        Enter your registered phone number
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleOTPLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
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
                        OTP sent to {phone}
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Verifying...' : 'Verify & Sign In'}
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
              </>
            )}

            {/* Password Login */}
            {loginMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            )}

            {/* Error and Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Registration Link */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/patient/register" className="text-blue-600 hover:underline font-medium">
                  Register as Patient
                </Link>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Need help? Contact support or visit our help center
              </p>
            </div>

            {/* Other Login Options */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Login as different user type:</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href="/doctor/login">Doctor Login</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href="/admin/login">Admin Login</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
