import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReservationState, ReservationDetails } from '../types';

const getToday = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

const initialState: ReservationState = {
  selectedTableId: null,
  date: getToday(),
  time: '19:00',
  guests: 2,
  area: 'Salón Principal',
  preferences: '',
  reservations: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    selectTable: (state, action: PayloadAction<string | null>) => {
      state.selectedTableId = action.payload;
    },
    setDateTime: (state, action: PayloadAction<{ date: string; time: string }>) => {
      state.date = action.payload.date;
      state.time = action.payload.time;
    },
    setGuests: (state, action: PayloadAction<number>) => {
      state.guests = action.payload;
    },
    setArea: (state, action: PayloadAction<string>) => {
      state.area = action.payload;
    },
    setPreferences: (state, action: PayloadAction<string>) => {
      state.preferences = action.payload;
    },
    addReservation: (state, action: PayloadAction<ReservationDetails>) => {
      state.reservations.push(action.payload);
    },
    cancelReservation: (state, action: PayloadAction<string>) => {
      const reservation = state.reservations.find(r => r.id === action.payload);
      if (reservation) {
        reservation.status = 'cancelled';
      }
    },
  },
});

export const { selectTable, setDateTime, setGuests, setArea, setPreferences, addReservation, cancelReservation } = bookingSlice.actions;
export default bookingSlice.reducer;
