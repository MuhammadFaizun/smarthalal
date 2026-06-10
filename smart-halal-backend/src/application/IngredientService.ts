import { IngredientRepository } from '../infrastructure/repositories/IngredientRepository';
import { Ingredient } from '../domain/Ingredient';

export class IngredientService {
  private repository: IngredientRepository;

  constructor() {
    this.repository = new IngredientRepository();
  }

  async searchIngredients(query?: string): Promise<Ingredient[]> {
    return this.repository.findAll(query);
  }

  async getIngredientById(id: string): Promise<Ingredient | null> {
    return this.repository.findById(id);
  }

  async addIngredient(data: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ingredient> {
    return this.repository.create(data);
  }

  async removeIngredient(id: string): Promise<void> {
    return this.repository.deleteById(id);
  }

  async getStats() {
    return this.repository.getStats();
  }
}
