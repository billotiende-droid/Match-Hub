"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Footer } from '@/components/common/Footer';
import { Navbar } from '@/components/common/Navbar';
import { getMyBookings, type UserBooking } from '@/services/bookingService';
import { getAuthSession } from '@/services/authService';

export default function DashboardPage() {
  const [session] = useState(() => getAuthSession());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    setUserName(session.user.name);

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
  }, [session]);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="container mx-auto px-6 py-12 text-gray-900 dark:text-white">
        <h1 className="text-4xl font-black mb-2">Dashboard</h1>
        {session ? (
          <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome back, {userName || session.user.name}.</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-8">Please login to view your bookings.</p>
        )}

        {!session ? (
          <Link href="/login" className="inline-flex bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)]">
            Go to Login
          </Link>
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
            {bookings.map((booking) => (
              <div key={booking.id} className="surface-card rounded-2xl p-5">
                <p className="font-bold">Booking #{booking.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {booking.date} • {booking.start_time} - {booking.end_time}
                </p>
                <p className="text-sm mt-2">Status: <span className="font-semibold uppercase">{booking.status}</span></p>
                <p className="text-[var(--color-primary)] font-bold mt-1">KES {booking.total_amount}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
