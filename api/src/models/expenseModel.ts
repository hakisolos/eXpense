import mongoose from "mongoose";
import { Document } from "mongoose";

interface Emodel extends Document {
    user: string
    desc: string
    category: string
    date: Date
    amount: string
}

const ExpenseSchema = new mongoose.Schema<Emodel>({
    user: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: "Misc"
    },
    date: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: String,
        required: true
    }
})

export const Expense = mongoose.model<Emodel>("Expense", ExpenseSchema)