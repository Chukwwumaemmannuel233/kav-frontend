"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteHeader from "../../../components/site-header";
import { toast } from "sonner";
import API from "@/lib/api"; // your axios instance

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

  /* ==============================
     FETCH ORDER
  ============================== */
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
        toast.error("Failed to fetch order: " + (err.message || "Server error"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  /* ==============================
     CANCEL ORDER
  ============================== */
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

            toast.success(data.message || "Order canceled successfully");

            setOrder((prev) => prev ? { ...prev, status: "canceled" } : prev);
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Server error");
          } finally {
            setCanceling(false);
          }
        },
      },
      cancel: { label: "No", onClick: () => {} },
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading order...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <SiteHeader variant="user" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-18">
        <h1 className="text-2xl font-semibold mb-8">Order Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* SUMMARY */}
            <div className="bg-white rounded-lg border p-6">
              <p className="mb-2">
                <span className="text-neutral-500">Order ID:</span> #{order.id}
              </p>
              <p className="mb-2">
                <span className="text-neutral-500">Date:</span> {order.date}
              </p>
              <p className="mb-2">
                <span className="text-neutral-500">Total:</span> ₦{order.total.toFixed(2)}
              </p>

              <div className="flex items-center gap-2 mt-4">
                <span className="text-neutral-500">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "pending"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* ITEMS */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="font-medium mb-4">Items</h2>
              <div className="divide-y">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-3 text-sm">
                    <div>
                      <p>{item.name}</p>
                      <p className="text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                    <p>₦{Number(item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* TRACK ORDER */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="font-medium mb-4">Order Progress</h2>
              <div className="space-y-3 text-sm">
                {STATUS_STEPS.map((step) => {
                  const active = STATUS_STEPS.indexOf(step) <= STATUS_STEPS.indexOf(order.status);
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${active ? "bg-green-600" : "bg-neutral-300"}`} />
                      <span className={`capitalize ${active ? "font-medium" : "text-neutral-500"}`}>{step}</span>
                    </div>
                  );
                })}
                {order.status === "canceled" && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-600" />
                    <span className="font-medium text-red-600">canceled</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border p-6 space-y-4">
              {order.status === "pending" && (
                <button
                  className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
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
