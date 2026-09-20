import { UtensilsCrossed, UserCircle, Map as MapIcon, Calendar as CalendarIcon } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import TableMapContainer from './components/TableMap/TableMapContainer';
import BookingSidebar from './components/BookingSidebar/BookingSidebar';
import ReservationsList from './components/ReservationsList';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function BookingView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'mapa' | 'reservas'>('mapa');
  const [role, setRole] = useState<'cliente' | 'recepcionista'>('cliente');

  return (
    <div className="flex h-screen bg-brand-secondary text-brand-primary font-sans selection:bg-brand-primary/10">
      
      {/* Left Sidebar */}
      <div className="w-64 bg-card border-r border-border h-screen flex flex-col z-10 relative shadow-sm shrink-0">
        <div className="p-6 border-b border-border">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-serif font-semibold tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-brand-primary" />
              SDReservas
            </h1>
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center border border-border">
              <UserCircle className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {role === 'cliente' ? 'Cliente Demo' : 'Recepcionista'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('mapa')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'mapa' ? 'bg-brand-secondary text-brand-primary font-semibold' : 'text-gray-500 hover:bg-brand-secondary/50 hover:text-brand-primary'}`}
          >
            <MapIcon className="w-4 h-4" />
            Mapa de Mesas
          </button>

          <button
            onClick={() => setActiveTab('reservas')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'reservas' ? 'bg-brand-secondary text-brand-primary font-semibold' : 'text-gray-500 hover:bg-brand-secondary/50 hover:text-brand-primary'}`}
          >
            <CalendarIcon className="w-4 h-4" />
            Mis Reservas
          </button>
        </nav>

        <div className="p-4 border-t border-border bg-card">
          <div className="text-[10px] font-semibold text-gray-400 mb-3 px-1 uppercase tracking-wider">
            Simulador de Rol
          </div>
          <select
            className="w-full bg-brand-secondary text-sm border-0 rounded-md p-2.5 focus:ring-2 focus:ring-brand-primary cursor-pointer outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            <option value="cliente">Cliente</option>
            <option value="recepcionista">Recepcionista</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-4 md:p-8 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'mapa' ? (
            <motion.div 
              key="mapa"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-[1400px] mx-auto flex flex-col h-full"
            >
              {/* Header */}
              <div className="mb-8 flex-shrink-0">
                <h2 className="text-3xl font-serif font-medium text-brand-primary">
                  Crear Nueva Reserva
                </h2>
                <p className="text-gray-500 mt-1">
                  Asegura tu lugar en SDReservas para una experiencia inolvidable.
                </p>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
                {/* Map Column */}
                <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden relative">
                  <div className="p-5 border-b border-border flex justify-between items-center bg-white z-10 relative">
                    <h3 className="font-medium text-brand-primary text-sm">
                      Plano del Restaurante
                    </h3>
                    <div className="flex gap-4 text-[11px] md:text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-white border border-border rounded-sm shadow-sm" /> Disponible
                      </span>
                      <span className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-brand-primary border border-brand-primary rounded-sm" /> Seleccionada
                      </span>
                      <span className="flex items-center gap-1.5">
                        <div className="w-3 h-3 bg-[#F5F5F5] border border-border rounded-sm" /> Ocupada
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative overflow-auto p-6 bg-brand-secondary/30">
                     <TableMapContainer restaurantId={id!} />
                  </div>
                </div>

                {/* Form Column */}
                <div className="w-full lg:w-[420px] flex-shrink-0 h-full overflow-y-auto">
                  <BookingSidebar restaurantId={id!} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reservas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-[1400px] mx-auto flex flex-col h-full"
            >
              <div className="mb-8 flex-shrink-0">
                <h2 className="text-3xl font-serif font-medium text-brand-primary">
                  Mis Reservas
                </h2>
                <p className="text-gray-500 mt-1">
                  Administra tus reservas actuales y revisa tu historial.
                </p>
              </div>
              <ReservationsList />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
