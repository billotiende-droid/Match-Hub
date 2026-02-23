// src/components/common/Footer.tsx
"use client";
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';
 
export const Footer = () => {

  return (
    <footer className="mt-12 text-gray-600 dark:text-gray-400 py-16 border-t border-[var(--color-border)]/70 bg-[color-mix(in_oklab,var(--surface)_96%,transparent)] backdrop-blur">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#ff5a1f" stroke="#e44a14" strokeWidth="2"/>
              <path d="M12 2C12 2 5 6 5 12C5 17 9 21 12 22C15 21 19 17 19 12C19 6 12 2 12 2Z" fill="#22c55e" stroke="#ffffff" strokeWidth="1.5"/>
              <path d="M2 12H22" stroke="#ffffff" strokeWidth="1.5"/>
              <path d="M5.5 5.5L18.5 18.5" stroke="#ffffff" strokeWidth="1.5"/>
              <path d="M18.5 5.5L5.5 18.5" stroke="#ffffff" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="2" fill="#ffffff"/>
            </svg>
            <span className="font-extrabold text-xl tracking-tight">Match Hub</span>
          </div>
          <p className="text-sm">Kenya&apos;s premier turf booking platform. Book. Play. Compete. Win.</p>
          <div className="flex gap-4">
            <Facebook size={20} className="hover:text-gray-900 dark:hover:text-white cursor-pointer" />
            <Twitter size={20} className="hover:text-gray-900 dark:hover:text-white cursor-pointer" />
            <Instagram size={20} className="hover:text-gray-900 dark:hover:text-white cursor-pointer" />
          </div>
        </div>
        
        <div>
          <h4 className="text-gray-900 dark:text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/turfs" className="hover:text-gray-900 dark:hover:text-white">Find Turfs</Link></li>
            <li><Link href="/tournaments" className="hover:text-gray-900 dark:hover:text-white">Tournaments</Link></li>
            <li><Link href="/games" className="hover:text-gray-900 dark:hover:text-white">Book a Game</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-900 dark:text-white font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-sm">
            <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Terms of Service</li>
            <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-900 dark:text-white font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3"><Phone size={16} className="text-[var(--color-primary)]" /> +254 700 123 456</li>
            <li className="flex items-center gap-3"><Mail size={16} className="text-[var(--color-primary)]" /> info@matchhub.co.ke</li>
            <li className="flex items-center gap-3"><MapPin size={16} className="text-[var(--color-primary)]" /> Nairobi, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 pt-12 mt-12 border-t border-[var(--color-border)] text-center text-xs">
        © 2026 Match Hub. All rights reserved. Made with ❤️ in Kenya
      </div>
    </footer>
  );
};
