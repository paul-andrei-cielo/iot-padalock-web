"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type ParcelStatus = "PENDING" | "DELIVERED" | "RETRIEVED";
type ViewMode = "MAIN_ACTIVITY" | "AUDIT_LOGS";
type FilterStatus = "ALL" | ParcelStatus;

interface ActivityItem {
  id: string;
  trackingNumber: string;
  status: ParcelStatus;
  date: string;
  time: string;
  hasClip: boolean;
}

interface AuditLogItem {
  id: string;
  date: string;
  time: string;
  event: string;
}

const navItems = [
  { label: "REGISTER", href: "/register" },
  { label: "ACTIVITY", href: "/activity" },
  { label: "ACCOUNT", href: "/account" },
];

const activityData: ActivityItem[] = [
  {
    id: "1",
    trackingNumber: "PH5326...245G",
    status: "DELIVERED",
    date: "March 10, 2026",
    time: "13:30",
    hasClip: true,
  },
  {
    id: "2",
    trackingNumber: "JT2516...I222",
    status: "PENDING",
    date: "March 10, 2026",
    time: "13:30",
    hasClip: false,
  },
  {
    id: "3",
    trackingNumber: "PH2156...521G",
    status: "RETRIEVED",
    date: "March 10, 2026",
    time: "13:30",
    hasClip: true,
  },
];

const auditLogs: AuditLogItem[] = [
  { id: "a1", date: "April 21, 2025", time: "5:50 PM", event: "Lock engaged" },
  { id: "a2", date: "April 21, 2025", time: "5:50 PM", event: "Lid closed" },
  { id: "a3", date: "April 21, 2025", time: "5:50 PM", event: "Lid opened" },
  { id: "a4", date: "April 21, 2025", time: "5:49 PM", event: "Valid PIN entered" },
  { id: "a5", date: "April 21, 2025", time: "5:30 PM", event: "Failed PIN attempt" },
  { id: "a6", date: "April 21, 2025", time: "5:00 PM", event: "Lock engaged" },
  { id: "a7", date: "April 21, 2025", time: "5:00 PM", event: "Lid closed" },
  { id: "a8", date: "April 21, 2025", time: "4:58 PM", event: "Parcel detected" },
  { id: "a9", date: "April 21, 2025", time: "4:55 PM", event: "Courier access granted" },
  { id: "a10", date: "April 21, 2025", time: "4:54 PM", event: "System armed" },
];

const statusStyles: Record<
  ParcelStatus,
  {
    label: string;
    pill: string;
  }
> = {
  PENDING: {
    label: "Pending",
    pill: "bg-[#f3dfd0] text-[#d46a1a]",
  },
  DELIVERED: {
    label: "Delivered",
    pill: "bg-[#b9d7c5] text-[#0b6d3b]",
  },
  RETRIEVED: {
    label: "Retrieved",
    pill: "bg-[#c5dde3] text-[#0d7d97]",
  },
};

const scrollbarClass =
  "[&::-webkit-scrollbar]:w-2.5 " +
  "[&::-webkit-scrollbar-track]:bg-[#f2d9e2] " +
  "[&::-webkit-scrollbar-track]:rounded-full " +
  "[&::-webkit-scrollbar-thumb]:bg-[#d985a1] " +
  "[&::-webkit-scrollbar-thumb]:rounded-full " +
  "hover:[&::-webkit-scrollbar-thumb]:bg-[#cf6c91]";

