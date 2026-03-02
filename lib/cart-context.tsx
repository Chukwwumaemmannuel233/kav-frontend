"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import API from "@/lib/api"; // Axios instance

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
  removeFromCart: (productId: number, variantId?: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  refreshCart: () => Promise<void>;
  forceClearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

/* ================= PROVIDER ================= */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    // Only fetch cart if user is logged in
    if (!isLoggedOut) refreshCart();
  }, [isLoggedOut]);

  /* ================= FETCH CART ================= */
  const refreshCart = async () => {
    const token = getToken();
    if (!token || isLoggedOut) return;

    try {
      const { data } = await API.get("/cart");
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
    } catch (err: any) {
      console.error("Failed to load cart", err);
      // If the error is 401/403, prevent further calls
      if (err.response?.status === 401 || err.response?.status === 403) {
        setIsLoggedOut(true);
        setItems([]);
        toast.error("Session expired. Please login again.");
      }
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (
    productId: number,
    quantity: number,
    variant?: VariantPayload
  ) => {
    if (isLoggedOut) return;

    try {
      await API.post("/cart", {
        productId,
        quantity,
        variantId: variant?.id,
      });
      toast.success("Added to cart 🛒");
      refreshCart();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (
    productId: number,
    quantity: number,
    variantId?: number
  ) => {
    if (isLoggedOut) return;

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );

    try {
      await API.put("/cart", { productId, quantity, variantId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
      refreshCart();
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeFromCart = async (productId: number, variantId?: number) => {
    if (isLoggedOut) return;

    setItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      )
    );

    try {
      await API.delete("/cart", { data: { productId, variantId } });
      toast.success("Cart item removed");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Remove failed");
      refreshCart();
    }
  };

  /* ================= CLEAR CART ================= */
  const clearCart = async () => {
    if (isLoggedOut) return;

    try {
      await API.delete("/cart/clear/all");
      setItems([]);
      toast.success("Cart cleared");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to clear cart");
    }
  };

  const forceClearCart = () => setItems([]);

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
