export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceCategoryPayload {
  name: string;
  description?: string;
}

export interface ServicePayload {
  name: string;
  description: string;
  price: number;
  durationMinutes?: number;
  categoryId: string;
}

export interface SalonService extends ServicePayload {
  id: string;
  category?: ServiceCategory;
  createdAt?: string;
  updatedAt?: string;
}
