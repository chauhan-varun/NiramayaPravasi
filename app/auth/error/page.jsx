"use client";

import { useSearchParams } from "next/navigation";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  const errorMessages = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification failed or the token has expired.",
    Default: "An unexpected error occurred during authentication."
  };
  
  const errorMessage = errorMessages[error] || errorMessages.Default;
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Authentication Error</h1>
            <p className="text-muted-foreground">{errorMessage}</p>
            {error === "AccessDenied" && (
              <p className="text-sm text-muted-foreground mt-2">
                If you're a doctor, your account may be pending approval.
              </p>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/auth/signin">
                Back to Sign In
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
