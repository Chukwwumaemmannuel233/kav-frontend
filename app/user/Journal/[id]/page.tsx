"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import SiteHeader from "../../../components/site-header";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function JournalDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/journal/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPost(data.post);
      });
  }, [id]);

  if (!post) return <p className="text-center py-20">Loading…</p>;

  return (
    <div className="bg-white min-h-screen">
      <SiteHeader variant="user" />

      <main className="mx-auto max-w-3xl px-4 py-20">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="aspect-video overflow-hidden rounded-lg mb-10"
        >
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            {post.category}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold">
            {post.title}
          </h1>
        </motion.div>

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="mt-8 space-y-6 text-neutral-700 leading-relaxed"
        >
          {post.content.split("\n\n").map((para: string, i: number) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {para}
            </motion.p>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
