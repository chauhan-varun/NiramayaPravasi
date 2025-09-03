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
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { PhoneNumberInput } from '@/components/ui/phone-input'
import Link from 'next/link'
import './otp-styles.css'
import { toast } from "sonner"

export default function DoctorLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [phone, setPhone] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const router = useRouter()

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!phone) {
      toast.error("Phone number required", {
        description: 'Please enter a valid phone number',
        duration: 3000,
      })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone, purpose: 'LOGIN' })
      })

      const data = await response.json()

      if (response.ok) {
        setOtpSent(true)
        setSuccess('OTP sent successfully!')
        toast.success("OTP sent successfully!", {
          description: `We've sent a 6-digit code to ${phone}`,
          duration: 4000,
        })
      } else {
        setError(data.error || 'Failed to send OTP')
        toast.error("Failed to send OTP", {
          description: data.error || 'Please try again',
          duration: 4000,
        })
      }
    } catch (err) {
      setError('Failed to send OTP')
      toast.error("Failed to send OTP", {
        description: 'Please check your connection and try again',
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Login with OTP
  const handleOTPLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!otpValue || otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      toast.error("Invalid OTP", {
        description: 'Please enter a valid 6-digit OTP',
        duration: 3000,
      })
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        phone,
        otp: otpValue,
        loginType: 'phone',
        redirect: false
      })

      if (result?.error) {
        setError('Invalid OTP or account not approved')
        toast.error("Login failed", {
          description: 'Invalid OTP or account not approved',
          duration: 4000,
        })
      } else {
        const session = await getSession()
        if (session?.user?.role === 'DOCTOR') {
          toast.success("Login successful!", {
            description: 'Welcome back, Doctor! Redirecting to dashboard...',
            duration: 3000,
          })
          router.push('/doctor')
        } else if (session?.user?.role === 'PENDING_DOCTOR') {
          setError('Your account is pending admin approval. Please wait for approval.')
          toast.warning("Account pending approval", {
            description: 'Your account is pending admin approval. Please wait for approval.',
            duration: 5000,
          })
        } else {
          setError('Access denied: Invalid user role')
          toast.error("Access denied", {
            description: 'Invalid user role for doctor portal',
            duration: 4000,
          })
        }
      }
    } catch (err) {
      setError('Login failed')
      toast.error("Login failed", {
        description: 'Something went wrong. Please try again.',
        duration: 4000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Doctor Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access patient records and manage healthcare services
          </p>
          <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
            For Approved Doctors Only
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In to Doctor Portal</CardTitle>
            <CardDescription>
              Secure access for healthcare professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Registered Phone Number</Label>
                  <PhoneNumberInput
                    value={phone}
                    onChange={setPhone}
                    placeholder="Enter your registered phone number"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use the phone number from your approved registration
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">🏥 Doctor Access</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Patient record management</li>
                    <li>• Create treatment plans</li>
                    <li>• Prescription management</li>
                    <li>• Appointment scheduling</li>
                    <li>• Secure patient communication</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send Verification Code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOTPLogin} className="space-y-4">
                <div>
                  <Label>Enter OTP sent to {phone}</Label>
                  <div className="mt-2 flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={setOtpValue}
                      pattern="[0-9]*"
                      data-input-otp
                      className="gap-2"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} autoComplete="off" />
                        <InputOTPSlot index={1} autoComplete="off" />
                        <InputOTPSlot index={2} autoComplete="off" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} autoComplete="off" />
                        <InputOTPSlot index={4} autoComplete="off" />
                        <InputOTPSlot index={5} autoComplete="off" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 text-center">
                    Please enter the 6-digit OTP
                  </p>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading || otpValue.length !== 6}>
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

            <div className="text-center mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Not registered yet?{' '}
                <Link href="/doctor/register" className="text-blue-600 hover:underline font-medium">
                  Apply for Doctor Account
                </Link>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Note: Doctor accounts require admin approval
              </p>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Login as different user type:</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href="/login">Patient Login</Link>
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
