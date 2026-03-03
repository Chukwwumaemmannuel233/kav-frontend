"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Archive,
  MoreVertical,
  Clock,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ INITIALIZE ROUTER

export default function NotificationDetails() {
  const [isArchived, setIsArchived] = useState(false);
   const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter(); // ✅ INITIALIZE ROUTER

  const handleArchive = () => {
    setIsArchived(!isArchived);
    console.log("Archive notification");
  };

  const handleDelete = () => {
    console.log("Delete notification");
  };

  const handleMarkAsRead = () => {
    console.log("Mark as read");
  };

  const handleViewInventory = async (e: React.FormEvent) => {
     e.preventDefault();
    setIsSignUp(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));


    // Redirect after login
    router.push("/pages/admin/inventory-management");
  };

  const handleBack = () => {
    console.log("Go back");
  };

  return (
    <div className="min-h-screen bg-[#faf8f6] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-900" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                Notification Details
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleArchive}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Archive className="w-4 h-4 text-gray-700" />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  Archive
                </span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            {/* Alert Badge and Timestamp */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#fff3e6] text-[#d97638] text-xs font-semibold rounded-full">
                  STOCK ALERT
                </span>
                <span className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                  New
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Today, 9:41 AM</span>
              </div>
            </div>

            {/* Bot Info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#d97638] rounded-full flex items-center justify-center border-2 border-white">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Inventory Bot
                </h2>
                <p className="text-sm text-gray-500">Automated System Alert</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Stock Level Warning: Linen Fabric
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The inventory for 'Linen Fabric - Natural Beige' has dropped
                  below the safety threshold of 50 yards. This item is currently
                  part of 3 active pending orders.
                </p>
                <p>
                  Please review the upcoming supply orders or adjust stock
                  availability manually to prevent fulfillment delays.
                </p>
              </div>
            </div>

            {/* Related Product */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Related Product
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src="/natural-beige-linen-fabric-texture.jpg"
                    alt="Linen Fabric"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    Linen Fabric - Natural Beige
                  </h4>
                  <p className="text-sm text-gray-500">
                    SKU: LIN-NAT-004 • Current Qty: 42 yds
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between mt-6 px-4">
            <p className="text-sm text-gray-500">Notification ID: #99283-AX</p>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Notification
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="mx-auto max-w-3xl flex items-center gap-3">
            <button
              onClick={handleMarkAsRead}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900 bg-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Mark as Read</span>
            </button>
            <Button
              onClick={handleViewInventory}
              isLoading={isSignUp}
              loadingText="Loading..."
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#d97638] hover:bg-[#c4671f] text-white rounded-lg transition-colors font-medium"
            >
              <span>View Inventory</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
