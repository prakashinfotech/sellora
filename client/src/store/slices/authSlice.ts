import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../services/auth.service';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  city?: string;
  avatar?: string;
  role?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const loginHandler: any = createAsyncThunk(
  'auth/login',
  (data: { email: string; password: string }, { rejectWithValue }) =>
    loginUser(data).catch((error) => error && rejectWithValue(error))
);

export const registerHandler: any = createAsyncThunk(
  'auth/register',
  (data: { name: string; email: string; password: string; phone?: string; city?: string }, { rejectWithValue }) =>
    registerUser(data).catch((error) => error && rejectWithValue(error))
);

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('auth_user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginHandler.fulfilled, (state, action: PayloadAction<{ access_token: string; user: AuthUser }>) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.access_token);
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginHandler.rejected, (state) => {
        state.loading = false;
        state.error = 'Login failed';
      });

    builder
      .addCase(registerHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerHandler.fulfilled, (state, action: PayloadAction<{ access_token: string; user: AuthUser }>) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.access_token);
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      })
      .addCase(registerHandler.rejected, (state) => {
        state.loading = false;
        state.error = 'Registration failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
