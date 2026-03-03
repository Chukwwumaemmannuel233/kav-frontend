"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Minus } from "lucide-react"
import SiteHeader from "../components/site-header"

interface FAQ {
  id: number
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "How do I care for my fabric?",
    answer:
      "Most of our fabrics should be gently hand-washed or machine-washed on a delicate cycle with cold water. We recommend using mild detergent and avoiding bleach. Always check the specific care instructions included with your fabric purchase for detailed guidelines.",
  },
  {
    id: 2,
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy on all unopened, unused fabric purchases. Please contact our customer service team with your order number to initiate a return. Once received and inspected, we'll process your refund within 7-10 business days.",
  },
  {
    id: 3,
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship internationally to most countries. Shipping costs and delivery times vary based on your location. You can view available shipping options during checkout. International orders may be subject to customs duties and taxes.",
  },
  {
    id: 4,
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a confirmation email with a tracking number. You can use this number to track your shipment in real-time through our carrier's website. Most domestic orders arrive within 5-7 business days.",
  },
  {
    id: 5,
    question: "Can I order fabric samples?",
    answer:
      "Yes, we offer fabric sample packs so you can see and feel our materials before making a larger purchase. Samples are available for a small fee and can be ordered through our website. Most sample orders arrive within 3-5 business days.",
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <SiteHeader variant="guest" />

      {/* Hero Section */}
      <section className="px-6 md:px-16 py-12 md:py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Frequently Asked Questions</h1>
        <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
          Find answers to common questions about our products, shipping, and policies. If you can't find what you're
          looking for, feel free to contact us.
        </p>
      </section>

      {/* Search Bar */}
      <section className="px-6 md:px-16 mb-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="px-6 md:px-16 mb-16 flex-1">
        <div className="max-w-2xl mx-auto space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className="border border-neutral-200">
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition"
                >
                  <span className="text-lg font-semibold text-left">{faq.question}</span>
                  {expandedId === faq.id ? (
                    <Minus size={24} className="flex-shrink-0 text-neutral-600" />
                  ) : (
                    <Plus size={24} className="flex-shrink-0 text-neutral-600" />
                  )}
                </button>
                {expandedId === faq.id && (
                  <div className="px-5 pb-5 pt-0 border-t border-neutral-200">
                    <p className="text-neutral-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-600">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-16 py-16 text-center bg-neutral-50">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Can't find your answer?</h2>
        <p className="text-neutral-600 mb-8">Our team is here to help. Reach out to us for any questions.</p>
        <Link href="/user/contact">
          <button className="bg-black text-white px-8 py-3 font-medium hover:bg-neutral-900 transition">
            Contact Us
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 py-8 border-t border-neutral-200 text-center text-sm text-neutral-600">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2025 Fabric Co. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/faq" className="hover:text-neutral-900 transition">
              FAQs
            </Link>
            <Link href="#" className="hover:text-neutral-900 transition">
              Shipping & Returns
            </Link>
            <Link href="#" className="hover:text-neutral-900 transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
