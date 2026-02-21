// src/components/common/Footer.tsx
"use client";
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Footer = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <footer className="bg-white dark:bg-gradient-to-b dark:from-black dark:to-[#4a0412] text-gray-600 dark:text-gray-400 py-16">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <div className="w-8 h-8 bg-green-600 rounded-full" />
            <span className="font-bold text-xl">Match Hub</span>
          </div>
          <p className="text-sm">Kenya's premier turf booking platform. Book. Play. Compete. Win.</p>
          <div className="flex gap-4">
            <Facebook size={20} className="hover:text-gray-900 dark:hover:text-white cursor-pointer" />
            <Twitter size={20} className="hover:text-gray-900 dark:hover:text-white cursor-pointer" />
            <Instagram size={20} className="hover:text-gray-900 dark:hover:text-white cursor-pointer" />
          </div>
        </div>
        
        <div>
          <h4 className="text-gray-900 dark:text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li className="hover:text-green-600 cursor-pointer">Find Turfs</li>
            <li className="hover:text-green-600 cursor-pointer">Tournaments</li>
            <li className="hover:text-green-600 cursor-pointer">Book a Game</li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-900 dark:text-white font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-sm">
            <li className="hover:text-green-600 cursor-pointer">Help Center</li>
            <li className="hover:text-green-600 cursor-pointer">Terms of Service</li>
            <li className="hover:text-green-600 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-900 dark:text-white font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3"><Phone size={16} className="text-red-500" /> +254 700 123 456</li>
            <li className="flex items-center gap-3"><Mail size={16} className="text-red-500" /> info@matchhub.co.ke</li>
            <li className="flex items-center gap-3"><MapPin size={16} className="text-red-500" /> Nairobi, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 pt-12 mt-12 border-t border-gray-200 dark:border-gray-800 text-center text-xs">
        © 2026 Match Hub. All rights reserved. Made with ❤️ in Kenya
      </div>
      
      {/* Dark Mode Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={toggleDarkMode}
          className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </footer>
  );
};
