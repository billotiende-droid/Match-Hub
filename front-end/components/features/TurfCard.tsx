// src/components/features/TurfCard.tsx
import { Star, MapPin, Clock } from 'lucide-react';

interface Turf {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerHour: number;
  image: string;
  isOpen: boolean;
}

interface TurfCardProps {
  turf: Turf;
}

export const TurfCard = ({ turf }: TurfCardProps) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={turf.image} 
          alt={turf.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-sm">{turf.rating}</span>
        </div>
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
          turf.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {turf.isOpen ? 'OPEN' : 'CLOSED'}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{turf.name}</h3>
        
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{turf.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D31D3F]" />
            <span className="font-bold text-[#D31D3F]">KES {turf.pricePerHour}</span>
            <span className="text-gray-400 text-sm">/hour</span>
          </div>
          
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
