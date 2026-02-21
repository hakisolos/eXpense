"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const node_server_1 = require("@hono/node-server");
const cors_1 = require("hono/cors");
const dotenv_1 = require("dotenv");
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
(0, dotenv_1.config)();
const app = new hono_1.Hono();
app.use("*", (0, cors_1.cors)());
app.route("/api", routes_1.default);
app.get("/", (c) => {
    return c.text("app runing");
});
async function start() {
    try {
        await (0, config_1.default)(); // connect to your DB
        console.log("DB connected");
        const PORT = Number(process.env.PORT) || 3002;
        (0, node_server_1.serve)({
            fetch: app.fetch,
            port: PORT
        });
        console.log("server running on port " + PORT);
    }
    catch (err) {
        console.error("Failed to start:", err);
    }
}
start();
