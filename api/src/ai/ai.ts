import { Hono } from "hono";
import { Expense } from "../models/expenseModel";
import jwt from "jsonwebtoken";
import { nikkaTextModule } from "./module";

const ai = new Hono();

ai.post("/ai", async (c) => {
    const { body } = await c.req.json();
    if (!body) return c.json({ error: "body is required" }, 400);

    const authHeader = c.req.header("authorization");
    if (!authHeader) return c.json({ error: "No authorization header" }, 401);

    const token = authHeader.split(" ")[1];
    if (!token) return c.json({ error: "Invalid token format" }, 401);

    try {
        const decoded: any = jwt.verify(token, String(process.env.JWT_SECRET));

        const expenses = await Expense.find({ user: decoded.email });

        const totalAmount = expenses.reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );

        const totalCount = expenses.length;

        const categoryBreakdown: Record<string, number> = {};
        expenses.forEach((xp) => {
            categoryBreakdown[xp.category] =
                (categoryBreakdown[xp.category] || 0) + Number(xp.amount);
        });

        const metadata = JSON.stringify({
            totalAmount,
            totalCount,
            categoryBreakdown,
        });

        const response = await nikkaTextModule(
            body,
            decoded.email,
            {},
            metadata
        );

        return c.json(
            {
                success: true,
                data: response,
            },
            200
        );
    } catch {
        return c.json({ error: "Invalid or expired token" }, 401);
    }
});

export default ai;
