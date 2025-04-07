// pages/admin.tsx or app/admin/page.tsx (depending on your routing)
import AdminRouteGuard from "@/components/admin/AdminRouteGuard"; // If using auth protection
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <AdminRouteGuard>
      <AdminDashboard />
    </AdminRouteGuard>
  );
}
