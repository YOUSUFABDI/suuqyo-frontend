export type IShopCategoryTableFilters = {
  name: string;
  role: string[];
  status: 'All' | 'Active' | 'Inactive';
  phoneNumber: string;
};

export interface ShopCategoryDT {
  id: string; // Keep as string for frontend consistency (converted from number)
  name: string;
  createdAt: string; // Required to match backend
  updatedAt: string; // Required to match backend
}

export interface ShopCategoryDataDT {
  sizes: ShopCategoryDT[];
}

export type ShopCategoryReqDT = {
  name: string;
};

export type DeleteManyShopCategoriesReqDT = {
  ids?: number[];
  names?: string[];
};
