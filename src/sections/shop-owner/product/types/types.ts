interface Image {
  id: number;
  productId: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResDT {
  id: string;
  userId: number;
  categoryId: number;
  name: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  discount: number;
  rate: number | null;
  quantity: number;
  model: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  category: Category;
}
