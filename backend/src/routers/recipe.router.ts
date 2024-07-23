import { Router } from 'express';
import { auth } from '../../middlewares/auth.mid';
import * as recipeController from '../controllers/recipe.controller';
const router = Router();
router.get('/', recipeController.getAllRecipes);
router.get('/search/:searchTerm', recipeController.searchRecipes);
router.get('/:id', recipeController.getRcipeById);
router.post('/:userId/recipe/new', auth, recipeController.createRecipe);
router.delete('/:id/recipes/:recipeId', auth, recipeController.deleteRecipe);
router.put('/:userId/recipes/:recipeId', auth, recipeController.updateRecipe);
router.patch('/:recipeId/favourites', auth, recipeController.updateFavourites);

export default router;
