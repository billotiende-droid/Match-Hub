// src/components/features/Tournaments.tsx
import { Trophy, Calendar, MapPin, Users } from 'lucide-react';

const tournaments = [
  { id: '1', title: 'Nairobi Champions League', date: 'March 15, 2026', location: 'Kasarani Stadium', teams: 16, prize: 'KSh 500,000' },
  { id: '2', title: 'Coastal Football Fest', date: 'March 22, 2026', location: 'Mombasa Beach Turf', teams: 12, prize: 'KSh 300,000' },
  { id: '3', title: 'Westlands Derby Cup', date: 'April 5, 2026', location: 'Westlands Sports Arena', teams: 8, prize: 'KSh 200,000' },
];

export const Tournaments = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 dark:text-white">Upcoming Tournaments</h2>
        <p className="text-gray-500 dark:text-gray-400">Join exciting tournaments and compete for amazing prizes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tournaments.map((t) => (
          <div key={t.id} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                <Trophy size={24} />
              </div>
              <h3 className="text-xl font-bold dark:text-white">{t.title}</h3>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2"><Calendar size={16} className="text-red-500"/> {t.date}</div>
                <div className="flex items-center gap-2"><MapPin size={16} className="text-red-500"/> {t.location}</div>
                <div className="flex items-center gap-2"><Users size={16} className="text-red-500"/> {t.teams} Teams</div>
              </div>
              <div className="pt-4 border-t dark:border-gray-700">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Prize Pool</p>
                <p className="text-xl font-black text-green-700">{t.prize}</p>
              </div>
              <button className="w-full py-4 bg-green-800 text-white rounded-xl font-bold hover:bg-green-900 transition-colors">
                Register Team
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
