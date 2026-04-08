"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

type ParcelStatus = "PENDING" | "DELIVERED" | "RETRIEVED";
type ViewMode = "MAIN_ACTIVITY" | "AUDIT_LOGS";
type FilterStatus = "ALL" | ParcelStatus;

interface Parcel {
  _id: string;
  trackingNumber: string;
  parcelName: string;
  status: string;
  createdAt: string;
  userId: string;
  deliveryDate?: string;
  retrievedDate?: string;
}

interface Log {
  _id: string;
  userId: string;
  lockerId: string;
  actor: string;
  action: string;
  success: boolean;
  details: string;
  timestamp: string;
}

interface Locker {
  _id: string;
  code: string;
  status: string;
  failedPinAttempts: number;
  lockout: boolean;
}

interface ActivityItem {
  id: string;
  trackingNumber: string;
  status: ParcelStatus;
  date: string;
  time: string;
  parcelName?: string;
}

const navItems = [
  { label: "REGISTER", href: "/register" },
  { label: "ACTIVITY", href: "/activity" },
  { label: "ACCOUNT", href: "/account" },
];

const API_BASE = "/api/parcels";
const LOGS_API = "/api/logs";
const LOCKER_API = "/api/locker";

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
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [locker, setLocker] = useState<Locker | null>(null);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found");
        setParcels([]);
        return;
      }

      const res = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error(errorData.error || "Failed to fetch parcels");
      }
      
      const data = await res.json();
      setParcels(Array.isArray(data) ? data : []);
      setError(""); 
    } catch (err: any) {
      console.error("Error fetching parcels:", err);
      setError(err.message || "Failed to load parcels");
      setParcels([]); 
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const res = await fetch(LOGS_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error(errorData.error || "Failed to fetch logs");
      }
      
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
      setError(""); 
    } catch (err: any) {
      console.error("Error fetching logs:", err);
      setError(err.message || "Failed to load logs");
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchLocker = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(LOCKER_API, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setLocker(data);
      }
    } catch (err) {
      console.error("Error fetching locker:", err);
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "AUDIT_LOGS") {
      fetchLogs();
      fetchLocker();
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return "N/A";
    }
  };

  const formatTime = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return "N/A";
    }
  };

  const activities: ActivityItem[] = useMemo(() => {
    return parcels.map((parcel) => {
      let activityDate = parcel.createdAt;
      let status: ParcelStatus = parcel.status as ParcelStatus;
      
      if (status === "DELIVERED" && parcel.deliveryDate) {
        activityDate = parcel.deliveryDate;
      } else if (status === "RETRIEVED" && parcel.retrievedDate) {
        activityDate = parcel.retrievedDate;
      }
      
      return {
        id: parcel._id,
        trackingNumber: parcel.trackingNumber,
        status,
        date: formatDate(activityDate),
        time: formatTime(activityDate),
        parcelName: parcel.parcelName !== "Parcel" ? parcel.parcelName : undefined,
      };
    });
  }, [parcels]); 

  const filteredActivities = useMemo(() => {
    if (activeFilter === "ALL") return activities;
    return activities.filter((item) => item.status === activeFilter);
  }, [activeFilter, activities]);

  const formattedAuditLogs = useMemo(() => {
    return logs.map((log) => ({
      id: log._id,
      date: formatDate(log.timestamp),
      time: formatTime(log.timestamp),
      event: formatLogEvent(log),
    })).slice(0, 20);
  }, [logs]);

  const formatLogEvent = (log: Log): string => {
    const { actor, action, success, details } = log;
    
    if (!success) {
      return "Failed PIN attempt";
    }

    switch (action) {
      case "PIN_ENTERED":
        return actor === "user" ? "Valid PIN entered" : "Courier access granted";
      case "LID_OPENED":
        return actor === "user" ? "Lid opened (PIN)" : "Lid opened (Courier)";
      case "LID_CLOSED":
        return "Lid closed";
      case "LOCK_ENGAGED":
        return "Lock engaged";
      case "PARCEL_DETECTED":
        return "Parcel detected";
      case "PIN_LOCKOUT":
        return "PIN lockout activated";
      case "PIN_RESET":
        return "PIN lockout reset";
      default:
        return `${action} by ${actor}`;
    }
  };

  if (loading) {
    return (
      <main className="h-screen overflow-hidden bg-gradient-to-b from-[#df4473] via-[#e99ab1] to-[#f4eff1] px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
        <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-4">
          <header className="rounded-[1.5rem] bg-[#FFFFFF]/25 px-4 py-3 backdrop-blur-sm md:px-6 md:py-3 lg:px-8 lg:py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Image
                src="/padalock-logo.png"
                alt="PadaLock logo"
                width={340}
                height={70}
                className="h-auto w-[140px] sm:w-[180px] md:w-[220px] lg:w-[260px]"
                priority
              />
              <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs font-medium text-white sm:text-sm md:text-base lg:gap-x-6 lg:text-lg">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`transition hover:opacity-80 ${
                      item.label === "ACTIVITY" ? "font-extrabold" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <section className="flex-1 overflow-hidden rounded-[2rem] bg-white/25 p-4 backdrop-blur-sm md:p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-xl font-bold text-white">Loading activity...</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-b from-[#df4473] via-[#e99ab1] to-[#f4eff1] px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-4">
        <header className="rounded-[1.5rem] bg-[#FFFFFF]/25 px-4 py-3 backdrop-blur-sm md:px-6 md:py-3 lg:px-8 lg:py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Image
              src="/padalock-logo.png"
              alt="PadaLock logo"
              width={340}
              height={70}
              className="h-auto w-[140px] sm:w-[180px] md:w-[220px] lg:w-[260px]"
              priority
            />
            <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs font-medium text-white sm:text-sm md:text-base lg:gap-x-6 lg:text-lg">
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

        <section className="flex-1 overflow-hidden rounded-[2rem] bg-white/25 p-4 backdrop-blur-sm md:p-6">
          <div className="flex h-full min-h-0 flex-col">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-extrabold text-white md:text-3xl">
                Activity
              </h1>

              <div className="flex w-full gap-3 md:w-auto md:min-w-[420px]">
                <button
                  onClick={() => handleViewModeChange("MAIN_ACTIVITY")}
                  className={`flex-1 rounded-full px-6 py-2.5 text-sm font-bold transition md:text-base ${
                    viewMode === "MAIN_ACTIVITY"
                      ? "bg-white text-[#de517e]"
                      : "bg-[#de517e] text-white hover:opacity-90"
                  }`}
                >
                  Main Activity
                </button>

                <button
                  onClick={() => handleViewModeChange("AUDIT_LOGS")}
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

            {error && (
              <div className="mb-5 rounded-lg bg-red-400/50 p-4 text-white">
                <p className="font-medium">{error}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={fetchParcels}
                    className="flex-1 rounded-full bg-white/20 px-4 py-1 text-sm font-bold text-white hover:bg-white/30 transition"
                  >
                    Retry Parcels
                  </button>
                  {viewMode === "AUDIT_LOGS" && (
                    <button
                      onClick={fetchLogs}
                      className="flex-1 rounded-full bg-white/20 px-4 py-1 text-sm font-bold text-white hover:bg-white/30 transition"
                    >
                      Retry Logs
                    </button>
                  )}
                </div>
              </div>
            )}

            {viewMode === "MAIN_ACTIVITY" ? (
              <>
                <div className="mb-5 rounded-[1.75rem] bg-white/35 p-2">
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

                <div className={`flex-1 min-h-0 overflow-y-auto pr-1 ${scrollbarClass}`}>
                  <div className="flex flex-col gap-4">
                    {filteredActivities.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 rounded-[1.75rem] bg-white/45 px-5 py-5 transition hover:bg-white/55 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="min-w-0">
                          <h2 className="truncate text-xl font-extrabold text-[#df8daa] md:text-2xl">
                            {item.trackingNumber}
                          </h2>
                          {item.parcelName && (
                            <p className="truncate text-base font-semibold text-[#df8daa]">
                              {item.parcelName}
                            </p>
                          )}
                          <p className="text-sm text-[#df8daa] md:text-base">
                            {item.date} | {item.time}
                          </p>
                        </div>

                        <span
                          className={`inline-flex min-w-[150px] items-center justify-center rounded-full px-6 py-3 text-base font-extrabold md:min-w-[180px] md:text-lg ${
                            statusStyles[item.status].pill
                          }`}
                        >
                          {statusStyles[item.status].label}
                        </span>
                      </div>
                    ))}

                    {filteredActivities.length === 0 && !loading && (
                      <div className="flex min-h-[220px] items-center justify-center rounded-[1.75rem] bg-white/35 px-6 py-8">
                        <p className="text-center text-base font-medium text-[#df8daa] md:text-lg">
                          No registered parcels found.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 min-h-0 pb-3">
                <div className="flex h-full min-h-0 flex-col rounded-[2rem] bg-white/20 p-3">
                  {locker && (
                    <div className="mb-4 rounded-[1.5rem] bg-white/40 p-4 shadow-lg">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-white/80 mb-1">Locker Status</p>
                          <p className="text-xl font-extrabold text-white">
                            {locker.status === "locked" ? "🔒 Locked" : "🔓 Unlocked"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-white/80">Failed Attempts</p>
                            <p className="text-2xl font-extrabold text-[#de517e]">
                              {locker.failedPinAttempts}
                            </p>
                          </div>
                          {locker.lockout && (
                            <span className="inline-block rounded-full bg-red-400/60 px-3 py-1 text-xs font-bold text-white">
                              LOCKED OUT
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-3 grid grid-cols-[1.1fr_0.75fr_2fr] gap-3 rounded-[1.5rem] bg-white/35 px-5 py-4 text-sm font-extrabold uppercase tracking-wide text-[#de517e] md:px-6 md:text-base">
                    <p>Date</p>
                    <p>Time</p>
                    <p>Event</p>
                  </div>

                  <div className={`flex-1 min-h-0 space-y-3 overflow-y-auto pr-1 ${scrollbarClass}`}>
                    {logsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#de517e]"></div>
                        <span className="ml-2 text-white/80">Loading logs...</span>
                      </div>
                    ) : formattedAuditLogs.length === 0 ? (
                      <div className="flex min-h-[200px] items-center justify-center rounded-[1.5rem] bg-white/30">
                        <p className="text-center text-base font-medium text-white/80">
                          No audit logs available yet.
                        </p>
                      </div>
                    ) : (
                      formattedAuditLogs.map((log) => (
                        <div
                          key={log.id}
                          className="grid grid-cols-[1.1fr_0.75fr_2fr] gap-3 rounded-[1.5rem] bg-white/40 px-5 py-4 text-[#d96f92] shadow-[0_4px_16px_rgba(255,255,255,0.08)] backdrop-blur-sm transition hover:bg-white/50 md:px-6"
                        >
                          <p className="text-sm font-medium md:text-base">{log.date}</p>
                          <p className="text-sm font-medium md:text-base">{log.time}</p>
                          <p className="text-sm font-semibold md:text-base">{log.event}</p>
                        </div>
                      ))
                    )}
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