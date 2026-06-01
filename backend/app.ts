import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import cors from "cors";

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

const allowedOrigins = [
    "http://localhost:3000", // for development
    "https://how2centeradiv.dev", // for productipo
];

app.use(cors({
    origin: (origin, callback) => {
        // allow non-browser requests like Postman/server-to-server
        if (!origin) return callback(null, true);

        const isAllowed =
            allowedOrigins.includes(origin) ||
            /^https:\/\/stechuhr(-[a-z0-9]+)?\.vercel\.app$/.test(origin); // to allow all vercel domains for preview testing

        if (isAllowed) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));

//Router imports
import userMangement from "./route/userManagement";
import auth from "./route/auth"

app.use("/users", userMangement);
app.use("/auth", auth);

app.get("/", (req, res) => {
    res.send("hello world");
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})