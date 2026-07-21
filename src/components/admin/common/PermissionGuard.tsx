"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAdminProfileData } from "@/hooks/useProfile"; // Use your actual hook name
import { Loader2 } from "lucide-react";

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
}

export default function PermissionGuard({ children, permission }: PermissionGuardProps) {
  const router = useRouter();
  const { data: userData, isLoading } = useAdminProfileData();
  
  const user = userData?.data || userData;

  // Logic: ADMIN can see everything. MANAGER must have the string in their array.
  const hasAccess = 
    // user?.role === "ADMIN" || 
    user?.permissions?.includes(permission);

  useEffect(() => {
    // If loading is done and they have no access, kick them out to dashboard home
    if (!isLoading && user && !hasAccess) {
      router.replace("/admin/dashboard/home");
    }
    
    // If not logged in at all, kick to signin
    if (!isLoading && !user) {
      router.replace("/admin/signin");
    }
  }, [hasAccess, isLoading, user, router]);

  // Show a loader while checking permissions
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin text-[#1DA1F2] mb-2" size={32} />
        <p className="text-gray-500 text-sm">Verifying permissions...</p>
      </div>
    );
  }

  // If no access, return nothing (useEffect will handle the redirect)
  if (!hasAccess) return null;

  return <>{children}</>;
}