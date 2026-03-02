"use client";

import Link from "next/link";
import Image from "next/image";

export default function AuthHeader() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-neutral-200 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
        <Link href="/">
          <Image
            src="/images/logo1.png"
            alt="Fabric Logo"
            width={400}
            height={120}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}