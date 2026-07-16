create table if not exists public.users
(
    id        serial                  not null,
    pw        character varying(1024) not null,
    username  character varying(64)   not null,
    isotp     boolean                 not null,
    role      character varying(32)   not null,
    managerid integer                 not null,
    workload  integer                 not null default 40,
    holidays  integer                 not null default 30,
    constraint users_pkey primary key (id)
) TABLESPACE pg_default;

create table if not exists sessions
(
    id        serial,
    userid    integer,
    token     varchar(1024),
    expiresat timestamp
);

-- Enum for TimeEntry type
CREATE
TYPE time_entry_type AS ENUM ('work', 'holiday', 'sick');

CREATE TABLE "timeEntries"
(
    "id"        SERIAL PRIMARY KEY,
    "userId"    INT REFERENCES "users" ("id") NOT NULL ON DELETE CASCADE,
    "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endTime"   TIMESTAMP WITH TIME ZONE, -- Optional
    "type" time_entry_type NOT NULL
);

-- Notification categories
CREATE TYPE notification_type AS ENUM ('request', 'worktimeExceeded', 'worktimeTooLow');

CREATE TABLE "notifications" (
                                 "id" SERIAL PRIMARY KEY,
                                 "userId" INT REFERENCES "users"("id") NOT NULL ON DELETE CASCADE,
                                 "managerId" INT REFERENCES "users"("id") ON DELETE SET NULL,
                                 "time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                                 "type" notification_type NOT NULL,
                                 "description" TEXT NOT NULL,
                                 "isRead" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TYPE request_type AS ENUM ('holiday', 'sick');

CREATE TABLE "requests" (
                            "id" SERIAL PRIMARY KEY,
                            "userId" INT REFERENCES "users"("id") NOT NULL ON DELETE CASCADE,
                            "managerId" INT REFERENCES "users"("id") NOT NULL ON DELETE SET NULL,
                            "type" request_type NOT NULL,
                            "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
                            "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
                            "isApproved" BOOLEAN DEFAULT NULL -- NULL while the request is still pending, TRUE means approved, FALSE means actively denied
);
