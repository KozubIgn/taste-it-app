import asyncHandler from 'express-async-handler';
import { ShoppingList, ShoppingListModel } from "../models/shopping-list.model";
import { Ingredient, IngredientModel } from '../models/ingredient.model';
import mongoose from "mongoose";
import { UserModel } from "../models/user.model";

export const createShoppingList = asyncHandler(async (req: any, res: any) => {
    const { userId } = req.params;
    const newShoppingListdata: ShoppingList = req.body;
    try {
        const ingredients: Ingredient[] = [];
        newShoppingListdata.ingredients?.map(async (ingredient: Ingredient) => {
            const newIngredient = new IngredientModel({
                name: ingredient.name,
                amount: ingredient.amount,
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
});

export const updateShoppingListData = asyncHandler(async (req: any, res: any) => {
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
});

export const deleteShoppingList = asyncHandler(async (req: any, res: any) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.userId,
            { $pull: { shopping_lists: req.params.shoppingListId } },
            { new: true })
            .populate<{ shopping_lists: ShoppingList[] }>({ path: 'shopping_lists', model: 'shoppingList' });
        res.status(200).send({ message: 'The shopping list has been removed from the list!', user: user });
    } catch (error) {
        return res.status(500).send(error)
    }
});

export const updateCheckboxStatus = asyncHandler(async (req: any, res: any) => {
    const shoppingLists: ShoppingList[] = req.body;
    try {
        const updatedShoppingLists: any = await Promise.all(
            shoppingLists.map(async (shoppingList: ShoppingList) => {
                const shoppingListDoc = await ShoppingListModel.findOne({ _id: shoppingList.id });
                if (shoppingListDoc) {
                    shoppingListDoc.ingredients?.forEach((ingredientDoc: Ingredient) => {
                        const update = shoppingList.ingredients?.find((ingredient: Ingredient) => ingredientDoc.name === ingredient.name);
                        if (update) {
                            ingredientDoc.checked = update.checked;
                        }
                    });
                    shoppingListDoc.checked = shoppingList.checked;
                    shoppingListDoc.indeterminate = shoppingList.indeterminate;
                    await shoppingListDoc.save();
                    return shoppingListDoc;
                }
            })
        )
        res.status(200).send({ updatedShoppingLists: updatedShoppingLists });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error });
    }
});
