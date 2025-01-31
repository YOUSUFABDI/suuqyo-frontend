import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  email: string | null;
  role: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  email: null,
  role: typeof window !== 'undefined' ? localStorage.getItem('role') : null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; email: string; role: string }>
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.loading = false;

      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.role = null;
      state.loading = false;

      localStorage.removeItem('auth_token');
      localStorage.removeItem('role');
    },
  },
});

export const { setCredentials, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
