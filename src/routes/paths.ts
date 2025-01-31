// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  SHOP_OWNER: '/shop-owner',
  DELIVERY_USER: '/delivery-user',
  CUSTOMER: '/customer',
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
    },
    report: {
      root: `${ROOTS.DASHBOARD}/report`,
    },
  },

  // SHOP OWNER DASHBOARD
  shopOwner: {
    root: ROOTS.SHOP_OWNER,
  },

  // DELIVERY USER DASHBOARD
  deliveryUser: {
    root: ROOTS.DELIVERY_USER,
  },

  // CUSTOMER
  customer: {
    root: ROOTS.CUSTOMER,
  },
};
