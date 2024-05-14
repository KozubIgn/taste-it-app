import { Schema, Types, model } from "mongoose";
import { Ingredient } from "./ingredient.model";

export interface ShoppingList {
    id: string | Types.ObjectId;
    name: string;
    ingredients?: Ingredient[];
    completed?: boolean;
}

export const ShoppingListSchema = new Schema<ShoppingList>({
    name: { type: String, required: true },
    ingredients: [{ type: Schema.ObjectId, ref: 'ingredient' }],
    completed: { type: Boolean, default: false }
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
