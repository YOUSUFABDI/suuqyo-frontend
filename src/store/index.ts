import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { authApi } from './auth/auth';

import { shopOwnerApi } from './admin/shop-owner';
import { subscriptionApi } from './admin/subscription';
import { reportApi } from './admin/report';
import { analyticApi } from './admin/analytic';
import { userApi } from './user/user';
import { manageUserAsAdminApi } from './admin/user';
import { variantApi } from './admin/variant';
import { categoryApi } from './admin/category';

import { productApi } from './shop-owner/product';
import { shopApi } from './shop-owner/shop';
import { OrderApi } from './shop-owner/order';
import { deliveryUserApi } from './shop-owner/delivery-user';
import { shopOwnerAnalyticApi } from './shop-owner/shop-owner-analytics';
import { shopSubscriptionApi } from './shop-owner/subscription';

import { deliveryUserApi as deliveryUserManagementApi } from './delivery-user/delivery-user';
import { deliveryUserAnalyticApi } from './delivery-user/delivery-user-analytic';

import { shopsManagementApi } from './customer/shop';
import { orderApi } from './customer/order';
import { customerProductApi } from './customer/product';
import { customerReviewApi } from './customer/review';

import { contactApi } from './public/public';

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
    [manageUserAsAdminApi.reducerPath]: manageUserAsAdminApi.reducer,
    [variantApi.reducerPath]: variantApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    // admin

    // shop-owner
    [productApi.reducerPath]: productApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [OrderApi.reducerPath]: OrderApi.reducer,
    [deliveryUserApi.reducerPath]: deliveryUserApi.reducer,
    [shopOwnerAnalyticApi.reducerPath]: shopOwnerAnalyticApi.reducer,
    [shopSubscriptionApi.reducerPath]: shopSubscriptionApi.reducer,
    // shop-owner

    // delivery-user
    [deliveryUserManagementApi.reducerPath]: deliveryUserManagementApi.reducer,
    [deliveryUserAnalyticApi.reducerPath]: deliveryUserAnalyticApi.reducer,
    // delivery-user

    // customer
    [shopsManagementApi.reducerPath]: shopsManagementApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [customerProductApi.reducerPath]: customerProductApi.reducer,
    [customerReviewApi.reducerPath]: customerReviewApi.reducer,
    // customer

    // public
    [contactApi.reducerPath]: contactApi.reducer,
    // public
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
      manageUserAsAdminApi.middleware,
      variantApi.middleware,
      categoryApi.middleware,
      // admin

      // shop-owner
      productApi.middleware,
      shopApi.middleware,
      OrderApi.middleware,
      deliveryUserApi.middleware,
      shopOwnerAnalyticApi.middleware,
      shopSubscriptionApi.middleware,
      // shop-owner

      // delivery-user
      deliveryUserManagementApi.middleware,
      deliveryUserAnalyticApi.middleware,
      // delivery-user

      // customer
      shopsManagementApi.middleware,
      orderApi.middleware,
      customerProductApi.middleware,
      customerReviewApi.middleware,
      // customer

      // public
      contactApi.middleware
      // public
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
