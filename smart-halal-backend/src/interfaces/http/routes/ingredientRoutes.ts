import { Router } from 'express';
import { IngredientController } from '../controllers/IngredientController';
import { requireAdminKey } from '../middleware/adminAuth';

const router = Router();

// Public routes
router.get('/', IngredientController.search);
router.get('/stats', IngredientController.getStats);
router.get('/:id', IngredientController.getById);

// Admin only — requires X-Admin-Key header
router.post('/', requireAdminKey, IngredientController.create);
router.delete('/:id', requireAdminKey, IngredientController.deleteById);

export default router;
