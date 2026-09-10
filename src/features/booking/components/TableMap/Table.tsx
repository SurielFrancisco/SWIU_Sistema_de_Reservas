import { TableInfo } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TableProps {
  table: TableInfo;
}

export default function Table({ table }: TableProps) {
  const dispatch = useDispatch();
  const selectedTableId = useSelector((state: RootState) => state.booking.selectedTableId);
  const isSelected = selectedTableId === table.id;

  const handleSelect = () => {
    if (table.status === 'available') {
      dispatch({ type: 'booking/selectTable', payload: isSelected ? null : table.id });
    }
  };

  const shapeClasses = {
    'square-2': 'w-16 h-16 rounded-xl',
    'square-4': 'w-20 h-20 rounded-xl',
    'round-4': 'w-20 h-20 rounded-full',
    'rect-6': 'w-28 h-20 rounded-xl',
    'rect-8': 'w-32 h-20 rounded-xl',
    'large-group': 'w-36 h-24 rounded-2xl',
  }[table.shape];

  let statusClasses = '';
  if (isSelected) {
    statusClasses = 'bg-brand-primary border-brand-primary text-white shadow-lg z-10 scale-110';
  } else {
    switch (table.status) {
      case 'available':
        statusClasses = 'bg-white border-border text-brand-primary hover:border-brand-primary/50 hover:shadow-md cursor-pointer shadow-sm';
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
      transition={{ duration: 0.3, delay: table.position.x * 0.002 + table.position.y * 0.002 }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${table.position.x}%`, top: `${table.position.y}%` }}
    >
      <button
        type="button"
        disabled={table.status !== 'available'}
        onClick={handleSelect}
        className={cn(
          'flex flex-col items-center justify-center border-2 transition-all duration-200 relative outline-none focus:ring-2 focus:ring-brand-primary/30',
          shapeClasses,
          statusClasses
        )}
      >
        <span className="text-xl md:text-2xl font-serif font-medium">
          {table.label.replace(/^[A-Z]-/, '')}
        </span>
        <span className="text-[10px] md:text-xs mt-0.5 flex items-center gap-1 opacity-70 font-sans">
          <Users className="w-3 h-3" /> {table.capacity}
        </span>
        
        {/* Chair Indicators */}
        <div className={`absolute -top-2 w-8 h-2 rounded-t-full ${isSelected ? 'bg-white/30' : 'bg-black/5'}`} />
        <div className={`absolute -bottom-2 w-8 h-2 rounded-b-full ${isSelected ? 'bg-white/30' : 'bg-black/5'}`} />
        {(table.capacity > 2 && table.shape !== 'square-2') && (
          <>
            <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-8 rounded-l-full ${isSelected ? 'bg-white/30' : 'bg-black/5'}`} />
            <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-8 rounded-r-full ${isSelected ? 'bg-white/30' : 'bg-black/5'}`} />
          </>
        )}
      </button>
    </motion.div>
  );
}
