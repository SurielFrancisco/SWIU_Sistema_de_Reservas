import { useState } from "react";
import { Calendar, Clock, Users, Check, CheckCircle2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getPaymentOption, getRestaurantLayout } from "@/features/restaurants/repository";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createId } from "@/lib/ids";
import { getLocalDate, getLocalTime } from "@/lib/date";
import { addReservation, selectTable, setDateTime, setDuration, setGuests } from "../store/reservationsSlice";
import LoginRequiredModal from "./LoginRequiredModal";
import PaymentModal from "./PaymentModal";
import type { RestaurantLayout } from '@/features/restaurants/types';

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour24 = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const value = `${String(hour24).padStart(2, "0")}:${minute}`;
  const period = hour24 >= 12 ? "p.m." : "a.m.";
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const label = `${hour12}:${minute} ${period}`;
  return { value, label };
});

export default function BookingForm({
  restaurantId,
  layout: suppliedLayout,
}: {
  restaurantId?: string;
  layout?: RestaurantLayout;
}) {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.reservations.draft);
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();
  const paymentOption = getPaymentOption(restaurantId);

  // Find the selected table across all floors of the current restaurant
  const layout = suppliedLayout ?? getRestaurantLayout(restaurantId);
  let selectedTableInfo = null;
  if (layout && draft.selectedTableId) {
    for (const floor of layout.floors) {
      const table = floor.tables.find(t => t.id === draft.selectedTableId);
      if (table) {
        selectedTableInfo = table;
        break;
      }
    }
  }

  const today = getLocalDate();
  const minimumTime =
    draft.date === today ? getLocalTime() : undefined;

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmedTable, setConfirmedTable] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleDateChange = (date: string) => {
    const time =
      date === today && draft.time < getLocalTime()
        ? getLocalTime()
        : draft.time;
    dispatch(setDateTime({ date, time }));
  };

  const handleTimeChange = (time: string) => {
    dispatch(setDateTime({ date: draft.date, time }));
  };

  const completeReservation = (wasPaid: boolean) => {
    if (draft.selectedTableId && selectedTableInfo && draft.restaurantId && draft.floorId) {
      const newReservation = {
        id: createId(),
        restaurantId: draft.restaurantId,
        floorId: draft.floorId,
        tableId: draft.selectedTableId,
        tableLabel: selectedTableInfo.label,
        date: draft.date,
        time: draft.time,
        durationMinutes: draft.durationMinutes,
        guests: draft.guests,
        customerName: auth.userName,
        status: 'upcoming' as const,
        paymentStatus: paymentOption ? (wasPaid ? 'paid' as const : 'not-paid' as const) : undefined,
        depositAmount: wasPaid ? paymentOption?.deposit : undefined,
      };
      dispatch(addReservation(newReservation));
      setConfirmedTable(selectedTableInfo.label);
      setPaymentConfirmed(wasPaid);
      dispatch(selectTable(null));
    }
    setShowPaymentModal(false);
  };

  const handleReserve = () => {
    if (!auth.isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (paymentOption) {
      setShowPaymentModal(true);
      return;
    }

    completeReservation(false);
  };

  return (
    <>
      <form className="bg-card p-5 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full">
        {/* Grid: Fecha / Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label htmlFor="booking-date" className="text-sm font-medium flex items-center gap-1.5 text-gray-500">
              <Calendar className="w-4 h-4" /> Fecha
            </label>
            <input
              id="booking-date"
              type="date"
              required
              min={today}
              value={draft.date}
              onChange={(event) => handleDateChange(event.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-primary/20 text-sm font-medium text-brand-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="booking-time" className="text-sm font-medium flex items-center gap-1.5 text-gray-500">
              <Clock className="w-4 h-4" /> Hora
            </label>
            <select
              id="booking-time"
              required
              value={draft.time}
              onChange={(event) => handleTimeChange(event.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-primary/20 text-sm font-medium text-brand-primary outline-none cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1em 1em',
                paddingRight: '2.5rem'
              }}
            >
              {TIME_OPTIONS.map((time) => {
                const isDisabled = minimumTime ? time.value < minimumTime : false;
                return (
                  <option key={time.value} value={time.value} disabled={isDisabled}>
                    {time.label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Grid: Personas / Duración */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <label htmlFor="booking-guests" className="text-sm font-medium flex items-center gap-1.5 text-gray-500">
              <Users className="w-4 h-4" /> Personas
            </label>
            <select
              id="booking-guests"
              value={draft.guests}
              onChange={(event) => dispatch(setGuests(Number(event.target.value)))}
              className="w-full p-2.5 rounded-lg border border-border bg-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-primary/20 text-sm font-medium text-brand-primary outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} personas
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="booking-duration" className="text-sm font-medium flex items-center gap-1.5 text-gray-500">
              <Clock className="w-4 h-4" /> Duración
            </label>
            <select
              id="booking-duration"
              value={draft.durationMinutes}
              onChange={(event) => dispatch(setDuration(Number(event.target.value)))}
              className="w-full p-2.5 rounded-lg border border-border bg-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-primary/20 text-sm font-medium text-brand-primary outline-none"
            >
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
              <option value={90}>1.5 horas</option>
              <option value={120}>2 horas</option>
              <option value={180}>3 horas</option>
            </select>
          </div>
        </div>

        {/* Selected Table Indicator */}
        {!selectedTableInfo && (
          <div className="mb-6 p-4 bg-brand-secondary text-gray-500 border border-border rounded-xl text-sm font-medium text-center">
            <span role="status">Por favor, selecciona una mesa en el plano.</span>
          </div>
        )}

        {selectedTableInfo && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            Mesa {selectedTableInfo.label} seleccionada.
          </div>
        )}

        {confirmedTable && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Reserva confirmada</p>
              <p className="mt-0.5 text-emerald-800">
                La mesa {confirmedTable} ya aparece en tus reservas{paymentConfirmed ? ' y tu anticipo quedó registrado.' : '.'}
              </p>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <button
            type="button"
            disabled={!selectedTableInfo}
            onClick={handleReserve}
            className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-medium text-sm hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Confirmar Reserva
          </button>
          <button
            type="button"
            onClick={() => dispatch(selectTable(null))}
            className="w-full py-3.5 rounded-xl font-medium text-sm text-gray-500 hover:bg-brand-secondary transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      <LoginRequiredModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        returnTo={location.pathname}
      />
      {paymentOption && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onComplete={completeReservation}
          restaurantName={paymentOption.restaurantName}
          deposit={paymentOption.deposit}
        />
      )}
    </>
  );
}
