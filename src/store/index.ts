import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { authApi } from './auth/authApi';

import { shopOwnerApi } from './admin/shop-owner';
import { subscriptionApi } from './admin/subscription';
import { reportApi } from './admin/report';
import { analyticApi } from './admin/analytic';
import { adminApi } from './admin/admin';

import { productApi } from './shop-owner/product';
import { shopApi } from './shop-owner/shopApi';
import { OrderApi } from './shop-owner/orderApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,

    // admin
    [shopOwnerApi.reducerPath]: shopOwnerApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [analyticApi.reducerPath]: analyticApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    // admin

    // shop-owner
    [productApi.reducerPath]: productApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [OrderApi.reducerPath]: OrderApi.reducer,
    // shop-owner
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,

      // admin
      shopOwnerApi.middleware,
      subscriptionApi.middleware,
      reportApi.middleware,
      analyticApi.middleware,
      adminApi.middleware,
      // admin

      // shop-owner
      productApi.middleware,
      shopApi.middleware,
      OrderApi.middleware
      // shop-owner
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
