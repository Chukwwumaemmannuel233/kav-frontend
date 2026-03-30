"use client"

import { useState } from "react"
import SiteHeader from "../../components/site-header"
import Link from "next/link"

export default function ShippingReturnsPage() {
  const [activeTab, setActiveTab] = useState<"shipping" | "returns">("shipping")

  return (
    <main className="min-h-screen bg-background text-neutral-900 dark:text-neutral-100">
      <SiteHeader variant="user" />

      <div className="flex justify-center px-6 md:px-16 py-16 md:py-24">
        <div className="w-full max-w-5xl">
          {/* Page Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-12 text-center">
            Shipping & Returns
          </h1>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-12 border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setActiveTab("shipping")}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "shipping"
                  ? "text-black border-b-2 border-black dark:text-white dark:border-white"
                  : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Shipping Policy
            </button>

            <button
              onClick={() => setActiveTab("returns")}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "returns"
                  ? "text-black border-b-2 border-black dark:text-white dark:border-white"
                  : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Return Policy
            </button>
          </div>

          {/* Shipping Content */}
          {activeTab === "shipping" && (
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  Domestic & International Shipping
                </h2>

                <p className="text-neutral-700 dark:text-neutral-400 mb-8">
                  We offer shipping to a wide range of domestic and international destinations.
                  All orders are processed within 1–2 business days.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: "Standard Shipping",
                      text: "5–7 business days. Flat rate of $8. Free for orders over $100.",
                    },
                    {
                      title: "Express Shipping",
                      text: "2–3 business days. Flat rate of $20.",
                    },
                    {
                      title: "International Shipping",
                      text: "7–21 business days. Calculated at checkout.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-bold mb-2">{item.title}</h3>
                        <p className="text-neutral-700 dark:text-neutral-400">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Returns Content */}
          {activeTab === "returns" && (
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  Returns & Exchanges
                </h2>

                <p className="text-neutral-700 dark:text-neutral-400 mb-8">
                  You can return most items within 30 days of delivery.
                </p>

                <div className="space-y-8">
                  {[
                    {
                      title: "Eligibility",
                      text: "Items must be in original condition. Custom items cannot be returned.",
                    },
                    {
                      title: "How to Start a Return",
                      text: "Contact support with your order number to receive instructions.",
                    },
                    {
                      title: "Refunds",
                      text: "Refunds are processed within 3–5 business days.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-bold mb-2">{item.title}</h3>
                        <p className="text-neutral-700 dark:text-neutral-400">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Button */}
              <div className="pt-8">
                <Link href="/user/contact">
                  <button className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 font-semibold hover:bg-neutral-900 dark:hover:bg-neutral-200 transition rounded-lg">
                    Start a Return
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="flex justify-center px-6">
          <div className="text-center max-w-5xl">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              © 2025 K.A.V Textile. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}