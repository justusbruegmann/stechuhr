import { pgTable, serial, text, varchar, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core";

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

// Enums — replace values with your actual enum values
export const time_entry_type = pgEnum("time_entry_type", ["work", "holiday", "sick"]);


export const requestTypeEnum = pgEnum("request_type", [
    "vacation",
    "sick",
    // ... your actual values
]);

export const notificationTypeEnum = pgEnum("notification_type", [
    "info",
    "warning",
    // ... your actual values
]);

// Tables
export const timeEntries = pgTable("timeEntries", {
    id: serial("id").primaryKey(),
    userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
    startTime: timestamp("startTime", { withTimezone: true }).notNull(),
    endTime: timestamp("endTime", { withTimezone: true }),
    type: time_entry_type("type").notNull(),
});

export const requests = pgTable("requests", {
    id: serial("id").primaryKey(),
    userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
    managerId: integer("managerId").references(() => users.id, {
        onDelete: "set null",
    }),
    type: requestTypeEnum("type").notNull(),
    startTime: timestamp("startTime", { withTimezone: true }).notNull(),
    endTime: timestamp("endTime", { withTimezone: true }).notNull(),
    isApproved: boolean("isApproved"),
});

export const notifications = pgTable("notifications", {
    id: serial("id").primaryKey(),
    userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
    managerId: integer("managerId").references(() => users.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    type: notificationTypeEnum("type").notNull(),
    description: text("description").notNull(),
    isRead: boolean("isRead").notNull().default(false),
});
