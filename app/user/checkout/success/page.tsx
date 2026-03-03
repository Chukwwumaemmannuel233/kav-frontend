"use client";
import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation"; // ✅ ADD THIS

export default function PaymentSuccessPage() {
  const router = useRouter(); // ✅ INITIALIZE ROUTER
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOrder, setIsOrder] = useState(false);

  const order = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrder(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Redirect after login
    router.push("/pages/user/order-history");
  };

  const shop = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Redirect after login
    router.push("/pages/user/fabrics");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold tracking-wide">KAV Textiles</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center py-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center">
              <Check size={48} className="text-black" strokeWidth={3} />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Your Order is Confirmed!
          </h2>
          <p className="text-lg text-neutral-600 mb-12">
            A confirmation email with your order details has been sent to your
            inbox.
          </p>

          {/* Order Details Box */}
          <div className="bg-neutral-100 rounded-lg p-8 mb-12 text-left max-w-lg mx-auto">
            <h3 className="text-xl font-semibold mb-6">Order #12345-ABC</h3>
            <div className="space-y-3 text-neutral-700">
              <p>Purchase Date: October 26, 2023</p>
              <p>Items: 3</p>
              <p>Total Paid: $245.50</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={order}
              isLoading={isOrder}
              loadingText="Loading..."
              className="bg-black text-white px-8 py-4 font-medium hover:bg-neutral-800 transition w-full sm:w-auto rounded-md"
            >
              View Order Details
            </Button>

            <Button
              onClick={shop}
              isLoading={isSuccess}
              loadingText="Loading..."
              className="border-2 border-black text-black px-8 py-4 font-medium hover:bg-neutral-50 transition w-full sm:w-auto rounded-md"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-6">
        <div className="container mx-auto px-4 text-center text-neutral-600">
          <p>&copy; 2023 TEXTURA. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
