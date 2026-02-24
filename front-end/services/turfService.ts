import { apiRequest } from "@/services/apiClient";

export interface Turf {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  rating: number;
  pricePerHour: number;
  image: string;
  images: string[];
  isOpen: boolean;
  amenities: string[];
  openingTime?: string | null;
  closingTime?: string | null;
}

interface ApiTurf {
  id: string;
  admin_id: string;
  name: string;
  description?: string | null;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  price_per_hour: number;
  opening_time?: string | null;
  closing_time?: string | null;
  images: string[];
  amenities: string[];
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const getFallbackImage = (id: string) => {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000",
    "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1000",
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000",
  ];
  const index = Number.parseInt(id.replace(/\D/g, ""), 10) || 0;
  return fallbackImages[index % fallbackImages.length];
};

const mapApiTurf = (turf: ApiTurf): Turf => ({
  id: turf.id,
  name: turf.name,
  location: turf.location,
  description: turf.description,
  rating: turf.rating ?? 0,
  pricePerHour: turf.price_per_hour,
  image: turf.images?.[0] || getFallbackImage(turf.id),
  images: turf.images || [],
  isOpen: turf.is_active,
  amenities: turf.amenities || [],
  openingTime: turf.opening_time,
  closingTime: turf.closing_time,
});

const toQueryString = (params?: Record<string, string | number | undefined>) => {
  if (!params) return "";
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      urlParams.set(key, String(value));
    }
  });
  const query = urlParams.toString();
  return query ? `?${query}` : "";
};

export const getTurfs = async (params?: {
  search?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
}): Promise<Turf[]> => {
  const query = toQueryString(params);

  try {
    const data = await apiRequest<ApiTurf[]>(`/turfs${query}`, {
      cache: "no-store",
    });
    return data.map(mapApiTurf);
  } catch {
    return [];
  }
};

export const getFeaturedTurfs = async (): Promise<Turf[]> => {
  const turfs = await getTurfs();
  return turfs.slice(0, 6);
};

export const getTurfById = async (id: string): Promise<Turf | null> => {
  try {
    const data = await apiRequest<ApiTurf>(`/turfs/${id}`, {
      cache: "no-store",
    });
    return mapApiTurf(data);
  } catch {
    return null;
  }
};
