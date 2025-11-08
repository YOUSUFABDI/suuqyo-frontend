export type IProductCategoryTableFilters = {
  name: string;
  role: string[];
  status: 'All' | 'Active' | 'Inactive'; // Change to string union type
  phoneNumber: string;
};

export interface ProductCategoryDT {
  id: string;
  name: string;
  createdBy: string;
  updatedBy: string;
}

export interface ProductCategoryDataDT {
  sizes: ProductCategoryDT[];
}

export type ProductCategoryReqDT = {
  name: string;
};

export type DeleteManyProductCategoryReqDT = {
  ids?: number[];
  names?: string[];
};