export default function ActivityPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("MAIN_ACTIVITY");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");

  const filteredActivities = useMemo(() => {
    if (activeFilter === "ALL") return activityData;
    return activityData.filter((item) => item.status === activeFilter);
  }, [activeFilter]);

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
                const isActive = item.label === "ACTIVITY";

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
                Activity
              </h1>

              <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:min-w-[420px] lg:flex-nowrap">
                <button
                  onClick={() => setViewMode("MAIN_ACTIVITY")}
                  className={`flex-1 rounded-full px-6 py-2.5 text-sm font-bold transition md:text-base ${
                    viewMode === "MAIN_ACTIVITY"
                      ? "bg-white text-[#de517e]"
                      : "bg-[#de517e] text-white hover:opacity-90"
                  }`}
                >
                  Main Activity
                </button>

                <button
                  onClick={() => setViewMode("AUDIT_LOGS")}
                  className={`flex-1 rounded-full px-6 py-2.5 text-sm font-bold transition md:text-base ${
                    viewMode === "AUDIT_LOGS"
                      ? "bg-white text-[#de517e]"
                      : "bg-[#de517e] text-white hover:opacity-90"
                  }`}
                >
                  Audit Logs
                </button>
              </div>
            </div>

            {viewMode === "MAIN_ACTIVITY" ? (
              <>
                <div className="mb-5 shrink-0 rounded-[1.75rem] bg-white/35 p-2">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {[
                      { label: "All", value: "ALL" },
                      { label: "Pending", value: "PENDING" },
                      { label: "Delivered", value: "DELIVERED" },
                      { label: "Retrieved", value: "RETRIEVED" },
                    ].map((filter) => {
                      const isActive = activeFilter === filter.value;

                      return (
                        <button
                          key={filter.value}
                          onClick={() =>
                            setActiveFilter(filter.value as FilterStatus)
                          }
                          className={`rounded-full px-4 py-3 text-sm font-extrabold transition md:text-lg ${
                            isActive
                              ? "bg-[#dd96ad] text-white"
                              : "text-[#df8daa] hover:bg-white/50"
                          }`}
                        >
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={`min-h-0 flex-1 overflow-y-auto pr-1 ${scrollbarClass}`}>
                  <div className="flex flex-col gap-4">
                    {filteredActivities.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 rounded-[1.75rem] bg-white/45 px-5 py-5 transition hover:bg-white/55 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="min-w-0">
                          <h2 className="truncate text-xl font-extrabold text-[#df8daa] md:text-2xl">
                            {item.trackingNumber}
                          </h2>
                          <p className="text-sm text-[#df8daa] md:text-base">
                            {item.date} | {item.time}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <span
                            className={`inline-flex min-w-[150px] items-center justify-center rounded-full px-6 py-3 text-base font-extrabold md:min-w-[180px] md:text-lg ${
                              statusStyles[item.status].pill
                            }`}
                          >
                            {statusStyles[item.status].label}
                          </span>

                          {item.hasClip && (
                            <button className="inline-flex min-w-[150px] items-center justify-center rounded-full bg-white/80 px-6 py-3 text-base font-extrabold text-[#1487a0] transition hover:bg-white md:min-w-[180px] md:text-lg">
                              ▶ View Clip
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredActivities.length === 0 && (
                      <div className="flex min-h-[220px] items-center justify-center rounded-[1.75rem] bg-white/35 px-6 py-8">
                        <p className="text-center text-base font-medium text-[#df8daa] md:text-lg">
                          No activity found for this category.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="min-h-0 flex-1 pb-3">
                <div className="flex h-full min-h-0 flex-col rounded-[2rem] bg-white/20 p-3">
                  <div className="mb-3 hidden shrink-0 grid-cols-[1.1fr_0.75fr_2fr] gap-3 rounded-[1.5rem] bg-white/35 px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-[#de517e] md:grid md:px-6 md:text-base">
                    <p>Date</p>
                    <p>Time</p>
                    <p>Event</p>
                  </div>

                  <div className={`min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 ${scrollbarClass}`}>
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-[1.5rem] bg-white/40 px-4 py-4 text-[#d96f92] shadow-[0_4px_16px_rgba(255,255,255,0.08)] backdrop-blur-sm transition hover:bg-white/50 md:grid md:grid-cols-[1.1fr_0.75fr_2fr] md:gap-3 md:px-6"
                      >
                        <p className="text-sm font-medium md:text-base">
                          <span className="mr-2 font-extrabold md:hidden">Date:</span>
                          {log.date}
                        </p>
                        <p className="mt-1 text-sm font-medium md:mt-0 md:text-base">
                          <span className="mr-2 font-extrabold md:hidden">Time:</span>
                          {log.time}
                        </p>
                        <p className="mt-1 text-sm font-semibold md:mt-0 md:text-base">
                          <span className="mr-2 font-extrabold md:hidden">Event:</span>
                          {log.event}
                        </p>
                      </div>
                    ))}
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