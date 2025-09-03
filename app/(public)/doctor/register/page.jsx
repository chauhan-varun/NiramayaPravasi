'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from "sonner"
import Link from 'next/link'

export default function DoctorRegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  // Handle doctor registration
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')
    const phone = formData.get('phone')
    const name = formData.get('name')
    const licenseNumber = formData.get('licenseNumber')
    const specialty = formData.get('specialty')
    const experience = formData.get('experience')

    // Validation
    if (!email || !password || !phone || !name || !licenseNumber) {
      toast.error("Missing required fields", {
        description: 'Please fill in all required fields',
        duration: 4000,
      })
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: 'Please make sure both passwords are identical',
        duration: 4000,
      })
      setLoading(false)
      return
    }

    if (password.length < 8) {
      toast.error("Password too short", {
        description: 'Password must be at least 8 characters long',
        duration: 4000,
      })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          phone,
          name,
          licenseNumber,
          specialty,
          experience
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Registration successful! Waiting for admin approval.')
        toast.success("Registration successful!", {
          description: 'Your application has been submitted for admin approval.',
          duration: 5000,
        })
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/doctor/login')
        }, 3000)
      } else {
        setError(data.error || 'Registration failed')
        toast.error("Registration failed", {
          description: data.error || 'Please try again',
          duration: 4000,
        })
      }
    } catch (err) {
      setError('Registration failed')
      toast.error("Registration failed", {
        description: 'Please check your connection and try again',
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
            Doctor Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Apply for healthcare professional access
          </p>
          <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
            Requires Admin Approval
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Apply for Doctor Account</CardTitle>
            <CardDescription>
              Please fill in your professional details for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!success ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Dr. John Smith"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="doctor@example.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
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
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Minimum 8 characters"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Re-enter your password"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="licenseNumber">Medical License Number *</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      required
                      placeholder="e.g., MH12345"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      type="text"
                      placeholder="e.g., Cardiology, General Medicine"
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
                      placeholder="e.g., 5"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-800 mb-2">⚠️ Important Notice</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Your application will be reviewed by admin</li>
                    <li>• Valid medical license required</li>
                    <li>• Approval may take 1-3 business days</li>
                    <li>• You'll receive email notification once approved</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-green-600 text-4xl mb-4">✅</div>
                  <h3 className="text-lg font-medium text-green-800 mb-2">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-sm text-green-700">
                    Your doctor registration application has been submitted for admin review. 
                    You'll receive an email notification once your account is approved.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/doctor/login">
                    Go to Login Page
                  </Link>
                </Button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg mt-4">
                {error}
              </div>
            )}

            {/* Login Link */}
            <div className="text-center mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/doctor/login" className="text-blue-600 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Other Registration Options */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Register as different user type:</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href="/register">Patient Registration</Link>
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
