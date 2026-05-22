import type { Metadata } from "next";
import { AdminPanelClient } from "./admin-panel-client";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminPanelClient>{children}</AdminPanelClient>;
}
