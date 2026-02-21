"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const userModel_1 = require("./models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("./utils");
const expenseModel_1 = require("./models/expenseModel");
const r = new hono_1.Hono();
r.post("/signin", async (c) => {
    const { email } = await c.req.json();
    if (!email)
        return c.json({ message: "invalid request" }, 401);
    const username = email.split("@")[0];
    try {
        let user = await userModel_1.User.findOne({ email });
        if (!user)
            user = await userModel_1.User.create({ username, email });
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), email: user.email }, String(process.env.JWT_SECRET));
        const fullUrl = new URL(c.req.url);
        const origin = `${fullUrl.protocol}//${fullUrl.host}`;
        const conurl = `${origin}/api/confirm?token=${token}`;
        await (0, utils_1.sendConfirmationMail)(email, conurl);
        return c.json({
            message: "user signed in successfully, check email for confirmation",
        });
    }
    catch (e) {
        console.log(e);
        return c.json({ error: e }, 500);
    }
});
r.get("/confirm", async (c) => {
    const token = c.req.query('token');
    if (!token) {
        return c.json({ error: "id required" }, 401);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, String(process.env.JWT_SECRET));
        const user = await userModel_1.User.findById(decoded.id);
        if (!user)
            return c.json({ error: "User not found" }, 404);
        const frontendUrl = "https://expense.haki.top/confirmed";
        return c.redirect(`${frontendUrl}?token=${token}`);
    }
    catch (err) {
        return c.json({ error: "Invalid or expired token" }, 401);
    }
});
r.get("/me", async (c) => {
    const auth = c.req.header("authorization");
    if (!auth)
        return c.json({ error: "No authorization header" }, 401);
    const token = auth.split(" ")[1];
    if (!token)
        return c.json({ error: "Invalid token format" }, 401);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, String(process.env.JWT_SECRET));
        const expenses = await expenseModel_1.Expense.find({ user: decoded.email });
        const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalCount = expenses.length;
        const categories = {};
        expenses.forEach((xp) => {
            categories[xp.category] = (categories[xp.category] || 0) + Number(xp.amount);
        });
        return c.json({
            user: decoded,
            expenseMeta: {
                totalAmount,
                totalCount,
                categoryBreakdown: categories,
            },
        }, 200);
    }
    catch (err) {
        return c.json({ error: "Invalid or expired token" }, 401);
    }
});
r.post("/addExpense", async (c) => {
    const { user, desc, category, amount } = await c.req.json();
    if (!user || !desc || !category || !amount) {
        return c.json({ message: "invalid request" }, 401);
    }
    const categories = ["Misc", "food", "utilities", "personal", "subscriptions"];
    if (!categories.includes(category)) {
        return c.json({
            message: `invalid category, must be one of: ${categories.join(", ")}`
        }, 401);
    }
    try {
        const xpense = await expenseModel_1.Expense.create({
            user,
            desc,
            category,
            amount
        });
        return c.json({ message: "Expense added" }, 200);
    }
    catch (e) {
        console.log(e);
        return c.status(500);
    }
});
r.post("/report", async (c) => {
    const { user, body } = await c.req.json();
    if (!user || !body) {
        return c.json({ message: "bad request" });
    }
    try {
        await (0, utils_1.sendReportMail)(user, body);
    }
    catch (e) {
        console.log(e);
        return c.status(500);
    }
});
exports.default = r;
