import { Schema, model } from "mongoose";

export interface Ingredient {
    name: string;
    amount: number;
}

export const IngredientSchema = new Schema<Ingredient>(
    {
        name: { type: String, required: true },
        amount: { type: Number, required: true }
    }
)

export const IngredientModel = model('ingredient', IngredientSchema)
