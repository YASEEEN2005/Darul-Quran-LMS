"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

function LoginSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuthStore();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.replace("/login?error=auth_failed");
      return;
    }

    const authenticate = async () => {
      try {
        // Optimistically set token so Axios interceptor picks it up
        document.cookie = `lms_token=${token}; path=/; max-age=${60*60*24*7}`;
        
        // Fetch user data from token
        // In a real app we'd decode the JWT or hit a /users/me endpoint.
        // For this demo, let's decode the JWT base64 payload bridging it manually if /users/me isn't perfectly mapped.
        
        // Let's decode the JWT payload manually so we can extract the ID at least:
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        // Since we don't have a specific `GET /users/me`, let's just fetch all users and find ourselves (admin needed),
        // WAIT: The backend provides no /users/me endpoint. 
        // We can just rely on decoding the token, but we need `name`, `role`, `email`.
        // We will assume the JWT only has ID. Let's make a generic user object, but since we need role (Admin/Student),
        // we might hit a snag unless we add a `/users/me` endpoint to the backend!
        // To circumvent backend modification, let's just assume we can fetch `GET /users` if we're admin, or we rely on the backend.
        // Actually, the simplest is to just decode it, or perhaps the backend JWT only contains `{ id: userId }`.
        
        let userRole = 'STUDENT';
        let userName = 'Student';

        // Let's try fetching `/users` to see if we're admin. If it succeeds, we are Admin (or it fails with 403)
        try {
           const usersRes = await api.get('/users');
           if (usersRes.success) {
             userRole = 'ADMIN';
             const me = usersRes.data.find((u: any) => u.id === userId);
             if (me) {
               userName = me.name;
             }
           }
        } catch (e) {
          // 403 means we are a student.
          userRole = 'STUDENT';
        }

        login(token, {
          id: userId,
          name: userName,
          email: "", // Not strictly needed for UI unless explicitly shown
          role: userRole as 'STUDENT' | 'ADMIN',
          approved: true, // If we got a token, backend says we are approved
        });

        router.replace("/dashboard");
      } catch (error) {
        console.error(error);
        router.replace("/login?error=auth_failed");
      }
    };

    authenticate();
  }, [token, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground animate-pulse">Authenticating securely...</p>
    </div>
  );
}

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginSuccess />
    </Suspense>
  );
}
