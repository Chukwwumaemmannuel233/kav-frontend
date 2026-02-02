"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import Confetti from "react-confetti";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  address_id: number;
  payment_status: string;
  status: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
 const { refreshCart, clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

//   useEffect(() => {
//   clearCart();      // 🔥 clears React state instantly
//   refreshCart();    // sync with backend
// }, []);


  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
try {
const res = await fetch(`${API_BASE}/payments/verify/${reference}`, {
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
});


const data = await res.json();


// ❌ verification failed
if (!res.ok || data?.data?.status !== "success") {
toast.error("Payment verification failed ❌");
setStatus("failed");
return;
}


// ✅ success
toast.success("Payment successful 🎉");
setStatus("success");


if (!data.data.order) {
toast.error("Order not found after payment ❌");
setStatus("failed");
return;
}


const orderRes = await fetch(
`${API_BASE}/payments/orders/by-reference/${reference}`,
{
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
}
);


const orderData = await orderRes.json();


if (!orderRes.ok || !orderData.order) {
toast.error("Failed to load order details ❌");
setStatus("failed");
return;
}


setOrder(orderData.order);


} catch (err) {
console.error("Payment verification error:", err);
toast.error("Something went wrong. Try again ❌");
setStatus("failed");
} finally {
setLoading(false);
}
};


verifyPayment();
  }, [reference]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-50">
      {status === "success" && <Confetti numberOfPieces={200} />}

    {status === "success" && (
  <motion.div
    initial={{ scale: 0.6, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="flex items-center justify-center mt-6"
  >
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-xl flex items-center justify-center">
      <svg
        width="60"
        height="60"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M14 27 L23 36 L38 18"
          fill="none"
          stroke="#22c55e"   // light green
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </svg>
    </div>
  </motion.div>
)}

<p className="mt-4 text-lg font-semibold text-gray-800">
  Payment Successful
</p>


      {/* Custom Toast */}
      {toastVisible && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Payment successful 🎉
        </div>
      )}

      <div className="flex gap-4 mt-4">

        <span
          className={`px-3 py-1 rounded-full font-semibold text-white ${
            order?.payment_status === "paid"
              ? "bg-green-600"
              : order?.payment_status === "pending"
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
        >
          Payment: {order?.payment_status}
        </span>
      </div>

      {status === "success" && order ? (
        <div className="bg-white rounded-lg shadow p-6 w-full max-w-xl mt-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="grid grid-cols-12 gap-2 border-b pb-2 font-semibold text-gray-700">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-4 text-right">Subtotal</span>
          </div>

          <ul className="divide-y divide-gray-200 mt-2">
            {order.items.map((item) => (
              <li
                key={item.product_id}
                className="py-2 grid grid-cols-12 items-center"
              >
                <span className="col-span-6">{item.name}</span>
                <span className="col-span-2 text-center">{item.quantity}</span>
                <span className="col-span-4 text-right">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t pt-4 flex justify-between font-bold text-lg mt-4">
            <span>Total Paid</span>
            <span>
              ₦
              {typeof order.total === "number"
                ? order.total.toLocaleString()
                : "0"}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-center mt-4 text-red-500">
          Payment verification failed. Please contact support.
        </p>
      )}

      <Button
        onClick={() => router.push("/pages/user/dashboard")}
        className="bg-black text-white mt-6 px-6 py-3 rounded-lg"
      >
        Go to Home
      </Button>
    </div>
  );
}
