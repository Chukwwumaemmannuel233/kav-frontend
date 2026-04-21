"use client";

import Link from "next/link";
import { ShoppingBag, X, Trash } from "lucide-react";
import SiteHeader from "../../components/site-header";
import { Button } from "../../components/ui/button";
import { useCart } from "../../../lib/cart-context";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  /* ---------------- TOTALS ---------------- */
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // const shipping = 10;
  const total = subtotal;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise((r) => setTimeout(r, 800));
    window.location.href = "/user/checkout";
  };

  const shop = async () => {
    setIsBack(true);
    await new Promise((r) => setTimeout(r, 800));
    window.location.href = "/user/fabrics";
  };

  const handleRemove = async (productId: number, variantId?: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item from your cart?",
    );

    if (!confirmed) return;

    await removeFromCart(productId, variantId);
  };

  /* ---------------- CLEAR ALL ---------------- */
  const handleClearCart = async () => {
    if (items.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear your entire cart?",
    );

    if (!confirmed) return;

    setIsClearing(true);
    await clearCart();
    setIsClearing(false);
  };

  return (
    <main className="bg-background min-h-screen pb-20 md:pb-0">
      <SiteHeader variant="user" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Shopping Cart
            </h1>
            <p className="text-neutral-600">{items.length} items</p>
          </div>

          {/* CLEAR CART BUTTON */}
          <button
            onClick={handleClearCart}
            disabled={items.length === 0 || isClearing}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition
              ${
                items.length === 0
                  ? "border-neutral-200 text-neutral-300 cursor-not-allowed"
                  : "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              }`}
          >
            <Trash size={16} />
            <span>{isClearing ? "Clearing..." : "Clear cart"}</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-xl text-neutral-600 mb-6">Your cart is empty</p>
            <Button
              onClick={shop}
              isLoading={isBack}
              loadingText="Loading..."
              className="
                  px-8 py-3 font-medium rounded-lg transition
                  bg-black text-white 
                  hover:bg-black/80

                  dark:bg-white dark:text-black
                  dark:hover:bg-white/90
  "
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId ?? "default"}`}
                  className="flex gap-6 pb-6 border-b border-neutral-200"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg md:text-xl font-bold">
                        {item.name}
                      </h3>
                      <button
                        onClick={() =>
                          handleRemove(item.productId, item.variantId)
                        }
                        className="text-neutral-400 hover:text-red-500 transition"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 px-3 py-2 rounded">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variantId,
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="px-2 "
                        >
                          −
                        </button>

                        <span className="w-8 text-center">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variantId,
                            )
                          }
                          className="px-2"
                        >
                          +
                        </button>
                      </div>

                      {/* <p className="text-sm text-neutral-500">
                        Variant: {item.variantType ?? "DEFAULT"}
                      </p> */}

                      <p className="text-sm text-neutral-500">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mb-6 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold">
                    ₦{total.toLocaleString()}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  isLoading={isCheckingOut}
                  loadingText="Processing..."
                  className="w-full py-3 rounded-full 
      bg-black text-white hover:bg-neutral-900
      dark:bg-white dark:text-black dark:hover:bg-neutral-200
      transition-colors"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
