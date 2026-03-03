"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, ShoppingBag, MapPin, CreditCard, Settings, LogOut } from "lucide-react"

interface SidebarItem {
  name: string
  href: string
  icon: React.ReactNode
}

const sidebarItems: SidebarItem[] = [
  { name: "Profile", href: "/user/profile", icon: <User size={20} /> },
  { name: "Order History", href: "/user/orders", icon: <ShoppingBag size={20} /> },
  { name: "Addresses", href: "/user/addresses", icon: <MapPin size={20} /> },
  { name: "Payment Methods", href: "/user/payment", icon: <CreditCard size={20} /> },
  { name: "Settings", href: "/user/settings", icon: <Settings size={20} /> },
]

export default function ProfileSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="w-full md:w-64 md:border-r md:border-neutral-200 px-6 py-8 md:py-12 md:px-8 bg-neutral-50 md:bg-white">
      <h2 className="text-xl font-bold mb-8 md:hidden">Menu</h2>
      <nav className="space-y-4 md:space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded transition ${
              pathname === item.href ? "bg-neutral-200 font-medium" : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <button className="w-full mt-12 md:mt-8 flex items-center gap-3 px-4 py-3 rounded text-neutral-700 hover:bg-neutral-100 transition">
        <LogOut size={20} />
        Log Out
      </button>
    </aside>
  )
}
