// src/components/features/Hero.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronRight, MapPin } from 'lucide-react';

export const Hero = () => (
  <section className="relative pt-16 sm:pt-20 pb-20 sm:pb-28 overflow-hidden text-white">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/44/71/07/4471074a4dc2b299e496e1ca0021cbb9.jpg')",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#006600]/65 to-[#00aa00]/60" />
    <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:44px_44px]" />

    <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center relative z-10">
      <div className="space-y-5 sm:space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-white/20 shadow-sm backdrop-blur-sm">
          <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
          Kenya&apos;s #1 Turf Booking Platform
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tight">
          Book. Play. Compete. Win.
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-xl leading-relaxed">
          Find the perfect turf for your next game near you.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4">
          <Link href="/turfs" className="w-full sm:w-auto justify-center bg-[var(--color-primary)] text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-black tracking-wide flex items-center gap-2 hover:bg-[var(--color-primary-strong)] transition-all shadow-lg">
            Find Turfs Near You <ChevronRight size={20} />
          </Link>
          <Link href="/signup" className="w-full sm:w-auto justify-center bg-[#101010] border border-white/30 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all">
            Book Now <Calendar size={20} />
          </Link>
        </div>
      </div>

      <div className="relative group max-w-sm sm:max-w-md lg:max-w-xl mx-auto lg:ml-auto">
        <div className="absolute -inset-2 sm:-inset-3 bg-[var(--color-primary)] rounded-[30px] rotate-6 opacity-85 -z-20 transition-transform duration-500 group-hover:rotate-3" />
        <div className="absolute -inset-1.5 sm:-inset-2 bg-[#111] rounded-[30px] -rotate-3 opacity-90 -z-10 transition-transform duration-500 group-hover:-rotate-1" />
        <div className="rounded-[28px] overflow-hidden border-[8px] border-white/10 shadow-2xl">
          <img src="https://media.istockphoto.com/id/1446832591/photo/closeup-of-a-ball-on-the-soccer-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=gKbpSgyj6Pt85d4nzvBTH4z4ISRAzJejW54_MF8Xvrk=" alt="Soccer Action" className="w-full h-auto object-cover aspect-[4/3] sm:aspect-auto" />
        </div>
      </div>
    </div>
  </section>
);

