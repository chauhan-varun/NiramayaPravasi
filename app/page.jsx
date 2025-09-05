'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, UserCog, Stethoscope, Users } from 'lucide-react';
import Navbar from '@/components/navbar';

export default function Home() {
 
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center text-center pb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Nirmaya Pravasi
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mb-8">
            Comprehensive healthcare management platform for patients and healthcare providers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Patient Portal</CardTitle>
              <CardDescription>
                Access your medical records, book appointments, and manage your healthcare
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <p className="text-sm text-muted-foreground mb-4">
                For patients seeking convenient access to healthcare services
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Register</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Doctor Portal</CardTitle>
              <CardDescription>
                Manage patients, appointments, and medical records
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <p className="text-sm text-muted-foreground mb-4">
                For healthcare providers to efficiently manage patient care
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild className="w-full">
                <Link href="/doctor/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/doctor/register">Register</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>
                Manage system settings, users, and organizational data
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <p className="text-sm text-muted-foreground mb-4">
                For administrators to oversee and manage the platform
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/login">Login</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="flex justify-center mt-16">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-4">
              If you're having trouble accessing your account or need assistance,
              please contact our support team.
            </p>
            <Button variant="outline" className="mt-2">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
