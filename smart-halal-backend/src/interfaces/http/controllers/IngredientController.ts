import { Request, Response } from 'express';
import { IngredientService } from '../../../application/IngredientService';
import { translateIngredients, translateIngredient } from '../../../application/translator';

const ingredientService = new IngredientService();

export class IngredientController {

  static async search(req: Request, res: Response) {
    try {
      const { q, lang } = req.query;
      const ingredients = await ingredientService.searchIngredients(q as string);
      
      let data = ingredients;
      if (lang === 'en') {
        data = await translateIngredients(ingredients, 'id', 'en');
      }
      
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { lang } = req.query;
      const ingredient = await ingredientService.getIngredientById(id as string);
      if (!ingredient) {
        return res.status(404).json({ success: false, message: 'Ingredient not found' });
      }
      
      let data = ingredient;
      if (lang === 'en') {
        data = await translateIngredient(ingredient, 'id', 'en');
      }
      
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const newIngredient = await ingredientService.addIngredient(data);
      res.status(201).json({ success: true, data: newIngredient });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ingredientService.removeIngredient(id as string);
      res.status(200).json({ success: true, message: 'Bahan berhasil dihapus.' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const stats = await ingredientService.getStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
