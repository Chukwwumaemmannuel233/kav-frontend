"use client";

import { useEffect, useState } from "react";
import SiteHeader from "../../../components/site-header";
import { getProducts } from "@/lib/products.api";
import Link from "next/link";

export default function FabricsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const LIMIT = 12;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        page,
        limit: LIMIT,
        search,
        category,
        minPrice,
        maxPrice,
      });

      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, category, minPrice, maxPrice]);

  return (
    <>
      <SiteHeader variant="user" />

      <main className="px-6 md:px-16 py-10 pb-24">
        {/* TITLE + SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Fabrics</h1>

          <input
            type="text"
            placeholder="Search fabrics..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="border px-3 py-2 rounded-md w-full md:w-72 text-sm"
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
          {/* FILTER SIDEBAR */}
          <aside className="space-y-4">
            <h2 className="text-sm font-semibold uppercase text-neutral-500">
              Filters
            </h2>

            <select
              value={category}
              onChange={(e) => {
                setPage(1);
                setCategory(e.target.value);
              }}
              className="w-full border px-2 py-1.5 rounded text-sm"
            >
              <option value="">All Categories</option>
              <option value="cotton">Cotton</option>
              <option value="silk">Silk</option>
              <option value="linen">Linen</option>
            </select>

            <input
              type="number"
              placeholder="Min ₦"
              onChange={(e) => {
                setPage(1);
                setMinPrice(Number(e.target.value) || undefined);
              }}
              className="w-full border px-2 py-1.5 rounded text-sm"
            />

            <input
              type="number"
              placeholder="Max ₦"
              onChange={(e) => {
                setPage(1);
                setMaxPrice(Number(e.target.value) || undefined);
              }}
              className="w-full border px-2 py-1.5 rounded text-sm"
            />

            <button
              onClick={() => {
                setCategory("");
                setMinPrice(undefined);
                setMaxPrice(undefined);
                setSearch("");
                setPage(1);
              }}
              className="w-full border text-sm py-1.5 rounded hover:bg-neutral-100 transition"
            >
              Reset
            </button>
          </aside>

          {/* PRODUCTS GRID */}
          <section>
            {loading ? (
              <div className="text-center py-20">Loading fabrics...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">No products found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/pages/user/fabrics/${product.id}`}
                  >
                    <div className="bg-neutral-100 rounded-lg aspect-square overflow-hidden mb-3">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-sm">
                      {product.name}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      ₦{product.price} / yard
                    </p>
                  </Link>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="border px-3 py-1.5 rounded text-sm disabled:opacity-40"
              >
                Prev
              </button>

              <span className="text-sm">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border px-3 py-1.5 rounded text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
