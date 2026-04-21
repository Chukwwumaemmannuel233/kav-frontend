"use client";

import { useState } from "react";
import API from "@/lib/api";
import { toast } from "sonner";

const CATEGORY_OPTIONS = ["cotton", "lace", "silk", "ankara", "linen"];

const VARIANT_TYPES = ["yard", "trouser"];

export default function AddProductForm() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState(generateSKU());
  const [category, setCategory] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [variants, setVariants] = useState([{ type: "yard", price: "" }]);

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [subImages, setSubImages] = useState<File[]>([]);
  const [subImagePreviews, setSubImagePreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  function generateSKU() {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `SKU-${random}`;
  }

  /* ================= VARIANTS ================= */

  const addVariant = () => {
    setVariants((prev) => [...prev, { type: "yard", price: "" }]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const updated: any = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  /* ================= MAIN IMAGE ================= */

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImage(file);

    const reader = new FileReader();
    reader.onload = () => setMainImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ================= SUB IMAGES ================= */

  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const selected = Array.from(files);

  // ✅ ADD instead of REPLACE
  setSubImages((prev) => [...prev, ...selected]);

  const previews = selected.map((file) => URL.createObjectURL(file));

 setSubImagePreviews((prev) => [...prev, ...previews].slice(0, 4));

  // 🔥 VERY IMPORTANT (fixes same-file reselect issue)
  e.target.value = "";
};
  /* ================= RESET ================= */

  const resetForm = () => {
    setProductName("");
    setDescription("");
    setSku(generateSKU());
    setCategory("");
    setStockQuantity("");
    setVariants([{ type: "yard", price: "" }]);
    setMainImage(null);
    setMainImagePreview(null);
    setSubImages([]);
    setSubImagePreviews([]);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !category) {
      toast.error("Fill required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", productName);
      formData.append("description", description);
      formData.append("sku", sku);
      formData.append("category", category);
      formData.append("stock_quantity", stockQuantity);
      formData.append("variants", JSON.stringify(variants));

      if (mainImage) formData.append("image", mainImage);

      subImages.forEach((img) => {
        formData.append("sub_images", img);
      });

      await API.post("/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully");

      resetForm();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 text-foreground">
      <div className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-8 rounded-xl shadow-sm">
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">Add Product</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Create a new product
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <input
            type="text"
            placeholder="Product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 rounded-lg placeholder:text-neutral-400 focus:outline-none"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 rounded-lg placeholder:text-neutral-400 focus:outline-none"
          />

          {/* SKU */}
          <div className="flex gap-2">
            <input
              value={sku}
              readOnly
              className="flex-1 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setSku(generateSKU())}
              className="bg-black text-white dark:bg-white dark:text-black px-4 rounded-lg hover:opacity-80 transition"
            >
              Generate SKU
            </button>
          </div>

          {/* CATEGORY + STOCK */}
          <div className="grid grid-cols-2 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 rounded-lg focus:outline-none"
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Stock"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 rounded-lg focus:outline-none"
            />
          </div>

          {/* VARIANTS */}
          <div>
            <p className="font-semibold mb-3">Variants</p>

            {variants.map((v, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={v.type}
                  onChange={(e) => updateVariant(index, "type", e.target.value)}
                  className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 rounded flex-1"
                >
                  {VARIANT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.toUpperCase()}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) =>
                    updateVariant(index, "price", e.target.value)
                  }
                  className="w-40 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 rounded"
                />

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded mt-2 hover:opacity-80 transition"
            >
              + Add Variant
            </button>
          </div>

          {/* MAIN IMAGE */}
          <div>
            <p className="font-semibold mb-2">Main Image</p>

            <label className="cursor-pointer block border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 text-center hover:border-black dark:hover:border-white transition">
              {mainImagePreview ? (
                <img
                  src={mainImagePreview}
                  className="w-40 mx-auto rounded-lg"
                />
              ) : (
                <div className="text-neutral-500 dark:text-neutral-400">
                  <p className="font-medium">Click to upload main image</p>
                  <p className="text-sm">PNG, JPG allowed</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* GALLERY */}
          <div>
            <p className="font-semibold mb-2">Gallery Images</p>

            {/* Upload Box */}
            <label className="cursor-pointer block border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 text-center hover:border-black dark:hover:border-white transition">
              <div className="text-neutral-500 dark:text-neutral-400">
                <p className="font-medium">Click to upload gallery images</p>
                <p className="text-sm">You can select multiple images</p>
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleSubImagesChange}
                className="hidden"
              />
            </label>

            {/* Preview Grid */}
            {subImagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-neutral-500 mb-2">
                  {subImagePreviews.length} image(s) selected
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {subImagePreviews.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        className="w-full h-24 object-cover rounded-lg"
                      />

                      {/* Remove Button (optional but 🔥) */}
                      <button
                        type="button"
                        onClick={() => {
                          setSubImages((prev) =>
                            prev.filter((_, index) => index !== i),
                          );
                          setSubImagePreviews((prev) =>
                            prev.filter((_, index) => index !== i),
                          );
                        }}
                        className="absolute top-1 right-1 bg-black text-white text-xs w-6 h-6 rounded-full flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
