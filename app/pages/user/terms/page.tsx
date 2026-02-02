"use client"

import SiteHeader from "../../../components/site-header"
import Link from "next/link"

export default function TermsOfUsePage() {
  return (
    <main className="bg-white">
      <SiteHeader variant="guest" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Terms of Use</h1>
        <p className="text-neutral-600 mb-12">Last Updated: October 26, 2023</p>

        {/* Section 1: Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-neutral-700 leading-relaxed">
            Welcome to TextileBrand. By accessing or using our service, you agree to be bound by these terms. If you
            disagree with any part of the terms, then you may not access the service. This agreement outlines the rules
            and regulations for the use of TextileBrand's website.
          </p>
        </section>

        {/* Section 2: User Accounts & Responsibilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. User Accounts & Responsibilities</h2>
          <p className="text-neutral-700 leading-relaxed">
            When you create an account with us, you must provide us information that is accurate, complete, and current
            at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination
            of your account on our Service. You are responsible for safeguarding the password that you use to access the
            Service and for any activities or actions under your password.
          </p>
        </section>

        {/* Section 3: Intellectual Property Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. Intellectual Property Rights</h2>
          <p className="text-neutral-700 leading-relaxed">
            The Service and its original content, features, and functionality are and will remain the exclusive property
            of TextileBrand and its licensors. Our trademarks and trade dress may not be used in connection with any
            product or service without the prior written consent of TextileBrand. All textile patterns, designs, and
            product images are the intellectual property of our company.
          </p>
        </section>

        {/* Section 4: Prohibited Uses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Prohibited Uses</h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            You may use our site only for lawful purposes. You may not use our site:
          </p>
          <ul className="list-disc list-inside space-y-3 text-neutral-700">
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>
              To transmit, or procure the sending of, any advertising or promotional material, including any "junk
              mail," "chain letter," "spam," or any other similar solicitation.
            </li>
            <li>
              To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other
              person or entity.
            </li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the site.</li>
          </ul>
        </section>

        {/* Section 5: Product Information & Disclaimers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Product Information & Disclaimers</h2>
          <p className="text-neutral-700 leading-relaxed">
            We make every effort to display as accurately as possible the colors and images of our products that appear
            at the store. We cannot guarantee that your computer monitor's display of any color will be accurate. All
            descriptions of products or product pricing are subject to change at any time without notice, at our sole
            discretion.
          </p>
        </section>

        {/* Section 6: Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
          <p className="text-neutral-700 leading-relaxed">
            In no event shall TextileBrand, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to
            or use of or inability to access or use the Service.
          </p>
        </section>

        {/* Section 7: Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Governing Law</h2>
          <p className="text-neutral-700 leading-relaxed">
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the
            company is established, without regard to its conflict of laws provisions.
          </p>
        </section>

        {/* Section 8: Contact Information */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
          <p className="text-neutral-700 leading-relaxed">
            Questions about the Terms of Use should be sent to us at support@textilebrand.com.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-bold mb-2">TextileBrand</h3>
              <p className="text-neutral-600 text-sm">Quality fabrics for the modern creator.</p>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-neutral-600 hover:text-black text-sm transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns" className="text-neutral-600 hover:text-black text-sm transition">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-returns" className="text-neutral-600 hover:text-black text-sm transition">
                    Returns & Exchanges
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-neutral-600 hover:text-black transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-600 hover:text-black transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7z" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-600 hover:text-black transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path
                      d="M16.5 7.5C16.5 5.57 14.93 4 13 4s-3.5 1.57-3.5 3.5S11.07 11 13 11s3.5-1.57 3.5-3.5z"
                      fill="white"
                    />
                    <path
                      d="M9.5 13c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8 text-center text-neutral-600 text-sm">
            <p>© 2025 TextileBrand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
