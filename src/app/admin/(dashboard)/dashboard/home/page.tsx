import HomePageWrapper from "./HomePageWrapper";
import PermissionGuard from "@/components/admin/common/PermissionGuard";

export default function page() {
  return (
    <PermissionGuard permission="Dashboard">
      <HomePageWrapper />
    </PermissionGuard>
  );
}
