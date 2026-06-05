"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Circle,
  Info,
  LayoutDashboard,
  Mail,
  ShoppingBag,
  Sparkles,
  Star,
  User,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  const choices = [
    {
      title: "Go to Dashboard",
      description: "Manage your account and orders",
      icon: LayoutDashboard,
      path: "/user/dashboard",
    },
    {
      title: "Explore Fabrics",
      description: "Browse fabric collections",
      icon: ShoppingBag,
      path: "/user/fabrics",
    },
    {
      title: "About Us",
      description: "Learn more about KAV Textiles",
      icon: Info,
      path: "/user/about",
    },
    {
      title: "Contact",
      description: "Get in touch with us",
      icon: Mail,
      path: "/user/contact",
    },
    {
      title: "New Arrivals",
      description: "Check our latest fabrics",
      icon: Star,
      path: "/user/new-arrivals",
    },
    {
      title: "Profile Update",
      description: "Edit your account details",
      icon: User,
      path: "/user/profile",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28, rotateX: 8 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#130f0c] text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/thread-and-yarn-shelves.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(13,10,8,0.94),rgba(13,10,8,0.72),rgba(13,10,8,0.52))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(228,185,137,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.14),transparent_24%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [-8, -4, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 top-20 hidden h-60 w-44 overflow-hidden rounded-[2rem] border border-white/16 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur lg:block"
        >
          <Image src="/images/belgian-linen-fabric.jpg" alt="" fill sizes="180px" className="object-cover" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [9, 5, 9] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-16 bottom-16 hidden h-72 w-52 overflow-hidden rounded-[2rem] border border-white/16 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur lg:block"
        >
          <Image src="/images/fabric-draping-form-art.jpg" alt="" fill sizes="220px" className="object-cover" />
        </motion.div>
      </div>

      <motion.section
        className="relative mx-auto grid min-h-screen max-w-7xl content-center gap-9 px-4 py-12 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e4b989] backdrop-blur">
            <Sparkles size={15} />
            Welcome
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
            Where would you like to start?
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
            Choose a place to begin. You can always move around from your account area later.
          </p>
          <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/48">
            <Circle size={8} fill="currentColor" />
            KAV Textile
          </div>
        </motion.div>

        <motion.div variants={containerVariants} className="grid gap-3 perspective-[1200px] sm:grid-cols-2 lg:gap-4">
          {choices.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.button
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -8, rotateX: 4, rotateY: index % 2 === 0 ? -5 : 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(item.path)}
                className="group relative flex min-h-[138px] transform-gpu items-start justify-between gap-4 overflow-hidden rounded-3xl border border-white/14 bg-white/12 p-5 text-left text-white shadow-2xl shadow-black/16 backdrop-blur-xl transition hover:border-[#e4b989]/40 hover:bg-white/18"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/14 opacity-80" />
                <div>
                  <span className="relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14 text-[#e4b989] ring-1 ring-white/12">
                    <Icon size={21} />
                  </span>
                  <h2 className="relative font-semibold">{item.title}</h2>
                  <p className="relative mt-2 text-sm leading-6 text-white/62">{item.description}</p>
                </div>
                <ArrowRight size={18} className="relative mt-2 shrink-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </motion.button>
            );
          })}
        </motion.div>
      </motion.section>
    </main>
  );
}
