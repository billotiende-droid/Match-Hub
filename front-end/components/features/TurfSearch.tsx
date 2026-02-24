"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export const TurfSearch = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set('search', search.trim());
    }

    if (priceRange) {
      params.set('max_price', priceRange);
    }

    router.push(`/turfs${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <div className="container mx-auto px-6 -mt-14 relative z-20">
      <form
        onSubmit={onSubmit}
        className="surface-card p-6 md:p-8 rounded-[20px] space-y-5 shadow-xl"
      >
        <div className="flex items-center gap-4 bg-white border border-[var(--color-border)] px-5 py-4 rounded-xl focus-within:ring-2 ring-[color-mix(in_oklab,var(--color-primary)_26%,transparent)] transition-all">
          <Search className="text-gray-400" size={20} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-transparent w-full outline-none text-base md:text-lg placeholder:text-gray-400 text-gray-700"
            placeholder="Search turfs by name or location..."
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select className="flex-1 min-w-[140px] p-3 bg-white border border-[var(--color-border)] rounded-xl font-medium text-gray-700">
            <option>Distance</option>
            <option>Nearest First</option>
            <option>Within 5 km</option>
            <option>Within 10 km</option>
          </select>
          <select
            value={priceRange}
            onChange={(event) => setPriceRange(event.target.value)}
            className="flex-1 min-w-[140px] p-3 bg-white border border-[var(--color-border)] rounded-xl font-medium text-gray-700"
          >
            <option value="">Price</option>
            <option value="3000">Up to KSh 3,000</option>
            <option value="5000">Up to KSh 5,000</option>
            <option value="7000">Up to KSh 7,000</option>
          </select>
          <select className="flex-1 min-w-[140px] p-3 bg-white border border-[var(--color-border)] rounded-xl font-medium text-gray-700">
            <option>Rating</option>
            <option>4.5+</option>
            <option>4.0+</option>
            <option>3.5+</option>
          </select>
          <button
            type="submit"
            className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-black text-base md:text-lg hover:bg-[var(--color-primary-strong)] hover:shadow-lg transition-all"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};
