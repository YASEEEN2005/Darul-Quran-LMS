"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowRight, ShieldCheck, Globe, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

function LoginForm() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const error = searchParams.get("error");
  const redirect = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (error) {
      let errorMessage = "An error occurred during authentication.";
      if (error === "user_not_found") errorMessage = "Could not verify your Google account.";
      if (error === "not_approved") errorMessage = "wait for admin approval";
      if (error === "session_expired") errorMessage = "Your session has expired. Please log in again.";

      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      });
    }
  }, [error, toast]);

  const handleGoogleLogin = () => {
    window.location.href = `/api/auth/google`;
  };

  if (error === "not_approved") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#022c22] relative overflow-hidden font-sans">
        {/* Animated background patterns */}
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600 rounded-full blur-[120px] animate-pulse delay-700"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="z-10 w-full max-w-md p-4"
        >
          <Card className="w-full shadow-2xl border-white/10 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>
            <CardHeader className="space-y-4 items-center justify-center pb-6 pt-12">
              <div className="bg-emerald-500/20 p-6 rounded-[2rem] shadow-inner border border-emerald-500/30">
                <ShieldCheck className="w-12 h-12 text-emerald-400" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-center text-white">Approval Pending</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8 px-10 pb-12 text-center">
              <div className="space-y-4">
                <p className="text-lg font-medium text-emerald-100/90 leading-relaxed">
                  Your registration is being reviewed.
                </p>
                <p className="text-sm text-emerald-100/60 leading-relaxed">
                  The Admin will verify your account shortly. Once approved, you'll have full access to our Quranic modules and live sessions.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full h-14 text-md font-bold text-white border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 rounded-2xl transition-all duration-300" 
                onClick={() => window.location.href = "/login"}
              >
                Return to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#011c18] relative overflow-hidden font-sans">
      {/* Premium Background with Image Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center transition-transform duration-[10s] scale-110" 
        style={{ backgroundImage: "url('/bg-login.png')", opacity: '0.4' }}
      ></div>
      <div className="absolute inset-0 z-0 bg-linear-to-tr from-[#011c18] via-[#011c18]/90 to-transparent"></div>

      {/* Decorative Ornaments */}
      <div className="absolute top-10 left-10 z-10 hidden lg:block opacity-40">
        <Globe className="w-24 h-24 text-emerald-500/20" />
      </div>

      <div className="w-full h-full flex flex-col lg:flex-row max-w-7xl mx-auto z-10 px-6 py-10 gap-12 items-center">
        
        {/* Left Side Branding */}
        <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left hidden lg:block"
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/40">
                    <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Darul-Quran</h2>
            </div>
            <h1 className="text-6xl font-extrabold text-white leading-tight mb-6 tracking-tighter">
                Master the Art of <span className="text-emerald-400">Quranic Mastery</span>
            </h1>
            <p className="text-xl text-emerald-100/70 max-w-lg leading-relaxed mb-10">
                A premium learning experience for the modern student of knowledge. Advanced tracking, live sessions, and interactive Tajweed assessments.
            </p>
            <div className="flex gap-6">
                <div className="flex items-center gap-3 text-emerald-100/80">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">Interactive Courses</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-100/80">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">Real-time Progress</span>
                </div>
            </div>
        </motion.div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-white/10 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden p-2">
            <div className="relative bg-[#022c22]/40 rounded-[2rem] overflow-hidden border border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-linear-to-r from-transparent via-emerald-400/50 to-transparent"></div>
                
                <CardHeader className="space-y-2 items-center justify-center pb-8 pt-12">
                  <div className="lg:hidden bg-emerald-500 p-3 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-4xl font-black tracking-tighter text-white">Sign In</CardTitle>
                  <CardDescription className="text-emerald-100/50 text-center font-medium px-4">
                    Unlock your personalized curriculum and track your spiritual journey.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="grid gap-6 px-10 pb-12">
                  <Button 
                    variant="outline" 
                    className="w-full h-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-bold flex items-center justify-center shadow-xl transition-all duration-300 group hover:border-emerald-500/50" 
                    onClick={handleGoogleLogin}
                  >
                    <div className="bg-white p-1.5 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                        <svg className="h-5 w-5" aria-hidden="true" focusable="false" viewBox="0 0 488 512"><path fill="#000000" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                    </div>
                    Continue with Google
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-xs text-white/30 font-medium tracking-wide flex items-center justify-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/50" />
                      SECURE ENTERPRISE AUTHENTICATION
                    </p>
                  </div>
                </CardContent>
            </div>
          </Card>
          
          {/* Footer Branding */}
          <div className="mt-8 text-center text-white/20 text-xs font-bold tracking-[0.2em] uppercase">
            © 2026 DARUL-QURAN LMS • PREMIUM EDUCATION
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#011c18] text-white">Loading Premium Experience...</div>}>
      <LoginForm />
    </Suspense>
  );
}
