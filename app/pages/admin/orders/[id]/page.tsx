"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/lib/api";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/orders/admin/${id}`);

      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error("Fetch order error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10">Loading order...</div>;
  if (!order) return <div className="p-10">Order not found</div>;

  function StatusChanger({ order, refresh }: any) {
    const [loading, setLoading] = useState(false);

    const updateStatus = async (status: string) => {
      try {
        setLoading(true);

        await API.patch(`/orders/admin/orders/${order.id}/status`, {
          status,
        });

        toast.success("Order status updated");
        refresh();
      } catch (err) {
        console.error("Status update error:", err);
        toast.error("Failed to update order");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-neutral-100 rounded-lg p-6">
        <h2 className="font-semibold mb-3">Update Status</h2>

        <div className="flex gap-3 flex-wrap">
          {["shipped", "delivered"].map((s) => (
            <button
              key={s}
              disabled={loading}
              onClick={() => updateStatus(s)}
              className="bg-black text-white px-4 py-2 rounded-lg capitalize"
            >
              {loading ? "Updating..." : s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <main className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-6">Order #{order.id}</h1>

        {/* Customer */}
        <div className="bg-neutral-100 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-2">Customer</h2>
          <p className="text-neutral-700">{order.email}</p>
        </div>

        {/* Items */}
        <div className="bg-neutral-100 rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Items</h2>

          {order.items?.map((item: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between border-b py-3"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                {/* IMAGE */}
                {item.image && (
                  <img
                    src={item.image}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                )}

                {/* NAME + QTY */}
                <div>
                  <p className="font-semibold max-w-[220px] truncate">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>

              {/* PRICE */}
              <p className="font-bold">
                ₦{Number(item.price).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-black text-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold">
            Total: ₦{Number(order.total).toLocaleString()}
          </h2>
        </div>

        {/* Status update */}
        <StatusChanger order={order} refresh={fetchOrder} />
      </main>
    </div>
  );
}
