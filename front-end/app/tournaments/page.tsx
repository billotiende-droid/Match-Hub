import Link from 'next/link';

import { Footer } from '@/components/common/Footer';
import { Navbar } from '@/components/common/Navbar';

export default function TournamentsPage() {
  return (
    <main className="page-shell">
      <Navbar />
      <section className="container mx-auto px-6 py-16 text-center text-gray-900 dark:text-white">
        <h1 className="text-4xl font-black mb-4">Tournaments</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Tournament registration is opening soon. Create an account to be notified first.</p>
        <Link href="/signup" className="inline-flex bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)]">
          Create Account
        </Link>
      </section>
      <Footer />
    </main>
  );
}
