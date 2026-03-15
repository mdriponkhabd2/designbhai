
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Handles the base /admin route by redirecting to the dashboard.
 * The AdminLayout will then handle authentication checks.
 */
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground animate-pulse">Redirecting to admin panel...</p>
    </div>
  );
}
