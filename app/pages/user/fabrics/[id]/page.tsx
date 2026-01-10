"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "../../../../components/ui/button";
import { useParams } from "next/navigation";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  sub_images: string[];
  width: string;
  weight: string;
  composition: string;
  origin: string;
  care_instructions: string;
  stock_quantity: number;
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "specifications",
  ]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error("Product not found");

        setProduct(data.product);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API_BASE_URL]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 800));

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image_url,
      color: product.composition,
      sku: `TX-${String(product.id).padStart(5, "0")}`,
    });

    setQuantity(1);
    setIsAdding(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link
            href="/pages/user/fabrics"
            className="text-blue-600 hover:underline"
          >
            Back to Fabrics
          </Link>
        </div>
      </main>
    );
  }

  const images = [
    product.image_url,
    ...(product.sub_images || []),
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="px-6 md:px-16 py-6 border-b border-neutral-200">
        <nav className="text-sm text-neutral-600">
          <Link href="/pages/user/dashboard">Home</Link> {" / "}
          <Link href="/pages/user/fabrics">Fabrics</Link> {" / "}
          <span className="text-neutral-900">{product.name}</span>
        </nav>
      </div>

      <section className="px-6 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-neutral-100 rounded-2xl p-8 mb-6 min-h-50">
              <img
                src={images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className="w-full h-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl md:text-3xl font-bold mb-4">
              {product.name}
            </h1>

            <p className="text-2xl font-semibold mb-6">
             ₦{Number(product.price).toFixed(2)} / yard
            </p>

            <p className="text-neutral-700 mb-8">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-4">
                Quantity:
              </label>
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

            <Button
              onClick={handleAddToCart}
              isLoading={isAdding}
              loadingText="Adding..."
              className="w-full bg-black text-white py-4 rounded-full"
            >
              ADD TO CART
            </Button>

            {/* Accordion */}
            <div className="border-t pt-8 mt-8 space-y-6">
              {/* Specifications */}
              <div>
                <button
                  onClick={() => toggleSection("specifications")}
                  className="w-full flex justify-between py-4 font-semibold"
                >
                  Specifications
                  <ChevronDown
                    className={`transition ${
                      expandedSections.includes("specifications")
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {expandedSections.includes("specifications") && (
                  <div className="space-y-2 text-neutral-700">
                    <div className="flex justify-between">
                      <span>Width:</span>
                      <span>{product.width}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span>{product.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Composition:</span>
                      <span>{product.composition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Origin:</span>
                      <span>{product.origin}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Care */}
              <div className="border-t">
                <button
                  onClick={() => toggleSection("care")}
                  className="w-full flex justify-between py-4 font-semibold"
                >
                  Care Instructions
                  <ChevronDown />
                </button>

                {expandedSections.includes("care") && (
                  <p className="text-neutral-700">
                    {product.care_instructions}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
