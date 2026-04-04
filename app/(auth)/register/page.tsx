"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Parcel {
  _id: string;
  trackingNumber: string;
  parcelName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
  retrievedDate?: string;
}

const navItems = [
  { label: "REGISTER", href: "/register" },
  { label: "ACTIVITY", href: "/activity" },
  { label: "ACCOUNT", href: "/account" },
];

const filterTabs = ["All", "Pending", "Delivered", "Retrieved"];

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "bg-[#edd9cb]", text: "text-[#d46800]" },
  DELIVERED: { bg: "bg-[#b8d8c7]", text: "text-[#0d7a43]" },
  RETRIEVED: { bg: "bg-[#cfe8ec]", text: "text-[#1383a3]" },
};

const API_BASE = "/api/parcels";

export default function RegisterPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [parcelName, setParcelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTrackingNumber, setEditTrackingNumber] = useState("");
  const [editParcelName, setEditParcelName] = useState("");

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        setParcels([]);
        return;
      }

      const res = await fetch(API_BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
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

  const handleRegister = async () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trackingNumber: trackingNumber.trim(),
          parcelName: parcelName.trim() || "Parcel",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to register parcel");
      }

      setTrackingNumber("");
      setParcelName("");
      await fetchParcels();
    } catch (err: any) {
      console.error("Error registering parcel:", err);
      setError(err.message || "Failed to register parcel");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (parcel: Parcel) => {
    setEditingId(parcel._id);
    setEditTrackingNumber(parcel.trackingNumber);
    setEditParcelName(parcel.parcelName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTrackingNumber("");
    setEditParcelName("");
  };

  const handleUpdate = async (parcelId: string) => {
    if (!editTrackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const res = await fetch(`${API_BASE}/${parcelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trackingNumber: editTrackingNumber.trim(),
          parcelName: editParcelName.trim() || "Parcel",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update parcel");
      }

      setParcels((prev) =>
        prev.map((p) =>
          p._id === parcelId
            ? {
                ...p,
                trackingNumber: editTrackingNumber.trim(),
                parcelName: editParcelName.trim() || "Parcel",
              }
            : p
        )
      );

      cancelEdit();
    } catch (err: any) {
      console.error("Error updating parcel:", err);
      setError(err.message || "Failed to update parcel");
    }
  };

  const handleDelete = async (parcelId: string, trackingNumber: string) => {
    if (!confirm(`Delete ${trackingNumber}?`)) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const res = await fetch(`${API_BASE}/${parcelId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete parcel");
      }

      await fetchParcels();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError("Failed to delete parcel");
      await fetchParcels();
    }
  };

  const filteredParcels = parcels.filter((parcel) => {
    if (activeFilter === "All") return true;
    return parcel.status === activeFilter.toUpperCase();
  });

  const getStatusDisplay = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    return normalizedStatus === "PENDING"
      ? "Pending"
      : normalizedStatus === "DELIVERED"
      ? "Delivered"
      : normalizedStatus === "RETRIEVED"
      ? "Retrieved"
      : status;
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatFullDateInfo = (parcel: Parcel): string => {
    return `
      <b>Created:</b> ${formatDate(parcel.createdAt)} |
      <b>Delivered:</b> ${formatDate(parcel.deliveryDate)} |
      <b>Retrieved:</b> ${formatDate(parcel.retrievedDate)}
    `.trim();
  };

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-b from-[#df4473] via-[#e99ab1] to-[#f4eff1] px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
      <div className="mx-auto flex h-full w-full flex-col gap-4">
        <header className="shrink-0 rounded-[1.5rem] bg-[#FFFFFF]/25 px-4 py-3 backdrop-blur-sm md:px-6 md:py-3 lg:px-8 lg:py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/home" className="flex items-center">
              <Image
                src="/padalock-logo.png"
                alt="PadaLock logo"
                width={340}
                height={70}
                className="h-auto w-[150px] sm:w-[180px] md:w-[220px] lg:w-[260px]"
                priority
              />
            </Link>

            <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-white sm:text-sm md:text-base lg:justify-end lg:gap-x-6 lg:text-lg">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`transition hover:opacity-80 ${
                    item.href === "/register" ? "font-bold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="flex min-h-0 flex-col rounded-[2rem] bg-white/25 p-4 backdrop-blur-sm sm:p-5 md:p-6">
            <div className="shrink-0">
              <h2 className="text-xl font-extrabold text-white md:text-2xl">
                Registered Tracking Numbers
              </h2>

              <p className="mt-3 max-w-[650px] text-xs leading-relaxed text-white sm:text-sm">
                All expected parcels are listed here. Register your tracking
                number, and it will appear in the list with Pending Status.
              </p>

              {error && (
                <div className="mt-3 rounded-xl bg-red-400/50 p-3 text-sm text-white">
                  {error}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2 rounded-[1.5rem] bg-white/35 p-2">
                {filterTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`min-w-[110px] flex-1 rounded-full px-3 py-2 text-xs font-bold transition sm:text-sm md:text-base ${
                      activeFilter === tab
                        ? "bg-[#de9aae] text-white"
                        : "text-[#de9aae] hover:bg-white/30"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="flex flex-col gap-3">
                {filteredParcels.length === 0 ? (
                  <div className="flex min-h-full items-center justify-center rounded-[1.5rem] bg-white/30 py-10 text-center">
                    <div>
                      <p className="text-lg font-bold text-[#de9aae] md:text-xl">
                        No parcels{" "}
                        {activeFilter !== "All"
                          ? `with ${activeFilter.toLowerCase()} status`
                          : ""}{" "}
                        found
                      </p>
                      <p className="mt-2 text-sm text-[#dd9db0]">
                        Register your first tracking number above
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredParcels.map((parcel) => {
                    const statusStyle =
                      statusColors[
                        parcel.status as keyof typeof statusColors
                      ] || {
                        bg: "bg-gray-400",
                        text: "text-gray-800",
                      };

                    const isEditing = editingId === parcel._id;

                    return (
                      <div
                        key={parcel._id}
                        className="flex flex-col gap-4 rounded-[1.5rem] bg-white/45 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={editTrackingNumber}
                                onChange={(e) =>
                                  setEditTrackingNumber(e.target.value)
                                }
                                className="w-full bg-transparent text-lg font-extrabold text-[#de9aae] outline-none sm:text-xl md:text-2xl"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleUpdate(parcel._id);
                                  if (e.key === "Escape") cancelEdit();
                                }}
                              />
                              <div className="mt-1 text-xs text-[#de9aae] sm:text-sm md:text-base">
                                {editParcelName !== "Parcel" && (
                                  <input
                                    type="text"
                                    value={editParcelName}
                                    onChange={(e) =>
                                      setEditParcelName(e.target.value)
                                    }
                                    className="block w-full bg-transparent font-medium outline-none"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleUpdate(parcel._id);
                                      if (e.key === "Escape") cancelEdit();
                                    }}
                                  />
                                )}
                                <span>{formatDate(parcel.createdAt)}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <h3 className="break-all text-lg font-extrabold text-[#de9aae] sm:text-xl md:text-2xl">
                                {parcel.trackingNumber}
                              </h3>
                              <div className="mt-1 text-xs text-[#de9aae] sm:text-sm md:text-base">
                                {parcel.parcelName !== "Parcel" && (
                                  <span className="block font-medium">
                                    {parcel.parcelName}
                                  </span>
                                )}
                                <div
                                  className="font-medium leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: formatFullDateInfo(parcel),
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:ml-4 lg:flex-nowrap">
                          <span
                            className={`rounded-full px-4 py-2 text-xs font-extrabold sm:text-sm md:px-5 md:text-base ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            {getStatusDisplay(parcel.status)}
                          </span>

                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                className="text-lg text-green-600 transition hover:scale-110 hover:opacity-80 md:text-xl"
                                aria-label="Save changes"
                                onClick={() => handleUpdate(parcel._id)}
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                className="text-lg text-red-500 transition hover:scale-110 hover:opacity-80 md:text-xl"
                                aria-label="Cancel edit"
                                onClick={cancelEdit}
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="text-lg text-[#de9aae] transition hover:scale-110 hover:opacity-80 md:text-xl"
                                aria-label={`Edit ${parcel.trackingNumber}`}
                                onClick={() => startEdit(parcel)}
                              >
                                ✎
                              </button>
                              <button
                                type="button"
                                className="text-lg text-[#de9aae] transition hover:scale-110 hover:opacity-80 md:text-xl"
                                aria-label={`Delete ${parcel.trackingNumber}`}
                                onClick={() =>
                                  handleDelete(parcel._id, parcel.trackingNumber)
                                }
                              >
                                🗑
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col rounded-[2rem] bg-white/25 p-4 backdrop-blur-sm sm:p-5 md:p-6">
            <div className="shrink-0">
              <h2 className="text-xl font-extrabold text-white md:text-2xl">
                Register Tracking Number
              </h2>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-base font-medium text-white md:text-lg">
                Tracking number
              </label>
              <input
                type="text"
                placeholder="Enter your parcel's tracking number"
                className="h-12 w-full rounded-full bg-white/45 px-5 text-sm text-[#dd8ea5] outline-none placeholder:text-[#dd9db0] md:h-14 md:text-base"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                disabled={loading}
              />

              <label className="mb-2 mt-4 block text-base font-medium text-white md:text-lg">
                Parcel name (optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Birthday Gift, Documents"
                className="h-12 w-full rounded-full bg-white/45 px-5 text-sm text-[#dd8ea5] outline-none placeholder:text-[#dd9db0] md:h-14 md:text-base"
                value={parcelName}
                onChange={(e) => setParcelName(e.target.value)}
                disabled={loading}
              />

              <button
                type="button"
                onClick={handleRegister}
                disabled={loading || !trackingNumber.trim()}
                className="mt-6 h-12 w-full rounded-full bg-[#df4473] px-6 text-base font-extrabold text-white transition hover:scale-[1.01] disabled:opacity-50 md:h-14 md:text-xl"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}