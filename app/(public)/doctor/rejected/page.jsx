'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/navbar';

export default function DoctorRejectedPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Account Rejected</CardTitle>
            <CardDescription>Your doctor account application was not approved</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="rounded-full bg-red-50 p-3 w-16 h-16 mx-auto mb-4">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="mb-4">
              Unfortunately, your application to register as a doctor on our platform has been rejected.
            </p>
            <p className="text-muted-foreground">
              This may be due to incomplete information or verification issues. For more information, please contact our support team.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
            <Link href="/contact">
              <Button>Contact Support</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
