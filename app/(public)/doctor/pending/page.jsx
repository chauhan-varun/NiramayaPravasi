'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/navbar';

export default function DoctorPendingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
            <CardDescription>Your doctor account is awaiting admin review</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="rounded-full bg-yellow-50 p-3 w-16 h-16 mx-auto mb-4">
              <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="mb-4">
              Thank you for registering as a doctor on our platform. Your application is currently being reviewed by our admin team.
            </p>
            <p className="text-muted-foreground">
              This process typically takes 1-2 business days. You'll receive an email notification once your account has been approved.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
