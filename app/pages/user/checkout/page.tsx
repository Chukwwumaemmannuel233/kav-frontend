"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Lock } from "lucide-react";
import { useCart } from "../../../../lib/cart-context";
import { toast } from "sonner";
import API from "@/lib/api";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Address = {
  id: number;
  full_name: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

export default function CheckoutPage() {
  const { items: cartItems } = useCart();

  const [address, setAddress] = useState<Address | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: true,
  });

  useEffect(() => {
    if (uiError) {
      const timer = setTimeout(() => {
        setUiError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [uiError]);

  /* ---------------- FETCH ADDRESSES ---------------- */
 useEffect(() => {
  const fetchAddresses = async () => {
    try {
      const res = await API.get("/addresses"); // Axios automatically includes token
      const data = res.data;

      if (data.addresses?.length) {
        const defaultAddress =
          data.addresses.find((a: Address) => a.is_default) ||
          data.addresses[0];

        setAddress(defaultAddress);
        setShowAddressForm(false);
      } else {
        setShowAddressForm(true);
      }
    } catch (err: any) {
      // Axios interceptor handles token expiration / deactivation
      console.error(err.response?.data?.message || "Failed to fetch addresses");
      setShowAddressForm(true);
    } finally {
      setLoadingAddress(false);
    }
  };

  fetchAddresses();
}, []);
  /* ---------------- Save Address ---------------- */

 const saveAddress = async () => {
  try {
    if (!formData.full_name || !formData.phone || !formData.street_address) {
      setUiError("Please fill all required address fields");
      return;
    }

    const res = await API.post("/addresses", formData);

    setAddress(res.data.address); // Axios automatically parses JSON
    setShowAddressForm(false);
    setUiError(null);
    toast.success("Address saved");
  } catch (err: any) {
    // Axios interceptor will handle token/deactivated issues
    setUiError(err.response?.data?.message || "Failed to save address");
  }
};

  /* ---------------- CALCULATIONS ---------------- */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // const shipping = cartItems.length ? 1500 : 0;
  // const tax = subtotal * 0.075;
  const total = subtotal;

  /* ---------------- PAYSTACK ---------------- */
 const handlePay = async () => {
  if (!address) return toast.error("Add delivery address");

  try {
    setLoadingPayment(true);

    // 1️⃣ Create order
    const checkoutRes = await API.post("/checkout", {
      address_id: address.id,
      items: cartItems.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId,
        name: item.name,
        variant_type: item.variantType,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    });

    // 2️⃣ Init Paystack
    const payRes = await API.post("/payments/init", {
      order_id: checkoutRes.data.order.id,
    });

    // 3️⃣ Redirect to Paystack
    window.location.href = payRes.data.authorization_url;
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Payment failed");
  } finally {
    setLoadingPayment(false);
  }
};


  return (
    <div className="min-h-screen bg-white">
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

          {loadingAddress ? (
            <div className="border rounded-lg p-5 bg-neutral-50 space-y-3 animate-pulse">
              <div className="h-4 bg-neutral-300 rounded w-1/2" />
              <div className="h-3 bg-neutral-300 rounded w-3/4" />
              <div className="h-3 bg-neutral-300 rounded w-2/3" />
              <div className="h-3 bg-neutral-300 rounded w-1/3" />
            </div>
          ) : address && !showAddressForm ? (
            <div className="border rounded-lg p-5 bg-neutral-50">
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {address.full_name} <br />
                {address.street_address} <br />
                {address.city}, {address.state} <br />
                {address.postal_code}, {address.country} <br />
                {address.phone}
              </p>

              <button
                onClick={() => setShowAddressForm(true)}
                className="text-sm text-blue-600 mt-3 inline-block"
              >
                Change address
              </button>
            </div>
          ) : (
            /* 🔥 YOUR FORM UI — RESTORED */
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Add Delivery Address</h3>

              <input
                className="input"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Street Address"
                value={formData.street_address}
                onChange={(e) =>
                  setFormData({ ...formData, street_address: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="input"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />

                <input
                  className="input"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="input"
                  placeholder="Postal Code"
                  value={formData.postal_code}
                  onChange={(e) =>
                    setFormData({ ...formData, postal_code: e.target.value })
                  }
                />

                <input
                  className="input"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData({ ...formData, is_default: e.target.checked })
                  }
                />
                Save as default address
              </label>

              <Button onClick={saveAddress} className="mt-4">
                Save Address
              </Button>
            </div>
          )}
        </div>

        {uiError && (
          <div className="mb-6 rounded-lg bg-red-100 text-red-700 px-4 py-3">
            {uiError}
          </div>
        )}

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-8">
            <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Shipping</span>
                <span>₦{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₦{tax.toLocaleString()}</span>
              </div> */}
            </div>

            <div className="border-t pt-4 mb-6 flex justify-between font-bold">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>

            <Button
              onClick={handlePay}
              disabled={!address || loadingPayment}
              isLoading={loadingPayment}
              loadingText="Redirecting..."
              className={`w-full py-4 rounded-lg font-semibold ${
                !address
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white"
              }`}
            >
              Pay ₦{total.toLocaleString()}
            </Button>

            <div className="flex justify-center items-center gap-2 text-xs text-neutral-500 mt-4">
              <Lock size={14} />
              <span>SSL Encrypted Payment</span>
            </div>
          </div>
        </div>
      </div>

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
