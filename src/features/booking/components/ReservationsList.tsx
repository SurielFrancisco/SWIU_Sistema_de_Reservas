import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { cancelReservation } from '../store/bookingSlice';
import { CalendarDays, Clock, Users, MapPin, XCircle, User, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReservationsList() {
  const dispatch = useDispatch();
  const reservations = useSelector((state: RootState) => state.booking.reservations);

  const upcomingReservations = reservations.filter(r => r.status === 'upcoming');
  const pastOrCancelled = reservations.filter(r => r.status !== 'upcoming');

  const handleCancel = (id: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      dispatch(cancelReservation(id));
    }
  };

  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm h-[60vh]"
    >
      <div className="w-24 h-24 bg-brand-secondary/50 rounded-full flex items-center justify-center mb-6">
        <CalendarDays className="w-10 h-10 text-brand-primary/50" />
      </div>
      <h3 className="text-2xl font-serif font-medium text-gray-900 mb-2">
        Aún no tienes reservas
      </h3>
      <p className="text-gray-500 max-w-sm">
        Explora nuestro plano interactivo y encuentra la mesa perfecta para tu próxima visita.
      </p>
    </motion.div>
  );

  return (
    <div className="flex-1 bg-gray-50/50 p-6 md:p-8 rounded-3xl overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {reservations.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Próximas Reservas */}
            <section>
              <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-brand-primary" />
                Próximas Reservas
                <span className="bg-brand-primary/10 text-brand-primary text-xs font-bold px-2.5 py-0.5 rounded-full ml-2">
                  {upcomingReservations.length}
                </span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {upcomingReservations.map((res) => (
                    <motion.div
                      key={res.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                      
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-3">
                            <CheckCircle2 className="w-3 h-3" /> Confirmada
                          </span>
                          <h4 className="font-medium text-gray-900 text-lg">{res.date}</h4>
                          <div className="text-brand-primary font-bold text-xl mt-0.5">{res.time}</div>
                        </div>
                        <div className="w-12 h-12 bg-brand-secondary rounded-xl flex items-center justify-center font-serif text-lg font-medium text-brand-primary border border-gray-100">
                          {res.tableLabel}
                        </div>
                      </div>

                      <div className="space-y-2.5 py-4 border-t border-b border-gray-50 my-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{res.customerName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{res.guests} personas</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>Mesa {res.tableLabel}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleCancel(res.id)}
                          className="flex-1 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                        >
                          Cancelar Reserva
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {upcomingReservations.length === 0 && (
                  <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">No tienes reservas próximas.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Historial / Canceladas */}
            {pastOrCancelled.length > 0 && (
              <section className="pt-8 mt-8 border-t border-gray-200">
                <h3 className="text-xl font-medium text-gray-400 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Historial y Canceladas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                  {pastOrCancelled.map((res) => (
                    <div key={res.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-full mb-3">
                            <XCircle className="w-3 h-3" /> Cancelada
                          </span>
                          <h4 className="font-medium text-gray-500">{res.date}</h4>
                          <div className="text-gray-400 font-medium mt-0.5">{res.time}</div>
                        </div>
                        <div className="text-gray-400 font-medium">Mesa {res.tableLabel}</div>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                         <User className="w-3.5 h-3.5" /> {res.customerName}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
