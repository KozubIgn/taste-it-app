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
        const ingredientIds: mongoose.Types.ObjectId[] = [];
        newShoppingListdata.ingredients?.map(async (ingredient: Ingredient) => {
            const newIngredient = new IngredientModel({
                name: ingredient.name,
                amount: ingredient.amount
            })
            await newIngredient.save();
            ingredientIds.push(newIngredient._id);
        })
        const userDoc = await UserModel.findOne({ _id: userId });
        if (!userDoc) {
            return res.status(404).send('User not found');
        }
        const newDataWithReference = new ShoppingListModel({
            ...newShoppingListdata,
            ingredients: ingredientIds
        })
        await newDataWithReference.save();
        userDoc.shopping_lists.push(newDataWithReference);
        await userDoc.save();
        await newDataWithReference.populate<{ ingredients: mongoose.Types.ObjectId[] }>({ path: 'ingredients', model: 'ingredient' })
        console.log('RESPONSE', res);
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
        res.status(500).send({ message: "Internal Server Error", error});
    }
}));

export default router;