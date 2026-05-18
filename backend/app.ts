import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import {drizzle} from  'drizzle-orm/postgres-js'
// @ts-ignore
import postgres from "postgres"
import {users} from "./drizzle/schema"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    throw new Error("Missing connection string");
}

const client = postgres(connectionString, {prepare : false});
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


app.get("/", (req, res) => {
    res.send("Sebbi Stinkt")
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})