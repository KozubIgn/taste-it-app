import { Schema, model } from "mongoose";

export interface Ingredient {
    name: string;
    amount: number;
    checked?: boolean;
    expandable?: boolean;
    level?: number;
}

export const IngredientSchema = new Schema<Ingredient>(
    {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        checked: { type: Boolean },
        expandable: { type: Boolean, required: false },
        level: { type: Number, required: false }
    }
)

export const IngredientModel = model('ingredient', IngredientSchema)
