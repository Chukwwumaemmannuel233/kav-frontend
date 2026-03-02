"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, Trash2, RotateCcw, Pencil } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface Variant {
  type: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  sub_images: string[];
  category: string;
  sku: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants: Variant[];
}

export default function AdminProductDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // EDIT MODAL STATE
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchProduct();
  }, []);

  /**
   * Show a confirmation toast.
   * Resolves to true if user clicks "Yes", false if "Cancel".
   */
  const confirmToast = async (message: string) => {
    return new Promise<boolean>((resolve) => {
      const id = toast(
        <div className="flex flex-col gap-3">
          <span>{message}</span>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                resolve(false);
                toast.dismiss(id); // <-- dismiss toast
              }}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resolve(true);
                toast.dismiss(id); // <-- dismiss toast
              }}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Yes
            </button>
          </div>
        </div>,
        { duration: Infinity }, // keep it open until user clicks
      );
    });
  };

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/admin/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.product);
        setEditData(res.data.product); // populate modal
      }
    } catch (err) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE PRODUCT (HIDE)
  ========================= */
  const handleDeleteProduct = async () => {
    const confirmed = await confirmToast(
      "Are you sure you want to hide this product?",
    );
    if (!confirmed) return; // user cancelled

    try {
      setActionLoading(true);
      await toast.promise(API.delete(`/admin/products/${id}`), {
        loading: "Hiding product...",
        success: "Product hidden",
        error: "Failed to hide product",
      });
      await fetchProduct();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreProduct = async () => {
    const confirmed = await confirmToast(
      "Are you sure you want to restore this product?",
    );
    if (!confirmed) return; // user cancelled

    try {
      setActionLoading(true);
      await toast.promise(API.patch(`/admin/products/${id}/restore`), {
        loading: "Restoring product...",
        success: "Product restored",
        error: "Failed to restore product",
      });
      await fetchProduct();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================
     SAVE EDIT CHANGES
  ========================= */
  const saveEdits = async () => {
    try {
      setActionLoading(true);

      // Handle variants as JSON string
      const variantsPayload = JSON.stringify(editData.variants);

      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("description", editData.description);
      formData.append("category", editData.category);
      formData.append("stock_quantity", editData.stock_quantity);
      formData.append("sku", editData.sku);
      formData.append("variants", variantsPayload);

      if (editData.image_file) formData.append("image", editData.image_file);
      if (editData.sub_image_files) {
        editData.sub_image_files.forEach((f: File) =>
          formData.append("sub_images", f),
        );
      }

      await API.put(`/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated");
      setShowEditModal(false);
      fetchProduct();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        Loading product...
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen bg-white pb-20">

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-sm"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* IMAGE */}
          <div>
            <img
              src={product.image_url}
              className="w-full h-[400px] object-cover rounded-xl border"
            />

            {/* sub images */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {product.sub_images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-neutral-500 mb-4">{product.description}</p>

            <div className="space-y-2 text-sm">
              <p>
                <b>SKU:</b> {product.sku}
              </p>
              <p>
                <b>Category:</b> {product.category}
              </p>
              <p>
                <b>Stock:</b> {product.stock_quantity}
              </p>
              <p>
                <b>Status:</b>{" "}
                {product.is_active ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-500 font-semibold">Deleted</span>
                )}
              </p>
              <p>
                <b>Created_at:</b> {product.created_at}
              </p>
              <p>
                <b>Updated_at:</b> {product.updated_at}
              </p>
            </div>

            {/* VARIANTS */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Prices</h3>
              <div className="space-y-2">
                {product.variants?.map((v, i) => (
                  <div
                    key={i}
                    className="flex justify-between border rounded-lg px-4 py-2"
                  >
                    <span>{v.type}</span>
                    <span className="font-semibold">
                      ₦{Number(v.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-8 flex-wrap">
              {/* EDIT BUTTON */}
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg hover:bg-neutral-800"
              >
                <Pencil size={18} />
                Edit Product
              </button>

              {/* DELETE OR RESTORE */}
              {product.is_active ? (
                <button
                  disabled={actionLoading}
                  onClick={handleDeleteProduct}
                  className={`flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 ${
                    actionLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <Trash2 size={18} />
                  {actionLoading ? "Hiding..." : "Delete Product"}
                </button>
              ) : (
                <button
                  disabled={actionLoading}
                  onClick={handleRestoreProduct}
                  className={`flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 ${
                    actionLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <RotateCcw size={18} />
                  {actionLoading ? "Restoring..." : "Restore Product"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          EDIT MODAL
      ========================= */}
      {/* =========================
    EDIT MODAL
========================= */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            <div className="space-y-4">
              {/* NAME */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={editData.sku}
                  onChange={(e) =>
                    setEditData({ ...editData, sku: e.target.value })
                  }
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={editData.category}
                  onChange={(e) =>
                    setEditData({ ...editData, category: e.target.value })
                  }
                >
                  <option value="cotton">Cotton</option>
                  <option value="silk">Silk</option>
                  <option value="linen">Linen</option>
                  <option value="wool">Wool</option>
                </select>
              </div>

              {/* STOCK */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={editData.stock_quantity}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      stock_quantity: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Main Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      image_file: e.target.files?.[0],
                    })
                  }
                />
              </div>

              {/* SUB IMAGES */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      sub_image_files: e.target.files
                        ? Array.from(e.target.files)
                        : [],
                    })
                  }
                />
              </div>

              {/* VARIANTS */}
              <div>
                <h3 className="font-semibold mb-2">Variants</h3>
                <div className="flex flex-col gap-2 md:gap-2 overflow-x-auto">
                  {editData.variants?.map((v: Variant, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full"
                    >
                      <input
                        type="text"
                        className="px-3 py-2 border rounded-lg flex-1"
                        value={v.type}
                        onChange={(e) => {
                          const newVariants = [...editData.variants];
                          newVariants[i].type = e.target.value;
                          setEditData({ ...editData, variants: newVariants });
                        }}
                        placeholder="Variant type"
                      />
                      <input
                        type="number"
                        className="px-3 py-2 border rounded-lg w-full sm:w-32"
                        value={v.price}
                        onChange={(e) => {
                          const newVariants = [...editData.variants];
                          newVariants[i].price = Number(e.target.value);
                          setEditData({ ...editData, variants: newVariants });
                        }}
                        placeholder="Price"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SAVE / CANCEL */}
              <div className="flex gap-3 mt-6 flex-wrap">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <Button
                  onClick={saveEdits}
                  isLoading={actionLoading}
                  loadingText="Saving..."
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
