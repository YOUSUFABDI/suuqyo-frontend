import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { authApi } from './auth/authApi';
import { shopOwnerApi } from './admin/shop-owner';
import { reportApi } from './admin/report';
import { analyticApi } from './admin/analytic';
import { productApi } from './shop-owner/product';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [shopOwnerApi.reducerPath]: shopOwnerApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [analyticApi.reducerPath]: analyticApi.reducer,

    // shop-owner
    [productApi.reducerPath]: productApi.reducer,
    // shop-owner
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,

      // admin
      shopOwnerApi.middleware,
      reportApi.middleware,
      analyticApi.middleware,
      // admin

      // shop-owner
      productApi.middleware
      // shop-owner
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
