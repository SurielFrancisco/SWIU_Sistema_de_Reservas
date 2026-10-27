import { configureStore } from '@reduxjs/toolkit';
import authReducer, { hydrateAuth, type AuthState } from '@/features/auth/store/authSlice';
import reservationsReducer, {
  hydrateReservations,
  type ReservationDetails,
} from '@/features/reservations/store/reservationsSlice';
import adminReducer, { hydrateAdmin, type AdminState } from '@/features/admin/store/adminSlice';

const PERSISTENCE_KEY = 'sdreservas-state';

interface PersistedState {
  auth?: AuthState;
  reservations?: ReservationDetails[];
  admin?: AdminState;
}

const loadPersistedState = (): PersistedState | null => {
  try {
    const value = window.localStorage.getItem(PERSISTENCE_KEY);
    return value ? (JSON.parse(value) as PersistedState) : null;
  } catch {
    return null;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reservations: reservationsReducer,
    admin: adminReducer,
  },
});

const persistedState = loadPersistedState();
if (persistedState?.auth) {
  store.dispatch(hydrateAuth(persistedState.auth));
}
if (persistedState?.reservations) {
  store.dispatch(hydrateReservations(persistedState.reservations));
}
if (persistedState?.admin) {
  store.dispatch(hydrateAdmin(persistedState.admin));
}

store.subscribe(() => {
  const state = store.getState();
  window.localStorage.setItem(
    PERSISTENCE_KEY,
    JSON.stringify({ auth: state.auth, reservations: state.reservations.reservations, admin: state.admin }),
  );
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
