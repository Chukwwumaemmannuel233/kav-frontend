"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Home,
  Store,
  Info,
  Mail,
  X,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import API from "@/lib/api";
import Image from "next/image";

interface SiteHeaderProps {
  variant?: "guest" | "user";
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
// USER HEADER
function SiteHeaderUser() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  // State for user info
  const [user, setUser] = useState<{ name: string; image?: string }>({
    name: "",
    image: "",
  });

  // Fetch user profile from backend (or localStorage token)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/user/profile"); // Axios handles token automatically

        if (data?.user) {
          setUser({
            name: data.user.name || "",
            image: data.user.image || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        // Axios interceptor already handles token expired / deactivated redirect
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <header className="border-b border-neutral-200 sticky top-0 z-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link
            href="/pages/user/dashboard"
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

          <nav className="hidden md:flex gap-8 items-center">
            <Link
              href="/pages/user/fabrics"
              className="text-sm font-medium hover:opacity-70 transition"
            >
              Fabrics
            </Link>
            <Link
              href="/pages/user/about"
              className="text-sm font-medium hover:opacity-70 transition"
            >
              About
            </Link>
            <Link
              href="/pages/user/contact"
              className="text-sm font-medium hover:opacity-70 transition"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/pages/user/profile"
              className="hover:opacity-70 transition"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              )}
            </Link>

            <Link
              href="/pages/user/cart"
              className="hover:opacity-70 transition relative"
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white z-40">
        <div className="flex items-center justify-around">
          <Link
            href="/pages/user/dashboard"
            className="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            href="/pages/user/fabrics"
            className="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition"
          >
            <Store size={20} />
            <span>Shop</span>
          </Link>
          <Link
            href="/pages/user/about"
            className="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition"
          >
            <Info size={20} />
            <span>About</span>
          </Link>
          <Link
            href="/pages/user/contact"
            className="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition"
          >
            <Mail size={20} />
            <span>Contact</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

// GUEST HEADER
// function SiteHeaderGuest() {
//   return (
//     <>
//       <header className="border-b border-neutral-200 sticky top-0 z-40 bg-white">
//         <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
//           <Link
//             href="/"
//             className="text-2xl font-bold tracking-tight hover:opacity-70 transition"
//           >
//             FABRIC.
//           </Link>
//           <nav className="hidden md:flex gap-8 items-center">
//             <Link
//               href="/shop"
//               className="text-sm font-medium hover:opacity-70 transition"
//             >
//               Shop
//             </Link>
//             <Link
//               href="/story"
//               className="text-sm font-medium hover:opacity-70 transition"
//             >
//               Our Story
//             </Link>
//             <Link
//               href="/journal"
//               className="text-sm font-medium hover:opacity-70 transition"
//             >
//               Journal
//             </Link>
//           </nav>
//         </div>
//       </header>

//       {/* Mobile Bottom Nav */}
//       <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white z-40">
//         <div className="flex items-center justify-around">
//           <Link
//             href="/"
//             className="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition"
//           >
//             <Home size={20} />
//             <span>Home</span>
//           </Link>
//           <Link
//             href="/shop"
//             className="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition"
//           >
//             <Store size={20} />
//             <span>Shop</span>
//           </Link>
//           <Link
//             href="/story"
//             className="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition"
//           >
//             <Info size={20} />
//             <span>About</span>
//           </Link>
//           <Link
//             href="/journal"
//             className="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium hover:opacity-70 transition"
//           >
//             <Mail size={20} />
//             <span>Contact</span>
//           </Link>
//         </div>
//       </nav>
//     </>
//   );
// }

// MAIN EXPORT
export default function SiteHeader({ variant = "guest" }: SiteHeaderProps) {
  return variant === "user" ? <SiteHeaderUser /> : null;
}
