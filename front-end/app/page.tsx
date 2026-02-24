// src/app/page.tsx
import { Navbar } from '@/components/common/Navbar';
import { Hero } from '@/components/features/Hero';
import { TurfSearch } from '@/components/features/TurfSearch';
import { TurfCard } from '@/components/features/TurfCard';
import { HowItWorks } from '@/components/features/HowItWorks';
import { Tournaments } from '@/components/features/Tournaments';
import { WhyChooseUs, ReadyToPlay } from '@/components/features/CTA';
import { Footer } from '@/components/common/Footer';
import { getFeaturedTurfs } from '@/services/turfService';
import Link from 'next/link';

export default async function Home() {
  const turfs = (await getFeaturedTurfs()).slice(0, 3);

  return (
    <main className="page-shell">
      <Navbar />
      <Hero />
      <TurfSearch />
      
      <section className="container mx-auto px-6 py-24 border-t-4 border-[var(--color-primary)]">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-gray-900">Featured Turfs</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Discover top-rated turfs across Kenya. All venues are verified and equipped with modern facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {turfs.map((turf) => (
            <TurfCard key={turf.id} turf={turf} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/turfs"
            className="inline-flex border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-secondary)] hover:text-white transition-colors"
          >
            View All Turfs
          </Link>
        </div>
      </section>
      
      <HowItWorks />
      <Tournaments />
      <WhyChooseUs />
      <ReadyToPlay />
      <Footer />
    </main>
  );
}
