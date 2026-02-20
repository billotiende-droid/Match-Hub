// src/components/features/Hero.tsx
import { Calendar, ChevronRight } from 'lucide-react';

export const Hero = () => (
  <section className="relative bg-[#1a4d2e] pt-20 pb-32 overflow-hidden text-white">
    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-semibold border border-white/20">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Kenya's #1 Turf Booking Platform
        </div>
        <h1 className="text-6xl md:text-7xl font-black leading-tight">
          Book. Play. <br /> Compete. Win.
        </h1>
        <p className="text-xl text-gray-300 max-w-md leading-relaxed">
          Find the perfect turf for your next game near you. Fast, reliable, and hassle-free.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <button className="bg-[#D31D3F] px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all">
            Find Turfs Near You <ChevronRight size={20} />
          </button>
          <button className="bg-black/50 border border-white/20 px-8 py-4 rounded-xl font-bold flex items-center gap-2">
            Book Now <Calendar size={20} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-4 bg-[#D31D3F] rounded-[40px] rotate-6 scale-95 opacity-80 -z-10 group-hover:rotate-3 transition-transform duration-500" />
        <div className="rounded-[40px] overflow-hidden border-[10px] border-white/10 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000" alt="Soccer Action" className="w-full h-auto object-cover" />
        </div>
      </div>
    </div>
  </section>
);