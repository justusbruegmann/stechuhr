import {boolean, integer, pgEnum, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    pw: varchar("pw", {length: 1024}),
    username: varchar("username", {length: 64}),
    isotp: boolean("isotp"),
    role: varchar("role", {length: 32}),
    managerid: integer("managerid"),
    workload: integer("workload").notNull().default(40),
    holidays: integer("holidays").notNull().default(30),
});


export const sessions = pgTable("sessions", {
    id: serial("id").primaryKey(),
    userid: integer("userid").references(() => users.id),
    token: varchar("token", {length: 1024}),
    expiresat: timestamp("expiresat"),
});


export const requestTypeEnum = pgEnum("request_type", [
    "holiday",
    "sick",
    // ... your actual values
]);

export const notificationTypeEnum = pgEnum("notification_type", ["info", "warning"]);

// Tables
export const time_entry_type = pgEnum("time_entry_type", ["work", "holiday", "sick"]);

export const timeEntries = pgTable("timeEntries", {
    id: serial("id").primaryKey(),
    userId: integer("userId").references(() => users.id, {onDelete: "cascade"}),
    startTime: timestamp("startTime", {withTimezone: true}).notNull(),
    endTime: timestamp("endTime", {withTimezone: true}),
    type: time_entry_type("type").notNull(),
});

export const requests = pgTable("requests", {
    id: serial("id").primaryKey(),
    userId: integer("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    managerId: integer("managerId")
        .references(() => users.id, { onDelete: "set null" }),
    type: requestTypeEnum("type").notNull(),
    startDate: varchar("startDate").notNull(),
    endDate: varchar("endDate").notNull(),
    remark: text("remark"),
    isApproved: boolean("isApproved"),
});

export const notifications = pgTable("notifications", {
    id: serial("id").primaryKey(),
    userId: integer("userId").references(() => users.id, {onDelete: "cascade"}),
    managerId: integer("managerId").references(() => users.id, {
        onDelete: "set null",
    }),
    time: timestamp("time", {withTimezone: true}).notNull().defaultNow(),
    type: notificationTypeEnum("type").notNull(),
    description: text("description").notNull(),
    isRead: boolean("isRead").notNull().default(false),
});
