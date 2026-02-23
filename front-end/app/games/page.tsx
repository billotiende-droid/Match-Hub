import Link from 'next/link';

import { Footer } from '@/components/common/Footer';
import { Navbar } from '@/components/common/Navbar';

export default function GamesPage() {
  return (
    <main className="page-shell">
      <Navbar />
      <section className="container mx-auto px-6 py-16 text-center text-gray-900 dark:text-white">
        <h1 className="text-4xl font-black mb-4">Games</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Pickup games module is coming next. Start by booking a turf.</p>
        <Link href="/turfs" className="inline-flex bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)]">
          Browse Turfs
        </Link>
      </section>
      <Footer />
    </main>
  );
}
