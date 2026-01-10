"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
// import SiteHeader from "../../components/site-header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/pages/auth/login");
    }
  }, [router]);

  return (
    <>
      {/* <SiteHeader variant="user" /> */}
      {children}
    </>
  );
}
