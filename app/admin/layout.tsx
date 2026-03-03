"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../lib/auth";
import AdminHeader from "../components/admin-header";
import { NotificationProvider } from "@/lib/NotificationContext";
import { MessageProvider } from "@/lib/MessageContext";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();

    if (!user || user.role !== "admin") {
      router.replace("/auth/admin-login");
    }
  }, [router]);

  return (
    <>
     
      <NotificationProvider>
        <MessageProvider>
           <AdminHeader />
      {children}
      </MessageProvider>
      </NotificationProvider>
    </>
  );
}
