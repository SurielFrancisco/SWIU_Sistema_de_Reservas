import type { TableInfo } from '../types';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { selectTable } from '@/features/reservations/store/reservationsSlice';
import { isTableReserved } from '@/features/reservations/selectors';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TableProps {
  table: TableInfo;
  restaurantId: string;
  floorId: string;
  tableScale?: number;
}

export default function Table({ table, restaurantId, floorId, tableScale = 1 }: TableProps) {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.reservations.draft);
  const reservations = useAppSelector((state) => state.reservations.reservations);
  const selectedTableId = draft.selectedTableId;
  const isSelected = selectedTableId === table.id;
  const canSelectTable = !['automatic-free', 'automatic-fixed-fee', 'per-person-fee', 'zone-free'].includes(draft.reservationMethod ?? 'table-free');
  const hasCapacity = table.capacity >= draft.guests;
  
  const effectiveStatus = isTableReserved(reservations, {
    restaurantId,
    floorId,
    tableId: table.id,
    date: draft.date,
    time: draft.time,
    durationMinutes: draft.durationMinutes,
  }) ? 'occupied' : table.status;

  const handleSelect = () => {
    if (effectiveStatus === 'available' && canSelectTable && hasCapacity) {
      dispatch(selectTable(isSelected ? null : table.id));
    }
  };

  // Dimensions adaptativas pero compactas que respetan la cuadrícula de distribución porcentual
  const shapeClasses = {
    'square-2': 'w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl',
    'square-4': 'w-13 h-13 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl',
    'round-4': 'w-13 h-13 sm:w-16 sm:h-16 rounded-full',
    'rect-6': 'w-16 h-12 sm:w-22 sm:h-16 rounded-lg sm:rounded-xl',
    'rect-8': 'w-18 h-12 sm:w-26 sm:h-16 rounded-lg sm:rounded-xl',
    'large-group': 'w-20 h-14 sm:w-28 sm:h-18 rounded-xl sm:rounded-2xl',
  }[table.shape];

  let statusClasses = '';
  if (isSelected) {
    statusClasses = 'bg-brand-primary border-brand-primary text-white shadow-lg z-20 scale-105';
  } else {
    switch (effectiveStatus) {
      case 'available':
        statusClasses = 'bg-white border-border text-brand-primary hover:border-brand-primary/50 hover:shadow-md cursor-pointer shadow-xs';
        break;
      case 'occupied':
        statusClasses = 'bg-brand-secondary border-border text-gray-400 cursor-not-allowed opacity-80';
        break;
      case 'reserved':
        statusClasses = 'bg-blue-50 border-blue-200 text-blue-800 cursor-not-allowed';
        break;
      default:
        statusClasses = 'bg-red-50 border-red-200 text-red-500 cursor-not-allowed';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: table.position.x * 0.0015 + table.position.y * 0.0015 }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${table.position.x}%`,
        top: `${table.position.y}%`,
        scale: tableScale,
      }}
    >
      <button
        type="button"
        disabled={effectiveStatus !== 'available' || !canSelectTable || !hasCapacity}
        onClick={handleSelect}
        className={cn(
          'flex flex-col items-center justify-center border transition-all duration-150 relative outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40',
          shapeClasses,
          statusClasses
        )}
      >
        <span className="text-xs sm:text-base font-serif font-medium leading-none truncate max-w-[90%]">
          {table.label.replace(/^[A-Z]-/, '')}
        </span>
        <span className="text-[9px] sm:text-[11px] mt-0.5 flex items-center gap-0.5 opacity-75 font-sans leading-none">
          <Users aria-hidden="true" className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {table.capacity}
        </span>
        
        {/* Sillas decorativas sutiles */}
        <div className={`absolute -top-1 sm:-top-1.5 w-4 sm:w-6 h-1 sm:h-1.5 rounded-t-full ${isSelected ? 'bg-white/40' : 'bg-black/10'}`} />
        <div className={`absolute -bottom-1 sm:-bottom-1.5 w-4 sm:w-6 h-1 sm:h-1.5 rounded-b-full ${isSelected ? 'bg-white/40' : 'bg-black/10'}`} />
        {(table.capacity > 2 && table.shape !== 'square-2') && (
          <>
            <div className={`absolute -left-1 sm:-left-1.5 top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-4 sm:h-6 rounded-l-full ${isSelected ? 'bg-white/40' : 'bg-black/10'}`} />
            <div className={`absolute -right-1 sm:-right-1.5 top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-4 sm:h-6 rounded-r-full ${isSelected ? 'bg-white/40' : 'bg-black/10'}`} />
          </>
        )}
      </button>
    </motion.div>
  );
}
