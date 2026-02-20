// src/services/turfService.ts

export interface Turf {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerHour: number;
  image: string;
  isOpen: boolean;
}

export const getFeaturedTurfs = async (): Promise<Turf[]> => {
  // Mock data for featured turfs
  const turfs: Turf[] = [
    {
      id: '1',
      name: 'Nairobi Sports Club',
      location: 'Ngong Road, Nairobi',
      rating: 4.8,
      pricePerHour: 3500,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000',
      isOpen: true,
    },
    {
      id: '2',
      name: 'Kasarani Turf Arena',
      location: 'Kasarani, Nairobi',
      rating: 4.6,
      pricePerHour: 2800,
      image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1000',
      isOpen: true,
    },
    {
      id: '3',
      name: 'Westlands Football Hub',
      location: 'Westlands, Nairobi',
      rating: 4.9,
      pricePerHour: 4200,
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000',
      isOpen: false,
    },
    {
      id: '4',
      name: 'Mombasa Road Sports',
      location: 'Mombasa Road, Nairobi',
      rating: 4.4,
      pricePerHour: 2500,
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000',
      isOpen: true,
    },
    {
      id: '5',
      name: 'Karen Country Club',
      location: 'Karen, Nairobi',
      rating: 4.7,
      pricePerHour: 5000,
      image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1000',
      isOpen: true,
    },
    {
      id: '6',
      name: 'Langata Sports Complex',
      location: 'Langata, Nairobi',
      rating: 4.5,
      pricePerHour: 3000,
      image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=1000',
      isOpen: true,
    },
  ];

  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(turfs), 500);
  });
};
