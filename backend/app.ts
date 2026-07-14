import dotenv from "dotenv";

dotenv.config();

import express from "express";

const app = express();
import {drizzle} from 'drizzle-orm/postgres-js'
// @ts-ignore
import postgres from "postgres"
import {users} from "./drizzle/schema"
import cors from "cors";

app.use(
    cors({
        origin: ["http://localhost:3000", "https://how2centeradiv.dev", "https://staging.how2centeradiv.dev"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "userid"],
    })
);
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    throw new Error("Missing connection string");
}

const client = postgres(connectionString, {prepare: false});
export const db = drizzle(client);

(async () => {
    try {
        const result = await db.select().from(users).limit(1);
        console.log("✓ Database connection successful");
    } catch (error) {
        console.error("✗ Database connection failed:", error);
        process.exit(1);
    }
})();

const port = process.env.PORT || 3500;

app.use(express.json());


//Router imports
import userMangement from "./route/userManagement";
import auth from "./route/auth"
import summary from "./route/summary";
import timeEntriesRoute from "./route/timeEntriesRoute";

app.use(userMangement);
app.use(auth);
app.use(summary);
app.use(timeEntriesRoute);

app.get("/", (req, res) => {
    res.send("hello world");
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
