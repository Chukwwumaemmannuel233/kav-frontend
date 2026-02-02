"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import SiteHeader from "../../../components/site-header";

interface OrderItem {
  name: string;
  price: string | number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
  items: OrderItem[];
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-700",
  },
  processing: {
    label: "Processing",
    color: "bg-yellow-100 text-yellow-700",
  },
  shipped: {
    label: "Shipped",
    color: "bg-blue-100 text-blue-700",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
  },
  canceled: {
    label: "Canceled",
    color: "bg-red-100 text-red-700",
  },
};

const normalizeStatus = (
  status: string | null | undefined
): Order["status"] => {
  switch (status) {
    case "pending":
    case "processing":
    case "shipped":
    case "delivered":
    case "canceled":
      return status;
    default:
      return "processing"; // safe fallback
  }
};

export default function OrderHistory() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "all" | "shipped" | "delivered" | "canceled"
  >("all");
  const [loading, setLoading] = useState(false);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        const mappedOrders: Order[] = data.orders.map((order: any) => ({
          id: String(order.id),
          date: new Date(order.created_at).toLocaleDateString(),
          total: Number(order.total),
          status: normalizeStatus(order.status),
          items: order.items || [],
        }));

        // newest order first
        setOrders(mappedOrders.reverse());
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_BASE]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.id.includes(searchTerm);
      const matchesFilter = filter === "all" || order.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchTerm, filter]);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader variant="user" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 pb-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">ORDER HISTORY</h1>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4 md:flex md:items-center md:gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-3 text-neutral-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by Order ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-200 rounded-full"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "processing", "shipped", "delivered", "canceled"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2 rounded-full ${
                  filter === f
                    ? "bg-neutral-400 text-white"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">No orders found.</div>
        ) : (
          <div className="bg-neutral-100 rounded-lg overflow-hidden">
            {/* DESKTOP HEADER */}
            <div className="hidden md:grid grid-cols-12 px-6 py-4 text-sm font-semibold text-neutral-600">
              <div className="col-span-3">Order</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3 text-right">Action</div>
            </div>

            {filteredOrders.map((order, index) => {
              status: order.status as Order["status"];

              return (
                <div key={order.id} className="border-b bg-white">
                  {/* MOBILE */}
                  <div className="md:hidden p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Order</span>
                      <span className="font-medium">#{order.id}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-neutral-500">Date</span>
                      <span>{order.date}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-neutral-500">Total</span>
                      <span className="font-medium">
                        ₦{order.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">Status</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          (
                            statusConfig[order.status] ??
                            statusConfig.processing
                          ).color
                        }`}
                      >
                        {
                          (
                            statusConfig[order.status] ??
                            statusConfig.processing
                          ).label
                        }
                      </span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() =>
                          router.push(`/pages/user/order-history/${order.id}`)
                        }
                        className="text-sm font-semibold hover:underline"
                      >
                        View details
                      </button>
                    </div>
                  </div>

                  {/* DESKTOP ROW */}
                  <div className="hidden md:grid grid-cols-12 px-6 py-4 items-center">
                    <div className="col-span-3 font-semibold">
                      Order #{order.id}
                    </div>

                    <div className="col-span-2">{order.date}</div>
                    <div className="col-span-2 font-semibold">
                      ₦{order.total.toFixed(2)}
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          (
                            statusConfig[order.status] ??
                            statusConfig.processing
                          ).color
                        }`}
                      >
                        {
                          (
                            statusConfig[order.status] ??
                            statusConfig.processing
                          ).label
                        }
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center justify-end">
                      <button
                        onClick={() =>
                          router.push(`/pages/user/order-history/${order.id}`)
                        }
                        className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-neutral-100"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
