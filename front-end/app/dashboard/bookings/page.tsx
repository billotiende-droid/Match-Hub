"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";
import { approveBooking, getOwnerBookings, type OwnerBooking } from "@/services/bookingService";
import { createTurf, type CreateTurfPayload } from "@/services/turfService";
import { getAuthSession, subscribeAuthSession } from "@/services/authService";

const BOOKINGS_PER_PAGE = 8;

const bookingStatusClasses: Record<OwnerBooking["status"], string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const paymentStatusClasses: Record<OwnerBooking["payment_status"], string> = {
  unpaid: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  refunded: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

const toDateTimeText = (value?: string) => (value ? value.replace("T", " ").slice(0, 16) : "N/A");

const AVAILABLE_AMENITIES = [
  "Parking",
  "Changing Rooms",
  "Showers",
  "Floodlights",
  "Cafeteria",
  "WiFi",
  "Equipment Rental",
  "First Aid",
  "Restrooms",
  "Bleachers",
];

export default function AdminBookingsPage() {
  const session = useSyncExternalStore(subscribeAuthSession, getAuthSession, () => null);
  const isAdmin = session?.user.user_type === "admin";

  const [activeTab, setActiveTab] = useState<"bookings" | "create-turf">("bookings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [approvingBookingId, setApprovingBookingId] = useState<string | null>(null);

  // Turf creation form state
  const [turfForm, setTurfForm] = useState<CreateTurfPayload>({
    name: "",
    location: "",
    pricePerHour: 0,
    description: "",
    openingTime: "06:00",
    closingTime: "22:00",
    images: [],
    amenities: [],
    isActive: true,
  });
  const [turfFormSubmitting, setTurfFormSubmitting] = useState(false);

  useEffect(() => {
    if (!session || !isAdmin) return;

    let active = true;

    const loadOwnerBookings = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getOwnerBookings(session.user.id, {
          date: selectedDate || undefined,
        });
        if (!active) return;
        setBookings(data);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOwnerBookings();

    return () => {
      active = false;
    };
  }, [isAdmin, selectedDate, session]);

  const handleApproveBooking = async (bookingId: string) => {
    if (!session) return;
    
    setApprovingBookingId(bookingId);
    setError("");
    setSuccessMessage("");

    try {
      await approveBooking(bookingId, session.user.id);
      setSuccessMessage("Booking approved successfully!");
      
      // Refresh bookings list
      const data = await getOwnerBookings(session.user.id, {
        date: selectedDate || undefined,
      });
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve booking");
    } finally {
      setApprovingBookingId(null);
    }
  };

  const handleTurfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError("You must be logged in to create a turf");
      return;
    }
    setError("");
    setSuccessMessage("");
    setTurfFormSubmitting(true);

    try {
      await createTurf(turfForm, session.user.id);
      setSuccessMessage("Turf created successfully! It will be visible to all users.");
      // Reset form
      setTurfForm({
        name: "",
        location: "",
        pricePerHour: 0,
        description: "",
        openingTime: "06:00",
        closingTime: "22:00",
        images: [],
        amenities: [],
        isActive: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create turf");
    } finally {
      setTurfFormSubmitting(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setTurfForm((prev) => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...(prev.amenities || []), amenity],
    }));
  };

  const totalRevenue = useMemo(
    () => bookings.reduce((sum, booking) => sum + booking.total_amount, 0),
    [bookings]
  );
  const paidBookings = useMemo(
    () => bookings.filter((booking) => booking.payment_status === "paid").length,
    [bookings]
  );
  const confirmedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "confirmed").length,
    [bookings]
  );
  const pendingBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "pending").length,
    [bookings]
  );

  const totalPages = Math.max(1, Math.ceil(bookings.length / BOOKINGS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (activePage - 1) * BOOKINGS_PER_PAGE;
  const visibleBookings = bookings.slice(pageStartIndex, pageStartIndex + BOOKINGS_PER_PAGE);
  const pageStartLabel = bookings.length === 0 ? 0 : pageStartIndex + 1;
  const pageEndLabel = Math.min(pageStartIndex + BOOKINGS_PER_PAGE, bookings.length);

  const handleDateChange = (dateValue: string) => {
    setSelectedDate(dateValue);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setSelectedDate("");
    setCurrentPage(1);
  };

  return (
    <main className="page-shell">
      <Navbar />

      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 text-gray-900 dark:text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage your turfs and bookings
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        {isAdmin && session && (
          <div className="flex gap-2 mb-6 border-b border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === "bookings"
                  ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              Bookings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("create-turf")}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === "create-turf"
                  ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              Create Turf
            </button>
          </div>
        )}

        {!session ? (
          <div className="surface-card rounded-2xl p-6">
            <p className="mb-4 text-gray-600 dark:text-gray-300">Please login as admin to access the dashboard.</p>
            <Link
              href="/login"
              className="inline-flex w-full sm:w-auto justify-center bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)]"
            >
              Go to Login
            </Link>
          </div>
        ) : !isAdmin ? (
          <div className="surface-card rounded-2xl p-6">
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              This page is for admin accounts only.
            </p>
            <Link href="/dashboard" className="text-[var(--color-primary)] font-bold hover:underline">
              Return to Dashboard
            </Link>
          </div>
        ) : activeTab === "create-turf" ? (
          /* Create Turf Form */
          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">Create New Turf</h2>
            
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleTurfSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Turf Name *
                    <input
                      type="text"
                      required
                      value={turfForm.name}
                      onChange={(e) => setTurfForm({ ...turfForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-white dark:bg-[var(--surface)] px-3 py-2 text-sm"
                      placeholder="e.g., Green Valley Sports Complex"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Location *
                    <input
                      type="text"
                      required
                      value={turfForm.location}
                      onChange={(e) => setTurfForm({ ...turfForm, location: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-white dark:bg-[var(--surface)] px-3 py-2 text-sm"
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Price per Hour (KES) *
                    <input
                      type="number"
                      required
                      min="0"
                      value={turfForm.pricePerHour}
                      onChange={(e) => setTurfForm({ ...turfForm, pricePerHour: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-white dark:bg-[var(--surface)] px-3 py-2 text-sm"
                      placeholder="5000"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Opening Time
                    <input
                      type="time"
                      value={turfForm.openingTime}
                      onChange={(e) => setTurfForm({ ...turfForm, openingTime: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-white dark:bg-[var(--surface)] px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Closing Time
                    <input
                      type="time"
                      value={turfForm.closingTime}
                      onChange={(e) => setTurfForm({ ...turfForm, closingTime: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-white dark:bg-[var(--surface)] px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                  <textarea
                    value={turfForm.description}
                    onChange={(e) => setTurfForm({ ...turfForm, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-white dark:bg-[var(--surface)] px-3 py-2 text-sm"
                    placeholder="Describe your turf facilities..."
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">
                  Amenities
                  <div className="mt-2 flex flex-wrap gap-2">
                    {AVAILABLE_AMENITIES.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          turfForm.amenities?.includes(amenity)
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={turfForm.isActive}
                  onChange={(e) => setTurfForm({ ...turfForm, isActive: e.target.checked })}
                  className="rounded border-[var(--color-border)]"
                />
                <label htmlFor="isActive" className="text-sm font-semibold">
                  Active immediately (visible to users)
                </label>
              </div>

              <button
                type="submit"
                disabled={turfFormSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-strong)] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {turfFormSubmitting ? "Creating Turf..." : "Create Turf"}
              </button>
            </form>
          </div>
        ) : (
          /* Bookings Tab */
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div className="surface-card rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
                <label className="text-sm font-semibold">
                  Booking date
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => handleDateChange(event.target.value)}
                    className="mt-1 block w-full sm:w-44 rounded-lg border border-[var(--color-border)] bg-white dark:bg-[var(--surface)] px-3 py-2 text-sm"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="sm:self-end px-4 py-2 rounded-lg border border-[var(--color-border)] font-semibold hover:bg-[var(--color-surface-muted)] transition"
                >
                  Clear
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {successMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
              <div className="surface-card rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Total bookings</p>
                <p className="text-2xl font-black mt-1">{bookings.length}</p>
              </div>
              <div className="surface-card rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Pending</p>
                <p className="text-2xl font-black mt-1 text-amber-600">{pendingBookings}</p>
              </div>
              <div className="surface-card rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Confirmed / Paid</p>
                <p className="text-2xl font-black mt-1">{confirmedBookings} / {paidBookings}</p>
              </div>
              <div className="surface-card rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Revenue booked</p>
                <p className="text-2xl font-black mt-1">KES {totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading admin bookings...</p>
            ) : bookings.length === 0 ? (
              <div className="surface-card rounded-2xl p-6">
                <p className="text-gray-600 dark:text-gray-300">
                  No bookings found for your turfs{selectedDate ? ` on ${selectedDate}` : ""}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleBookings.map((booking) => (
                  <article key={booking.id} className="surface-card rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-black text-lg">Booking #{booking.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.booking_date} • {booking.start_time} - {booking.end_time}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${bookingStatusClasses[booking.status]}`}>
                          {booking.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${paymentStatusClasses[booking.payment_status]}`}>
                          {booking.payment_status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="rounded-xl border border-[var(--color-border)] p-3">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Booking details</p>
                        <p className="text-sm">Amount: <span className="font-bold">KES {booking.total_amount.toLocaleString()}</span></p>
                        <p className="text-sm">Turf ID: <span className="font-mono text-xs">{booking.turf_id}</span></p>
                        <p className="text-sm">Client ID: <span className="font-mono text-xs">{booking.client_id}</span></p>
                        <p className="text-sm">Created: {toDateTimeText(booking.created_at)}</p>
                        <p className="text-sm">Updated: {toDateTimeText(booking.updated_at)}</p>
                      </div>

                      <div className="rounded-xl border border-[var(--color-border)] p-3">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">User details</p>
                        <p className="text-sm font-semibold">{booking.client?.name || "Unknown user"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{booking.client?.email || "No email"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{booking.client?.phone || "No phone"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Skill level: {booking.client?.skill_level || "N/A"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[var(--color-border)] p-3">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Turf details</p>
                        <p className="text-sm font-semibold">{booking.turf?.name || "Unknown turf"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{booking.turf?.location || "No location"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Price/hour: KES {booking.turf?.price_per_hour?.toLocaleString() || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Hours: {booking.turf?.opening_time || "--"} - {booking.turf?.closing_time || "--"}
                        </p>
                        
                        {/* Approve Button for Pending Bookings */}
                        {booking.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleApproveBooking(booking.id)}
                            disabled={approvingBookingId === booking.id}
                            className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                          >
                            {approvingBookingId === booking.id ? "Approving..." : "Approve Booking"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}

                {bookings.length > BOOKINGS_PER_PAGE && (
                  <div className="surface-card rounded-2xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Showing {pageStartLabel}-{pageEndLabel} of {bookings.length} bookings
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                        disabled={activePage === 1}
                        className="px-3 sm:px-4 py-2 rounded-lg border border-[var(--color-border)] font-semibold hover:bg-[var(--color-surface-muted)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm font-semibold min-w-20 sm:min-w-24 text-center">
                        Page {activePage} of {totalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                        disabled={activePage === totalPages}
                        className="px-3 sm:px-4 py-2 rounded-lg border border-[var(--color-border)] font-semibold hover:bg-[var(--color-surface-muted)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}

