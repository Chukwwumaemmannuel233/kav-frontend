"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../components/site-header";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface JournalPost {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  created_at: string;
}

export default function JournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/journal`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.posts);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader variant="user" />

      <main className="mx-auto max-w-7xl px-4 py-20">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Journal
          </h1>
          <p className="mt-3 text-neutral-500 max-w-xl mx-auto">
            Stories, fabric knowledge, and inspiration behind our collections.
          </p>
        </div>

        {/* Grid */}
        {loading && <p className="text-center">Loading articles…</p>}

        {!loading && posts.length === 0 && (
          <p className="text-center text-neutral-500">
            No journal posts yet.
          </p>
        )}

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/user/Journal/${post.id}`}
              className="group"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-neutral-200">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-widest text-neutral-500">
                  {post.category}
                </p>
                <h3 className="mt-1 text-lg font-medium group-hover:underline">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-400 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
