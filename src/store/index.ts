import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { authApi } from './auth/authApi';
import { shopOwnerApi } from './admin/shop-owner';
import { reportApi } from './admin/report';
import { analyticApi } from './admin/analytic';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [shopOwnerApi.reducerPath]: shopOwnerApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [analyticApi.reducerPath]: analyticApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      shopOwnerApi.middleware,
      reportApi.middleware,
      analyticApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
