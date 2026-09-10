import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReservationState } from '../types';

const initialState: ReservationState = {
  selectedTableId: null,
  date: new Date().toISOString().split('T')[0],
  time: '19:00',
  guests: 2,
  area: 'Salón Principal',
  preferences: '',
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
  },
});

export const { selectTable, setDateTime, setGuests, setArea, setPreferences } = bookingSlice.actions;
export default bookingSlice.reducer;
