
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const [isSessionAuth, setIsSessionAuth] = useState<boolean | null>(null);

  // Real-time check if the user is actually an admin in Firestore
  const adminRoleRef = useMemoFirebase(() => 
    user ? doc(db, "admin_roles", user.uid) : null, 
    [db, user]
  );
  const { data: adminData, isLoading: isAdminDataLoading } = useDoc(adminRoleRef);

  useEffect(() => {
    // Check session storage on mount
    const auth = sessionStorage.getItem("admin_auth");
    setIsSessionAuth(auth === "true");
  }, []);

  useEffect(() => {
    // Wait for auth state, session state, and Firestore role to be determined
    if (isUserLoading || isSessionAuth === null || isAdminDataLoading) return;

    // Don't redirect if we are already on the login page
    if (pathname === "/admin/login") return;

    // Strict guard: Must have session auth AND be an admin in Firestore
    if (!isSessionAuth || !user || !adminData) {
      router.push("/admin/login");
    }
  }, [user, isUserLoading, isSessionAuth, isAdminDataLoading, adminData, pathname, router]);

  // Show loading state while checking authentication
  if (isUserLoading || isSessionAuth === null || isAdminDataLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-48 mx-auto" />
          <p className="text-muted-foreground animate-pulse">Verifying administrative privileges...</p>
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

  // Final guard: don't render children if not fully authenticated and verified
  if (!isSessionAuth || !user || !adminData) {
    return null;
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
