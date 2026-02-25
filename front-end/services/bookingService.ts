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

interface CreateBookingResponse {
  id: string;
  turf_id: string;
  client_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "unpaid" | "paid" | "refunded";
}

export type UserBooking = CreateBookingResponse;

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
