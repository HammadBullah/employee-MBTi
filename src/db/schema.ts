import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  team: text("team").notNull(),
  personality: text("personality").notNull(),
  emoji: text("emoji").notNull(),
  match: integer("match").notNull(),
  avatar: text("avatar").notNull(),
  color: text("color").notNull(),
  glow: text("glow").notNull(),
  reason: text("reason").notNull(),
  tag: text("tag").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const assessmentProfiles = pgTable(
  "assessment_profiles",
  {
    id: serial("id").primaryKey(),
    employeeId: integer("employee_id").notNull(),
    archetype: text("archetype").notNull(),
    answers: jsonb("answers").$type<number[]>().notNull(),
    visibility: text("visibility").notNull().default("team"),
    completed: boolean("completed").notNull().default(true),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("assessment_employee_idx").on(table.employeeId)],
);

export const connectionRequests = pgTable("connection_requests", {
  id: serial("id").primaryKey(),
  fromEmployeeId: integer("from_employee_id").notNull(),
  toEmployeeId: integer("to_employee_id").notNull(),
  note: text("note"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const moodCheckins = pgTable("mood_checkins", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  mood: text("mood").notNull(),
  energy: integer("energy").notNull(),
  shareWithTeam: boolean("share_with_team").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const appreciations = pgTable("appreciations", {
  id: serial("id").primaryKey(),
  fromEmployeeId: integer("from_employee_id").notNull(),
  toEmployeeId: integer("to_employee_id").notNull(),
  badge: text("badge").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const employeeProgress = pgTable(
  "employee_progress",
  {
    id: serial("id").primaryKey(),
    employeeId: integer("employee_id").notNull(),
    xp: integer("xp").notNull().default(1720),
    level: integer("level").notNull().default(17),
    streak: integer("streak").notNull().default(8),
    unlockedBadges: jsonb("unlocked_badges")
      .$type<string[]>()
      .notNull()
      .default(["Deep Work DJ", "Meeting Survivor"]),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("progress_employee_idx").on(table.employeeId)],
);
