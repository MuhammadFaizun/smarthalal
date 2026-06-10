export interface Ingredient {
  id: string;
  eNumber?: string | null;
  name: string;
  status: 'HALAL' | 'HARAM' | 'SYUBHAT';
  description?: string | null;
  source?: string | null;
  categoryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
