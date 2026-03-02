"use client"

import { useState } from "react"
import SiteHeader from "../../../components/site-header"
import Link from "next/link"

export default function ShippingReturnsPage() {
  const [activeTab, setActiveTab] = useState<"shipping" | "returns">("shipping")

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader variant="user" />

      <div className="flex justify-center px-6 md:px-16 py-16 md:py-24">
        <div className="w-full max-w-5xl">
          {/* Page Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-12 text-center">Shipping & Returns</h1>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-12 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab("shipping")}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "shipping" ? "text-black border-b-2 border-black" : "text-neutral-600 hover:text-black"
              }`}
            >
              Shipping Policy
            </button>
            <button
              onClick={() => setActiveTab("returns")}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "returns" ? "text-black border-b-2 border-black" : "text-neutral-600 hover:text-black"
              }`}
            >
              Return Policy
            </button>
          </div>

          {/* Shipping Content */}
          {activeTab === "shipping" && (
            <div className="space-y-12">
              {/* Domestic & International Shipping */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Domestic & International Shipping</h2>
                <p className="text-neutral-700 mb-8">
                  We offer shipping to a wide range of domestic and international destinations. Please review the
                  options below to find the best method for your location. All orders are processed within 1-2 business
                  days.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-bold mb-2">Standard Shipping</h3>
                      <p className="text-neutral-700">5-7 business days. Flat rate of $8. Free for orders over $100.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-bold mb-2">Express Shipping</h3>
                      <p className="text-neutral-700">2-3 business days. Flat rate of $20.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-bold mb-2">International Shipping</h3>
                      <p className="text-neutral-700">
                        7-21 business days. Calculated at checkout based on destination.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Returns Content */}
          {activeTab === "returns" && (
            <div className="space-y-12">
              {/* Returns & Exchanges */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Returns & Exchanges</h2>
                <p className="text-neutral-700 mb-8">
                  We want you to be completely satisfied with your purchase. You can return most items for a full refund
                  or exchange within 30 days of delivery.
                </p>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-bold mb-2">Eligibility</h3>
                      <p className="text-neutral-700">
                        Items must be in their original, uncut condition. Custom-cut fabrics and sale items are final
                        sale and cannot be returned.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-bold mb-2">How to Start a Return</h3>
                      <p className="text-neutral-700">
                        Please contact our customer service team with your order number to receive a return
                        authorization and shipping label.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-bold mb-2">Refunds</h3>
                      <p className="text-neutral-700">
                        Once we receive your return, please allow 3-5 business days for processing. Refunds will be
                        issued to the original payment method.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Start a Return Button */}
              <div className="pt-8">
                <Link href="/pages/user/contact">
                  <button className="bg-black text-white px-8 py-3 font-semibold hover:bg-neutral-900 transition rounded-lg">
                    Start a Return
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-12 bg-neutral-50">
        <div className="flex justify-center px-6">
          <div className="text-center max-w-5xl">
            <p className="text-neutral-600 text-sm">© 2025 K.A.V Textile. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
