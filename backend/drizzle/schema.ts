import { pgTable, serial, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    pw: varchar("pw", { length: 1024 }),
    username: varchar("username", { length: 64 }),
    isotp: boolean("isotp"),
    role: varchar("role", { length: 32 }),
    managerid: integer("managerid"),
    workload: integer("workload").notNull().default(40),
    holidays: integer("holidays").notNull().default(30),
});


export const sessions = pgTable("sessions", {
    id: serial("id").primaryKey(),
    userid: integer("userid").references(() => users.id),
    token: varchar("token", { length: 1024 }),
    expiresat: timestamp("expiresat"),
});