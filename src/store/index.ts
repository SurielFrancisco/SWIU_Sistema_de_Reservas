import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from '../features/booking/store/bookingSlice';
import authReducer from '../features/auth/store/authSlice';

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
