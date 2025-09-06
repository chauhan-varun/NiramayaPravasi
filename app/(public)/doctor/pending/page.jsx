'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/navbar';
import { Clock, CheckCircle, Mail, PhoneCall, ArrowRight } from 'lucide-react';

export default function DoctorPendingPage() {
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    // Simulate changing progress over time
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 2;
        if (newProgress >= 95) {
          clearInterval(interval);
          return 95;
        }
        return newProgress;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-12 md:py-16 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <Card className="overflow-hidden">
            <div className="h-2 bg-yellow-400"></div>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-yellow-100 p-4 w-20 h-20 flex items-center justify-center">
                  <Clock className="h-10 w-10 text-yellow-600" />
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl">Account Pending Approval</CardTitle>
              <CardDescription className="text-base">
                Your doctor account application is currently under review
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <p className="mb-4">
                  Thank you for registering as a doctor on our Nirmaya Pravasi platform. Our admin team is reviewing your application to ensure all qualifications meet our requirements.
                </p>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Review</Badge>
              </div>
              
              <div className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Application Status</h3>
                  <Badge variant="outline">Pending</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Review Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="border-t pt-4 grid gap-2">
                  <div className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Application submitted successfully</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Documents received and verified</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>Pending admin review (typically takes 1-2 business days)</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-4">What happens next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Email Notification</h4>
                      <p className="text-sm text-muted-foreground">
                        You'll receive an email once your account is approved.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Automatic Redirect</h4>
                      <p className="text-sm text-muted-foreground">
                        Once approved, you can log in and access your doctor dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row justify-between border-t p-6 gap-4">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Need help? Contact support at: support@nirmayapravasi.com</span>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">Return to Home</Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full">Contact Support</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
