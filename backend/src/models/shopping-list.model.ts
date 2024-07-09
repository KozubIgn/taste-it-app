import { Schema, Types, model } from "mongoose";
import { Ingredient, IngredientSchema } from "./ingredient.model";

export interface ShoppingList {
    id: string | Types.ObjectId;
    name: string;
    expandable?: boolean;
    level?: number;
    ingredients?: Ingredient[];
    checked?: boolean;
    indeterminate?: boolean;
}

export const ShoppingListSchema = new Schema<ShoppingList>({
    name: { type: String, required: true },
    expandable: { type: Boolean, required: false },
    level: { type: Number, required: false },
    ingredients: { type: [IngredientSchema] },
    checked: { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
}
);

export const ShoppingListModel = model<ShoppingList>('shoppingList', ShoppingListSchema)
