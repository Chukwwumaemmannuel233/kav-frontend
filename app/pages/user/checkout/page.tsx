"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Lock } from "lucide-react";

type Address = {
  id: number;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};

export default function CheckoutPage() {
  const [address, setAddress] = useState<Address | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Fetch default address
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const res = await fetch("/api/addresses/default", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setAddress(data.address || null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchDefaultAddress();
  }, []);

  // Paystack redirect
  const handlePay = async () => {
    try {
      setLoadingPayment(true);

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      window.location.href = data.authorization_url;
    } catch (error) {
      console.error(error);
      setLoadingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Lock size={20} />
          <h1 className="text-xl font-semibold">Secure Checkout</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-3xl font-bold">Checkout</h2>

          {/* ADDRESS SECTION */}
          {loadingAddress ? (
            <p>Loading address...</p>
          ) : address ? (
            <div className="border rounded-lg p-5 bg-neutral-50">
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {address.full_name} <br />
                {address.address_line} <br />
                {address.city}, {address.state} <br />
                {address.zip_code}, {address.country} <br />
                {address.phone}
              </p>

              <Link
                href="/pages/user/address"
                className="text-sm text-blue-600 mt-3 inline-block"
              >
                Change address
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Add Delivery Address</h3>

              <input className="input" placeholder="Full Name" />
              <input className="input" placeholder="Phone Number" />
              <input className="input" placeholder="Street Address" />

              <div className="grid grid-cols-2 gap-4">
                <input className="input" placeholder="City" />
                <input className="input" placeholder="State" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input className="input" placeholder="Zip Code" />
                <input className="input" placeholder="Country" />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                Save as default address
              </label>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-8">
            <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦120.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₦10.00</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₦9.60</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6 flex justify-between font-bold">
              <span>Total</span>
              <span>₦139.60</span>
            </div>

            <Button
              onClick={handlePay}
              isLoading={loadingPayment}
              loadingText="Redirecting..."
              className="w-full bg-black text-white py-4 rounded-lg font-semibold"
            >
              Pay ₦139.60
            </Button>

            <div className="flex justify-center items-center gap-2 text-xs text-neutral-500 mt-4">
              <Lock size={14} />
              <span>SSL Encrypted Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* INPUT STYLE */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          background: #f5f5f5;
          outline: none;
        }
      `}</style>
    </div>
  );
}
