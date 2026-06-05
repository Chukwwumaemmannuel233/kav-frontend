"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { login } from "@/lib/auth.api";
import { toast } from "sonner";
import AuthHeader from "../../components/AuthHeader";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const data = await login({ email, password });
      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful", { duration: 1500 });
      router.push("/user/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Invalid email or password",
        { duration: 1500 }
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171412] transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      <AuthHeader />

      <div className="relative isolate min-h-screen overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(142,79,37,0.16),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(23,20,18,0.10),transparent_26%)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(228,185,137,0.12),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.08),transparent_26%)]" />
        </div>

        <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:py-14">
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#8e4f25] backdrop-blur dark:border-white/10 dark:bg-white/8 dark:text-[#e4b989]">
                <ShieldCheck size={15} />
                Secure access
              </span>
              <h1 className="mt-6 text-6xl font-semibold leading-[1.02] tracking-normal">
                Welcome back to your fabric workspace.
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#70665d] dark:text-neutral-400">
                Sign in to continue sourcing fabrics, managing orders, and keeping your textile selections close.
              </p>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4">
              <div className="rounded-3xl border border-black/10 bg-white/70 p-5 backdrop-blur dark:border-white/10 dark:bg-white/8">
                <p className="text-3xl font-semibold">24/7</p>
                <p className="mt-2 text-sm leading-6 text-[#70665d] dark:text-neutral-400">Access your saved account area anytime.</p>
              </div>
              <div className="rounded-3xl border border-black/10 bg-white/70 p-5 backdrop-blur dark:border-white/10 dark:bg-white/8">
                <p className="text-3xl font-semibold">Fast</p>
                <p className="mt-2 text-sm leading-6 text-[#70665d] dark:text-neutral-400">Jump back into orders and fabric browsing.</p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 text-center lg:hidden">
              <h1 className="text-3xl font-semibold tracking-normal">Welcome back</h1>
              <p className="mt-2 text-sm text-[#70665d] dark:text-neutral-400">
                Sign in to continue.
              </p>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-white/85 p-5 shadow-2xl shadow-black/8 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/88 sm:p-7 md:p-8">
              <div className="mb-7">
                <h2 className="text-2xl font-semibold tracking-normal">Log in</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email address
                  </label>
                  <div className="flex min-h-12 items-center rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 transition focus-within:border-[#8e4f25] dark:border-white/10 dark:bg-neutral-950 dark:focus-within:border-[#e4b989]">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#8d8379] dark:placeholder:text-neutral-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Password
                  </label>
                  <div className="flex min-h-12 items-center rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 transition focus-within:border-[#8e4f25] dark:border-white/10 dark:bg-neutral-950 dark:focus-within:border-[#e4b989]">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                      className="auth-input w-full bg-transparent py-3 pr-9 text-sm outline-none placeholder:text-[#8d8379] dark:placeholder:text-neutral-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0 text-[#8d8379] transition hover:text-[#171412] dark:text-neutral-500 dark:hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-sm font-medium text-[#70665d] transition hover:text-[#171412] dark:text-neutral-400 dark:hover:text-white"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  isLoading={isLoggingIn}
                  loadingText="Logging in..."
                  className="min-h-12 w-full rounded-full bg-[#171412] py-3 text-sm font-bold text-white transition hover:bg-[#2a241f] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                >
                  <span>Login</span>
                  <ArrowRight size={17} />
                </Button>
              </form>

              <div className="mt-7 text-center text-sm text-[#70665d] dark:text-neutral-400">
                New to our site?{" "}
                <Link
                  href="/auth/signup"
                  className="font-bold text-[#171412] transition hover:opacity-70 dark:text-white"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
