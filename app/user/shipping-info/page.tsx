"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import SiteHeader from "../../components/site-header"
import Link from "next/link"

interface ExpandedSection {
  [key: string]: boolean
}

export default function ShippingInfoPage() {
  const [expandedSections, setExpandedSections] = useState<ExpandedSection>({
    domestic: true,
    international: false,
    processing: false,
    faq: false,
  })

  const [email, setEmail] = useState("")

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader variant="user" />

      {/* Hero Section */}
      <section className="px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16 border-b border-neutral-200">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4">Shipping Information</h1>
          <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
            We are committed to getting your orders to you safely and efficiently. Below you'll find everything you need
            to know about our shipping policies and options.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Domestic Shipping Options */}
          <div className="border-b border-neutral-200">
            <button
              onClick={() => toggleSection("domestic")}
              className="w-full flex items-center justify-between py-4 md:py-6 hover:bg-neutral-50 transition gap-2"
            >
              <h2 className="text-base md:text-lg lg:text-xl font-bold text-left">Domestic Shipping Options</h2>
              {expandedSections.domestic ? (
                <ChevronUp size={20} className="text-neutral-600 flex-shrink-0" />
              ) : (
                <ChevronDown size={20} className="text-neutral-600 flex-shrink-0" />
              )}
            </button>
            {expandedSections.domestic && (
              <div className="pb-4 md:pb-6 space-y-3 md:space-y-4">
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                  We offer several domestic shipping options to meet your needs. Please see the table below for details
                  on costs and estimated delivery times. Orders over $150 qualify for free standard shipping.
                </p>
                <div className="overflow-x-auto border border-neutral-200 rounded text-sm md:text-base">
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left font-semibold">Method</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left font-semibold">Cost</th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left font-semibold">Est. Delivery</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-200">
                        <td className="px-3 md:px-6 py-3 md:py-4">Standard Shipping</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">$8.00</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">5-7 Days</td>
                      </tr>
                      <tr>
                        <td className="px-3 md:px-6 py-3 md:py-4">Express Shipping</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">$25.00</td>
                        <td className="px-3 md:px-6 py-3 md:py-4">1-2 Days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* International Shipping */}
          <div className="border-b border-neutral-200">
            <button
              onClick={() => toggleSection("international")}
              className="w-full flex items-center justify-between py-4 md:py-6 hover:bg-neutral-50 transition gap-2"
            >
              <h2 className="text-base md:text-lg lg:text-xl font-bold text-left">International Shipping</h2>
              {expandedSections.international ? (
                <ChevronUp size={20} className="text-neutral-600 flex-shrink-0" />
              ) : (
                <ChevronDown size={20} className="text-neutral-600 flex-shrink-0" />
              )}
            </button>
            {expandedSections.international && (
              <div className="pb-4 md:pb-6">
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                  We ship to select international locations. International shipping costs are calculated at checkout
                  based on destination and weight. Delivery times typically range from 7-21 business days. Please note
                  that international orders may be subject to customs duties and taxes.
                </p>
              </div>
            )}
          </div>

          {/* Processing & Delivery Times */}
          <div className="border-b border-neutral-200">
            <button
              onClick={() => toggleSection("processing")}
              className="w-full flex items-center justify-between py-4 md:py-6 hover:bg-neutral-50 transition gap-2"
            >
              <h2 className="text-base md:text-lg lg:text-xl font-bold text-left">Processing & Delivery Times</h2>
              {expandedSections.processing ? (
                <ChevronUp size={20} className="text-neutral-600 flex-shrink-0" />
              ) : (
                <ChevronDown size={20} className="text-neutral-600 flex-shrink-0" />
              )}
            </button>
            {expandedSections.processing && (
              <div className="pb-4 md:pb-6">
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                  All orders are processed within 1-2 business days (excluding weekends and holidays). Once your order
                  ships, you'll receive a tracking number via email. Please allow 1-2 additional business days for
                  carriers to update tracking information after shipment.
                </p>
              </div>
            )}
          </div>

          {/* Frequently Asked Questions */}
          <div className="border-b border-neutral-200">
            <button
              onClick={() => toggleSection("faq")}
              className="w-full flex items-center justify-between py-4 md:py-6 hover:bg-neutral-50 transition gap-2"
            >
              <h2 className="text-base md:text-lg lg:text-xl font-bold text-left">Frequently Asked Questions</h2>
              {expandedSections.faq ? (
                <ChevronUp size={20} className="text-neutral-600 flex-shrink-0" />
              ) : (
                <ChevronDown size={20} className="text-neutral-600 flex-shrink-0" />
              )}
            </button>
            {expandedSections.faq && (
              <div className="pb-4 md:pb-6 space-y-3 md:space-y-4">
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">
                    Can I change my address after ordering?
                  </h3>
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                    Please contact us immediately if you need to change your shipping address. We can only modify
                    addresses for orders that haven't shipped yet.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">Do you offer tracking?</h3>
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                    Yes, all orders include tracking. You'll receive tracking information via email once your order
                    ships.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">
                    What if my package is lost or damaged?
                  </h3>
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                    Contact our customer service team immediately with photos and proof of the issue. We'll work with
                    the carrier to resolve it.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16 bg-neutral-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">Stay in the loop</h2>
          <p className="text-sm md:text-base text-neutral-600 mb-6 md:mb-8 leading-relaxed">
            Sign up for our newsletter to receive updates on new arrivals and exclusive offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 md:gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-neutral-300 rounded focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 md:px-6 py-2 md:py-3 bg-black text-white font-semibold text-sm md:text-base rounded hover:bg-neutral-900 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 px-4 md:px-8 lg:px-16 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="text-center md:text-left">
              <h3 className="font-bold mb-1 md:mb-2 text-sm md:text-base">K.A.V Textile</h3>
              <p className="text-neutral-600 text-xs md:text-sm">Quality fabrics for the modern creator.</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Need Help?</h4>
              <div className="flex flex-wrap gap-4 md:gap-6 justify-center text-xs md:text-sm text-neutral-600">
                <Link href="/user/shipping-returns" className="hover:text-black transition">
                  Returns
                </Link>
                <Link href="/user/contact" className="hover:text-black transition">
                  Contact Us
                </Link>
                <Link href="/user/privacy" className="hover:text-black transition">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-200 pt-6 md:pt-8 text-center text-xs md:text-sm text-neutral-600">
            <p>© 2025 K.A.V Textile. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
