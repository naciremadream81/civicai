"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, this would check the user's role from session/auth
    // For now, redirecting to contractor dashboard as default
    // You would replace this with actual role-based routing:
    // const role = session?.user?.role;
    // if (role === "ADMIN") router.push("/admin/dashboard");
    // else if (role === "INSPECTOR") router.push("/inspector/dashboard");
    // else router.push("/contractor/dashboard");
    
    router.push("/contractor/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--navy)]"></div>
    </div>
  );
}
