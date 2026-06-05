"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Menu, Sparkles, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/Guest/shop" },
  { label: "About", href: "/Guest/About" },
];

const values = [
  "Carefully selected fabrics",
  "Reliable sourcing support",
  "Quality before quantity",
];

const process = [
  {
    title: "Source",
    text: "We look for fabrics with dependable texture, finish, and practical use.",
  },
  {
    title: "Review",
    text: "Each material is considered for feel, drape, weight, and design purpose.",
  },
  {
    title: "Support",
    text: "Customers can browse, request, and choose fabrics with clearer confidence.",
  },
];

export default function GuestAboutPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171412] transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fbfaf7]/92 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/92">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo1.png"
              alt="KAV Textile"
              width={180}
              height={44}
              className="h-8 w-auto object-contain dark:brightness-0 dark:invert sm:h-9"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#514942] dark:text-neutral-300 md:flex">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[#171412] dark:hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/auth/login")}
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#514942] transition hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10 sm:inline-flex"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="hidden rounded-full bg-[#171412] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2a241f] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 sm:inline-flex"
            >
              Join Now
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 transition hover:bg-black hover:text-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white dark:hover:text-neutral-950 md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-black/10 bg-[#fbfaf7]/98 px-4 py-4 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-neutral-950/98 md:hidden">
            <nav className="grid gap-2 text-sm font-semibold text-[#514942] dark:text-neutral-200">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3 transition hover:bg-black hover:text-white dark:border-white/10 dark:bg-white/8 dark:hover:bg-white dark:hover:text-neutral-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => router.push("/auth/login")} className="rounded-full border border-black/10 px-4 py-3 text-sm font-bold dark:border-white/10">
                Login
              </button>
              <button onClick={() => router.push("/auth/signup")} className="rounded-full bg-[#171412] px-4 py-3 text-sm font-bold text-white dark:bg-white dark:text-neutral-950">
                Join Now
              </button>
            </div>
          </div>
        )}
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8e4f25] dark:border-white/10 dark:bg-white/8 dark:text-[#e4b989] sm:text-xs">
            <Sparkles size={14} />
            About KAV
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            Fabrics chosen with care, purpose, and restraint.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#70665d] dark:text-neutral-400 sm:text-lg sm:leading-8">
            KAV Textile helps creators find fabrics that feel good, look refined, and work beautifully for the pieces they want to make.
          </p>
          <div className="mt-8 grid gap-3 sm:max-w-xl">
            {values.map((value) => (
              <div key={value} className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-neutral-900">
                <CheckCircle2 size={18} className="text-[#8e4f25] dark:text-[#e4b989]" />
                <span className="text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr] sm:gap-4">
          <div className="relative min-h-[280px] overflow-hidden rounded-3xl sm:min-h-[460px]">
            <Image src="/images/fabric-weaving-process-hands.jpg" alt="Hands working with fabric" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" priority />
          </div>
          <div className="grid gap-3 sm:gap-4">
            <div className="relative min-h-[190px] overflow-hidden rounded-3xl sm:min-h-[220px]">
              <Image src="/images/thread-and-yarn-shelves.jpg" alt="Thread and yarn shelves" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
            </div>
            <div className="relative min-h-[190px] overflow-hidden rounded-3xl sm:min-h-[220px]">
              <Image src="/images/fabric-draping-form-art.jpg" alt="Fabric draping form" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white py-12 dark:border-white/10 dark:bg-neutral-900 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8e4f25] dark:text-[#e4b989]">Our approach</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Simple, practical, and quality-led.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {process.map((item) => (
              <article key={item.title} className="rounded-3xl border border-black/10 bg-[#fbfaf7] p-5 dark:border-white/10 dark:bg-neutral-950">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#70665d] dark:text-neutral-400">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center">
        <div className="relative min-h-[320px] overflow-hidden rounded-3xl sm:min-h-[460px]">
          <Image src="/images/designer-woman-working.jpg" alt="Designer working with fabric" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8e4f25] dark:text-[#e4b989]">What we care about</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Better fabric choices make better finished work.</h2>
          <p className="mt-5 text-sm leading-7 text-[#70665d] dark:text-neutral-400 sm:text-base sm:leading-8">
            We focus on fabrics that are useful, beautiful, and easy to understand. The goal is not to overwhelm customers with noise, but to make each option feel clear enough to choose.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/Guest/shop" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#171412] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#2a241f] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200">
              View Fabrics
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
