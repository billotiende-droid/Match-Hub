// src/components/common/Footer.tsx
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => (
  <footer className="bg-[#111] dark:bg-black text-gray-400 py-16">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 bg-green-600 rounded-full" />
          <span className="font-bold text-xl">Match Hub</span>
        </div>
        <p className="text-sm">Kenya's premier turf booking platform. Book. Play. Compete. Win.</p>
        <div className="flex gap-4">
          <Facebook size={20} className="hover:text-white cursor-pointer" />
          <Twitter size={20} className="hover:text-white cursor-pointer" />
          <Instagram size={20} className="hover:text-white cursor-pointer" />
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-bold mb-6">Quick Links</h4>
        <ul className="space-y-4 text-sm">
          <li>Find Turfs</li>
          <li>Tournaments</li>
          <li>Book a Game</li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-6">Support</h4>
        <ul className="space-y-4 text-sm">
          <li>Help Center</li>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-6">Contact Us</h4>
        <ul className="space-y-4 text-sm">
          <li className="flex items-center gap-3"><Phone size={16} className="text-red-500" /> +254 700 123 456</li>
          <li className="flex items-center gap-3"><Mail size={16} className="text-red-500" /> info@matchhub.co.ke</li>
          <li className="flex items-center gap-3"><MapPin size={16} className="text-red-500" /> Nairobi, Kenya</li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-6 pt-12 mt-12 border-t border-gray-800 text-center text-xs">
      © 2026 Match Hub. All rights reserved. Made with ❤️ in Kenya
    </div>
  </footer>
);
