"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import API from "@/lib/api"; // your Axios instance
import {
  Bell,
  User,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useNotification } from "@/lib/NotificationContext";
import { useMessage } from "@/lib/MessageContext";
import Image from "next/image";

export default function AdminHeader() {
  const pathname = usePathname();
  const { notificationUnreadCount } = useNotification();
  const { unreadCount } = useMessage();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const isActive = (path: string) => pathname === path;

  // Fetch admin profile image
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/admin/profile");
        if (res.data.success && res.data.admin.image) {
          setProfileImage(res.data.admin.image);
        }
      } catch (err) {
        console.error("Failed to fetch admin profile image:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <header className="border-b border-neutral-200 sticky top-0 z-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/admin/dashboard"
            className="hover:opacity-80 transition"
          >
            <Image
              src="/images/logo1.png"
              alt="Fabric Logo"
              width={200}
              height={10}
              className="w-15 h-auto"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link
              href="/admin/dashboard"
              className={`text-sm font-medium hover:opacity-70 transition ${
                isActive("/admin/dashboard")
                  ? "text-black border-b-2 border-black pb-1"
                  : "text-neutral-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/orders"
              className={`text-sm font-medium hover:opacity-70 transition ${
                isActive("/admin/orders")
                  ? "text-black border-b-2 border-black pb-1"
                  : "text-neutral-600"
              }`}
            >
              Orders
            </Link>
            <Link
              href="/admin/products"
              className={`text-sm font-medium hover:opacity-70 transition ${
                isActive("/admin/products")
                  ? "text-black border-b-2 border-black pb-1"
                  : "text-neutral-600"
              }`}
            >
              Products
            </Link>
            <Link
              href="/admin/customers"
              className={`text-sm font-medium hover:opacity-70 transition ${
                isActive("/admin/customers")
                  ? "text-black border-b-2 border-black pb-1"
                  : "text-neutral-600"
              }`}
            >
              Customers
            </Link>
            <Link
              href="/admin/messages"
              className={`relative text-sm font-medium hover:opacity-70 transition ${
                isActive("/admin/messages")
                  ? "text-black border-b-2 border-black pb-1"
                  : "text-neutral-600"
              }`}
            >
              Messages
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/settings"
              className="hover:opacity-70 transition"
            >
              <Settings size={20} />
            </Link>
            <Link
              href="/admin/notification"
              className="hover:opacity-70 transition relative"
            >
              <Bell size={20} />

              {notificationUnreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full">
                  {notificationUnreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin/profile"
              className="hover:opacity-70 transition"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Admin profile"
                  className="w-8 h-8 rounded-full object-cover border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center">
                  <User size={16} />
                </div>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white z-40">
        <div className="flex items-center justify-around">
          <Link
            href="/admin/dashboard"
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition ${
              isActive("/admin/dashboard")
                ? "text-black"
                : "text-neutral-600"
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/orders"
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition ${
              isActive("/admin/orders")
                ? "text-black"
                : "text-neutral-600"
            }`}
          >
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Link>
          <Link
            href="/admin/products"
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition ${
              isActive("/admin/products")
                ? "text-black"
                : "text-neutral-600"
            }`}
          >
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link
            href="/admin/customers"
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition ${
              isActive("/admin/customers")
                ? "text-black"
                : "text-neutral-600"
            }`}
          >
            <Users size={20} />
            <span>Customers</span>
          </Link>
          <Link
            href="/admin/messages"
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium ${
              isActive("/admin/messages")
                ? "text-black"
                : "text-neutral-600"
            }`}
          >
            <div className="relative">
              <MessageSquare size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <span>Messages</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
