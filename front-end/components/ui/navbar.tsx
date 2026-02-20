import Link from 'next/link';
import { Search, Moon, User } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
        </div>
        <span className="font-bold text-xl">Match Hub</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
        <Link href="/turfs">Turfs</Link>
        <Link href="/games">Games</Link>
        <Link href="/tournaments">Tournaments</Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 border rounded-lg"><Moon size={20} /></button>
        <button className="font-medium">Login</button>
        <button className="bg-[#D31D3F] text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition">
          Register
        </button>
      </div>
    </nav>
  );
};