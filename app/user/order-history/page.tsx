"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import SiteHeader from "../../components/site-header";
import API from "@/lib/api";

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

const statusConfig: Record<Order["status"], { label: string; color: string }> =
  {
    pending: { label: "Pending", color: "bg-gray-100 text-gray-700" },
    processing: { label: "Processing", color: "bg-yellow-100 text-yellow-700" },
    shipped: { label: "Shipped", color: "bg-blue-100 text-blue-700" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
    canceled: { label: "Canceled", color: "bg-red-100 text-red-700" },
  };

const normalizeStatus = (status?: string | null): Order["status"] => {
  if (!status) return "processing";
  return ["pending", "processing", "shipped", "delivered", "canceled"].includes(
    status,
  )
    ? (status as Order["status"])
    : "processing";
};

// Reusable order row component
function OrderRow({
  order,
  onView,
}: {
  order: Order;
  onView: (id: string) => void;
}) {
  const badge = statusConfig[order.status] || statusConfig.processing;

  return (
    <div className="border-b bg-background">
      {/* Mobile */}
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
          <span className="font-medium">₦{order.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-neutral-500">Status</span>
          <span className={`px-2 py-1 rounded text-xs ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <div className="flex justify-between pt-2">
          <button
            onClick={() => onView(order.id)}
            className="text-sm font-semibold hover:underline"
          >
            View details
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-12 px-6 py-4 items-center">
        <div className="col-span-3 font-semibold">Order #{order.id}</div>
        <div className="col-span-2">{order.date}</div>
        <div className="col-span-2 font-semibold">
          ₦{order.total.toFixed(2)}
        </div>
        <div className="col-span-2">
          <span className={`px-2 py-1 rounded text-xs ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <div className="col-span-3 flex items-center justify-end">
          <button
            onClick={() => onView(order.id)}
            className="px-4 py-2 border rounded-md text-sm font-medium
               bg-white dark:bg-neutral-800
               text-black dark:text-white
               border-neutral-300 dark:border-neutral-700
               hover:bg-neutral-100 dark:hover:bg-neutral-700
               transition-colors"
          >
            View details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderHistory() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/orders/my-orders");
        const mappedOrders: Order[] = data.orders.map((order: any) => ({
          id: String(order.id),
          date: new Date(order.created_at).toLocaleDateString(),
          total: Number(order.total),
          status: normalizeStatus(order.status),
          items: order.items || [],
        }));
        setOrders(mappedOrders.reverse());
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        (filter === "all" || o.status === filter) && o.id.includes(searchTerm),
    );
  }, [orders, searchTerm, filter]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <SiteHeader variant="user" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 pb-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-900 dark:text-white">
          ORDER HISTORY
        </h1>

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
              className="w-full pl-12 pr-4 py-3 bg-neutral-200 dark:bg-neutral-800 rounded-full text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              "all",
              "pending",
              "processing",
              "shipped",
              "delivered",
              "canceled",
            ].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2 rounded-full ${
                  filter === f
                    ? "bg-neutral-400 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-white"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-300">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-300">
            No orders found.
          </div>
        ) : (
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
            {/* Desktop header */}
            <div className="hidden md:grid grid-cols-12 px-6 py-4 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
              <div className="col-span-3">Order</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3 text-right">Action</div>
            </div>

            {filteredOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onView={(id) => router.push(`/user/order-history/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
