
// src/components/features/CTA.tsx
import Link from 'next/link';

export const WhyChooseUs = () => (
  <section className="py-24 bg-[#0fa218] text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:36px_36px]" />
    <div className="container mx-auto px-6 text-center relative z-10">
      <h2 className="text-5xl font-black mb-4">Why Choose Match Hub</h2>
      <p className="text-white/90 mb-16">Everything you need for the perfect football experience</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['Find Turfs Near You', 'Easy Booking', 'Join Tournaments', 'Secure Payments'].map((title) => (
          <div key={title} className="bg-white/10 border border-white/20 backdrop-blur-sm p-8 rounded-2xl text-left">
            <div className="w-14 h-14 bg-white/15 rounded-xl mb-5 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-white/60" />
            </div>
            <h4 className="font-bold mb-2">{title}</h4>
            <p className="text-sm text-white/90">Browse through verified turfs with detailed information and photos.</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ReadyToPlay = () => (
  <section className="py-20 bg-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_bottom,rgba(148,163,184,.15)_1px,transparent_1px)] [background-size:100%_54px]" />
    <div className="container mx-auto px-6 relative z-10">
      <div className="surface-card rounded-[28px] overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-accent)] to-[var(--color-primary)]" />
        <div className="p-10 md:p-14 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-muted)] border border-[var(--color-border)] text-sm font-semibold text-gray-700 mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-secondary)]" />
            Match Day Starts Here
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Ready to Play?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-9">
            Join thousands of players across Kenya. Secure your turf, lock your slot, and get the team on the pitch.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/turfs"
              className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)] transition-colors"
            >
              Browse Turfs
            </Link>
            <Link
              href="/tournaments"
              className="bg-[var(--color-secondary)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[color-mix(in_oklab,var(--color-secondary)_88%,black)] transition-colors"
            >
              Join Tournament
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);
