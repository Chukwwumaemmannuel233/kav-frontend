"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  // CreditCard,
  ChevronRight,
} from "lucide-react";
import SiteHeader from "../../components/site-header";
import { getProfile } from "../../../lib/profileApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AccountPage() {
  const [user, setUser] = useState<{ name: string; image?: string }>({
    name: "",
    image: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser({ name: profile.name, image: profile.image });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    toast("Are you sure you want to log out?", {
      description: "You will need to log in again to access your account.",
      action: {
        label: "Log out",
        onClick: () => {
          // ✅ Clear auth data
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // ✅ Success feedback
          toast.success("Logged out successfully 👋");

          // ✅ Redirect
          setTimeout(() => {
            router.push("/auth/login");
          }, 1000);
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          // Optional: just close toast or do nothing
          console.log("Logout cancelled");
        },
      },
    });
  };

  const accountOptions = [
    {
      id: "details",
      title: "Account Details",
      description: "Manage your name, email, and password.",
      icon: User,
      href: "/user/account-details",
    },
    {
      id: "orders",
      title: "Order History",
      description: "View and track your past orders.",
      icon: ShoppingBag,
      href: "/user/order-history",
    },
    {
      id: "favorites",
      title: "My Favorites",
      description: "Access your saved items.",
      icon: Heart,
      href: "/user/favorites",
    },
    {
      id: "addresses",
      title: "Saved Addresses",
      description: "Manage your shipping and billing addresses.",
      icon: MapPin,
      href: "/user/addresses",
    },
    // {
    //   id: "payment",
    //   title: "Payment Methods",
    //   description: "Manage your saved credit cards.",
    //   icon: CreditCard,
    //   href: "/user/payment-method",
    // },
  ];

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader variant="user" />

      {/* Hero Section */}
      <section className="px-6 md:px-8 py-12 md:py-16 text-center max-w-5xl mx-auto flex flex-col items-center gap-4">
        {/* Profile Image */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="flex items-center justify-center h-full w-full text-gray-500">
              No Image
            </span>
          )}
        </div>

        {/* Welcome Text */}
        <p className="text-neutral-700">
          Welcome back,{" "}
          <span className="font-semibold">{user.name || "User"}</span>! Manage
          your details, orders, and favorites.
        </p>
      </section>

      {/* Account Options Grid */}
      <section className="px-6 md:px-8 pb-24 max-w-5xl mx-auto">
        <div className="space-y-4">
          {accountOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Link key={option.id} href={option.href}>
                <div className="flex items-center gap-4 p-6 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                  {/* Icon Circle */}
                  <div className="flex-shrink-0 w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-neutral-700" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-neutral-900">
                      {option.title}
                    </h3>
                    <p className="text-neutral-600">{option.description}</p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-6 h-6 text-neutral-400" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Log Out */}
      <section className="px-6 md:px-8 pb-16 max-w-5xl mx-auto text-center border-t border-neutral-200 pt-8">
        <button
          onClick={handleLogout}
          className="text-neutral-700 hover:text-neutral-900 underline font-medium transition-colors"
        >
          Log Out
        </button>
      </section>
    </main>
  );
}
