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
      if (error === "not_approved") errorMessage = "Your request has gone to the Admin. The Admin will check and approve you, then you can proceed.";
      if (error === "session_expired") errorMessage = "Your session has expired. Please log in again.";

      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      });
    }
  }, [error, toast]);

  const handleGoogleLogin = () => {
    // Redirects browser to the internal Next.js Monorepo Google OAuth initiation
    window.location.href = `/api/auth/google`;
  };

  if (error === "not_approved") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
        <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden rounded-2xl">
          <div className="bg-[#184e55] h-2 w-full"></div>
          <CardHeader className="space-y-2 items-center justify-center pb-6 pt-10">
            <div className="bg-amber-100 p-5 rounded-3xl mb-3 shadow-inner">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <CardTitle className="text-[26px] font-bold tracking-tight text-center text-[#111827]">Approval Pending</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 px-10 pb-12 text-center">
            <div className="text-gray-600 space-y-2 pb-2">
              <p className="text-[16px] leading-relaxed font-semibold text-[#184e55]">
                Your request has gone to the Admin.
              </p>
              <p className="text-[15px] leading-relaxed text-gray-500">
                The Admin will check and approve you, then you can proceed into your classes.
              </p>
            </div>
            <Button variant="outline" className="w-full h-12 text-md font-bold text-gray-700 border-gray-200 hover:bg-gray-50 rounded-xl" onClick={() => window.location.href = "/login"}>
              Back to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <Card className="w-full max-w-sm shadow-xl border-0 overflow-hidden rounded-[1.5rem]">
        <div className="bg-[#1a535c] h-2 w-full"></div>
        <CardHeader className="space-y-1 items-center justify-center pb-6 pt-8">
          <div className="bg-[#1a535c]/10 p-4 rounded-full mb-2">
            <GraduationCap className="w-8 h-8 text-[#1a535c]" />
          </div>
          <CardTitle className="text-[28px] font-extrabold tracking-tight text-gray-900">Welcome</CardTitle>
          <CardDescription className="text-center font-medium mt-1">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 px-8 pb-10">
          <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 text-[15px] font-semibold flex items-center shadow-sm" onClick={handleGoogleLogin}>
            <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" viewBox="0 0 488 512"><path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Continue with Google
          </Button>
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
