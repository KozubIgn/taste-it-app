import { Schema, model } from "mongoose";

export interface Tag {
    id: number;
    name: string;
}

export const TagSchema = new Schema<Tag>({
    name: { type: String, required: true }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});
export const TagModel = model<Tag>('tag', TagSchema);