import { Schema, Document, model } from "mongoose";

interface Umodel extends Document {
    username: string
    email: string
    created_at: Date
}


const Userschema = new Schema<Umodel>(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }
)

export const User = model<Umodel>("User", Userschema)