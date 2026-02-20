// src/components/features/TurfSearch.tsx
"use client";
import { Search, SlidersHorizontal } from 'lucide-react';

export const TurfSearch = () => (
  <div className="container mx-auto px-6 -mt-16 relative z-20">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-700 space-y-6">
      <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 px-6 py-4 rounded-2xl focus-within:ring-2 ring-red-100 transition-all">
        <Search className="text-gray-400" size={24} />
        <input className="bg-transparent w-full outline-none text-lg dark:text-white dark:placeholder-gray-400" placeholder="Search turfs by name or location..." />
      </div>
      <div className="flex flex-wrap gap-4">
        {['Distance', 'Price', 'Rating'].map((filter) => (
          <select key={filter} className="flex-1 min-w-[140px] p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-600 dark:text-gray-300 outline-none focus:border-red-500">
            <option>{filter}</option>
          </select>
        ))}
        <button className="bg-[#D31D3F] text-white px-10 py-4 rounded-xl font-black text-lg hover:shadow-lg transition-all">
          SEARCH
        </button>
      </div>
    </div>
  </div>
);
