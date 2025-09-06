'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Navbar from '@/components/navbar';
import { XCircle, AlertTriangle, HelpCircle, RefreshCcw, Mail, PhoneCall } from 'lucide-react';

export default function DoctorRejectedPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-12 md:py-16 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <Card className="overflow-hidden">
            <div className="h-2 bg-red-500"></div>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-red-100 p-4 w-20 h-20 flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl">Account Application Rejected</CardTitle>
              <CardDescription className="text-base">
                Your doctor account application was not approved
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <p className="mb-4">
                  Unfortunately, your application to register as a doctor on our Nirmaya Pravasi platform has been rejected.
                  This may be due to one or more of the reasons detailed below.
                </p>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Not Approved</Badge>
              </div>
              
              <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-red-800">Application Status: Rejected</AlertTitle>
                <AlertDescription className="text-red-700">
                  After careful review, our administrative team was unable to approve your doctor account application at this time.
                </AlertDescription>
              </Alert>
              
              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-amber-500" />
                  <span>Possible Reasons for Rejection</span>
                </h3>
                <ul className="space-y-3 pl-5 list-disc text-muted-foreground">
                  <li>Incomplete or insufficient professional documentation</li>
                  <li>Unable to verify medical credentials or qualifications</li>
                  <li>Missing or invalid medical license information</li>
                  <li>Inconsistencies in the provided information</li>
                  <li>Failure to meet minimum experience requirements</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-4">What can you do next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Contact Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Reach out to our support team for detailed information about your application rejection.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <RefreshCcw className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Reapply with Updated Information</h4>
                      <p className="text-sm text-muted-foreground">
                        You may submit a new application after addressing the issues with your initial application.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row justify-between border-t p-6 gap-4">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Contact support at: support@nirmayapravasi.com</span>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
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
