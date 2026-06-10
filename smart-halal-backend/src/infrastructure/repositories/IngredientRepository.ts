import { prisma } from '../database/prismaClient';
import { Ingredient } from '../../domain/Ingredient';

export class IngredientRepository {
  async findAll(query?: string): Promise<Ingredient[]> {
    if (query) {
      return prisma.ingredient.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { eNumber: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { category: true }
      }) as unknown as Ingredient[];
    }
    return prisma.ingredient.findMany({ include: { category: true } }) as unknown as Ingredient[];
  }

  async findById(id: string): Promise<Ingredient | null> {
    return prisma.ingredient.findUnique({
      where: { id },
      include: { category: true }
    }) as unknown as Ingredient | null;
  }

  async create(data: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ingredient> {
    return prisma.ingredient.create({
      data
    }) as unknown as Ingredient;
  }

  async deleteById(id: string): Promise<void> {
    await prisma.ingredient.delete({ where: { id } });
  }

  async getStats(): Promise<{ total: number; halal: number; syubhat: number; haram: number }> {
    const [total, halal, syubhat, haram] = await Promise.all([
      prisma.ingredient.count(),
      prisma.ingredient.count({ where: { status: 'HALAL' } }),
      prisma.ingredient.count({ where: { status: 'SYUBHAT' } }),
      prisma.ingredient.count({ where: { status: 'HARAM' } }),
    ]);
    return { total, halal, syubhat, haram };
  }
}
