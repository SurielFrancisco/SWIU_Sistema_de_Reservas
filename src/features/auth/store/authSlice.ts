import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  userName: string;
  email: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userName: '',
  email: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.userName = action.payload.email.split('@')[0] || 'Cliente';
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.userName = '';
      state.email = '';
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
