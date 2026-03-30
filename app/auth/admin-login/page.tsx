"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { Eye, EyeOff } from "lucide-react";
import { login } from "../../../lib/auth.api"; // adjust path
import { toast } from "sonner";
import AuthHeader from "@/app/components/AuthHeader";


export default function LoginPage() {
  const router = useRouter(); // ✅ INITIALIZE ROUTER

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogginIn, setIsLogginIn] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLogginIn(true);

  try {
    const data = await login({ email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    toast.success("Login successful");

    router.push("/admin/dashboard");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Login failed"
    );
  } finally {
    setIsLogginIn(false);
  }
};


  return (
      <div className="min-h-screen bg-background">
    <AuthHeader />

    {/* Push content below fixed header */}
    <div className="pt-28 px-4 pb-16">
       <div className="max-w-md mx-auto w-full bg-white dark:bg-neutral-800 p-8 md:p-10 shadow-md rounded-2xl">
         <h1 className="text-2xl font-bold text-center mb-6 tracking-tight text-neutral-900 dark:text-neutral-100">
          Admin Log In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
             <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-200 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="#"
              className="text-sm text-neutral-400 hover:text-neutral-600 transition"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="button"
            isLoading={isLogginIn}
            loadingText="Logging in..."
            onClick={handleSubmit}
            className="w-full bg-black dark:bg-white dark:text-black text-white font-semibold py-3 rounded-lg hover:bg-black/80 dark:hover:bg-white/90 transition"
          >
            Login
          </Button>
        </form>

        {/* <div className="text-center mt-8">
          <span className="text-neutral-400 text-sm">
            New to our site?{" "}
            <Link
              href="/auth/signup"
              className="text-neutral-900 font-semibold hover:underline transition"
            >
              Sign Up
            </Link>
          </span>
        </div> */}
      </div>
    </div>
    </div>
  );
}
