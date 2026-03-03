"use client";

import { useState } from "react";
import SiteHeader from "../../components/site-header";
import { Shield, Hammer, Star } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";

export default function AboutPage() {
  const [isExplore, setIsExplore] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExplore(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/pages/user/fabrics");
  };

  /* =====================
     ANIMATION VARIANTS
  ====================== */

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const slideLeft: Variants = {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const slideRight: Variants = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <main className="bg-white">
      <SiteHeader variant="user" />

      {/* ================= HERO ================= */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative w-full flex items-center justify-center py-28 md:py-36"
      >
        <div className="absolute inset-0">
          <img
            src="/images/natural-linen-blend-fabric.jpg"
            alt="Luxury fabric"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Woven with Purpose
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto">
            Discover the story behind our threads, crafted with passion and
            integrity.
          </p>
        </div>
      </motion.section>

      {/* ================= OUR STORY ================= */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-6 md:px-16 py-20"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideLeft}>
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-neutral-700 mb-4 leading-relaxed">
              Founded on a passion for authentic materials, our journey began
              with a commitment to quality and traditional techniques.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Our story is woven with sustainability and timeless craftsmanship.
            </p>
          </motion.div>

          <motion.div variants={slideRight}>
            <img
              src="/images/thread-and-yarn-shelves.jpg"
              alt="Thread shelves"
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* ================= CORE VALUES ================= */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-6 md:px-16 py-20 bg-neutral-50"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">Our Core Values</h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[ 
              {
                icon: <Shield size={48} />,
                title: "Sustainability",
                text: "We source eco-friendly materials to protect our planet.",
              },
              {
                icon: <Hammer size={48} />,
                title: "Artisanal Craft",
                text: "We preserve heritage techniques in every thread.",
              },
              {
                icon: <Star size={48} />,
                title: "Uncompromising Quality",
                text: "We ensure durability and timeless elegance.",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="flex justify-center mb-6 text-neutral-800">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-neutral-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================= TEAM - VICTOR ================= */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-6 md:px-16 py-20"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideLeft}>
            <img
              src="/images/CEO.png"
              alt="Victor Ugwu"
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
          </motion.div>

          <motion.div variants={slideRight}>
            <h3 className="text-3xl font-bold mb-2">Victor Ugwu</h3>
            <p className="text-neutral-600 font-medium mb-6">
              CEO & Founder
            </p>
            <p className="text-neutral-700 leading-relaxed">
              With a lifelong passion for textiles, Victor founded the company
              to bring sustainable, high-quality fabrics to the forefront of
              design.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ================= TEAM - JOHN ================= */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-6 md:px-16 py-20 bg-neutral-50"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideLeft}>
            <h3 className="text-3xl font-bold mb-2">John Smith</h3>
            <p className="text-neutral-600 font-medium mb-6">
              COO & Head of Operations
            </p>
            <p className="text-neutral-700 leading-relaxed">
              John ensures that our operations align with our core values,
              perfecting sourcing and supply chain excellence.
            </p>
          </motion.div>

          <motion.div variants={slideRight}>
            <img
              src="/images/john-smith-coo-portrait.jpg"
              alt="John Smith"
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* ================= MISSION ================= */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-6 md:px-16 py-20 text-center"
      >
        <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
        <p className="text-neutral-700 max-w-2xl mx-auto mb-10">
          Our mission is to create textiles that tell a story of conscious
          craftsmanship while respecting the planet.
        </p>

        <Button
          onClick={handleSubmit}
          isLoading={isExplore}
          loadingText="Loading..."
          className="bg-black text-white px-8 py-3 font-medium hover:bg-neutral-900 transition"
        >
          Explore Our Collection
        </Button>
      </motion.section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-neutral-200 px-6 md:px-16 py-20 bg-white text-center">
        <div className="flex justify-center gap-6 text-sm text-neutral-600 mb-4">
          <a href="/pages/user/terms" className="hover:text-black transition">
            Terms of Service
          </a>
          <a href="/pages/user/privacy" className="hover:text-black transition">
            Privacy Policy
          </a>
        </div>
        <p className="text-sm text-neutral-600">
          © 2025 K.A.V TEXTILE. All rights reserved.
        </p>
      </footer>
    </main>
  );
}