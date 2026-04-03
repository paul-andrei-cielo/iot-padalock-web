"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Parcel {
  _id: string;
  trackingNumber: string;
  parcelName: string;
  status: "PENDING" | "DELIVERED" | "RETRIEVED";
  deliveryDate: string | null;
  retrievedDate: string | null;
}

interface OverviewStats {
  pending: number;
  delivered: number;
  retrieved: number;
}

const navItems = [
  { label: "REGISTER", href: "/register" },
  { label: "ACTIVITY", href: "/activity" },
  { label: "ACCOUNT", href: "/account" },
];

export default function HomePage() {
  const router = useRouter();

  const [stats, setStats] = useState<OverviewStats>({
    pending: 0,
    delivered: 0,
    retrieved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        console.log("No token, redirecting to login...");
        router.push("/login");
        return;
      }

      const response = await fetch("/api/parcels", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch parcels");
      }

      const parcels: Parcel[] = await response.json();

      const stats = parcels.reduce(
        (acc, parcel) => {
          switch (parcel.status) {
            case "PENDING":
              acc.pending++;
              break;
            case "DELIVERED":
              acc.delivered++;
              break;
            case "RETRIEVED":
              acc.retrieved++;
              break;
          }
          return acc;
        },
        { pending: 0, delivered: 0, retrieved: 0 } as OverviewStats
      );

      setStats(stats);
    } catch (err) {
      setError("Failed to load parcel stats");
      console.error("Error fetching parcels:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

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
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition hover:opacity-80"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <section className="flex min-h-0 flex-1">
          <div className="flex min-h-0 w-full flex-col rounded-[2rem] bg-white/25 p-4 backdrop-blur-sm sm:p-5 md:p-6">
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <h2 className="text-xl font-extrabold text-white md:text-2xl">
                Overview
              </h2>
              <button
                onClick={fetchOverviewStats}
                disabled={loading}
                className="rounded-full bg-white/30 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/40 disabled:opacity-50 md:text-base"
              >
                {loading ? "⟳" : "↻"}
              </button>
            </div>

            {error ? (
              <div className="flex flex-1 items-center justify-center rounded-[1.5rem] bg-white/30 p-6">
                <p className="text-center text-sm text-white/80">{error}</p>
              </div>
            ) : (
              <div className="grid min-h-0 flex-1 gap-4 sm:grid-cols-1 md:grid-cols-3">
                <div className="flex min-h-[170px] flex-col rounded-[1.5rem] bg-white/50 p-4 transition hover:scale-[1.02] md:p-5">
                  <h3 className="text-center text-base font-extrabold text-[#df4473] md:text-lg lg:text-xl">
                    Pending
                  </h3>
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-5xl font-light text-[#df4473] md:text-6xl lg:text-7xl">
                      {formatNumber(stats.pending)}
                    </p>
                  </div>
                </div>

                <div className="flex min-h-[170px] flex-col rounded-[1.5rem] bg-white/50 p-4 transition hover:scale-[1.02] md:p-5">
                  <h3 className="text-center text-base font-extrabold text-[#df4473] md:text-lg lg:text-xl">
                    Delivered
                  </h3>
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-5xl font-light text-[#df4473] md:text-6xl lg:text-7xl">
                      {formatNumber(stats.delivered)}
                    </p>
                  </div>
                </div>

                <div className="flex min-h-[170px] flex-col rounded-[1.5rem] bg-white/50 p-4 transition hover:scale-[1.02] md:p-5">
                  <h3 className="text-center text-base font-extrabold text-[#df4473] md:text-lg lg:text-xl">
                    Retrieved
                  </h3>
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <p className="text-5xl font-light text-[#df4473] md:text-6xl lg:text-7xl">
                      {formatNumber(stats.retrieved)}
                    </p>
                    <div className="mt-2 flex w-full max-w-[120px] items-center justify-between rounded-full bg-white/50 px-3 py-1 text-xs text-[#df4473]">
                      <span>Today</span>
                      <span>˅</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}