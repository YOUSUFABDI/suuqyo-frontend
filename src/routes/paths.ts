// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  STAFF: '/staff',
  SHOP_OWNER: '/shop-owner',
  DELIVERY_USER: '/delivery-user',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  faqs: '/about-us',
  forbidden: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`,
      signUp: `${ROOTS.AUTH}/sign-up`,
      resetPassword: `${ROOTS.AUTH}/reset-password`,
      updatePassword: `${ROOTS.AUTH}/update-password`,
      verify: `${ROOTS.AUTH}/verify`,
    },
  },
  // ADMIN DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    shopOwner: {
      root: `${ROOTS.DASHBOARD}/shop-owner`,
      new: `${ROOTS.DASHBOARD}/shop-owner/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/shop-owner/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/shop-owner/${id}/edit`,
    },
    subscription: {
      root: `${ROOTS.DASHBOARD}/subscription`,
      new: `${ROOTS.DASHBOARD}/subscription/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/subscription/${id}/edit`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/user/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
    orderStatus: {
      root: `${ROOTS.DASHBOARD}/order-status`,
      details: (id: string) => `${ROOTS.SHOP_OWNER}/order-status/${id}`,
    },
    variant: {
      // size
      root: `${ROOTS.DASHBOARD}/variant/size`,
      // size
      // color
      color: `${ROOTS.DASHBOARD}/variant/color`,
      // color
    },
    category: {
      // product category
      // productCategory: `${ROOTS.DASHBOARD}/category/product-category`,
      root: `${ROOTS.DASHBOARD}/category/product-category`,
      // product category

      // product category
      shopCategory: `${ROOTS.DASHBOARD}/category/shop-category`,
      // product category
    },
    notification: {
      root: `${ROOTS.DASHBOARD}/notification`,
    },
    report: {
      root: `${ROOTS.DASHBOARD}/report`,
      subscriptionRenewal: `${ROOTS.DASHBOARD}/report/subs-renewal`,
    },
    account: {
      root: `${ROOTS.DASHBOARD}/account-setting`,
      changePassword: `${ROOTS.DASHBOARD}/account-setting/change-password`,
    },
  },
  // STAFF DASHBOARD
  staff: {
    root: ROOTS.STAFF,
    shopOwner: {
      root: `${ROOTS.STAFF}/shop-owner`,
      new: `${ROOTS.STAFF}/shop-owner/new`,
      details: (id: string) => `${ROOTS.STAFF}/shop-owner/${id}`,
      edit: (id: string) => `${ROOTS.STAFF}/shop-owner/${id}/edit`,
    },
    subscription: {
      root: `${ROOTS.STAFF}/subscription`,
      new: `${ROOTS.STAFF}/subscription/new`,
      edit: (id: string) => `${ROOTS.STAFF}/subscription/${id}/edit`,
    },
    account: {
      root: `${ROOTS.STAFF}/account-setting`,
      changePassword: `${ROOTS.STAFF}/account-setting/change-password`,
    },
  },

  // SHOP OWNER DASHBOARD
  shopOwner: {
    root: ROOTS.SHOP_OWNER,
    deliveryUser: {
      root: `${ROOTS.SHOP_OWNER}/delivery-user`,
      new: `${ROOTS.SHOP_OWNER}/delivery-user/new`,
      details: (id: string) => `${ROOTS.SHOP_OWNER}/delivery-user/${id}`,
      edit: (id: string) => `${ROOTS.SHOP_OWNER}/delivery-user/${id}/edit`,
    },
    product: {
      root: `${ROOTS.SHOP_OWNER}/product`,
      trash: `${ROOTS.SHOP_OWNER}/product/trash`,
      new: `${ROOTS.SHOP_OWNER}/product/new`,
      edit: (id: string) => `${ROOTS.SHOP_OWNER}/product/${id}/edit`,
    },
    order: {
      root: `${ROOTS.SHOP_OWNER}/order`,
      details: (id: string) => `${ROOTS.SHOP_OWNER}/order/${id}`,
    },
    account: {
      root: `${ROOTS.SHOP_OWNER}/account-setting`,
      shop: `${ROOTS.SHOP_OWNER}/account-setting/my-shop`,
      changePassword: `${ROOTS.SHOP_OWNER}/account-setting/change-password`,
    },
  },

  // DELIVERY USER DASHBOARD
  deliveryUser: {
    root: ROOTS.DELIVERY_USER,
    assignedDeliveries: {
      root: `${ROOTS.DELIVERY_USER}/assigned-delivery`,
      details: (id: string) => `${ROOTS.DELIVERY_USER}/assigned-delivery/${id}`,
    },
    account: {
      root: `${ROOTS.DELIVERY_USER}/account-setting`,
      changePassword: `${ROOTS.DELIVERY_USER}/account-setting/change-password`,
    },
  },

  // CUSTOMER
  customer: {
    root: '/',
    account: {
      root: `/account-setting`,
      changePassword: `/account-setting/change-password`,
      orderHistory: `/account-setting/order-history`,
    },
    shop: {
      root: '/shop',
      details: (name: string) => `/shop/${name}`,
    },
    product: {
      root: `/product`,
      checkout: `/product/checkout`,
      details: (id: string) => `/product/${id}`,
    },
    contact: '/contact-us',
    about: '/about-us',
    pricing: '/pricing',
    privacy: '/privacy',
  },
};
