
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // Basic session-based auth check
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuth(true);
    } else {
      if (pathname !== "/admin/login") {
        setIsAuth(false);
        router.push("/admin/login");
      } else {
        setIsAuth(true); // Technically we are on the login page, so layout can render
      }
    }
  }, [router, pathname]);

  if (isAuth === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-48 mx-auto" />
          <p className="text-muted-foreground animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If we are on login page, don't show sidebar
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-background font-body">
        {children}
        <Toaster />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background font-body">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
