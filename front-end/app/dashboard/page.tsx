"use client";

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { Footer } from '@/components/common/Footer';
import { Navbar } from '@/components/common/Navbar';
import { getMyBookings, type UserBooking } from '@/services/bookingService';
import { getAuthSession, subscribeAuthSession } from '@/services/authService';

const BOOKINGS_PER_PAGE = 6;

export default function DashboardPage() {
  const session = useSyncExternalStore(subscribeAuthSession, getAuthSession, () => null);
  const isAdmin = session?.user.user_type === "admin";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!session || isAdmin) {
      return;
    }

    const loadBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getMyBookings(session.user.id);
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [isAdmin, session]);

  const totalPages = Math.max(1, Math.ceil(bookings.length / BOOKINGS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (activePage - 1) * BOOKINGS_PER_PAGE;
  const visibleBookings = bookings.slice(pageStartIndex, pageStartIndex + BOOKINGS_PER_PAGE);
  const pageStartLabel = bookings.length === 0 ? 0 : pageStartIndex + 1;
  const pageEndLabel = Math.min(pageStartIndex + BOOKINGS_PER_PAGE, bookings.length);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 text-gray-900 dark:text-white">
        <h1 className="text-3xl sm:text-4xl font-black mb-2">Dashboard</h1>
        {session ? (
          <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome back, {session.user.name}.</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-8">Please login to view your bookings.</p>
        )}

        {!session ? (
          <Link href="/login" className="inline-flex w-full sm:w-auto justify-center bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)]">
            Go to Login
          </Link>
        ) : isAdmin ? (
          <div className="surface-card rounded-2xl p-6">
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Use the admin booking monitor to view all bookings on your turfs and customer details.
            </p>
            <Link href="/dashboard/bookings" className="text-[var(--color-primary)] font-bold hover:underline">
              Open Admin Booking Monitor
            </Link>
          </div>
        ) : loading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : error ? (
          <p className="text-[var(--color-primary-strong)]">{error}</p>
        ) : bookings.length === 0 ? (
          <div className="surface-card rounded-2xl p-6">
            <p className="mb-4">No bookings yet.</p>
            <Link href="/turfs" className="text-[var(--color-primary)] font-bold hover:underline">Book your first turf</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleBookings.map((booking) => (
              <div key={booking.id} className="surface-card rounded-2xl p-4 sm:p-5">
                <p className="font-bold">Booking #{booking.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {booking.booking_date} • {booking.start_time} - {booking.end_time}
                </p>
                <p className="text-sm mt-2">Status: <span className="font-semibold uppercase">{booking.status}</span></p>
                <p className="text-sm mt-1">
                  Payment: <span className="font-semibold uppercase">{booking.payment_status}</span>
                </p>
                <p className="text-[var(--color-primary)] font-bold mt-1">KES {booking.total_amount}</p>
              </div>
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
                    className="px-3 sm:px-4 py-2 rounded-lg border border-[var(--color-border)] font-semibold hover:bg-[var(--surface-muted)] dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="px-3 sm:px-4 py-2 rounded-lg border border-[var(--color-border)] font-semibold hover:bg-[var(--surface-muted)] dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
