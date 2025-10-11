export type ISizesTableFilters = {
  name: string;
  role: string[];
  status: 'All' | 'Active' | 'Inactive'; // Change to string union type
  phoneNumber: string;
};

export interface SizeDT {
  id: string;
  name: string;
  createdBy: string;
  updatedBy: string;
}

export interface SizesDataDT {
  sizes: SizeDT[];
}

export type SizeReqDT = {
  name: string;
};

export type DeleteManySizesReqDT = {
  ids?: number[];
  names?: string[];
};
