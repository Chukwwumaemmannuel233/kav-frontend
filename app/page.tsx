"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "./components/ui/button";
import SiteHeader from "./components/site-header";
import { Instagram, Facebook, Twitter, Music2 } from "lucide-react";
import { useLoading } from "@/lib/loading-context";

export default function Home() {
  const { isInitialLoading } = useLoading();

  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleSignup = async () => {
    setSignupLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    window.location.href = "/pages/auth/signup";
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    window.location.href = "/pages/auth/login";
  };

  /* =====================
     FRAMER MOTION VARIANTS
  ====================== */

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -60 }, // 👈 FROM LEFT
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const socialIconVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://media.istockphoto.com/id/2192806905/photo/luxury-pearl-fabric-background-3d-render.jpg?s=612x612&w=0&k=20&c=G32DnzcZZS4RRMpagl41rqes1ZW7Ky7fOAoa5d-k9nE=')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* CONTENT */}
        {!isInitialLoading && (
          <motion.div
            className="relative z-10 max-w-xl w-full px-4 sm:px-6 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* BRAND */}
            <motion.img
              variants={itemVariants}
              src="/images/logo1.png"
              alt="KAV Textiles Logo"
              className="mx-auto mb-6 w-40 sm:w-48 md:w-56 object-contain"
            />

            {/* TAGLINE */}
            <motion.p
              variants={itemVariants}
              className="text-white/70 text-sm sm:text-base mb-8"
            >
              Premium fabrics crafted with intention and excellence.
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
            >
              <Button
                onClick={handleSignup}
                className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-white/90"
              >
                {signupLoading ? "Please wait…" : "Sign up"}
              </Button>

              <button
                onClick={handleLogin}
                className="px-6 py-2 rounded-full border border-white/60 text-white text-sm font-medium hover:bg-white/10"
              >
                {loginLoading ? "Please wait…" : "Log in"}
              </button>
            </motion.div>

            {/* SOCIAL ICONS */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center gap-4"
            >
              {[Instagram, Facebook, Twitter, Music2].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  variants={socialIconVariants}
                  whileHover={{ y: -4, scale: 1.15 }}
                  className="text-white/60 hover:text-white"
                >
                  <div className="p-2 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10">
                    <Icon size={18} />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
