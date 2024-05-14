import { Schema, Types, model } from 'mongoose';
import { Recipe } from './recipe.model';
import { ShoppingList } from './shopping-list.model';

export interface User {
    id: string | Types.ObjectId;
    email: string;
    password: string;
    favourite_recipes: Recipe[];
    created_recipes: Recipe[];
    shopping_lists: ShoppingList[];
    custom_objects?: Object[];
    settings?: Object[];
}

export const UserSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favourite_recipes: [{type: Schema.ObjectId, ref: 'recipe' }],
    created_recipes: [{ type: Schema.ObjectId, ref: 'recipe' }],
    shopping_lists: [{type:Schema.ObjectId, ref: 'shoppingList'}],
    custom_objects:[]
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

export const UserModel = model<User>('user', UserSchema);