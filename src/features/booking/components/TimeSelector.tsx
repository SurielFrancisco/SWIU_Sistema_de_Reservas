import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { motion } from 'framer-motion';

const TIMES = [
  { time: '1:30 PM', area: '' },
  { time: '2:00 PM', area: '' },
  { time: '2:30 PM', area: 'Terraza' },
  { time: '6:30 PM', area: '' },
  { time: '7:00 PM', area: 'Salón Principal' },
  { time: '8:00 PM', area: '' },
  { time: '8:30 PM', area: 'Bar' },
];

export default function TimeSelector() {
  const dispatch = useDispatch();
  const selectedTime = useSelector((state: RootState) => state.booking.time);
  const selectedDate = useSelector((state: RootState) => state.booking.date);

  const handleTimeSelect = (time: string, area: string) => {
    dispatch({ type: 'booking/setDateTime', payload: { date: selectedDate, time } });
    if (area) {
      dispatch({ type: 'booking/setArea', payload: area });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 mb-4 flex overflow-x-auto hide-scrollbar relative">
      {TIMES.map((t, idx) => {
        const isSelected = selectedTime === t.time;
        return (
          <button
            key={idx}
            onClick={() => handleTimeSelect(t.time, t.area)}
            className="min-w-[110px] relative flex-shrink-0 flex flex-col items-center justify-center py-3 px-4 rounded-xl mx-1 outline-none transition-colors"
          >
            {isSelected && (
              <motion.div
                layoutId="activeTimeBubble"
                className="absolute inset-0 bg-brand-primary rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className={`relative z-10 font-heading font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-700 group-hover:text-brand-primary'}`}>
              {t.time}
            </span>
            {t.area && (
              <span className={`relative z-10 text-[10px] font-semibold uppercase tracking-wider mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                {t.area}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
