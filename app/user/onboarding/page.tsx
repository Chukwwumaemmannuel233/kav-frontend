"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Info,
  Mail,
  Star,
  User,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  // Updated choices
  const choices = [
    {
      title: "Go to Dashboard",
      description: "Manage your account and orders",
      icon: LayoutDashboard,
      path: "/pages/user/dashboard",
    },
    {
      title: "Explore Fabrics",
      description: "Browse premium textile collections",
      icon: ShoppingBag,
      path: "/pages/user/fabrics",
    },
    {
      title: "About Us",
      description: "Learn more about KAV Textiles",
      icon: Info,
      path: "/pages/user/about",
    },
    {
      title: "Contact",
      description: "Get in touch with us",
      icon: Mail,
      path: "/pages/user/contact",
    },
    {
      title: "New Arrivals",
      description: "Check our latest fabrics",
      icon: Star,
      path: "/pages/user/new-arrivals",
    },
    {
      title: "Profile Update",
      description: "Edit your account details",
      icon: User,
      path: "/pages/user/profile",
    },
  ];

  // FRAMER MOTION VARIANTS
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://media.istockphoto.com/id/2192806905/photo/luxury-pearl-fabric-background-3d-render.jpg?s=612x612&w=0&k=20&c=G32DnzcZZS4RRMpagl41rqes1ZW7Ky7fOAoa5d-k9nE=')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-5xl px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
       
        <motion.p
          variants={itemVariants}
          className="text-white/70 mb-10 text-sm sm:text-base"
        >
          Where would you like to start?
        </motion.p>

        {/* Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {choices.map((item, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(item.path)}
              className="bg-white/10 border border-white/20 backdrop-blur rounded-xl p-6 text-left text-white hover:bg-white/20 transition"
            >
              <item.icon className="mb-4 text-white" size={28} />
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-white/70 text-sm">{item.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
