import { apiRequest } from "@/services/apiClient";

export interface AvailabilitySlot {
  start_time: string;
  end_time: string;
  status: "booked" | "blocked";
  reason?: string;
}

export interface AvailabilityResponse {
  turf_id: string;
  date: string;
  slots: AvailabilitySlot[];
}

interface CreateBookingPayload {
  turfId: string;
  clientId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
type BookingPaymentStatus = "unpaid" | "paid" | "refunded";

export interface BookingRecord {
  id: string;
  turf_id: string;
  client_id: string;
  game_id?: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: BookingStatus;
  payment_status: BookingPaymentStatus;
  created_at?: string;
  updated_at?: string;
}

type CreateBookingResponse = BookingRecord;

export type UserBooking = BookingRecord;

export interface OwnerBooking extends BookingRecord {
  client: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    skill_level?: "beginner" | "intermediate" | "pro" | null;
    user_type: "client";
  } | null;
  turf: {
    id: string;
    admin_id: string;
    name: string;
    location: string;
    price_per_hour: number;
    opening_time?: string | null;
    closing_time?: string | null;
    is_active: boolean;
  } | null;
}

interface StkPushResponse {
  message: string;
  booking_id: string;
  payment_status: "pending" | "completed" | "failed";
  merchant_request_id?: string;
  checkout_request_id?: string;
  response_code?: string;
  response_description?: string;
}

interface PaymentStatusResponse {
  booking_id: string;
  status: "pending" | "completed" | "failed";
  mpesa_transaction_id?: string | null;
  checkout_request_id?: string | null;
  merchant_request_id?: string | null;
  amount: number;
}

export const getAvailability = async (turfId: string, date: string): Promise<AvailabilityResponse> => {
  return apiRequest<AvailabilityResponse>(`/turfs/${turfId}/availability?date=${date}`, {
    cache: "no-store",
  });
};

export const createBooking = async (
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> => {
  return apiRequest<CreateBookingResponse>("/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": payload.clientId,
    },
    body: JSON.stringify({
      turf_id: payload.turfId,
      booking_date: payload.bookingDate,
      start_time: payload.startTime,
      end_time: payload.endTime,
      notes: payload.notes,
    }),
  });
};

export const getMyBookings = async (clientId: string): Promise<UserBooking[]> => {
  return apiRequest<UserBooking[]>("/bookings", {
    headers: {
      "X-User-Id": clientId,
    },
    cache: "no-store",
  });
};

export const getOwnerBookings = async (
  adminId: string,
  params?: { date?: string }
): Promise<OwnerBooking[]> => {
  const queryParams = new URLSearchParams();
  if (params?.date) {
    queryParams.set("date", params.date);
  }

  const queryString = queryParams.toString();

  return apiRequest<OwnerBooking[]>(`/owner/bookings${queryString ? `?${queryString}` : ""}`, {
    headers: {
      "X-User-Id": adminId,
    },
    cache: "no-store",
  });
};

export const initiateStkPush = async (payload: {
  bookingId: string;
  clientId: string;
  phone: string;
}): Promise<StkPushResponse> => {
  return apiRequest<StkPushResponse>("/payments/stkpush", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": payload.clientId,
    },
    body: JSON.stringify({
      booking_id: payload.bookingId,
      phone: payload.phone,
    }),
  });
};

export const getPaymentStatus = async (bookingId: string): Promise<PaymentStatusResponse> => {
  return apiRequest<PaymentStatusResponse>(`/payments/${bookingId}/status`, {
    cache: "no-store",
  });
};

export const approveBooking = async (bookingId: string, adminId: string): Promise<BookingRecord> => {
  return apiRequest<BookingRecord>(`/bookings/${bookingId}/approve`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": adminId,
    },
  });
};
