import { useState } from 'react';
import { RESTAURANT_LAYOUTS } from '../../mockData';
import Table from './Table';
import { motion, AnimatePresence } from 'framer-motion';

interface TableMapContainerProps {
  restaurantId: string;
}

export default function TableMapContainer({ restaurantId }: TableMapContainerProps) {
  const layout = RESTAURANT_LAYOUTS[restaurantId];
  
  // Default to the first floor if available
  const [activeFloorId, setActiveFloorId] = useState(layout?.floors[0]?.id || '');

  if (!layout) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Plano no disponible para este restaurante.
      </div>
    );
  }

  const activeFloor = layout.floors.find(f => f.id === activeFloorId) || layout.floors[0];

  return (
    <div className="w-full h-[600px] min-w-[600px] relative flex">
      
      {/* Floor Selector (Only visible if > 1 floor) */}
      {layout.floors.length > 1 && (
        <div className="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur-md rounded-xl p-1.5 shadow-sm border border-gray-100 flex flex-col gap-1">
          {layout.floors.map(floor => (
            <button
              key={floor.id}
              onClick={() => setActiveFloorId(floor.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeFloorId === floor.id 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-brand-primary'
              }`}
            >
              {floor.name}
            </button>
          ))}
        </div>
      )}

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden bg-white/50 rounded-2xl border border-gray-100 shadow-inner">
        {/* Background Grid Pattern - Very subtle */}
        <div className="absolute inset-0 opacity-50" style={{ 
          backgroundImage: 'radial-gradient(#E5E5E5 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }}></div>

        {/* Animate floor transitions */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFloorId}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {/* Mesas */}
            <div className="absolute inset-0 z-10">
              {activeFloor.tables.map(table => (
                <Table key={table.id} table={table} />
              ))}
            </div>
            
            {/* Visual zones based on area name (Optional decorative elements) */}
            {activeFloor.tables.some(t => t.area === 'Balcón') && (
              <div className="absolute bottom-4 left-8 right-8 h-32 bg-blue-50/40 border-2 border-blue-100/50 rounded-xl pointer-events-none z-0 flex items-end justify-center pb-2 text-blue-300 font-serif text-sm">
                Zona de Balcón
              </div>
            )}
            
            {/* Floor Label */}
            <div className="absolute top-4 right-4 text-gray-400 font-serif uppercase tracking-widest text-xs pointer-events-none z-0 bg-white/80 px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
              {activeFloor.name}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
