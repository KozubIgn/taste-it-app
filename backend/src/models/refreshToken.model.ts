import { Schema, Types, model } from "mongoose";

export interface RefreshToken {
    token: string;
    user: Types.ObjectId;
    expiryDate: Date;
}

interface RefreshTokenBase extends RefreshToken {
    isExpired: boolean;
}

export const RefreshTokenSchema = new Schema<RefreshTokenBase>({
    token: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    expiryDate: Date,
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
}
);

RefreshTokenSchema.virtual('isExpired').get(function(this : RefreshTokenBase ) {
    return new Date(Date.now()) >= this.expiryDate;
});


export const RefreshTokenModel = model<RefreshTokenBase>('refreshToken', RefreshTokenSchema);
