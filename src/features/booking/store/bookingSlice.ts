import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReservationState } from '../types';

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
    addReservation: (state, action: PayloadAction<string>) => {
      if (!state.reservations.includes(action.payload)) {
        state.reservations.push(action.payload);
      }
    },
  },
});

export const { selectTable, setDateTime, setGuests, setArea, setPreferences, addReservation } = bookingSlice.actions;
export default bookingSlice.reducer;
