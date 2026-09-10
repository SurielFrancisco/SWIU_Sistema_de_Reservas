import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { Calendar, Clock, Users, Check } from 'lucide-react';
import { MOCK_TABLES } from '../../mockData';

export default function BookingSidebar({ restaurantId: _ }: { restaurantId: string }) {
  const bookingState = useSelector((state: RootState) => state.booking);
  const selectedTableInfo = MOCK_TABLES.find((t: any) => t.id === bookingState.selectedTableId);

  return (
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
            defaultValue={bookingState.date}
            className="w-full p-2.5 rounded-lg border border-border bg-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-primary/20 text-sm font-medium text-brand-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1.5 text-gray-500">
            <Clock className="w-4 h-4" /> Hora
          </label>
          <input
            type="time"
            required
            defaultValue={bookingState.time}
            className="w-full p-2.5 rounded-lg border border-border bg-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-primary/20 text-sm font-medium text-brand-primary"
          />
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
              <option key={n} value={n}>{n} pax</option>
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
  );
}
