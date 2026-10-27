import type { Metadata } from "next";

import { AdminPageClient } from "@/features/admin/components/admin-page-client";

export const metadata: Metadata = { title: "Resumen" };

export default function AdminPage() {
  return <AdminPageClient />;
}
