"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation"; //
import { signup } from "@/lib/auth.api";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter(); // ✅ INITIALIZE ROUTER
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignUp(true);

    try {
      const data = await signup({
        name,
        email,
        password,
      });

      // If backend returns token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      toast.success("Account created successfully", { duration: 1500 });

      router.push("/pages/user/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed", { duration: 1500 });
    } finally {
      setIsSignUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      {/* Compact Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 tracking-tight">
          Create Account
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none placeholder:text-neutral-400"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none placeholder:text-neutral-400"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg pr-10 focus:outline-none placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Repeat password"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg pr-10 focus:outline-none placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            isLoading={isSignUp}
            loadingText="Signing Up..."
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-neutral-800 transition mt-4"
          >
            Sign Up
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-neutral-600 mt-4">
            Already have an account?{" "}
            <Link
              href="/pages/auth/login"
              className="text-black font-semibold hover:opacity-70"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
