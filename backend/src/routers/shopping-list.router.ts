import { Router } from "express";
import { auth } from "../../middlewares/auth.mid";
import * as shoppingListController from '../controllers/shopping-list.controller';
const router = Router();
router.post('/:userId/new', auth, shoppingListController.createShoppingList);
router.put('/:userId/shopping-list/:shoppingListId', auth, shoppingListController.updateShoppingListData);
router.delete('/:userId/shopping-list/:shoppingListId', auth, shoppingListController.deleteShoppingList);
router.put('/:userId/shopping-lists', auth, shoppingListController.updateCheckboxStatus);
export default router;