export type IColorsTableFilters = {
  name: string;
  role: string[];
  status: 'All' | 'Active' | 'Inactive'; // Change to string union type
  phoneNumber: string;
};

export interface ColorDT {
  id: string;
  name: string;
  createdBy: string;
  updatedBy: string;
}

export interface ColorsDataDT {
  sizes: ColorDT[];
}

export type ColorReqDT = {
  name: string;
};

export type DeleteManyColorsReqDT = {
  ids?: number[];
  names?: string[];
};
