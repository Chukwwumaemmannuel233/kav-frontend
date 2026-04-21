"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import API from "@/lib/api"; // import your axios instance

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const touchStartX = useRef<number | null>(null);

  /* FETCH PRODUCT USING AXIOS */
  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`, {
          signal: controller.signal as any, // axios needs casting for AbortController
        });

        setProduct(data.product);
        setSelectedVariant(data.product.variants?.[0] || null);
      } catch (err: any) {
        // ignore axios cancel error
        if (err?.message === "canceled" || err?.code === "ERR_CANCELED") return;

        console.error("Failed to fetch product:", err?.message || err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  /* IMAGE SWIPE */
  const images = [product?.image_url, ...(product?.sub_images || [])].filter(
    Boolean,
  );

  const handleTouchStart = (e: React.TouchEvent) =>
    (touchStartX.current = e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || images.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      setActiveImageIndex((prev) =>
        diff > 0
          ? (prev + 1) % images.length
          : (prev - 1 + images.length) % images.length,
      );
    }
    touchStartX.current = null;
  };

  /* ADD TO CART USING API */
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    if (isAdding) return;

    setIsAdding(true);

    try {
      await addToCart(product.id, quantity, selectedVariant); // ONLY THIS
      setQuantity(1);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = !selectedVariant || product.stock_quantity <= 2;

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading product...
      </main>
    );

  if (!product)
    return (
      <main className="min-h-screen flex items-center justify-center">
        Product not found
      </main>
    );

  return (
    <main className="bg-background min-h-screen">
      <div className="px-6 md:px-16 py-6 border-b">
        <nav className="text-sm text-neutral-500">
          <Link href="/user/dashboard">Home</Link> /{" "}
          <Link href="/user/fabrics">Fabrics</Link> /{" "}
          <span>{product.name}</span>
        </nav>
      </div>

      <section className="px-6 md:px-16 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* IMAGES */}
          <div>
            <div
              className="bg-neutral-100 rounded-2xl p-8 mb-6 h-96"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={images[activeImageIndex]}
                className="w-full h-full object-cover rounded-xl"
                alt={product.name}
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`border rounded-lg overflow-hidden ${
                    idx === activeImageIndex
                      ? "border-black"
                      : "border-neutral-300"
                  }`}
                >
                  <img
                    src={img}
                    className="h-20 w-full object-cover"
                    alt={`${product.name} ${idx + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-2xl font-bold mb-3">{product.name}</h1>

            <p className="text-1xl font-semibold mb-6">
              ₦{Number(selectedVariant?.price ?? 0).toLocaleString()} /{" "}
              {selectedVariant?.type ?? ""}
            </p>

            {product.variants?.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Select Option
                </label>

                <select
                  value={selectedVariant?.id || ""}
                  onChange={(e) =>
                    setSelectedVariant(
                      product.variants.find(
                        (v: any) => String(v.id) === e.target.value,
                      ),
                    )
                  }
                  className="w-44 border border-neutral-300 dark:border-neutral-700 
                 bg-white dark:bg-neutral-900 
                 text-black dark:text-white
                 px-3 py-2 rounded-md transition-colors"
                >
                  {product.variants.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {(v.type ?? "DEFAULT").toUpperCase()} – ₦
                      {(v.price ?? 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* QUANTITY */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border rounded"
                >
                  −
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((prev) =>
                     Math.min(prev + 1, product?.stock_quantity || 1)
                    )
                  }
                  className="w-10 h-10 border rounded"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              isLoading={isAdding}
              disabled={isOutOfStock}
              className="w-full py-4 rounded-full bg-black text-white hover:bg-neutral-800 
             dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
            >
              {!selectedVariant
                ? "SELECT OPTION"
                : product.stock_quantity <= 0
                  ? "OUT OF STOCK"
                  : product.stock_quantity <= 2
                    ? "LOW STOCK"
                    : "ADD TO CART"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
