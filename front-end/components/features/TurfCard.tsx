// src/components/features/TurfCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import type { Turf } from '@/services/turfService';

interface TurfCardProps {
  turf: Turf;
}

export const TurfCard = ({ turf }: TurfCardProps) => {
  const ratingCount = (Number.parseInt(turf.id.replace(/\D/g, ''), 10) || 120) + 80;

  return (
    <div className="surface-card rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all">
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <Image
          src={turf.image}
          alt={turf.name}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover"
        />
        <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1 rounded-full text-xs font-semibold ${
          turf.isOpen ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-500 text-white'
        }`}>
          {turf.isOpen ? 'Available' : 'Booked'}
        </div>
      </div>
      
      <div className="p-5 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{turf.name}</h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="text-sm">{turf.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">{turf.rating.toFixed(1)} ({ratingCount} reviews)</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
          {turf.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="text-xs px-2.5 py-1 rounded-md bg-[var(--surface-muted)] border border-[var(--color-border)] text-gray-700"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="text-xl font-black text-gray-900">KSh {turf.pricePerHour.toLocaleString()}</p>
            <p className="text-sm text-gray-500">/hour</p>
          </div>

          <Link
            href={`/turfs/${turf.id}`}
            className="w-full sm:w-auto text-center bg-[var(--color-primary)] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)] transition"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};
