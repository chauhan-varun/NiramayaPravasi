'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle, AlertTriangle, HelpCircle, RefreshCcw, Mail, PhoneCall, ShieldX } from 'lucide-react';

export default function DoctorRejectedPage() {
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
            <div className="h-1 bg-red-500"></div>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center animate-pulse opacity-20">
                    <ShieldX className="h-16 w-16 text-red-500" />
                  </div>
                  <div className="rounded-full bg-red-50 p-5 w-24 h-24 flex items-center justify-center">
                    <ShieldX className="h-12 w-12 text-red-500" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold">Application Rejected</CardTitle>
              <CardDescription className="text-base mt-2">
                Your doctor account application was not approved
              </CardDescription>
          </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <p className="mb-4 text-muted-foreground">
                  Unfortunately, your application to register as a doctor on our Nirmaya Pravasi platform has been rejected.
                  This may be due to one or more of the reasons detailed below.
                </p>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 font-medium">Application Not Approved</Badge>
              </div>
              
              <Alert variant="destructive" className="bg-red-50/80 text-red-900 border-red-200 shadow-sm">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-red-800 font-semibold">Application Status: Rejected</AlertTitle>
                <AlertDescription className="text-red-700 mt-1">
                  After careful review, our administrative team was unable to approve your doctor account application at this time. 
                  You can contact our support team for more information and guidance on how to proceed.
                </AlertDescription>
              </Alert>
              
              <div className="border rounded-lg p-6 bg-amber-50/50">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-amber-800">
                  <HelpCircle className="h-5 w-5 text-amber-500" />
                  <span>Possible Reasons for Rejection</span>
                </h3>
                <ul className="space-y-3 pl-6 list-disc text-amber-700">
                  <li>Incomplete or insufficient professional documentation</li>
                  <li>Unable to verify medical credentials or qualifications</li>
                  <li>Missing or invalid medical license information</li>
                  <li>Inconsistencies in the provided information</li>
                  <li>Failure to meet minimum experience requirements</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-transparent">
                <h3 className="font-semibold text-base mb-4">What can you do next?</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-2.5">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Contact Support</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reach out to our support team for detailed information about your application rejection and specific feedback.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-2.5">
                      <RefreshCcw className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Reapply with Updated Information</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        You may submit a new application after addressing the issues with your initial application. 
                        Make sure to include all required documentation and credentials.
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
                <Link href="/doctor/register" className="w-full sm:w-auto">
                  <Button className="w-full">Apply Again</Button>
                </Link>
              </div>
            </CardFooter>
        </Card>
        </div>
      </div>
    </div>
  );
}
