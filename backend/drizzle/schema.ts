import { pgTable, serial, text, varchar, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    pw: varchar("pw", { length: 1024 }),
    username: varchar("username", { length: 64 }),
    isotp: boolean("isotp"),
    role: varchar("role", { length: 32 }),
    managerid: integer("managerid"),
});

export const sessions = pgTable("sessions", {
    id: serial("id").primaryKey(),
    userid: integer("userid").references(() => users.id),
    token: varchar("token", { length: 1024 }),
    expiresat: timestamp("expiresat"),
});

export const time_entry_type = pgEnum("time_entry_type", ["work", "holiday", "sick"]);

export const timeEntries = pgTable("timeEntries", {
    id: serial("id").primaryKey(),
    userId: integer("userId").references(() => users.id),
    startTime: timestamp("startTime", { withTimezone: true}),
    endTime: timestamp("endTime", {withTimezone: true}),
    type: time_entry_type("type"),
});