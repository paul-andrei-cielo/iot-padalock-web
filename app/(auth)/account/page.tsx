"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  User,
  Pencil,
  LockKeyhole,
  Eye,
  EyeOff,
  LogOut,
  Send,
  Trash2,
} from "lucide-react";

const navItems = [
  { label: "REGISTER", href: "/register" },
  { label: "ACTIVITY", href: "/activity" },
  { label: "ACCOUNT", href: "/account" },
];

const scrollbarClass =
  "[&::-webkit-scrollbar]:w-2.5 " +
  "[&::-webkit-scrollbar-track]:bg-[#f2d9e2] " +
  "[&::-webkit-scrollbar-track]:rounded-full " +
  "[&::-webkit-scrollbar-thumb]:bg-[#d985a1] " +
  "[&::-webkit-scrollbar-thumb]:rounded-full " +
  "hover:[&::-webkit-scrollbar-thumb]:bg-[#cf6c91]";

export default function AccountPage() {
  const [showChangePinCard, setShowChangePinCard] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showOldPin, setShowOldPin] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-b from-[#df4473] via-[#e99ab1] to-[#f4eff1] px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex h-full w-full flex-col gap-4">
        <header className="shrink-0 rounded-[1.5rem] bg-[#FFFFFF]/25 px-4 py-3 backdrop-blur-sm md:px-6 md:py-3 lg:px-8 lg:py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Image
              src="/padalock-logo.png"
              alt="PadaLock logo"
              width={340}
              height={70}
              className="h-auto w-[140px] sm:w-[180px] md:w-[220px] lg:w-[260px]"
              priority
            />

            <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-white sm:text-sm md:text-base lg:justify-end lg:gap-x-6 lg:text-lg">
              {navItems.map((item) => {
                const isActive = item.label === "ACCOUNT";

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`transition hover:opacity-80 ${
                      isActive ? "font-extrabold" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <section className="min-h-0 flex-1 overflow-hidden rounded-[2rem] bg-white/25 p-4 backdrop-blur-sm sm:p-5 md:p-6">
          <div className="flex h-full min-h-0 flex-col">
            <div className="mb-5 flex shrink-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h1 className="text-2xl font-extrabold text-white md:text-3xl">
                Account Settings
              </h1>

              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#de517e] px-6 py-2.5 text-sm font-extrabold text-white transition hover:opacity-90 md:text-base">
                <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                Logout
              </button>
            </div>

            <div className={`min-h-0 flex-1 overflow-y-auto pr-1 ${scrollbarClass}`}>
              <div className="flex flex-col gap-4 pb-1">
                <div className="rounded-[1.75rem] bg-white/45 p-4 md:p-5">
                  <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#de517e] text-white">
                        <User className="h-5 w-5" />
                      </div>
                      <h2 className="text-xl font-extrabold text-[#de517e] md:text-2xl">
                        Profile Information
                      </h2>
                    </div>

                    <button className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#de517e] px-5 py-2 text-sm font-extrabold text-[#de517e] transition hover:bg-[#de517e] hover:text-white md:text-base">
                      <Pencil className="h-4 w-4" />
                      Edit Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.4fr]">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#de517e] md:text-base">
                        First Name
                      </label>
                      <div className="rounded-full bg-[#f6f1f3] px-5 py-3 text-base text-[#d695aa] md:text-lg">
                        Sophie Ella
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#de517e] md:text-base">
                        Last Name
                      </label>
                      <div className="rounded-full bg-[#f6f1f3] px-5 py-3 text-base text-[#d695aa] md:text-lg">
                        Mausisa
                      </div>
                    </div>

                    <div className="md:col-span-2 xl:col-span-1">
                      <label className="mb-2 block text-sm font-semibold text-[#de517e] md:text-base">
                        Email
                      </label>
                      <div className="rounded-full bg-[#f6f1f3] px-5 py-3 text-base text-[#d695aa] md:text-lg break-all">
                        user@example.com
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-white/45 p-4 md:p-5">
                  <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#de517e] text-white">
                        <LockKeyhole className="h-5 w-5" />
                      </div>
                      <h2 className="text-xl font-extrabold text-[#de517e] md:text-2xl">
                        Locker PIN
                      </h2>
                    </div>

                    <button
                      onClick={() => setShowChangePinCard((prev) => !prev)}
                      className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-extrabold transition md:text-base ${
                        showChangePinCard
                          ? "bg-[#de517e] text-white hover:opacity-90"
                          : "border-2 border-[#de517e] text-[#de517e] hover:bg-[#de517e] hover:text-white"
                      }`}
                    >
                      {showChangePinCard ? "Save Changes" : "Update PIN"}
                    </button>
                  </div>

                  <div className="rounded-[1.5rem] bg-[#f3dfd0] px-4 py-4 md:px-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-xl font-extrabold text-[#d46a1a] md:text-2xl">
                          Current PIN
                        </h3>
                        <p className="text-sm text-[#d46a1a] md:text-base">
                          Used to open the PadaBox for parcel retrieval.
                        </p>
                      </div>

                      <div className="relative w-full lg:max-w-[320px]">
                        <input
                          type={showCurrentPin ? "text" : "password"}
                          value="1234"
                          readOnly
                          className="w-full rounded-full bg-white/70 py-3 pl-6 pr-14 text-center text-xl tracking-[0.35em] text-[#d46a1a] outline-none"
                        />
                        <button
                          onClick={() => setShowCurrentPin((prev) => !prev)}
                          className="absolute inset-y-0 right-4 flex items-center text-[#d46a1a] transition hover:opacity-80"
                        >
                          {showCurrentPin ? (
                            <EyeOff className="h-6 w-6" />
                          ) : (
                            <Eye className="h-6 w-6" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {showChangePinCard && (
                  <div className="rounded-[1.75rem] bg-[#e7b8c8]/85 p-4 md:p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#de517e]">
                        <LockKeyhole className="h-5 w-5" />
                      </div>
                      <h2 className="text-xl font-extrabold text-white md:text-2xl">
                        Change PIN
                      </h2>
                    </div>

                    <div className="relative flex flex-col gap-4">
                      <div className="absolute bottom-10 left-[1.7rem] top-10 hidden w-[2px] bg-[#de517e]/65 md:block" />

                      <div className="relative flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#de517e] text-xl font-extrabold text-white">
                          1
                        </div>

                        <div className="flex-1 rounded-[1.5rem] bg-white/65 px-4 py-4 md:px-6">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <p className="text-lg font-extrabold text-[#de517e] md:text-2xl">
                              Enter current 4-digit PIN
                            </p>

                            <div className="relative w-full lg:w-[360px]">
                              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#de517e]" />
                              <input
                                type={showOldPin ? "text" : "password"}
                                maxLength={4}
                                placeholder="Enter 4-digit PIN"
                                className="h-14 w-full rounded-full bg-[#f7f7f7] pl-12 pr-14 text-base text-[#de517e] outline-none placeholder:text-[#e08ca8] md:text-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setShowOldPin((prev) => !prev)}
                                className="absolute inset-y-0 right-4 flex items-center text-[#de517e] transition hover:opacity-80"
                              >
                                {showOldPin ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#de517e] text-xl font-extrabold text-white">
                          2
                        </div>

                        <div className="flex-1 rounded-[1.5rem] bg-white/65 px-4 py-4 md:px-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                              <p className="text-lg font-extrabold text-[#de517e] md:text-2xl">
                                Send verification code to email
                              </p>

                              <div className="relative w-full lg:w-[360px]">
                                <Send className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#de517e]" />
                                <input
                                  type={showCode ? "text" : "password"}
                                  maxLength={6}
                                  placeholder="Enter 6-digit code"
                                  className="h-14 w-full rounded-full bg-[#f7f7f7] pl-12 pr-14 text-base text-[#de517e] outline-none placeholder:text-[#e08ca8] md:text-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCode((prev) => !prev)}
                                  className="absolute inset-y-0 right-4 flex items-center text-[#de517e] transition hover:opacity-80"
                                >
                                  {showCode ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <button className="rounded-full bg-[#de517e] px-6 py-3 text-base font-extrabold text-white transition hover:opacity-90 md:text-lg">
                              Send Code
                            </button>
                            <button className="rounded-full bg-[#de517e] px-6 py-3 text-base font-extrabold text-white transition hover:opacity-90 md:text-lg">
                              Verify
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#de517e] text-xl font-extrabold text-white">
                          3
                        </div>

                        <div className="flex-1 rounded-[1.5rem] bg-white/65 px-4 py-4 md:px-6">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <p className="text-lg font-extrabold text-[#de517e] md:text-2xl">
                              Enter New PIN
                            </p>

                            <div className="relative w-full lg:w-[360px]">
                              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#de517e]" />
                              <input
                                type={showNewPin ? "text" : "password"}
                                maxLength={4}
                                placeholder="Enter new 4-digit PIN"
                                className="h-14 w-full rounded-full bg-[#f7f7f7] pl-12 pr-14 text-base text-[#de517e] outline-none placeholder:text-[#e08ca8] md:text-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPin((prev) => !prev)}
                                className="absolute inset-y-0 right-4 flex items-center text-[#de517e] transition hover:opacity-80"
                              >
                                {showNewPin ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#de517e] text-xl font-extrabold text-white">
                          4
                        </div>

                        <div className="flex-1 rounded-[1.5rem] bg-white/65 px-4 py-4 md:px-6">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <p className="text-lg font-extrabold text-[#de517e] md:text-2xl">
                              Confirm New PIN
                            </p>

                            <div className="relative w-full lg:w-[360px]">
                              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#de517e]" />
                              <input
                                type={showConfirmPin ? "text" : "password"}
                                maxLength={4}
                                placeholder="Confirm new PIN"
                                className="h-14 w-full rounded-full bg-[#f7f7f7] pl-12 pr-14 text-base text-[#de517e] outline-none placeholder:text-[#e08ca8] md:text-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPin((prev) => !prev)}
                                className="absolute inset-y-0 right-4 flex items-center text-[#de517e] transition hover:opacity-80"
                              >
                                {showConfirmPin ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-1">
                        <button className="w-full rounded-full bg-[#de517e] px-6 py-3 text-base font-extrabold text-white transition hover:opacity-90 md:text-lg">
                          Update PIN
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-[1.75rem] bg-[#f28a92]/95 p-4 md:p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#ef1f1f]">
                      <Trash2 className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-extrabold text-white md:text-2xl">
                      Account Deletion
                    </h2>
                  </div>

                  <div className="rounded-[1.5rem] bg-white/70 px-4 py-4 md:px-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold text-[#ef1f1f] md:text-2xl">
                          Delete Account
                        </h3>
                        <p className="text-sm text-[#ef1f1f] md:text-base">
                          This will permanently delete your account and all records.
                        </p>
                      </div>

                      <button className="inline-flex items-center justify-center rounded-full bg-[#ef1f1f] px-6 py-3 text-base font-extrabold text-white transition hover:opacity-90 md:text-lg">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}