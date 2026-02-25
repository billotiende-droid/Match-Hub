import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/common/Footer';
import { Navbar } from '@/components/common/Navbar';
import { BookingPanel } from '@/components/features/BookingPanel';
import { getTurfById } from '@/services/turfService';

interface TurfDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TurfDetailPage({ params }: TurfDetailPageProps) {
  const { id } = await params;
  const turf = await getTurfById(id);

  if (!turf) {
    notFound();
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/turfs" className="text-sm sm:text-base text-[var(--color-primary)] font-bold hover:underline">
          Back to Turfs
        </Link>

        <div className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-10 items-start">
          <img
            src={turf.image}
            alt={turf.name}
            className="w-full h-64 sm:h-80 lg:h-[420px] object-cover rounded-3xl border border-[var(--color-border)] shadow-lg"
          />

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-3">{turf.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-5">{turf.location}</p>
            <p className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] mb-6">KES {turf.pricePerHour} / hour</p>

            <div className="mb-8">
              <h2 className="font-bold text-lg mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {turf.amenities.length > 0 ? (
                  turf.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 rounded-full text-sm bg-[var(--surface-muted)] dark:bg-[var(--surface-muted)] border border-[var(--color-border)]"
                    >
                      {amenity}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No amenities listed yet.</span>
                )}
              </div>
            </div>

            <BookingPanel turfId={turf.id} pricePerHour={turf.pricePerHour} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
