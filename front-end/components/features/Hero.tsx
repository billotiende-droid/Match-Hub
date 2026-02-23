// src/components/features/Hero.tsx
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';

export const Hero = () => (
  <section className="relative pt-20 pb-32 overflow-hidden text-white">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://www.istockphoto.com/photo/kicking-the-ball-with-the-bare-foot-gm469068352-62204556?utm_source=unsplash&utm_medium=affiliate&utm_campaign=adp_photos_sponsored&utm_content=https%3A%2F%2Funsplash.com%2Fphotos%2Ffootball-game-on-focus-photography-IQpFq1OehtA&utm_term=football%3A%3Awallpapers-no-affiliates%3Aexperiment%3A2bce63d7-0199-4753-8903-5cd62d7deca2')",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0e7f16]/88 to-[#0f9b1a]/84" />
    <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:44px_44px]" />

    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-sm font-semibold border border-white/20 shadow-sm backdrop-blur-sm">
          <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
          Kenya&apos;s #1 Turf Booking Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
          Book. Play. Compete. Win.
        </h1>
        <p className="text-2xl text-white/90 max-w-xl leading-relaxed">
          Find the perfect turf for your next game near you.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/turfs" className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-black tracking-wide flex items-center gap-2 hover:bg-[var(--color-primary-strong)] transition-all shadow-lg">
            Find Turfs Near You <ChevronRight size={20} />
          </Link>
          <Link href="/signup" className="bg-[#101010] border border-white/30 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all">
            Book Now <Calendar size={20} />
          </Link>
        </div>
      </div>

      <div className="relative group max-w-xl ml-auto">
        <div className="absolute -inset-3 bg-[var(--color-primary)] rounded-[30px] rotate-6 opacity-85 -z-20 transition-transform duration-500 group-hover:rotate-3" />
        <div className="absolute -inset-2 bg-[#111] rounded-[30px] -rotate-3 opacity-90 -z-10 transition-transform duration-500 group-hover:-rotate-1" />
        <div className="rounded-[28px] overflow-hidden border-[8px] border-white/10 shadow-2xl">
          <img src="https://media.istockphoto.com/id/1446832591/photo/closeup-of-a-ball-on-the-soccer-field.webp?a=1&b=1&s=612x612&w=0&k=20&c=gKbpSgyj6Pt85d4nzvBTH4z4ISRAzJejW54_MF8Xvrk=" alt="Soccer Action" className="w-full h-auto object-cover" />
        </div>
      </div>
    </div>
  </section>
);
