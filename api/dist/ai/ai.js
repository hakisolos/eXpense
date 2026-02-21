"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const expenseModel_1 = require("../models/expenseModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const module_1 = require("./module");
const ai = new hono_1.Hono();
ai.post("/ai", async (c) => {
    const { body } = await c.req.json();
    if (!body)
        return c.json({ error: "body is required" }, 400);
    const authHeader = c.req.header("authorization");
    if (!authHeader)
        return c.json({ error: "No authorization header" }, 401);
    const token = authHeader.split(" ")[1];
    if (!token)
        return c.json({ error: "Invalid token format" }, 401);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, String(process.env.JWT_SECRET));
        const expenses = await expenseModel_1.Expense.find({ user: decoded.email });
        const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalCount = expenses.length;
        const categoryBreakdown = {};
        expenses.forEach((xp) => {
            categoryBreakdown[xp.category] =
                (categoryBreakdown[xp.category] || 0) + Number(xp.amount);
        });
        const metadata = JSON.stringify({
            totalAmount,
            totalCount,
            categoryBreakdown,
        });
        const response = await (0, module_1.nikkaTextModule)(body, decoded.email, {}, metadata);
        return c.json({
            success: true,
            data: response,
        }, 200);
    }
    catch {
        return c.json({ error: "Invalid or expired token" }, 401);
    }
});
exports.default = ai;
