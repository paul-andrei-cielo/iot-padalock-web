"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordsDoNotMatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Frontend-only behavior
    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
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
              Create an
              <br />
              account
            </h2>
          </div>
        </section>

        <section className="flex w-full max-w-xl justify-center lg:justify-end">
          <div className="w-full rounded-[2rem] bg-[#f6e8ec]/50 p-8 shadow-[0_20px_60px_rgba(214,84,126,0.18)] backdrop-blur-sm md:p-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-full border border-red-300 bg-red-100/80 p-4 text-center text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-lg font-medium text-[#e34774]"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="First name"
                    className="h-12 w-full rounded-full bg-[#f8f4f5] px-6 text-base text-[#db416a] outline-none placeholder:text-[#e79baf] focus:ring-2 focus:ring-[#e33e70]"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-lg font-medium text-[#e34774]"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Last name"
                    className="h-12 w-full rounded-full bg-[#f8f4f5] px-6 text-base text-[#db416a] outline-none placeholder:text-[#e79baf] focus:ring-2 focus:ring-[#e33e70]"
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="user@example.com"
                  className="h-12 w-full rounded-full bg-[#f8f4f5] px-6 text-base text-[#db416a] outline-none placeholder:text-[#e79baf] focus:ring-2 focus:ring-[#e33e70]"
                  disabled={isLoading}
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
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Your password"
                  className={`h-12 w-full rounded-full bg-[#f8f4f5] px-6 text-base text-[#db416a] outline-none placeholder:text-[#e79baf] focus:ring-2 ${
                    passwordsDoNotMatch
                      ? "ring-2 ring-red-400 focus:ring-red-500"
                      : passwordsMatch
                      ? "ring-2 ring-green-400 focus:ring-green-500"
                      : "focus:ring-[#e33e70]"
                  }`}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-lg font-medium text-[#e34774]"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm your password"
                  className={`h-12 w-full rounded-full bg-[#f8f4f5] px-6 text-base text-[#db416a] outline-none placeholder:text-[#e79baf] focus:ring-2 ${
                    passwordsDoNotMatch
                      ? "ring-2 ring-red-400 focus:ring-red-500"
                      : passwordsMatch
                      ? "ring-2 ring-green-400 focus:ring-green-500"
                      : "focus:ring-[#e33e70]"
                  }`}
                  disabled={isLoading}
                />

                <div className="mt-2 min-h-[20px] px-2 text-sm">
                  {passwordsDoNotMatch && (
                    <p className="text-red-600">Passwords do not match</p>
                  )}
                  {passwordsMatch && (
                    <p className="text-green-600">Passwords match</p>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isLoading || passwordsDoNotMatch}
                  className="flex h-12 min-w-[190px] items-center justify-center gap-2 rounded-full bg-[#db416a] px-8 text-lg font-bold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </button>
              </div>

              <p className="mt-4 text-center text-sm text-[#db416a]">
                Already have an account?{" "}
                <Link href="/login" className="font-bold hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}