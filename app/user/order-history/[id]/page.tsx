"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteHeader from "../../../components/site-header";
import { toast } from "sonner";
import API from "@/lib/api";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
  items: OrderItem[];
}

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/orders/${id}`);

        setOrder({
          id: String(data.order.id),
          date: new Date(data.order.created_at).toLocaleDateString(),
          total: Number(data.order.total),
          status: data.order.status,
          items: data.order.items || [],
        });
      } catch (err: any) {
        toast.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = () => {
    if (!order) return;

    toast("Cancel this order?", {
      description: "This action cannot be undone.",
      action: {
        label: "Yes, cancel",
        onClick: async () => {
          if (canceling) return;
          setCanceling(true);

          try {
            const { data } = await API.post(`/orders/${order.id}/cancel`);

            toast.success(data.message || "Order canceled");

            setOrder((prev) =>
              prev ? { ...prev, status: "canceled" } : prev
            );
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Server error");
          } finally {
            setCanceling(false);
          }
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-neutral-600 dark:text-neutral-300">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12 text-neutral-600 dark:text-neutral-300">
        Order not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <SiteHeader variant="user" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-18">
        <h1 className="text-2xl font-semibold mb-8 text-black dark:text-white">
          Order Details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* SUMMARY */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <p className="mb-2">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Order ID:
                </span>{" "}
                #{order.id}
              </p>

              <p className="mb-2">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Date:
                </span>{" "}
                {order.date}
              </p>

              <p className="mb-2">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Total:
                </span>{" "}
                ₦{order.total.toFixed(2)}
              </p>

              <div className="flex items-center gap-2 mt-4">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Status:
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : order.status === "processing"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : order.status === "pending"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* ITEMS */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="font-medium mb-4 text-black dark:text-white">
                Items
              </h2>

              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-3 text-sm text-neutral-700 dark:text-neutral-200"
                  >
                    <div>
                      <p>{item.name}</p>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p>₦{Number(item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ORDER PROGRESS */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="font-medium mb-4 text-black dark:text-white">
                Order Progress
              </h2>

              <div className="space-y-3 text-sm">
                {STATUS_STEPS.map((step) => {
                  const active =
                    STATUS_STEPS.indexOf(step) <=
                    STATUS_STEPS.indexOf(order.status);

                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          active
                            ? "bg-green-600"
                            : "bg-neutral-300 dark:bg-neutral-600"
                        }`}
                      />

                      <span
                        className={`capitalize ${
                          active
                            ? "font-medium text-black dark:text-white"
                            : "text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}

                {order.status === "canceled" && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-600" />
                    <span className="font-medium text-red-600">
                      canceled
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 space-y-4">

              {order.status === "pending" && (
                <button
                  className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                  onClick={handleCancelOrder}
                  disabled={canceling}
                >
                  {canceling ? "Canceling..." : "Cancel Order"}
                </button>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}