// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, ReactNode } from "react";
// import { useAdminProfileData } from "@/hooks/useProfile"; // Use your actual hook name
// import { Loader2 } from "lucide-react";

// interface PermissionGuardProps {
//   children: ReactNode;
//   permission: string;
// }

// export default function PermissionGuard({ children, permission }: PermissionGuardProps) {
//   const router = useRouter();
//   const { data: userData, isLoading } = useAdminProfileData();

//   const user = userData?.data || userData;

//   // Logic: ADMIN can see everything. MANAGER must have the string in their array.
//   const hasAccess =
//     // user?.role === "ADMIN" ||
//     user?.permissions?.includes(permission);

//   useEffect(() => {
//     // If loading is done and they have no access, kick them out to dashboard home
//     if (!isLoading && user && !hasAccess) {
//       router.replace("/admin/dashboard/home");
//     }

//     // If not logged in at all, kick to signin
//     if (!isLoading && !user) {
//       router.replace("/admin/signin");
//     }
//   }, [hasAccess, isLoading, user, router]);

//   // Show a loader while checking permissions
//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[70vh]">
//         <Loader2 className="animate-spin text-[#1DA1F2] mb-2" size={32} />
//         <p className="text-gray-500 text-sm">Verifying permissions...</p>
//       </div>
//     );
//   }

//   // If no access, return nothing (useEffect will handle the redirect)
//   if (!hasAccess) return null;

//   return <>{children}</>;
// }


"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAdminProfileData } from "@/hooks/useProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string; 
}

export default function PermissionGuard({ children, permission }: PermissionGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const adminUser = useAuthStore((state) => state.adminUser);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);
  
  const { data: userData, isLoading, isError } = useAdminProfileData();
  const user = userData || adminUser;

  const userRole = user?.role;
  const hasAccess = userRole === "ADMIN" || userRole === "MANAGER";

  useEffect(() => {
    if (!_hasHydrated || isLoading) return;

    // 1. If no session, go to SIGNIN (Fixed Path)
    if (!user || isError) {
      router.replace("/admin/signin"); // 🚀 Must include /admin
      return;
    }

    // 2. Block standard customers
    if (userRole === "CUSTOMER") {
      router.replace("/admin/signin"); 
      return;
    }

    // 3. Unauthorized redirect to HOME (Fixed Path)
    if (!hasAccess) {
      if (pathname !== "/admin/dashboard/home") {
        router.replace("/admin/dashboard/home"); // 🚀 Must include /admin
      }
    }
  }, [_hasHydrated, isLoading, isError, userRole, hasAccess, pathname, router, user]);

  if (!_hasHydrated || (isLoading && !user)) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin text-[#FF7050]" size={32} />
        <p className="text-gray-500 text-sm mt-2">Verifying Credentials...</p>
      </div>
    );
  }

  if (user && hasAccess) {
    return <>{children}</>;
  }

  return null;
}