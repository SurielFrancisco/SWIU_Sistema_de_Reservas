import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Users, Check, CheckCircle2, CreditCard } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getPaymentOption, getRestaurantLayout } from "@/features/restaurants/repository";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getLocalDate, getNextReservationSlot } from "@/lib/date";
import { addReservation, selectTable, setDateTime, setDuration, setGuests, setReservationMethod, setReservationZone } from "../store/reservationsSlice";
import { isTableReserved } from "../selectors";
import LoginRequiredModal from "./LoginRequiredModal";
import PaymentModal from "./PaymentModal";
import type { ReservationMethod, RestaurantLayout, RestaurantSchedule, TableInfo, Weekday } from '@/features/restaurants/types';
import { ApiError } from '@/lib/api/client';
import { createReservation } from '@/lib/api/reservations';

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour24 = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const value = `${String(hour24).padStart(2, "0")}:${minute}`;
  const period = hour24 >= 12 ? "p.m." : "a.m.";
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const label = `${hour12}:${minute} ${period}`;
  return { value, label };
});
const methodOptions: { value: ReservationMethod; label: string; paid: boolean; amount: number }[] = [
  { value: 'automatic-free', label: 'Asignación automática de mesa', paid: false, amount: 0 },
  { value: 'zone-free', label: 'Elección de zona', paid: false, amount: 0 },
  { value: 'table-free', label: 'Elección gratuita de mesa', paid: false, amount: 0 },
  { value: 'automatic-fixed-fee', label: 'Asignación automática con tarifa fija', paid: true, amount: 100 },
  { value: 'table-fixed-fee', label: 'Selección de mesa con tarifa fija', paid: true, amount: 100 },
  { value: 'per-person-fee', label: 'Tarifa por persona', paid: true, amount: 75 },
  { value: 'zone-table-fee', label: 'Tarifa por zona o mesa', paid: true, amount: 150 },
  { value: 'table-deposit', label: 'Selección de mesa con depósito anticipado', paid: true, amount: 200 },
  { value: 'refundable-guarantee', label: 'Reservación con garantía reembolsable', paid: true, amount: 200 },
  { value: 'members-only', label: 'Selección exclusiva para miembros', paid: true, amount: 200 },
];
const weekdayByNumber: Weekday[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const defaultSchedule: RestaurantSchedule = {
  monday: { enabled: true, open: '00:00', close: '23:30' }, tuesday: { enabled: true, open: '00:00', close: '23:30' },
  wednesday: { enabled: true, open: '00:00', close: '23:30' }, thursday: { enabled: true, open: '00:00', close: '23:30' },
  friday: { enabled: true, open: '00:00', close: '23:30' }, saturday: { enabled: true, open: '00:00', close: '23:30' },
  sunday: { enabled: true, open: '00:00', close: '23:30' },
};

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
  const managedRestaurant = useAppSelector((state) => state.admin.restaurants.find((restaurant) => restaurant.id === restaurantId));
  const reservations = useAppSelector((state) => state.reservations.reservations);
  const location = useLocation();
  const paymentOption = getPaymentOption(restaurantId);
  const schedule = managedRestaurant?.schedule ?? defaultSchedule;
  const configuredMethods = managedRestaurant?.reservationMethods ?? ['automatic-free', 'table-free'];
  const availableMethods = methodOptions.filter((method) => configuredMethods.includes(method.value));
  const reservationMethod = availableMethods.some((method) => method.value === draft.reservationMethod)
    ? draft.reservationMethod
    : availableMethods[0]?.value ?? 'table-free';
  const selectedMethod = methodOptions.find((method) => method.value === reservationMethod) ?? methodOptions[2];
  const automaticMethods: ReservationMethod[] = ['automatic-free', 'automatic-fixed-fee', 'per-person-fee'];
  const isAutomaticAssignment = automaticMethods.includes(reservationMethod);
  const isZoneAssignment = reservationMethod === 'zone-free';
  const reservationAmount = selectedMethod.value === 'per-person-fee'
    ? selectedMethod.amount * draft.guests
    : selectedMethod.amount;

  // Find the selected table across all floors of the current restaurant
  const layout = suppliedLayout ?? getRestaurantLayout(restaurantId);
  let selectedTableInfo: TableInfo | null = null;
  if (layout && draft.selectedTableId) {
    for (const floor of layout.floors) {
      const table = floor.tables.find(t => t.id === draft.selectedTableId);
      if (table) {
        selectedTableInfo = table;
        break;
      }
    }
  }
  const activeFloor = layout?.floors.find((floor) => floor.id === draft.floorId) ?? layout?.floors[0];
  const availableZones = [...new Set(activeFloor?.tables.map((table) => table.area).filter(Boolean))] as string[];
  const selectableTables = useMemo(
    () =>
      activeFloor?.tables
        .filter((table) =>
          table.status === 'available' &&
          table.capacity >= draft.guests &&
          !isTableReserved(reservations, {
            restaurantId: draft.restaurantId ?? '',
            floorId: activeFloor.id,
            tableId: table.id,
            date: draft.date,
            time: draft.time,
            durationMinutes: draft.durationMinutes,
          }),
        )
        .sort((first, second) => first.capacity - second.capacity || first.id.localeCompare(second.id)) ?? [],
    [activeFloor, draft.date, draft.durationMinutes, draft.guests, draft.restaurantId, draft.time, reservations],
  );

  const today = getLocalDate();
  const nextSlot = getNextReservationSlot();
  const minimumTime =
    draft.date === today
      ? nextSlot.date === today
        ? nextSlot.time
        : '24:00'
      : undefined;
  const selectedDay = weekdayByNumber[new Date(`${draft.date}T12:00:00`).getDay()];
  const daySchedule = schedule[selectedDay];
  const isClosedDay = !daySchedule?.enabled;
  const reservationTimes = TIME_OPTIONS.filter((time) => !daySchedule || (time.value >= daySchedule.open && time.value <= daySchedule.close));

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmedTable, setConfirmedTable] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);

  useEffect(() => {
    if (!availableMethods.some((method) => method.value === draft.reservationMethod) && availableMethods[0]) {
      dispatch(setReservationMethod(availableMethods[0].value));
    }
  }, [availableMethods, dispatch, draft.reservationMethod]);

  useEffect(() => {
    if (!activeFloor || !draft.restaurantId) return;

    const candidates = selectableTables.filter((table) => !isZoneAssignment || table.area === draft.selectedZone);
    if (isAutomaticAssignment || (isZoneAssignment && draft.selectedZone)) {
      const nextTable = candidates[0];
      if (nextTable?.id !== draft.selectedTableId) dispatch(selectTable(nextTable?.id ?? null));
    } else if (
      !isAutomaticAssignment &&
      !isZoneAssignment &&
      draft.selectedTableId &&
      !selectableTables.some((table) => table.id === draft.selectedTableId)
    ) {
      dispatch(selectTable(null));
    }
  }, [
    activeFloor,
    dispatch,
    draft.date,
    draft.durationMinutes,
    draft.guests,
    draft.restaurantId,
    draft.selectedTableId,
    draft.selectedZone,
    isAutomaticAssignment,
    isZoneAssignment,
    reservations,
    selectableTables,
    selectedTableInfo,
  ]);

  const handleDateChange = (date: string) => {
    if (date === today && nextSlot.date !== today) {
      setReservationError(null);
      dispatch(setDateTime(nextSlot));
      return;
    }

    const dateSchedule = schedule[weekdayByNumber[new Date(`${date}T12:00:00`).getDay()]];
    const time =
      date === today && nextSlot.date === today && draft.time < nextSlot.time
        ? nextSlot.time
        : dateSchedule?.enabled && draft.time >= dateSchedule.open && draft.time <= dateSchedule.close ? draft.time : dateSchedule?.open ?? draft.time;
    setReservationError(null);
    dispatch(setDateTime({ date, time }));
  };

  const handleTimeChange = (time: string) => {
    setReservationError(null);
    dispatch(setDateTime({ date: draft.date, time }));
  };

  const handleMethodChange = (method: ReservationMethod) => {
    setReservationError(null);
    dispatch(setReservationMethod(method));
  };

  const isReservationInPast = () => {
    const reservationStart = new Date(`${draft.date}T${draft.time}`);
    return (
      Number.isNaN(reservationStart.getTime()) ||
      reservationStart.getTime() <= Date.now()
    );
  };

  const completeReservation = async (wasPaid: boolean) => {
    if (isReservationInPast()) {
      setReservationError('La fecha y hora seleccionadas ya pasaron. Elige un horario posterior.');
      setShowPaymentModal(false);
      return;
    }

    const selectedTableIsAvailable = selectedTableInfo
      ? selectableTables.some((table) => table.id === selectedTableInfo?.id)
      : false;

    if (!selectedTableIsAvailable) {
      setReservationError('La mesa seleccionada ya no está disponible para estos criterios.');
      setShowPaymentModal(false);
      return;
    }

    if (draft.selectedTableId && selectedTableInfo && draft.restaurantId && draft.floorId) {
      if (!auth.token) {
        setReservationError('Inicia sesión para confirmar tu reserva.');
        return;
      }

      try {
        const { reserva } = await createReservation(auth.token, {
          restauranteId: draft.restaurantId,
          modalidad: reservationMethod,
          fecha: draft.date,
          hora: draft.time,
          duracion: draft.durationMinutes,
          personas: draft.guests,
          areaId: reservationMethod === 'zone-free' ? selectedTableInfo.areaId : undefined,
          mesaId: reservationMethod === 'table-free' ? draft.selectedTableId : undefined,
        });
        const saved = reserva.mesas[0];
        dispatch(addReservation({
          id: reserva.id,
          restaurantId: reserva.restauranteId,
          floorId: draft.floorId,
          tableId: saved?.mesaId ?? draft.selectedTableId,
          tableLabel: saved?.mesa?.etiqueta ?? selectedTableInfo.label,
          date: draft.date,
          time: draft.time,
          durationMinutes: reserva.duracionMin,
          guests: reserva.personas,
          customerName: auth.userName,
          status: 'upcoming',
          reservationMethod,
        }));
        setConfirmedTable(saved?.mesa?.etiqueta ?? selectedTableInfo.label);
        setPaymentConfirmed(wasPaid);
        dispatch(selectTable(null));
      } catch (error) {
        setReservationError(error instanceof ApiError ? error.message : 'No se pudo crear la reserva.');
      }
    }
    setShowPaymentModal(false);
  };

  const handleReserve = () => {
    setReservationError(null);
    if (!auth.isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (selectedMethod.paid || paymentOption) {
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
              {reservationTimes.map((time) => {
                const isDisabled = minimumTime ? time.value < minimumTime : false;
                return (
                  <option key={time.value} value={time.value} disabled={isDisabled}>
                    {time.label}
                  </option>
                );
              })}
            </select>
            {isClosedDay && <p className="text-xs font-medium text-amber-700">El restaurante no recibe reservaciones este día.</p>}
            {!isClosedDay && daySchedule && <p className="text-xs text-gray-500">Horario: {daySchedule.open} a {daySchedule.close}</p>}
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

          <div className="mb-8 space-y-2">
            <label htmlFor="booking-method" className="flex items-center gap-1.5 text-sm font-medium text-gray-500"><CreditCard className="h-4 w-4" /> Tipo de reserva</label>
            <select id="booking-method" value={reservationMethod} onChange={(event) => handleMethodChange(event.target.value as ReservationMethod)} className="w-full rounded-lg border border-border bg-brand-secondary p-2.5 text-sm font-medium text-brand-primary outline-none focus:ring-1 focus:ring-brand-primary/20">
              {availableMethods.map((method) => <option key={method.value} value={method.value}>{method.label}{method.paid ? ` · desde $${method.amount} MXN` : ' · sin costo'}</option>)}
            </select>
            {selectedMethod.paid && <p className="text-xs text-gray-500">Al confirmar se abrirá la pasarela de pago simulada para completar esta modalidad.</p>}
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

        {isZoneAssignment && (
          <div className="mb-6 space-y-2">
            <label htmlFor="booking-zone" className="text-sm font-medium text-gray-500">Zona preferida</label>
            <select
              id="booking-zone"
              value={draft.selectedZone ?? ''}
              onChange={(event) => dispatch(setReservationZone(event.target.value || null))}
              className="w-full rounded-lg border border-border bg-brand-secondary p-2.5 text-sm font-medium text-brand-primary outline-none focus:ring-1 focus:ring-brand-primary/20"
            >
              <option value="">Selecciona una zona</option>
              {availableZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
            </select>
          </div>
        )}

        {/* Selected Table Indicator */}
        {!selectedTableInfo && (
          <div className="mb-6 p-4 bg-brand-secondary text-gray-500 border border-border rounded-xl text-sm font-medium text-center">
            <span role="status">
              {isAutomaticAssignment
                ? 'No hay una mesa disponible para estos criterios.'
                : isZoneAssignment
                  ? 'Selecciona una zona para asignar una mesa automáticamente.'
                  : 'Por favor, selecciona una mesa en el plano.'}
            </span>
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

        {reservationError && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            {reservationError}
          </div>
        )}

        {/* Submit */}
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <button
            type="button"
            disabled={!selectedTableInfo || isClosedDay || reservationTimes.length === 0}
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
      {(paymentOption || selectedMethod.paid) && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onComplete={completeReservation}
          restaurantName={paymentOption?.restaurantName ?? managedRestaurant?.name ?? 'este restaurante'}
          deposit={selectedMethod.paid ? reservationAmount : paymentOption?.deposit ?? 0}
          paymentLabel={selectedMethod.paid ? 'Pago de la reserva' : 'Anticipo opcional'}
          requiredPayment={selectedMethod.paid}
        />
      )}
    </>
  );
}
