// src/components/features/Hero.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronRight, MapPin } from 'lucide-react';

export const Hero = () => (
  <section className="relative pt-14 pb-24 overflow-hidden text-white">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/44/71/07/4471074a4dc2b299e496e1ca0021cbb9.jpg')",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#006600]/65 to-[#00aa00]/60" />
    <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:44px_44px]" />

    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center relative z-10">
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold border border-white/20 shadow-sm backdrop-blur-sm">
          <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
          Kenya&apos;s #1 Turf Booking Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
          Book. Play. Compete. Win.
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
          Find the perfect turf for your next game! <MapPin className="inline-block align-[-2px] text-[#e4354f] fill-[#df1d1d]" size={28} /> Find a turf near you.
        </p>
        <div className="flex flex-wrap gap-4 pt-3">
          <Link href="/turfs" className="bg-[var(--color-primary)] text-white px-7 py-3.5 rounded-xl font-semibold tracking-wide flex items-center gap-2 hover:bg-[var(--color-primary-strong)] transition-all shadow-lg">
            Find Turfs Near You <ChevronRight size={18} />
          </Link>
          <Link href="/signup" className="bg-black border border-white/30 px-7 py-3.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#1f2937] transition-all">
            Book Now <Calendar size={18} />
          </Link>
        </div>
      </div>

      <div className="relative group w-full max-w-lg lg:max-w-xl mx-auto lg:ml-auto">
        <div className="absolute -inset-2 sm:-inset-3 bg-[var(--color-primary)] rounded-[26px] sm:rounded-[28px] rotate-2 sm:rotate-4 opacity-90 -z-20 transition-transform duration-500 group-hover:rotate-1 sm:group-hover:rotate-2" />
        <div className="absolute -inset-1.5 sm:-inset-2 bg-black rounded-[26px] sm:rounded-[28px] -rotate-1 sm:-rotate-2 opacity-90 -z-10 transition-transform duration-500 group-hover:-rotate-0.5 sm:group-hover:-rotate-1" />
        <div className="relative rounded-[24px] sm:rounded-[26px] overflow-hidden border-[4px] sm:border-[6px] border-white/10 shadow-2xl aspect-[4/3] sm:aspect-[16/10]">
          <Image
            src="https://i.pinimg.com/736x/6f/90/4d/6f904db22d2c59197432eca70ee68c2c.jpg"
            alt="Soccer Action"
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 520px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);
