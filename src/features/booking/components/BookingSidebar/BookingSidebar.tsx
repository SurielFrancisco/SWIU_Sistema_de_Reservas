import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Calendar, Clock, Users, Check } from "lucide-react";
import { RESTAURANT_LAYOUTS } from "../../mockData";
import { setDateTime, selectTable, addReservation } from "../../store/bookingSlice";
import BookingModal from "../BookingModal";

const getToday = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour24 = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const value = `${String(hour24).padStart(2, "0")}:${minute}`;
  const period = hour24 >= 12 ? "p.m." : "a.m.";
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const label = `${hour12}:${minute} ${period}`;
  return { value, label };
});

export default function BookingSidebar({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const dispatch = useDispatch();
  const bookingState = useSelector((state: RootState) => state.booking);
  
  // Find the selected table across all floors of the current restaurant
  const layout = RESTAURANT_LAYOUTS[restaurantId];
  let selectedTableInfo = null;
  if (layout && bookingState.selectedTableId) {
    for (const floor of layout.floors) {
      const table = floor.tables.find(t => t.id === bookingState.selectedTableId);
      if (table) {
        selectedTableInfo = table;
        break;
      }
    }
  }

  const today = getToday();
  const minimumTime =
    bookingState.date === today ? getCurrentTime() : undefined;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateChange = (date: string) => {
    const time =
      date === today && bookingState.time < getCurrentTime()
        ? getCurrentTime()
        : bookingState.time;
    dispatch(setDateTime({ date, time }));
  };

  const handleTimeChange = (time: string) => {
    dispatch(setDateTime({ date: bookingState.date, time }));
  };

  const handleConfirmSuccess = (customerName: string) => {
    if (bookingState.selectedTableId && selectedTableInfo) {
      const newReservation = {
        id: Math.random().toString(36).substr(2, 9),
        tableId: bookingState.selectedTableId,
        tableLabel: selectedTableInfo.label,
        date: bookingState.date,
        time: bookingState.time,
        guests: bookingState.guests,
        customerName: customerName,
        status: 'upcoming' as const,
      };
      dispatch(addReservation(newReservation));
    }
    setIsModalOpen(false);
    // Optionally reset state or navigate away
    dispatch(selectTable(null));
  };

  return (
    <>
      <form className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full overflow-y-auto">
        {/* Grid: Fecha / Hora */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-gray-500">
              <Calendar className="w-4 h-4" /> Fecha
            </label>
            <input
              type="date"
              required
              min={today}
              value={bookingState.date}
              onChange={(event) => handleDateChange(event.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-primary/20 text-sm font-medium text-brand-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-gray-500">
              <Clock className="w-4 h-4" /> Hora
            </label>
            <select
              required
              value={bookingState.time}
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
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5 text-gray-500">
              <Users className="w-4 h-4" /> Personas
            </label>
            <select
              defaultValue={bookingState.guests}
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
            <label className="text-sm font-medium flex items-center gap-1.5 text-gray-500">
              <Clock className="w-4 h-4" /> Duración
            </label>
            <select
              defaultValue="2 horas"
              className="w-full p-2.5 rounded-lg border border-border bg-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-primary/20 text-sm font-medium text-brand-primary outline-none"
            >
              <option value="30 minutos">30 minutos</option>
              <option value="1 hora">1 hora</option>
              <option value="1.5 horas">1.5 horas</option>
              <option value="2 horas">2 horas</option>
              <option value="3 horas">3 horas</option>
            </select>
          </div>
        </div>

        {/* Selected Table Indicator */}
        {!selectedTableInfo && (
          <div className="mb-6 p-4 bg-brand-secondary text-gray-500 border border-border rounded-xl text-sm font-medium text-center">
            Por favor, selecciona una mesa en el plano.
          </div>
        )}

        {selectedTableInfo && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            Mesa {selectedTableInfo.label} seleccionada.
          </div>
        )}

        {/* Submit */}
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <button
            type="button"
            disabled={!selectedTableInfo}
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-medium text-sm hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Confirmar Reserva
          </button>
          <button
            type="button"
            className="w-full py-3.5 rounded-xl font-medium text-sm text-gray-500 hover:bg-brand-secondary transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookingDetails={{
          date: bookingState.date,
          time: bookingState.time,
          guests: bookingState.guests,
          tableLabel: selectedTableInfo?.label || "",
        }}
        onConfirmSuccess={handleConfirmSuccess}
      />
    </>
  );
}
