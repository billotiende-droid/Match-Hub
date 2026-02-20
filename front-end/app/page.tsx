// src/app/page.tsx
import { Navbar } from '@/components/common/Navbar';
import { Hero } from '@/components/features/Hero';
import { TurfSearch } from '@/components/features/TurfSearch';
import { TurfCard } from '@/components/features/TurfCard';
import { getFeaturedTurfs } from '@/services/turfService';

export default async function Home() {
  const turfs = await getFeaturedTurfs();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TurfSearch />
      
      <section className="container mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900">Featured Turfs</h2>
            <p className="text-gray-500 mt-2">The best-rated pitches in your area.</p>
          </div>
          <button className="text-[#D31D3F] font-bold hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {turfs.map((turf) => (
            <TurfCard key={turf.id} turf={turf} />
          ))}
        </div>
      </section>
    </main>
  );
}