import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core";

export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const assessmentProfiles = sqliteTable(
  "assessment_profiles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    employeeId: integer("employee_id").notNull(),
    archetype: text("archetype").notNull(),
    answers: text("answers", { mode: "json" }).$type<number[]>().notNull(),
    visibility: text("visibility").notNull().default("team"),
    completed: integer("completed", { mode: "boolean" }).notNull().default(true),
    updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
  }
);

export const connectionRequests = sqliteTable("connection_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromEmployeeId: integer("from_employee_id").notNull(),
  toEmployeeId: integer("to_employee_id").notNull(),
  note: text("note"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const moodCheckins = sqliteTable("mood_checkins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id").notNull(),
  mood: text("mood").notNull(),
  energy: integer("energy").notNull(),
  shareWithTeam: integer("share_with_team", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const appreciations = sqliteTable("appreciations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromEmployeeId: integer("from_employee_id").notNull(),
  toEmployeeId: integer("to_employee_id").notNull(),
  badge: text("badge").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const employeeProgress = sqliteTable(
  "employee_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    employeeId: integer("employee_id").notNull(),
    xp: integer("xp").notNull().default(0),
    level: integer("level").notNull().default(1),
    streak: integer("streak").notNull().default(0),
    unlockedBadges: text("unlocked_badges", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default([]),
    updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
  }
);
