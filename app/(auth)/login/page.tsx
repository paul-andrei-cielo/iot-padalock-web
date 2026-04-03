'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    setTimeout(() => {
      localStorage.setItem("token", "dummy-token");
      router.push("/home");
    }, 800);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f6f2f4] via-[#efc7d3] to-[#df4f7d] px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-between gap-10">
        <section className="flex-1 text-white">
          <div className="mb-16 flex items-center gap-4">
            <div className="mb-16">
              <Image
                src="/padalock-logo.png"
                alt="PadaLock Logo"
                width={390}
                height={90}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-extrabold leading-[1.2] md:text-5xl">
              Login to
              <br />
              your account
            </h2>
          </div>
        </section>

        <section className="flex w-full max-w-xl justify-center lg:justify-end">
          <div className="w-full rounded-[2rem] bg-[#f6e8ec]/50 p-8 shadow-[0_20px_60px_rgba(214,84,126,0.18)] backdrop-blur-sm md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-lg font-medium text-[#e34774]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  className="h-14 w-full rounded-full border-none bg-[#f8f4f5] px-6 text-lg text-[#db416a] outline-none placeholder:text-[#e79baf] focus:ring-2 focus:ring-[#e33e70]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-lg font-medium text-[#e34774]"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="h-14 w-full rounded-full border-none bg-[#f8f4f5] px-6 text-lg text-[#db416a] outline-none placeholder:text-[#e79baf] focus:ring-2 focus:ring-[#e33e70]"
                />
                <p className="mt-2 text-center text-sm text-[#db416a]">
                  <Link href="/forgot-password" className="hover:underline">
                    Forgot password?
                  </Link>
                </p>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-base text-[#db416a]">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="font-bold hover:underline">
                    Sign up
                  </Link>
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 min-w-[150px] items-center justify-center gap-2 rounded-full bg-[#db416a] px-6 text-lg font-bold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}