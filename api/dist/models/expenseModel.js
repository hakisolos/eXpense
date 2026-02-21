"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ExpenseSchema = new mongoose_1.default.Schema({
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
});
exports.Expense = mongoose_1.default.model("Expense", ExpenseSchema);
