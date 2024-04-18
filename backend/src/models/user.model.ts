import { Schema, Types, model } from 'mongoose';
import { Recipe } from './recipe.model';

export interface User {
    id: string | Types.ObjectId;
    email: string;
    password: string;
    favourite_recipes: Recipe[];
    created_recipes: Recipe[];
    custom_objects?: Object[];
    settings?: Object[];
}

export const UserSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favourite_recipes: [{type: Schema.ObjectId, ref: 'Recipe' }],
    created_recipes: [{ type: Schema.ObjectId, ref: 'Recipe' }],
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