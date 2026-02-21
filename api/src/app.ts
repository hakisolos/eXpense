import { Hono } from "hono";
import { serve } from "@hono/node-server"
import { cors } from 'hono/cors'
import { config } from "dotenv";
import connb from "./config";
import r from "./routes";
config()



const app = new Hono()
app.use("*", cors());
app.route("/api", r)
app.get("/", (c) => {
    return c.text("app runing")
})
async function start() {
    try {
        await connb();           // connect to your DB
        console.log("DB connected");
        const PORT =  Number(process.env.PORT) || 3002
        serve({
            fetch: app.fetch,
            port: PORT
        });

        console.log("server running on port " + PORT );
    } catch (err) {
        console.error("Failed to start:", err);
    }
}

start();