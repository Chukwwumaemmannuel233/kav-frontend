"use client";

import React, { useState } from "react";
import Link from "next/link";
import SiteHeader from "../../components/site-header";
import { FaInstagram, FaFacebookF, FaTwitter, FaTiktok } from "react-icons/fa";
import { Button } from "../../components/ui/button";
import { toast } from "sonner"; // ✅ Sonner toast
import API from "@/lib/api"; // adjust the path if needed

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isContact, setIsContact] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContact(true);

    try {
      const { data } = await API.post("/contact/contact", formData);
      toast.success(data.message || "Message sent!");

      // Clear the form inputs
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsContact(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <SiteHeader variant="user" />

      {/* Contact Content */}
      <section className="px-6 md:px-16 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <div className="space-y-12">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Get in Touch
                </h1>

                <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed">
                  We'd love to hear from you. Reach out with any questions,
                  inquiries, or just to say hello.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                  Email
                </p>

                <a
                  href="mailto:support@textileco.com"
                  className="text-lg hover:opacity-70 transition"
                >
                  support@kavtextile.com
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                  Phone
                </p>

                <a
                  href="tel:+12345678900"
                  className="text-lg hover:opacity-70 transition"
                >
                  +1 (234) 567-8900
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                  Address
                </p>

                <p className="text-lg">
                  123 Fabric Lane, Suite 100, Weavertown, TX 54321
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                  Business Hours
                </p>

                <p className="text-lg">
                  Monday - Friday, 9:00 AM - 6:00 PM EST
                </p>
              </div>

              <div>
                <p className="font-semibold text-neutral-500 dark:text-neutral-400 uppercase text-xs mb-2">
                  Follow Us
                </p>

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

            {/* Right Column - Contact Form */}
            <div className="p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-8">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border rounded-lg
                            border-neutral-300 bg-white text-black
                            dark:border-neutral-700 dark:bg-neutral-900 dark:text-white
                            focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-300
                            transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border 
                          border-neutral-300 bg-white text-black
                          dark:border-neutral-700 dark:bg-neutral-900 dark:text-white
                          focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-300
                          transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Question about an order"
                    className="w-full px-4 py-3 rounded-lg border 
                        border-neutral-300 bg-white text-black
                        dark:border-neutral-700 dark:bg-neutral-900 dark:text-white
                        focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-300
                        transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border 
                          border-neutral-300 bg-white text-black
                          dark:border-neutral-700 dark:bg-neutral-900 dark:text-white
                          focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-300
                          transition-colors resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isContact}
                  loadingText="Contacting..."
                  className="w-full py-3 rounded-lg font-medium 
             bg-black text-white hover:bg-neutral-900
             dark:bg-white dark:text-black dark:hover:bg-neutral-200
             transition-colors"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="max-w-5xl mx-auto px-6 md:px-16 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-neutral-400">
              © 2025 K.A.V Textile. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/user/faq"
                className="text-sm text-neutral-400 hover transition"
              >
                FAQs
              </Link>
              {/* <Link
                href="/user/shipping-returns"
                className="text-sm text-neutral-400 hover transition"
              >
                Shipping & Returns
              </Link> */}
              <Link
                href="/user/privacy"
                className="text-sm text-neutral-400 hover transition"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
