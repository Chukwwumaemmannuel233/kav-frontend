"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import API from "@/lib/api";
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
      <header className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40 bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/admin/dashboard" className="hover:opacity-80 transition">
            <Image
              src="/images/logo1.png"
              alt="Fabric Logo"
              width={200}
              height={10}
              className="w-15 h-auto h-8 dark:invert"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            {[
              { href: "/admin/dashboard", label: "Dashboard" },
              { href: "/admin/orders", label: "Orders" },
              { href: "/admin/products", label: "Products" },
              { href: "/admin/customers", label: "Customers" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  isActive(item.href)
                    ? "text-black border-b-2 border-black pb-1 dark:text-white dark:border-white"
                    : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Messages */}
            <Link
              href="/admin/messages"
              className={`relative text-sm font-medium transition ${
                isActive("/admin/messages")
                  ? "text-black border-b-2 border-black pb-1 dark:text-white dark:border-white"
                  : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
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
              className="text-neutral-700 dark:text-neutral-300 hover:opacity-70 transition"
            >
              <Settings size={20} />
            </Link>

            <Link
              href="/admin/notification"
              className="relative text-neutral-700 dark:text-neutral-300 hover:opacity-70 transition"
            >
              <Bell size={20} />
              {notificationUnreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full">
                  {notificationUnreadCount}
                </span>
              )}
            </Link>

            <Link href="/admin/profile">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Admin profile"
                  className="w-8 h-8 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center">
                  <User size={16} className="text-neutral-700 dark:text-neutral-200" />
                </div>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-40">
        <div className="flex items-center justify-around">
          {[
            { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
            { href: "/admin/products", icon: Package, label: "Products" },
            { href: "/admin/customers", icon: Users, label: "Customers" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition ${
                isActive(href)
                  ? "text-black dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}

          {/* Messages */}
          <Link
            href="/admin/messages"
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium ${
              isActive("/admin/messages")
                ? "text-black dark:text-white"
                : "text-neutral-600 dark:text-neutral-400"
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