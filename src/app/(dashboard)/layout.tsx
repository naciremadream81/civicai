"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This layout ensures we're authenticated before showing dashboard pages
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // In a real app, you would check authentication here
    // For now, this is just a placeholder
    // const session = getSession();
    // if (!session) {
    //   router.push("/auth/signin");
    // }
  }, [router]);

  return <>{children}</>;
}
