"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api"; // your Axios instance with token interceptor
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  // const [loading, setLoading] = useState(true);
  // const [admin, setAdmin] = useState<any>(null);

  const [isEditing, setIsEditing] = useState(false);

  // ================= FETCH ADMIN PROFILE =================
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await API.get("/admin/profile"); // calls backend route
        const data = res.data;

        if (data.success) {
          setAdmin({
            name: data.admin.name,
            email: data.admin.email,
            image: data.admin.image || "/admin-profile.png",
          });
        }
      } catch (err) {
        console.error("Failed to fetch admin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center">

          {/* PROFILE IMAGE */}
          <div className="w-40 h-40 rounded-full overflow-hidden mb-8 border">
            <img
              src={admin?.image}
              alt="Admin profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* NAME */}
          <h1 className="text-4xl font-bold mb-3">{admin?.name}</h1>

          {/* EMAIL */}
          <p className="text-neutral-600 mb-4">{admin?.email}</p>

          {/* ROLE (static, since your backend doesn’t return role except in query) */}
          <div className="bg-neutral-200 px-4 py-1.5 rounded-full text-sm font-medium mb-12">
            Admin
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
             <Link href="/admin/settings">
            <Button
              isLoading={isEditing}
              loadingText="Loading..."
              className="bg-black text-white px-8 py-3 font-medium hover:bg-neutral-900 transition"
            >
              Edit Profile
            </Button>
            </Link>
            </div>
        </div>
      </main>
    </div>
  );
}
