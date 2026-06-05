"use client";

import { useState } from "react";
import { toast } from "sonner";
import PhoneInput from "react-phone-input-2";
import { Loader2, X } from "lucide-react";
import "react-phone-input-2/lib/style.css";

export default function FabricRequestModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/api/fabric-request", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
      } else {
        toast.success("Fabric request sent successfully");
        setName("");
        setPhone("");
        setDescription("");
        setFile(null);
        onClose();
      }
    } catch (err) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <form
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl bg-white p-5 text-[#171412] shadow-2xl dark:bg-neutral-950 dark:text-white sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 transition hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Close fabric finder form"
        >
          <X size={18} />
        </button>

        <h3 className="pr-10 text-2xl font-semibold">Fabric sourcing request</h3>
        <p className="mt-3 text-sm leading-6 text-[#70665d] dark:text-neutral-400">
          Send your sample and details. The team will help source the fabric or suggest the closest available option.
        </p>

        <div className="mt-6 space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[#171412] outline-none transition focus:border-[#9c653d] dark:border-white/10 dark:bg-neutral-900 dark:text-white"
          />

          <PhoneInput
            country="ng"
            value={phone}
            onChange={(value) => setPhone(value)}
            enableSearch
            countryCodeEditable={false}
            inputClass="!w-full !h-12 !rounded-xl !border-black/10 !bg-white !text-sm !text-black focus:!border-[#9c653d] dark:!border-white/10 dark:!bg-neutral-900 dark:!text-white"
            buttonClass="!rounded-l-xl !border-black/10 !bg-white dark:!border-white/10 dark:!bg-neutral-900"
            dropdownClass="!bg-white !text-black dark:!bg-neutral-900 dark:!text-white"
          />

          <textarea
            placeholder="What fabric are you looking for? Color, texture, quantity, deadline, or where you saw it"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-[#171412] outline-none transition focus:border-[#9c653d] dark:border-white/10 dark:bg-neutral-900 dark:text-white"
          />

          <label className="block rounded-xl border border-dashed border-black/20 bg-black/[0.02] px-4 py-3 text-sm text-[#70665d] transition hover:border-[#9c653d] dark:border-white/15 dark:bg-white/5 dark:text-neutral-300">
            <span className="font-semibold text-[#171412] dark:text-white">Upload fabric sample</span>
            <span className="mt-1 block break-words text-xs">
              {file ? file.name : "Image or video sample required"}
            </span>
            <input
              type="file"
              accept="image/*,video/*"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#171412] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2a241f] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            {loading && <Loader2 className="animate-spin" size={17} />}
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
