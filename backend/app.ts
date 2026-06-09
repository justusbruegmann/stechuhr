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

//Router imports
import userMangement from "./route/userManagement";
import auth from "./route/auth"
import timeentries from "./route/timeentries";
import requests from "./route/request";
import summary from "./route/summary";
import notifications from "./route/notifications";

app.use("/users", userMangement);
app.use("/auth", auth);
app.use("/timeentries", timeentries);
app.use("/requests", requests);
app.use("/summary", summary);
app.use("/notifications", notifications);


app.get("/", (req, res) => {
    res.send("hello world");
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})