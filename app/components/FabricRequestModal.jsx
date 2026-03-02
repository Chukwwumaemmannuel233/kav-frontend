"use client";

import { useState } from "react";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function FabricRequestModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  /* ===============================
     1. HANDLE FILE SELECT + PREVIEW
  =============================== */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);

    // preview
    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  /* ===============================
     2. SUBMIT FORM
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

   
  if (!name.trim()) {
    toast.error("Please enter your name");
    return;
  }

  if (!phone || phone.length < 7) {
    toast.error("Enter valid WhatsApp number");
    return;
  }

  if (!description.trim()) {
    toast.error("Please describe the fabric you want");
    return;
  }

  if (!file) {
    toast.error("Please upload fabric image or video");
    return;
  }


    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("description", description);

      if (file) {
        formData.append("file", file); // IMPORTANT
      }

      const res = await fetch("http://localhost:5000/api/fabric-request", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
      } else {
        toast.success("Fabric request sent successfully 🎉");

        // reset form
        setName("");
        setPhone("");
        setDescription("");
        setFile(null);
        setPreview(null);
        onClose();
      }
    } catch (err) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     3. MODAL UI
  =============================== */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[95%] max-w-md rounded-xl p-6 relative">
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute right-4 top-3 text-xl">
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Request Fabric</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-medium">WhatsApp Number *</label>

            <PhoneInput
              country={"ng"} // default Nigeria
              value={phone}
              onChange={(value) => setPhone(value)}
              enableSearch={true}
              countryCodeEditable={false}
              inputStyle={{
                width: "100%",
                height: "45px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
              buttonStyle={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px 0 0 8px",
              }}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium">Fabric Description</label>
            <textarea
              placeholder="Describe fabric you want..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* FILE UPLOAD */}
          <div>
            <label className="text-sm font-medium">Upload Image or Video</label>

            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full mt-1"
            />
          </div>

          {/* PREVIEW */}
          {preview && (
            <div className="mt-3">
              <p className="text-sm mb-1">Preview:</p>

              {file?.type.startsWith("image") ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="w-full h-40 rounded-lg"
                />
              )}
            </div>
          )}

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg mt-3"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
