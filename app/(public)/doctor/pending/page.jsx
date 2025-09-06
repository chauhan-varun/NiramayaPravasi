'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, Mail, PhoneCall, ArrowRight, AlertCircle, Hourglass } from 'lucide-react';

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
    <div className="min-h-screen bg-background bg-gradient-to-b from-muted/50 to-background">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/nirmaya-pravasi-logo.png" 
            alt="Nirmaya Pravasi Logo" 
            className="w-10 h-10 object-contain"
          />
          <span className="font-bold text-xl text-primary hidden sm:inline-block">Nirmaya Pravasi</span>
        </Link>
      </div>
      
      <div className="container py-16 md:py-20 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <Card className="overflow-hidden border shadow-md">
            <div className="h-1 bg-yellow-400"></div>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-20">
                    <Hourglass className="h-16 w-16 text-yellow-500" />
                  </div>
                  <div className="rounded-full bg-yellow-50 p-5 w-24 h-24 flex items-center justify-center">
                    <Hourglass className="h-12 w-12 text-yellow-500" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold">Account Pending Approval</CardTitle>
              <CardDescription className="text-base mt-2">
                Your doctor account application is currently under review
              </CardDescription>
          </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <p className="mb-4 text-muted-foreground">
                  Thank you for registering as a doctor on our Nirmaya Pravasi platform. Our admin team is reviewing your application to ensure all qualifications meet our requirements.
                </p>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-medium">Application In Review</Badge>
              </div>
              
              <div className="border rounded-lg p-6 space-y-4 bg-card shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-base">Application Status</h3>
                  <Badge variant="outline" className="font-medium">Pending</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Review Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" indicatorClassName="bg-yellow-500" />
                </div>
                
                <div className="border-t pt-4 grid gap-3">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium">Application submitted</span>
                      <p className="text-xs text-muted-foreground mt-0.5">Your application has been received</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium">Initial verification</span>
                      <p className="text-xs text-muted-foreground mt-0.5">Basic information has been verified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="rounded-full bg-yellow-100 p-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-yellow-600" />
                    </div>
                    <div>
                      <span className="font-medium">Admin review in progress</span>
                      <p className="text-xs text-muted-foreground mt-0.5">Typically takes 1-2 business days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-transparent">
                <h3 className="font-semibold text-base mb-4">What happens next?</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-2.5">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Email Notification</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        You'll receive an email notification when your account is approved with login instructions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-2.5">
                      <ArrowRight className="h-5 w-5 text-blue-600" />
            </div>
                    <div>
                      <h4 className="font-medium text-sm">Access Your Dashboard</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Once approved, you can log in and access your doctor dashboard with all features.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-2.5">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Additional Information</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        We may contact you if we need additional information to verify your credentials.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row justify-between border-t p-6 gap-4 bg-muted/5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <PhoneCall className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Need help? Contact support at: <span className="text-primary font-medium">support@nirmayapravasi.com</span></span>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <Link href="/" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">Return to Home</Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button className="w-full">Contact Support</Button>
            </Link>
              </div>
          </CardFooter>
        </Card>
        </div>
      </div>
    </div>
  );
}
