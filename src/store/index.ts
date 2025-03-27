import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { authApi } from './auth/auth';

import { shopOwnerApi } from './admin/shop-owner';
import { subscriptionApi } from './admin/subscription';
import { reportApi } from './admin/report';
import { analyticApi } from './admin/analytic';
import { userApi } from './user/user';

import { productApi } from './shop-owner/product';
import { shopApi } from './shop-owner/shop';
import { OrderApi } from './shop-owner/order';
import { deliveryUserApi } from './shop-owner/delivery-user';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,

    // admin
    [shopOwnerApi.reducerPath]: shopOwnerApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [analyticApi.reducerPath]: analyticApi.reducer,
    // admin

    // shop-owner
    [productApi.reducerPath]: productApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [OrderApi.reducerPath]: OrderApi.reducer,
    [deliveryUserApi.reducerPath]: deliveryUserApi.reducer,
    // shop-owner
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,

      // admin
      shopOwnerApi.middleware,
      subscriptionApi.middleware,
      reportApi.middleware,
      analyticApi.middleware,
      // admin

      // shop-owner
      productApi.middleware,
      shopApi.middleware,
      OrderApi.middleware,
      deliveryUserApi.middleware
      // shop-owner
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
