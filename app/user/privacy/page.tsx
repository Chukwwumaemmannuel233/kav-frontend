"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import SiteHeader from "../../components/site-header"

const tableOfContents = [
  { id: "introduction", label: "Introduction" },
  { id: "information-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Information" },
  { id: "how-we-share", label: "How We Share Your Information" },
  { id: "data-security", label: "Data Security & Retention" },
  { id: "your-rights", label: "Your Rights & Choices" },
  { id: "cookies", label: "Use of Cookies" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Information" },
]

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-50% 0px -50% 0px" },
    )

    tableOfContents.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => {
      tableOfContents.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) observer.unobserve(element)
      })
    }
  }, [])

  return (
    <main className="bg-white min-h-screen">
      <SiteHeader variant="guest" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-sm font-semibold mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm transition px-3 py-2 rounded ${
                      activeSection === item.id
                        ? "bg-neutral-300 text-neutral-900 font-medium"
                        : "text-neutral-600 bg-neutral-100 hover:text-neutral-900 hover:bg-neutral-200"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Header */}
            <div>
              <h1 className="text-5xl font-bold mb-2">PRIVACY POLICY</h1>
              <p className="text-sm text-neutral-600">Last Updated: October 26, 2023</p>
            </div>

            {/* Introduction */}
            <section id="introduction">
              <h2 className="text-2xl font-bold mb-4">INTRODUCTION</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                Welcome to K.A.V Textile. We are committed to protecting your personal information and your right to
                privacy. If you have any questions or concerns about our policy, or our practices with regards to your
                personal information, please contact us.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                We take your privacy very seriously. In this privacy policy, we seek to explain to you in the clearest
                way possible what information we collect, how we use it, and what rights you have in relation to it. We
                hope you take some time to read through it carefully, as it is important.
              </p>
            </section>

            {/* Information We Collect */}
            <section id="information-collect">
              <h2 className="text-2xl font-bold mb-4">INFORMATION WE COLLECT</h2>
              <p className="text-neutral-700 leading-relaxed mb-6">
                We collect personal information that you voluntarily provide to us when you register on the website,
                express an interest in obtaining information about us or our products and services, when you participate
                in activities on the website or otherwise when you contact us.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <ul className="space-y-2 text-neutral-700">
                    <li className="flex gap-3">
                      <span>•</span>
                      <span>
                        <strong>Contact Data:</strong> such as your first and last name, email address, postal address,
                        and phone number.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span>•</span>
                      <span>
                        <strong>Account Data:</strong> such as your username, password, and purchase history.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span>•</span>
                      <span>
                        <strong>Payment Data:</strong> We collect data necessary to process your payment if you make
                        purchases, such as your payment instrument (such as a credit card number), and the security code
                        associated with your payment instrument.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section id="how-we-use">
              <h2 className="text-2xl font-bold mb-4">HOW WE USE YOUR INFORMATION</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">We use the information we collect or receive:</p>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex gap-3">
                  <span>•</span>
                  <span>To facilitate account creation and logon process.</span>
                </li>
                <li className="flex gap-3">
                  <span>•</span>
                  <span>To send you marketing and promotional communications.</span>
                </li>
                <li className="flex gap-3">
                  <span>•</span>
                  <span>To send administrative information to you.</span>
                </li>
                <li className="flex gap-3">
                  <span>•</span>
                  <span>To fulfill and manage your orders.</span>
                </li>
                <li className="flex gap-3">
                  <span>•</span>
                  <span>To post testimonials with your consent.</span>
                </li>
                <li className="flex gap-3">
                  <span>•</span>
                  <span>To request feedback and to contact you about your use of our website.</span>
                </li>
              </ul>
            </section>

            {/* How We Share Your Information */}
            <section id="how-we-share">
              <h2 className="text-2xl font-bold mb-4">HOW WE SHARE YOUR INFORMATION</h2>
              <p className="text-neutral-700 leading-relaxed">
                We only share information with your consent, to comply with laws, to provide you with services, to
                protect your rights, or to fulfill business obligations. We may process or share your data that we hold
                based on the following legal basis: vendors, consultants, and other third-party service providers.
              </p>
            </section>

            {/* Data Security & Retention */}
            <section id="data-security">
              <h2 className="text-2xl font-bold mb-4">DATA SECURITY & RETENTION</h2>
              <p className="text-neutral-700 leading-relaxed">
                We have implemented appropriate technical and organizational security measures designed to protect the
                security of any personal information we process. We will only keep your personal information for as long
                as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is
                required or permitted by law.
              </p>
            </section>

            {/* Your Rights & Choices */}
            <section id="your-rights">
              <h2 className="text-2xl font-bold mb-4">YOUR RIGHTS & CHOICES</h2>
              <p className="text-neutral-700 leading-relaxed">
                In some regions (like the European Economic Area and the UK), you have certain rights under applicable
                data protection laws. These may include the right (i) to request access and obtain a copy of your
                personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your
                personal information; and (iv) if applicable, to data portability.
              </p>
            </section>

            {/* Use of Cookies */}
            <section id="cookies">
              <h2 className="text-2xl font-bold mb-4">USE OF COOKIES</h2>
              <p className="text-neutral-700 leading-relaxed">
                We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store
                information. Specific information about how we use such technologies and how you can refuse certain
                cookies is set out in our Cookie Policy.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section id="changes">
              <h2 className="text-2xl font-bold mb-4">CHANGES TO THIS POLICY</h2>
              <p className="text-neutral-700 leading-relaxed">
                We may update this privacy policy from time to time. The updated version will be indicated by an updated
                "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you
                to review this privacy policy frequently to be informed of how we are protecting your information.
              </p>
            </section>

            {/* Contact Information */}
            <section id="contact" className="pb-8">
              <h2 className="text-2xl font-bold mb-4">CONTACT INFORMATION</h2>
              <p className="text-neutral-700 leading-relaxed mb-6">
                If you have questions or comments about this policy, you may email us at privacy@K.A.V Textile.com or by
                post to:
              </p>
              <div className="bg-neutral-50 p-6 rounded text-sm text-neutral-700 space-y-1">
                <p>K.A.V Textile</p>
                <p>123 Brown strt</p>
                <p>Oshodi, Lagos 78701</p>
                <p>Nigeria</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-600">
          <div>© 2025 K.A.V Textile. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-neutral-900 transition">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-neutral-900 transition">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-neutral-900 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
