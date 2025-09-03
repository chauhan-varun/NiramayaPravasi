'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from "sonner"

export default function DoctorLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Email + Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    if (!email || !password) {
      toast.error("All fields required", {
        description: 'Please enter both email and password',
        duration: 3000,
      })
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        loginType: 'email',
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
        toast.error("Login failed", {
          description: 'Invalid email or password. Please try again.',
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

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await signIn('google', { 
        callbackUrl: '/doctor',
        redirect: true 
      })
    } catch (error) {
      toast.error("Google login failed", {
        description: 'Please try again or use email login',
        duration: 4000,
      })
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
          <CardContent className="space-y-6">
            {/* Email + Password Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="doctor@example.com"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use your registered email address
                </p>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="mt-1"
                />
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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            {/* Error Display */}
            {error && (
              <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Registration and Other Login Links */}
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
