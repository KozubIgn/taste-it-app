import { Router } from "express";
import asyncHandler from 'express-async-handler';
import { auth } from "../../middlewares/auth.mid";
import { ShoppingList, ShoppingListModel } from "../models/shopping-list.model";
import { Ingredient, IngredientModel } from "../models/ingredient.model";
import mongoose from "mongoose";
import { UserModel } from "../models/user.model";
const router = Router();

router.post('/:userId/new', auth, asyncHandler(async (req: any, res: any) => {
    const { userId } = req.params;
    const newShoppingListdata: ShoppingList = req.body;

    try {
        const ingredients: Ingredient[] = [];
        newShoppingListdata.ingredients?.map(async (ingredient: Ingredient) => {
            const newIngredient = new IngredientModel({
                name: ingredient.name,
                amount: ingredient.amount
            })
            ingredients.push(newIngredient);
        });
        const userDoc = await UserModel.findOne({ _id: userId });
        if (!userDoc) {
            return res.status(404).send('User not found');
        }
        const newDataWithReference = new ShoppingListModel({
            ...newShoppingListdata,
            ingredients: ingredients
        })
        await newDataWithReference.save();
        userDoc.shopping_lists.push(newDataWithReference);
        await userDoc.save();
        await newDataWithReference.populate<{ ingredients: mongoose.Types.ObjectId[] }>({ path: 'ingredients', model: 'ingredient' })
 
        res.status(201).send({ message: "Shopping list created successfully!", shoppingList: newDataWithReference });
    } catch (error) {
        res.status(500).send(error);
    }
}))

router.put('/:userId/shopping-list/:shoppingListId', auth, asyncHandler(async (req: any, res: any) => {
    const shoppingListId = new mongoose.Types.ObjectId(req.params.shoppingListId);
    const shoppingListData: ShoppingList = req.body.value;
    try {
        const updatedShoppingList = await ShoppingListModel.findByIdAndUpdate(
            { _id: shoppingListId },
            shoppingListData,
            { new: true }
        );
        res.status(200).send({ message: "Shopping list updated successfully", shoppingList: updatedShoppingList });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error });
    }
}));

router.delete('/:userId/shopping-list/:shoppingListId', auth, asyncHandler(async (req: any, res: any) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.userId,
            { $pull: { shopping_lists: req.params.shoppingListId } },
            { new: true })
            .populate<{ shopping_lists: ShoppingList[] }>({ path: 'shopping_lists', model: 'shoppingList' });
        res.status(200).send({ message: 'The shopping list has been removed from the list!', user: user });
    } catch (error) {
        return res.status(500).send(error)
    }
}));

export default router;