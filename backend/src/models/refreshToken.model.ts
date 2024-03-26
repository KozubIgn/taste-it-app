import { Schema, model } from "mongoose";
import { User } from "./user.model";

export interface RefreshToken {
    token: string;
    user: User;
    expiryDate: Date;
}

export const RefreshTokenSchema = new Schema<RefreshToken>({
    token: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    expiryDate: Date,
});

export const RefreshTokenModel = model<RefreshToken>('refreshToken', RefreshTokenSchema);
