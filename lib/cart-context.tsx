"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

/* ================= TYPES ================= */

export interface CartItem {
  productId: number;
  variantId?: number;
  variantType?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock?: number;
}

interface VariantPayload {
  id: number;
  type: string;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    productId: number,
    quantity: number,
    variant?: VariantPayload
  ) => Promise<void>;
  updateQuantity: (
    productId: number,
    quantity: number,
    variantId?: number
  ) => Promise<void>;
  removeFromCart: (
    productId: number,
    variantId?: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  refreshCart: () => Promise<void>;
  forceClearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

/* ================= PROVIDER ================= */

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    refreshCart();
  }, []);

  /* ================= FETCH CART ================= */

  const refreshCart = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setItems(
        data.cart.map((item: any) => ({
          productId: item.product_id,
          variantId: item.variant_id,
          variantType: item.variant_type,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.image_url,
          stock: item.stock_quantity,
        }))
      );
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  };

  /* ================= ADD TO CART ================= */

  const addToCart = async (
    productId: number,
    quantity: number,
    variant?: VariantPayload
  ) => {
    const token = getToken();
    if (!token) {
      toast.error("Please login first");
      return;
    }

    const res = await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity,
        variantId: variant?.id,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to add to cart");
      return;
    }

    toast.success("Added to cart 🛒");
    refreshCart();
  };

  /* ================= UPDATE QUANTITY ================= */

  const updateQuantity = async (
    productId: number,
    quantity: number,
    variantId?: number
  ) => {
    const token = getToken();
    if (!token) return;

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId &&
        item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );

    const res = await fetch(`${API_BASE}/cart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({  productId, quantity, variantId }),
    });

    if (!res.ok) {
      toast.error("Update failed");
      refreshCart();
    }
  };

  /* ================= REMOVE ITEM ================= */

  const removeFromCart = async (
    productId: number,
    variantId?: number
  ) => {
    const token = getToken();
    if (!token) return;

    setItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.variantId === variantId
          )
      )
    );

    const res = await fetch(`${API_BASE}/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, variantId }),
    });
     toast.success("cart item removed");

    if (!res.ok) {
      toast.error("Remove failed");
      refreshCart();
    }
  };

  /* ================= CLEAR CART ================= */

  const clearCart = async () => {
    const token = getToken();
    if (!token) return;

    await fetch(`${API_BASE}/cart/clear/all`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setItems([]);
    toast.success("Cart cleared");
  };

  const forceClearCart = () => {
  setItems([]);
};

 const getTotalItems = () => items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        refreshCart,
        forceClearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
