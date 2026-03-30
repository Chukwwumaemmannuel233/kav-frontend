"use client";

import SiteHeader from "../../components/site-header";
import { FaInstagram, FaFacebookF, FaTwitter, FaTiktok } from "react-icons/fa";
import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <main className="bg-background min-h-screen">
      <SiteHeader variant="guest" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Terms of Use</h1>
        <p className="text-neutral-400 mb-12">Last Updated: October 26, 2023</p>

        {/* Section 1: Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-neutral-400 leading-relaxed">
            Welcome to K.A.V Textile. By accessing or using our service, you
            agree to be bound by these terms. If you disagree with any part of
            the terms, then you may not access the service. This agreement
            outlines the rules and regulations for the use of K.A.V Textile
            website.
          </p>
        </section>

        {/* Section 2: User Accounts & Responsibilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            2. User Accounts & Responsibilities
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            When you create an account with us, you must provide us information
            that is accurate, complete, and current at all times. Failure to do
            so constitutes a breach of the Terms, which may result in immediate
            termination of your account on our Service. You are responsible for
            safeguarding the password that you use to access the Service and for
            any activities or actions under your password.
          </p>
        </section>

        {/* Section 3: Intellectual Property Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            3. Intellectual Property Rights
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            The Service and its original content, features, and functionality
            are and will remain the exclusive property of K.A.V Textile and its
            licensors. Our trademarks and trade dress may not be used in
            connection with any product or service without the prior written
            consent of K.A.V Textile. All textile patterns, designs, and product
            images are the intellectual property of our company.
          </p>
        </section>

        {/* Section 4: Prohibited Uses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Prohibited Uses</h2>
          <p className="text-neutral-400 leading-relaxed mb-4">
            You may use our site only for lawful purposes. You may not use our
            site:
          </p>
          <ul className="list-disc list-inside space-y-3 text-neutral-400">
            <li>
              In any way that violates any applicable national or international
              law or regulation.
            </li>
            <li>
              To transmit, or procure the sending of, any advertising or
              promotional material, including any "junk mail," "chain letter,"
              "spam," or any other similar solicitation.
            </li>
            <li>
              To impersonate or attempt to impersonate the Company, a Company
              employee, another user, or any other person or entity.
            </li>
            <li>
              To engage in any other conduct that restricts or inhibits anyone's
              use or enjoyment of the site.
            </li>
          </ul>
        </section>

        {/* Section 5: Product Information & Disclaimers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            5. Product Information & Disclaimers
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            We make every effort to display as accurately as possible the colors
            and images of our products that appear at the store. We cannot
            guarantee that your computer monitor's display of any color will be
            accurate. All descriptions of products or product pricing are
            subject to change at any time without notice, at our sole
            discretion.
          </p>
        </section>

        {/* Section 6: Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            In no event shall K.A.V Textile, nor its directors, employees,
            partners, agents, suppliers, or affiliates, be liable for any
            indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill,
            or other intangible losses, resulting from your access to or use of
            or inability to access or use the Service.
          </p>
        </section>

        {/* Section 7: Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Governing Law</h2>
          <p className="text-neutral-400 leading-relaxed">
            These Terms shall be governed and construed in accordance with the
            laws of the jurisdiction in which the company is established,
            without regard to its conflict of laws provisions.
          </p>
        </section>

        {/* Section 8: Contact Information */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
          <p className="text-neutral-400 leading-relaxed">
            Questions about the Terms of Use should be sent to us at
            support@K.A.V Textile.com.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-neutral-600 mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-bold mb-2">K.A.V TEXTILE</h3>
              <p className="text-neutral-400 text-sm">
                Quality fabrics for the modern creator.
              </p>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/user/privacy"
                    className="
                        text-neutral-600 
                        dark:text-neutral-400
                        hover:text-black 
                        dark:hover:text-white
                        text-sm 
                        transition
    "
                  >
                    Privacy Policy
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/user/shipping-info"
                    className="text-neutral-600 
                        dark:text-neutral-400
                        hover:text-black 
                        dark:hover:text-white
                        text-sm 
                        transition"
                  >
                    Shipping Info
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/user/shipping-returns"
                    className="text-neutral-600 
                        dark:text-neutral-400
                        hover:text-black 
                        dark:hover:text-white
                        text-sm 
                        transition"
                  >
                    Returns & Exchanges
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>

              <div className="flex gap-4 text-2xl">
                <a
                  href="#"
                  className="text-pink-500 hover:text-pink-600 transition"
                >
                  <FaInstagram />
                </a>

                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-500 transition"
                >
                  <FaTwitter />
                </a>

                <a
                  href="#"
                  className="text-blue-700 hover:text-blue-800 transition"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="#"
                  className="text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 transition"
                >
                  <FaTiktok />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400 text-sm">
            <p>© 2025 K.A.V TEXTILE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
