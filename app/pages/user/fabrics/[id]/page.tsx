"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";

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
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  /* FETCH PRODUCT */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Product not found");

        setProduct(data.product);
        setSelectedVariant(data.product.variants?.[0] || null);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, API_BASE_URL]);

  /* IMAGE SWIPE */
  const handleTouchStart = (e: React.TouchEvent) =>
    (touchStartX.current = e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !product) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50)
      setActiveImageIndex((prev) =>
        diff > 0
          ? (prev + 1) % images.length
          : (prev - 1 + images.length) % images.length
      );
    touchStartX.current = null;
  };

  
  /* ADD TO CART */
  const handleAddToCart = async () => {
    if (!selectedVariant || isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(product.id, quantity, selectedVariant);
      setQuantity(1);
      // toast.success("Added to cart 🛒");
    } catch (err: any) {
      if (!selectedVariant) {
        toast.error("Please select a variant");
        return;
      }

      toast.error(err.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = !product || product.stock_quantity <= 0;


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

  const images = [product.image_url, ...(product.sub_images || [])];

  return (
    <main className="bg-white min-h-screen">
      <div className="px-6 md:px-16 py-6 border-b">
        <nav className="text-sm text-neutral-600">
          <Link href="/pages/user/dashboard">Home</Link> /{" "}
          <Link href="/pages/user/fabrics">Fabrics</Link> /{" "}
          <span className="text-black">{product.name}</span>
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
                  <img src={img} className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div>
            <h1 className="text-2xl font-bold mb-3">{product.name}</h1>

            {/* PRICE */}
            <p className="text-1xl font-semibold mb-6">
              ₦{selectedVariant?.price?.toFixed(2) ?? "0.00"} /{" "}
              {selectedVariant?.type ?? ""}
            </p>

            {/* <p className="text-neutral-700 mb-8">{product.description}</p> */}

            {/* VARIANT DROPDOWN */}
            {/* VARIANT DROPDOWN */}
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
                        (v: any) => v.id === Number(e.target.value)
                      )
                    )
                  }
                  className="w-44 border px-3 py-2 rounded-md"
                >
                  {product.variants.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {(v.type ?? "DEFAULT").toUpperCase()} – ₦
                      {(v.price ?? 0).toFixed(2)}
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
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <Button
              onClick={handleAddToCart}
              isLoading={isAdding}
             disabled={isOutOfStock}
              className="w-full bg-black text-white py-4 rounded-full"
            >
             {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
