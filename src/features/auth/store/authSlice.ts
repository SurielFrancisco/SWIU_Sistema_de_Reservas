import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  userName: string;
  email: string;
  role: 'customer' | 'admin' | 'receptionist';
}

const initialState: AuthState = {
  isAuthenticated: false,
  userName: '',
  email: '',
  role: 'customer',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ email: string; role?: AuthState['role'] }>) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.userName = action.payload.email.split('@')[0] || 'Cliente';
      state.role = action.payload.role || 'customer';
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.userName = '';
      state.email = '';
      state.role = 'customer';
    },
    hydrateAuth: (_state, action: PayloadAction<AuthState>) => ({ ...initialState, ...action.payload }),
  },
});

export const { signIn, signOut, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
