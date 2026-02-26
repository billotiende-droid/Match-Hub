 "use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { getAuthSession } from "@/services/authService";
import {
  createBooking,
  getAvailability,
  getPaymentStatus,
  initiateStkPush,
} from "@/services/bookingService";

interface BookingPanelProps {
  turfId: string;
  pricePerHour: number;
}

const START_HOUR = 6;
const END_HOUR = 23;

const toTimeLabel = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

const getTodayIsoDate = () => new Date().toISOString().slice(0, 10);

const expandHours = (startTime: string, endTime: string): string[] => {
  const start = Number(startTime.split(":")[0]);
  const end = Number(endTime.split(":")[0]);
  const hours: string[] = [];
  for (let hour = start; hour < end; hour += 1) {
    hours.push(toTimeLabel(hour));
  }
  return hours;
};

export const BookingPanel = ({ turfId, pricePerHour }: BookingPanelProps) => {
  const [clientId, setClientId] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(getTodayIsoDate());
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("19:00");
  const [notes, setNotes] = useState("");

  const [busyHours, setBusyHours] = useState<Set<string>>(new Set());
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "failed" | null>(null);
  const [createdBookingId, setCreatedBookingId] = useState("");

  useEffect(() => {
    const storedUserId =
      window.localStorage.getItem("matchhub_client_id") ||
      window.localStorage.getItem("matchhub_user_id") ||
      "";
    const session = getAuthSession();

    if (storedUserId) {
      setClientId(storedUserId);
    }

    if (session?.user?.phone) {
      setPhone(session.user.phone);
    }
  }, []);

  useEffect(() => {
    if (!clientId) return;
    window.localStorage.setItem("matchhub_client_id", clientId);
    window.localStorage.setItem("matchhub_user_id", clientId);
  }, [clientId]);

  useEffect(() => {
    let active = true;

    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      setError("");

      try {
        const data = await getAvailability(turfId, date);
        if (!active) return;

        const nextBusyHours = new Set<string>();
        data.slots.forEach((slot) => {
          expandHours(slot.start_time, slot.end_time).forEach((hour) => nextBusyHours.add(hour));
        });
        setBusyHours(nextBusyHours);
      } catch (fetchError) {
        if (!active) return;
        setBusyHours(new Set());
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load availability");
      } finally {
        if (active) {
          setLoadingAvailability(false);
        }
      }
    };

    fetchAvailability();

    return () => {
      active = false;
    };
  }, [date, turfId]);

  const startOptions = useMemo(
    () => Array.from({ length: END_HOUR - START_HOUR }, (_, index) => START_HOUR + index),
    []
  );

  const endOptions = useMemo(() => {
    const selectedStart = Number(startTime.split(":")[0]);
    return Array.from({ length: END_HOUR - selectedStart }, (_, index) => selectedStart + index + 1);
  }, [startTime]);

  const selectedHours = useMemo(() => {
    const start = Number(startTime.split(":")[0]);
    const end = Number(endTime.split(":")[0]);
    return Math.max(end - start, 0);
  }, [endTime, startTime]);

  const totalAmount = selectedHours * pricePerHour;

  const hasConflict = useMemo(() => {
    return expandHours(startTime, endTime).some((hour) => busyHours.has(hour));
  }, [busyHours, endTime, startTime]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setPaymentMessage("");
    setPaymentStatus(null);

    if (!clientId.trim()) {
      setError("Login first or enter your client ID.");
      return;
    }

    if (hasConflict) {
      setError("Selected time is not available. Pick another slot.");
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({
        turfId,
        clientId: clientId.trim(),
        bookingDate: date,
        startTime,
        endTime,
        notes: notes.trim() || undefined,
      });

      setCreatedBookingId(booking.id);
      setSuccess(
        `Booking created (${booking.id.slice(0, 8)}). Status: ${booking.status}. Payment: ${booking.payment_status}. Total: KES ${booking.total_amount}.`
      );
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStkPush = async () => {
    setError("");
    setPaymentMessage("");

    if (!createdBookingId) {
      setError("Create a booking first.");
      return;
    }

    if (!phone.trim()) {
      setError("Enter phone number for M-Pesa prompt.");
      return;
    }

    setPaying(true);
    try {
      const response = await initiateStkPush({
        bookingId: createdBookingId,
        clientId: clientId.trim(),
        phone: phone.trim(),
      });

      setPaymentStatus("pending");
      setPaymentMessage(response.message || "STK Push initiated. Check your phone.");
    } catch (payError) {
      setError(payError instanceof Error ? payError.message : "Failed to start payment");
    } finally {
      setPaying(false);
    }
  };

  const handleCheckPaymentStatus = async () => {
    if (!createdBookingId) return;

    setCheckingPayment(true);
    setError("");
    try {
      const response = await getPaymentStatus(createdBookingId);
      setPaymentStatus(response.status);

      if (response.status === "completed") {
        setPaymentMessage(`Payment confirmed. Receipt: ${response.mpesa_transaction_id || "N/A"}`);
      } else if (response.status === "failed") {
        setPaymentMessage("Payment failed. You can retry STK push.");
      } else {
        setPaymentMessage("Payment is still pending.");
      }
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Failed to check payment status");
    } finally {
      setCheckingPayment(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-2xl p-4 sm:p-6 space-y-4">
      <h2 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">Book This Turf</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">Select date/time, create booking, then trigger M-Pesa STK Push.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Client ID</span>
          <input
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            placeholder="Client UUID"
            className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-white dark:bg-[var(--surface)]"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">M-Pesa Phone</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="07XXXXXXXX"
            className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-white dark:bg-[var(--surface)]"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Date</span>
          <input
            type="date"
            min={getTodayIsoDate()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-white dark:bg-[var(--surface)]"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">Notes (optional)</span>
          <input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Team name, jersey color..."
            className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-white dark:bg-[var(--surface)]"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Start Time</span>
          <select
            value={startTime}
            onChange={(event) => {
              const nextStart = event.target.value;
              setStartTime(nextStart);
              const nextHour = Number(nextStart.split(":")[0]) + 1;
              if (nextHour > Number(endTime.split(":")[0])) {
                setEndTime(toTimeLabel(nextHour));
              }
            }}
            className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-white dark:bg-[var(--surface)]"
          >
            {startOptions.map((hour) => {
              const label = toTimeLabel(hour);
              const unavailable = busyHours.has(label);
              return (
                <option key={label} value={label} disabled={unavailable}>
                  {label} {unavailable ? "(Unavailable)" : ""}
                </option>
              );
            })}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-semibold mb-1">End Time</span>
          <select
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-white dark:bg-[var(--surface)]"
          >
            {endOptions.map((hour) => {
              const label = toTimeLabel(hour);
              return (
                <option key={label} value={label}>
                  {label}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      <div className="rounded-xl bg-[var(--surface-muted)] dark:bg-[var(--surface-muted)] border border-[var(--color-border)] p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">Hours: {selectedHours}</p>
        <p className="text-lg font-bold text-[var(--color-primary)]">Total: KES {totalAmount}</p>
        <p className="text-xs text-gray-500 mt-1">Availability and booking checks use your backend endpoints.</p>
      </div>

      {loadingAvailability && <p className="text-sm text-gray-500">Checking availability...</p>}
      {hasConflict && <p className="text-sm text-[var(--color-primary-strong)]">Selected range overlaps an unavailable slot.</p>}
      {error && <p className="text-sm text-[var(--color-primary-strong)]">{error}</p>}
      {success && <p className="text-sm text-[var(--color-primary)]">{success}</p>}

      <button
        type="submit"
        disabled={submitting || loadingAvailability}
        className="w-full bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-strong)] transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Creating Booking..." : "Create Booking"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleStkPush}
          disabled={!createdBookingId || paying}
          className="w-full bg-[var(--color-secondary)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-accent)] transition disabled:opacity-60"
        >
          {paying ? "Starting STK..." : "Pay with M-Pesa"}
        </button>

        <button
          type="button"
          onClick={handleCheckPaymentStatus}
          disabled={!createdBookingId || checkingPayment}
          className="w-full border border-[var(--color-border)] px-6 py-3 rounded-xl font-bold hover:bg-[var(--surface-muted)] dark:hover:bg-[var(--surface-muted)] transition disabled:opacity-60"
        >
          {checkingPayment ? "Checking..." : "Check Payment Status"}
        </button>
      </div>

      {createdBookingId && (
        <p className="text-xs text-gray-500">
          Booking ID: <span className="font-mono">{createdBookingId}</span>
        </p>
      )}

      {paymentStatus && (
        <p className="text-sm">
          Payment status: <span className="font-semibold uppercase">{paymentStatus}</span>
        </p>
      )}

      {paymentMessage && <p className="text-sm text-[var(--color-primary)]">{paymentMessage}</p>}
    </form>
  );
};
