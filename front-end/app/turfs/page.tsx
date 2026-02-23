import Link from 'next/link';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';

import { Footer } from '@/components/common/Footer';
import { Navbar } from '@/components/common/Navbar';
import { TurfCard } from '@/components/features/TurfCard';
import { getTurfs } from '@/services/turfService';

interface TurfsPageProps {
  searchParams?: Promise<{
    search?: string;
    location?: string;
    min_price?: string;
    max_price?: string;
  }>;
}

export default async function TurfsPage({ searchParams }: TurfsPageProps) {
  const params = (await searchParams) || {};
  const hasActiveFilters = Boolean(
    params.search || params.location || params.min_price || params.max_price
  );

  const turfs = await getTurfs({
    search: params.search,
    location: params.location,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
  });

  return (
    <main className="page-shell">
      <Navbar />

      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_bottom,rgba(148,163,184,.15)_1px,transparent_1px)] [background-size:100%_52px]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="inline-flex items-center gap-2 bg-[var(--surface-muted)] border border-[var(--color-border)] rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700 mb-4">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                Kenya Turf Directory
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Browse Turfs</h1>
              <p className="text-gray-600 max-w-2xl">
                Filter by location and budget, then pick the best pitch for your next match.
              </p>
            </div>

            <div className="surface-card rounded-xl px-4 py-3 text-sm font-semibold text-gray-700">
              {turfs.length} turf{turfs.length === 1 ? '' : 's'} found
            </div>
          </div>

          <form className="surface-card rounded-2xl p-5 md:p-6 mb-10" method="GET">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              <label className="xl:col-span-2 flex items-center gap-3 px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  name="search"
                  defaultValue={params.search || ''}
                  placeholder="Search turf name"
                  className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                />
              </label>

              <input
                name="location"
                defaultValue={params.location || ''}
                placeholder="Location"
                className="px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white text-gray-700 placeholder:text-gray-400"
              />

              <input
                type="number"
                name="min_price"
                defaultValue={params.min_price || ''}
                placeholder="Min KES/hour"
                className="px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white text-gray-700 placeholder:text-gray-400"
              />

              <input
                type="number"
                name="max_price"
                defaultValue={params.max_price || ''}
                placeholder="Max KES/hour"
                className="px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Apply Filters
              </button>
              {hasActiveFilters && (
                <Link
                  href="/turfs"
                  className="inline-flex items-center justify-center border border-[var(--color-secondary)] text-[var(--color-secondary)] px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
                >
                  Clear Filters
                </Link>
              )}
            </div>
          </form>

          {turfs.length === 0 ? (
            <div className="surface-card p-8 rounded-2xl text-center">
              <p className="text-lg font-semibold text-gray-900 mb-2">No turfs found for these filters.</p>
              <p className="text-sm text-gray-600 mb-4">Try adjusting your location or price range.</p>
              <Link href="/turfs" className="text-[var(--color-primary)] font-bold hover:underline">
                Reset and show all turfs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {turfs.map((turf) => (
                <TurfCard key={turf.id} turf={turf} />
              ))}
            </div>
          )}

          {turfs.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">Need help choosing? Compare location, facilities, and hourly rates.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
