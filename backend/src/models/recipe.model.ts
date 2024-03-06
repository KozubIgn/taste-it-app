import { Schema, Types, model } from 'mongoose';
import { Ingredient, IngredientSchema } from './ingredient.model'
import { Tag, TagSchema } from './tag.model';

export interface Recipe {
    id: string;
    name: string;
    description: string;
    note: string;
    tags: Tag[];
    imagePath: ImageUrl[];
    ingredients: Ingredient[];
    instruction: string;
    vield: number;
    vieldType: string;
    prepTime: number;
    cookTime: number;
    favourites: boolean;
    created_by: Types.ObjectId;
}

export interface ImageUrl {
    url: string;
}

export const ImageUrlSchema = new Schema<ImageUrl>(
    { url: { type: String, required: true } }
)

export const RecipeSchema = new Schema<Recipe>({
        name: { type: String, required: true },
        description: { type: String},
        note: { type: String },
        tags: { type: [TagSchema] },
        imagePath: { type: [ImageUrlSchema] },
        ingredients: { type: [IngredientSchema] },
        instruction: { type: String },
        vield: { type: Number, default: 0 },
        vieldType: { type: String },
        prepTime: { type: Number, default: 0 },
        cookTime: { type: Number, default: 0 },
    favourites: { type: Boolean, default: false },
        created_by:{type: Schema.Types.ObjectId, ref:'User', required: true}
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

export const RecipeModel = model<Recipe>('recipe', RecipeSchema);