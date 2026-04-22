"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  User,
  Pencil,
  LockKeyhole,
  Eye,
  EyeOff,
  LogOut,
  Send,
  Trash2,
  X,
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

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");

  // Locker state
  const [locker, setLocker] = useState<any>(null);
  const [lockerLoading, setLockerLoading] = useState(true);

  const [showChangePinCard, setShowChangePinCard] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showOldPin, setShowOldPin] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // Change PIN state
  const [currentPin, setCurrentPin] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [updatingPin, setUpdatingPin] = useState(false);
  const [step, setStep] = useState(1); // 1: current PIN, 2: verification, 3: new PIN, 4: confirm

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUserProfile(), fetchLocker()]);
    };
    fetchData();
  }, []);

  // Reset form when toggling change PIN card
  useEffect(() => {
    if (!showChangePinCard) {
      setStep(1);
      setCurrentPin("");
      setVerificationCode("");
      setNewPin("");
      setConfirmPin("");
      setCodeSent(false);
      setCodeVerified(false);
    }
  }, [showChangePinCard]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      setError("");
      const response = await fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setUser(data.user);
      
      if (data.user) {
        setEditFirstName(data.user.firstName);
        setEditLastName(data.user.lastName);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocker = async () => {
    try {
      setLockerLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/locker", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch locker");
      }

      const data = await response.json();
      setLocker(data.length > 0 ? data[0] : null);
    } catch (err: any) {
      console.error("Locker fetch error:", err);
      setLocker(null);
    } finally {
      setLockerLoading(false);
    }
  };

  const formatPinDisplay = (pin: string | number | undefined) => {
    if (!pin) return "••••";
    return pin.toString().padStart(4, "0");
  };

  // Change PIN handlers
  const handleVerifyCurrentPin = async () => {
    if (currentPin !== locker?.pin) {
      alert("Current PIN is incorrect");
      return;
    }
    setStep(2);
  };

  const handleSendVerificationCode = async () => {
    try {
      setUpdatingPin(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send code");
      }

      setCodeSent(true);
      alert("Verification code sent to your email!");
    } catch (err: any) {
      alert(err.message || "Failed to send verification code");
    } finally {
      setUpdatingPin(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setUpdatingPin(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid code");
      }

      setCodeVerified(true);
      setStep(3);
    } catch (err: any) {
      alert(err.message || "Invalid verification code");
    } finally {
      setUpdatingPin(false);
    }
  };

  const handleResendCode = () => {
    setVerificationCode("");
    handleSendVerificationCode();
  };

  const handleUpdatePin = async () => {
    if (newPin.length !== 4 || confirmPin.length !== 4 || newPin !== confirmPin) {
      alert("Please enter matching 4-digit PINs");
      return;
    }

    try {
      setUpdatingPin(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/locker", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: locker?._id,
          pin: newPin,
          pinChanged: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update PIN");
      }

      const data = await response.json();
      setLocker(data);
      setShowChangePinCard(false);
      setStep(1);
      setCurrentPin("");
      setVerificationCode("");
      setNewPin("");
      setConfirmPin("");
      setCodeSent(false);
      setCodeVerified(false);
      alert("PIN updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update PIN");
    } finally {
      setUpdatingPin(false);
    }
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    if (user) {
      setEditFirstName(user.firstName);
      setEditLastName(user.lastName);
    }
  };

  const handleSaveProfile = async () => {
    if (!editFirstName.trim() || !editLastName.trim()) {
      alert("First name and last name are required");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update profile");
      }

      const data = await response.json();
      setUser(data.user);
      setEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
      console.error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteEmail !== user?.email) {
      alert("Please enter your email address exactly as shown to confirm deletion.");
      return;
    }

    if (!confirm("Are you absolutely sure? This will permanently delete your account and all data.")) {
      return;
    }

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/users/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete account");
      }

      const data = await response.json();
      alert("Account deleted successfully. You will be logged out.");
      
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err: any) {
      alert(err.message || "Failed to delete account");
      console.error("Account deletion error:", err);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteEmail("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <main className="h-screen bg-gradient-to-b from-[#df4473] via-[#e99ab1] to-[#f4eff1] flex items-center justify-center">
        <div className="text-white text-xl font-extrabold animate-pulse">Loading profile...</div>
      </main>
    );
  }

  return (
    <>
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

                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#de517e] px-6 py-2.5 text-sm font-extrabold text-white transition hover:opacity-90 md:text-base"
                >
                  <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                  Logout
                </button>
              </div>

              <div className={`min-h-0 flex-1 overflow-y-auto pr-1 ${scrollbarClass}`}>
                <div className="flex flex-col gap-4 pb-1">
                  {/* Profile Information Card */}
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

                      {!editingProfile ? (
                        <button
                          onClick={handleEditProfile}
                          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#de517e] px-5 py-2 text-sm font-extrabold text-[#de517e] transition hover:bg-[#de517e] hover:text-white md:text-base"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="rounded-full border-2 border-[#de517e] px-5 py-2 text-sm font-extrabold text-[#de517e] transition hover:bg-[#de517e] hover:text-white md:text-base disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#de517e] px-6 py-2 text-sm font-extrabold text-white transition hover:opacity-90 md:text-base disabled:opacity-50"
                          >
                            {saving ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent md:h-5 md:w-5" />
                                Saving...
                              </>
                            ) : (
                              "Save"
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {error ? (
                      <div className="rounded-full bg-red-100/80 p-6 text-center text-red-800">
                        <p className="text-lg font-semibold mb-2">{error}</p>
                        <button
                          onClick={fetchUserProfile}
                          className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-red-600"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.4fr]">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#de517e] md:text-base">
                            First Name
                          </label>
                          {editingProfile ? (
                            <input
                              type="text"
                              value={editFirstName}
                              onChange={(e) => setEditFirstName(e.target.value)}
                              className="w-full rounded-full bg-[#f6f1f3] px-5 py-3 text-base text-[#d695aa] outline-none focus:border-2 focus:border-[#de517e] focus:ring-0 md:text-lg"
                              autoFocus
                            />
                          ) : (
                            <div className="rounded-full bg-[#f6f1f3] px-5 py-3 text-base text-[#d695aa] md:text-lg">
                              {user?.firstName || "N/A"}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#de517e] md:text-base">
                            Last Name
                          </label>
                          {editingProfile ? (
                            <input
                              type="text"
                              value={editLastName}
                              onChange={(e) => setEditLastName(e.target.value)}
                              className="w-full rounded-full bg-[#f6f1f3] px-5 py-3 text-base text-[#d695aa] outline-none focus:border-2 focus:border-[#de517e] focus:ring-0 md:text-lg"
                            />
                          ) : (
                            <div className="rounded-full bg-[#f6f1f3] px-5 py-3 text-base text-[#d695aa] md:text-lg">
                              {user?.lastName || "N/A"}
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-2 xl:col-span-1">
                          <label className="mb-2 block text-sm font-semibold text-[#de517e] md:text-base">
                            Email
                          </label>
                          <div className="rounded-full bg-[#f6f1f3] px-5 py-3 text-base text-[#d695aa] md:text-lg break-all">
                            {user?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Locker PIN Card */}
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

                      {(!editingProfile && lockerLoading) ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#de517e]/50 border-t-[#de517e] md:h-8 md:w-8" />
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowChangePinCard((prev) => !prev)}
                          disabled={lockerLoading || updatingPin}
                          className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-extrabold transition md:text-base ${
                            showChangePinCard
                              ? "bg-[#de517e] text-white hover:opacity-90"
                              : "border-2 border-[#de517e] text-[#de517e] hover:bg-[#de517e] hover:text-white"
                          } ${lockerLoading || updatingPin ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {showChangePinCard ? "Cancel" : "Update PIN"}
                        </button>
                      )}
                    </div>

                    {!lockerLoading && !locker && (
                      <div className="text-center py-12 text-[#d46a1a]/80">
                        <LockKeyhole className="mx-auto h-16 w-16 mb-4 opacity-50" />
                        <p className="text-xl font-semibold mb-2">No locker assigned</p>
                        <p className="text-base">Create a locker to set up your PIN</p>
                      </div>
                    )}

                    {locker && (
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
                              value={showCurrentPin ? 
                                (locker?.pin || "••••") : 
                                formatPinDisplay(locker?.pin)
                              }
                              readOnly
                              className="w-full rounded-full bg-white/70 py-3 pl-6 pr-14 text-center text-xl tracking-[0.35em] text-[#d46a1a] outline-none"
                              placeholder="No PIN set"
                            />
                            <button
                              onClick={() => setShowCurrentPin((prev) => !prev)}
                              disabled={!locker?.pin}
                              className={`absolute inset-y-0 right-4 flex items-center transition hover:opacity-80 ${
                                !locker?.pin ? 'opacity-50 cursor-not-allowed text-[#d46a1a]/50' : 'text-[#d46a1a]'
                              }`}
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
                    )}
                  </div>

                  {/* Change PIN Card */}
                  {showChangePinCard && locker && (
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

                        <div className={`relative flex flex-col gap-3 md:flex-row md:items-center ${step !== 1 ? 'opacity-50' : ''}`}>
                          <div className={`z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#de517e] text-xl font-extrabold text-white ${step > 1 ? 'ring-2 ring-[#de517e]/50 bg-[#de517e]/80' : ''}`}>
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
                                  value={currentPin}
                                  onChange={(e) => setCurrentPin(e.target.value)}
                                  placeholder="Enter 4-digit PIN"
                                  disabled={step !== 1}
                                  className="h-14 w-full rounded-full bg-[#f7f7f7] pl-12 pr-14 text-base text-[#de517e] outline-none placeholder:text-[#e08ca8] md:text-lg disabled:opacity-50"
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
                            {step === 1 && (
                              <button 
                                onClick={handleVerifyCurrentPin}
                                disabled={currentPin.length !== 4 || updatingPin}
                                className="mt-4 w-full rounded-full bg-[#de517e] px-6 py-3 text-base font-extrabold text-white transition hover:opacity-90 md:text-lg disabled:opacity-50"
                              >
                                Next
                              </button>
                            )}
                          </div>
                        </div>

                        <div className={`relative flex flex-col gap-3 md:flex-row md:items-center ${step !== 2 ? 'opacity-50' : ''}`}>
                          <div className={`z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#de517e] text-xl font-extrabold text-white ${step > 2 ? 'ring-2 ring-[#de517e]/50 bg-[#de517e]/80' : ''}`}>
                            2
                          </div>
                          <div className="flex-1 rounded-[1.5rem] bg-white/65 px-4 py-4 md:px-6">
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <p className="text-lg font-extrabold text-[#de517e] md:text-2xl">
                                  {codeSent ? 'Enter verification code' : 'Send verification code to email'}
                                </p>
                                <div className="relative w-full lg:w-[360px]">
                                  <Send className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#de517e]" />
                                  <input
                                    type={showCode ? "text" : "password"}
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder={codeSent ? "Enter 6-digit code" : "Code will appear here"}
                                    disabled={step !== 2 || !codeSent}
                                    className="h-14 w-full rounded-full bg-[#f7f7f7] pl-12 pr-14 text-base text-[#de517e] outline-none placeholder:text-[#e08ca8] md:text-lg disabled:opacity-50"
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
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {!codeSent ? (
                                  <button 
                                    onClick={handleSendVerificationCode}
                                    disabled={updatingPin}
                                    className="rounded-full bg-[#de517e] px-6 py-3 text-base font-extrabold text-white transition hover:opacity-90 md:text-lg disabled:opacity-50"
                                  >
                                    Send Code
                                  </button>
                                ) : (
                                  <button 
                                    onClick={handleVerifyCode}
                                    disabled={verificationCode.length !== 6 || updatingPin}
                                    className="rounded-full bg-[#de517e] px-6 py-3 text-base font-extrabold text-white transition hover:opacity-90 md:text-lg disabled:opacity-50"
                                  >
                                    Verify
                                  </button>
                                )}
                                {codeSent && (
                                  <button 
                                    onClick={handleResendCode}
                                    disabled={updatingPin}
                                    className="rounded-full border-2 border-[#de517e] bg-transparent px-6 py-3 text-base font-extrabold text-[#de517e] transition hover:bg-[#de517e] hover:text-white md:text-lg"
                                  >
                                    Resend
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`relative flex flex-col gap-3 md:flex-row md:items-center ${step !== 3 ? 'opacity-50' : ''}`}>
                          <div className={`z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#de517e] text-xl font-extrabold text-white ${step > 3 ? 'ring-2 ring-[#de517e]/50 bg-[#de517e]/80' : ''}`}>
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
                                  value={newPin}
                                  onChange={(e) => setNewPin(e.target.value)}
                                  placeholder="Enter new 4-digit PIN"
                                  disabled={step !== 3}
                                  className="h-14 w-full rounded-full bg-[#f7f7f7] pl-12 pr-14 text-base text-[#de517e] outline-none placeholder:text-[#e08ca8] md:text-lg disabled:opacity-50"
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
                            {step === 3 && (
                              <button 
                                onClick={() => setStep(4)}
                                disabled={newPin.length !== 4 || updatingPin}
                                className="mt-4 w-full rounded-full bg-[#de517e] px-6 py-3 text-base font-extrabold text-white transition hover:opacity-90 md:text-lg disabled:opacity-50"
                              >
                                Next
                              </button>
                            )}
                          </div>
                        </div>

                        <div className={`relative flex flex-col gap-3 md:flex-row md:items-center ${step !== 4 ? 'opacity-50' : ''}`}>
                          <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#de517e] text-xl font-extrabold text-white ring-2 ring-[#de517e]/50 bg-[#de517e]/80">
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
                                  value={confirmPin}
                                  onChange={(e) => setConfirmPin(e.target.value)}
                                  placeholder="Confirm new PIN"
                                  disabled={step !== 4}
                                  className="h-14 w-full rounded-full bg-[#f7f7f7] pl-12 pr-14 text-base text-[#de517e] outline-none placeholder:text-[#e08ca8] md:text-lg disabled:opacity-50"
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

                        {step === 4 && (
                          <div className="pt-1">
                            <button 
                              onClick={handleUpdatePin}
                              disabled={newPin.length !== 4 || confirmPin.length !== 4 || newPin !== confirmPin || updatingPin}
                              className="w-full rounded-full bg-[#de517e] px-6 py-3 text-base font-extrabold text-white transition hover:opacity-90 md:text-lg disabled:opacity-50"
                            >
                              {updatingPin ? (
                                <>
                                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                                  Updating PIN...
                                </>
                              ) : (
                                'Update PIN'
                              )}
                            </button>
                            {newPin !== confirmPin && newPin.length === 4 && confirmPin.length === 4 && (
                              <p className="mt-2 text-sm text-red-400 text-center">PINs do not match</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Account Deletion Card */}
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
                            This will permanently delete your account and all records. This action cannot be undone.
                          </p>
                        </div>

                        <button 
                          onClick={() => setShowDeleteConfirm(true)}
                          disabled={deleting}
                          className="inline-flex items-center justify-center rounded-full bg-[#ef1f1f] px-6 py-3 text-base font-extrabold text-white transition hover:opacity-90 md:text-lg disabled:opacity-50"
                        >
                          {deleting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent md:h-5 md:w-5" />
                              Deleting...
                            </>
                          ) : (
                            "Delete Account"
                          )}
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

      {/* Floating Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDeleteConfirm(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md transform rounded-[2rem] bg-white/95 p-8 shadow-2xl backdrop-blur-sm transition-all sm:p-10">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ef1f1f]/20 p-2">
                    <Trash2 className="h-6 w-6 text-[#ef1f1f]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#ef1f1f] md:text-3xl">
                      Final Confirmation
                    </h3>
                    <p className="text-sm text-[#ef1f1f]/80">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#ef1f1f] transition hover:bg-[#ef1f1f]/10 disabled:opacity-50 md:h-12 md:w-12"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="mb-4 text-lg font-semibold text-gray-800">
                    Are you absolutely sure you want to delete your PadaLock account?
                  </p>
                  <p className="text-sm text-gray-600">
                    This will permanently delete your account and all associated data including activity records and locker access.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Type your email to confirm
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={deleteEmail}
                      onChange={(e) => setDeleteEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full rounded-[1.5rem] bg-gray-50 px-5 py-4 pr-14 text-base text-gray-800 outline-none ring-0 focus:border-2 focus:border-[#ef1f1f] focus:bg-white md:text-lg"
                      disabled={deleting}
                    />
                  </div>
                  {deleteEmail && deleteEmail !== user?.email && (
                    <p className="mt-1 text-sm text-[#ef1f1f]">
                      Email must match exactly
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteEmail("");
                    }}
                    disabled={deleting}
                    className="flex-1 rounded-[1.5rem] border-2 border-[#ef1f1f] bg-transparent px-6 py-4 font-extrabold text-[#ef1f1f] transition hover:bg-[#ef1f1f] hover:text-white disabled:opacity-50 md:text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting || deleteEmail !== user?.email}
                    className="flex-1 inline-flex items-center justify-center rounded-[1.5rem] bg-[#ef1f1f] px-6 py-4 font-extrabold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed md:text-lg"
                  >
                    {deleting ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent md:h-6 md:w-6" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      "Yes, Delete My Account"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}