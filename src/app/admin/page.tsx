// src/app/admin/page.tsx
"use client";

import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <AdminRouteGuard>
      <AdminDashboard />
    </AdminRouteGuard>
  );
}
