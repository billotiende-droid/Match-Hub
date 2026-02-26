// src/components/features/Tournaments.tsx
import Link from 'next/link';
import { Trophy, Calendar, MapPin, Users } from 'lucide-react';

const tournaments = [
  { id: '1', title: 'Nairobi Champions League', date: 'March 15, 2026', location: 'Kasarani Stadium', teams: 16, prize: 'KSh 500,000' },
  { id: '2', title: 'Coastal Football Fest', date: 'March 22, 2026', location: 'Mombasa Beach Turf', teams: 12, prize: 'KSh 300,000' },
  { id: '3', title: 'Westlands Derby Cup', date: 'April 5, 2026', location: 'Westlands Sports Arena', teams: 8, prize: 'KSh 200,000' },
];

export const Tournaments = () => (
  <section className="py-14 sm:py-20 bg-white">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-gray-900">Upcoming Tournaments</h2>
        <p className="text-gray-600">Join exciting tournaments and compete for amazing prizes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {tournaments.map((t) => (
          <div key={t.id} className="surface-card rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="h-1 bg-[var(--color-primary)]" />
            <div className="p-5 sm:p-6 space-y-4">
              <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center text-white">
                <Trophy size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t.title}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Calendar size={16} className="text-[var(--color-primary)]"/> {t.date}</div>
                <div className="flex items-center gap-2"><MapPin size={16} className="text-[var(--color-primary)]"/> {t.location}</div>
                <div className="flex items-center gap-2"><Users size={16} className="text-[var(--color-primary)]"/> {t.teams} Teams</div>
              </div>
              <div className="pt-4 border-t border-[var(--color-border)]">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Prize Pool</p>
                <p className="text-xl font-black text-[var(--color-secondary)]">{t.prize}</p>
              </div>
              <Link href="/signup" className="block w-full text-center py-3.5 sm:py-4 bg-[var(--color-secondary)] text-white rounded-xl font-bold hover:bg-[color-mix(in_oklab,var(--color-secondary)_88%,black)] transition-colors">
                Register Team
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
