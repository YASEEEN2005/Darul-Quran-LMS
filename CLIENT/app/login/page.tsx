"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const error = searchParams.get("error");
  const redirect = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (error) {
      let errorMessage = "An error occurred during authentication.";
      if (error === "user_not_found") errorMessage = "Could not verify your Google account.";
      if (error === "not_approved") errorMessage = "Your account is pending admin approval.";
      if (error === "session_expired") errorMessage = "Your session has expired. Please log in again.";

      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      });
    }
  }, [error, toast]);

  const handleGoogleLogin = () => {
    // Redirects browser to backend Google OAuth initiation
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    // Encode the redirect path so the backend could ideally bounce back, but for simplicity:
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 items-center justify-center pb-6">
          <div className="bg-primary/10 p-3 rounded-full mb-2">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your learning portal
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign in with Google
          </Button>
          <div className="text-center text-xs text-muted-foreground mt-4">
            If you are unapproved, contact your administrator.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
