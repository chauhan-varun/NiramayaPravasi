"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("doctor");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error || "");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        role: selectedRole,
      });
      
      if (result?.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
      } else {
        // Redirect based on role
        router.push(callbackUrl);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Pass role in the custom state parameter
    signIn("google", { 
      callbackUrl,
      redirect: true,
      state: JSON.stringify({ role: selectedRole })
    });
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        
        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="credentials">Email & Password</TabsTrigger>
            <TabsTrigger value="oauth">Google</TabsTrigger>
          </TabsList>
          
          <TabsContent value="credentials">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select 
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="oauth">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oauth-role">Role</Label>
                <select 
                  id="oauth-role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
              
              <Button 
                type="button" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
