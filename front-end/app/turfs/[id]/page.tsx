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

      <section className="container mx-auto px-6 py-12">
        <Link href="/turfs" className="text-[var(--color-primary)] font-bold hover:underline">
          Back to Turfs
        </Link>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <img
            src={turf.image}
            alt={turf.name}
            className="w-full h-[420px] object-cover rounded-3xl border border-[var(--color-border)] shadow-lg"
          />

          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">{turf.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-5">{turf.location}</p>
            <p className="text-2xl font-bold text-[var(--color-primary)] mb-6">KES {turf.pricePerHour} / hour</p>

            <div className="mb-8">
              <h2 className="font-bold text-lg mb-3">Facilities</h2>
              <div className="flex flex-wrap gap-2">
                {turf.facilities.length > 0 ? (
                  turf.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="px-3 py-1 rounded-full text-sm bg-[var(--surface-muted)] dark:bg-gray-800 border border-[var(--color-border)]"
                    >
                      {facility}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No facilities listed yet.</span>
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
