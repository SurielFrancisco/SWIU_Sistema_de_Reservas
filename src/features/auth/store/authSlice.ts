import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  token: string;
  userId: string;
  userName: string;
  email: string;
  role: 'customer' | 'admin' | 'receptionist' | 'waiter';
  restaurantId: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: '',
  userId: '',
  userName: '',
  email: '',
  role: 'customer',
  restaurantId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ token?: string; userId?: string; email: string; role?: AuthState['role']; userName?: string; restaurantId?: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token ?? '';
      state.userId = action.payload.userId ?? '';
      state.email = action.payload.email;
      state.userName = action.payload.userName || action.payload.email.split('@')[0] || 'Cliente';
      state.role = action.payload.role || 'customer';
      state.restaurantId = action.payload.restaurantId || null;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.token = '';
      state.userId = '';
      state.userName = '';
      state.email = '';
      state.role = 'customer';
      state.restaurantId = null;
    },
    hydrateAuth: (_state, action: PayloadAction<AuthState>) => ({ ...initialState, ...action.payload }),
  },
});

export const { signIn, signOut, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
