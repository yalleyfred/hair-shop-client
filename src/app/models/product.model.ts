export interface Product {
  name: string;
  price: string;
  description: string;
}

export interface ProductResponse extends Product {
  id: string;
  productUrl: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
