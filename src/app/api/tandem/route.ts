import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  appreciations,
  assessmentProfiles,
  connectionRequests,
  employeeProgress,
  employees,
  moodCheckins,
  users,
} from "@/db/schema";
import { eq, not } from "drizzle-orm";

const validMoods = new Set(["focused", "sunny", "social", "lowkey", "chaos"]);
const validBadges = new Set(["Clutch Save", "Good Vibes", "Brain Spark", "Kind Human"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdStr = searchParams.get("userId");
    
    if (!userIdStr) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const userId = Number(userIdStr);

    const [progress] = await db
      .select()
      .from(employeeProgress)
      .where(eq(employeeProgress.employeeId, userId));

    const [profile] = await db
      .select()
      .from(assessmentProfiles)
      .where(eq(assessmentProfiles.employeeId, userId));
      
    // Optionally fetch dynamic people here if needed
    // const allEmployees = await db.select().from(employees);

    return NextResponse.json({
      ok: true,
      progress: progress || { xp: 0, level: 1, streak: 1, unlockedBadges: [] },
      profile: profile || null,
      // people: allEmployees, // Only if the dashboard expects overriding people
    });
  } catch (error) {
    console.error("GET tandem error", error);
    return NextResponse.json({ error: "Failed to fetch data." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      action?: string;
      userId?: number;
      email?: string;
      name?: string;
      answers?: number[];
      archetype?: string;
      toEmployeeId?: number;
      note?: string;
      mood?: string;
      energy?: number;
      shareWithTeam?: boolean;
      badge?: string;
      message?: string;
    };

    if (payload.action === "signup") {
      if (!payload.email || !payload.name) {
        return NextResponse.json(
          { error: "Name and email are required." },
          { status: 400 },
        );
      }

      const [user] = await db
        .insert(users)
        .values({
          email: payload.email,
          name: payload.name,
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            name: payload.name,
          },
        })
        .returning();

      // Ensure progress exists for this user
      let [progress] = await db.select().from(employeeProgress).where(eq(employeeProgress.employeeId, user.id));
      if (!progress) {
        [progress] = await db.insert(employeeProgress).values({
          employeeId: user.id,
          xp: 0,
          level: 1,
          streak: 1,
          unlockedBadges: [],
        }).returning();
      }

      // Ensure assessment profile exists
      let [profile] = await db.select().from(assessmentProfiles).where(eq(assessmentProfiles.employeeId, user.id));
      
      return NextResponse.json({ ok: true, user, progress, profile: profile || null });
    }


    if (payload.action === "assessment") {
      if (
        !Array.isArray(payload.answers) ||
        payload.answers.length !== 6 ||
        payload.answers.some(
          (answer) => !Number.isInteger(answer) || answer < 1 || answer > 4,
        ) ||
        !payload.archetype ||
        payload.archetype.length > 80
      ) {
        return NextResponse.json(
          { error: "Finish all six scenarios to reveal your vibe." },
          { status: 400 },
        );
      }

      const [profile] = await db
        .insert(assessmentProfiles)
        .values({
          employeeId: payload.userId!,
          archetype: payload.archetype,
          answers: payload.answers,
          visibility: "team",
          completed: true,
          updatedAt: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: assessmentProfiles.employeeId,
          set: {
            archetype: payload.archetype,
            answers: payload.answers,
            completed: true,
            updatedAt: new Date().toISOString(),
          },
        })
        .returning();

      await db
        .insert(employeeProgress)
        .values({ employeeId: payload.userId!, xp: 1840, level: 17, streak: 8 })
        .onConflictDoUpdate({
          target: employeeProgress.employeeId,
          set: {
            xp: sql`${employeeProgress.xp} + 120`,
            updatedAt: new Date().toISOString(),
          },
        });

      return NextResponse.json({ ok: true, profile, xpEarned: 120 });
    }

    if (payload.action === "connect") {
      if (
        !Number.isInteger(payload.toEmployeeId) ||
        Number(payload.toEmployeeId) < 2 ||
        Number(payload.toEmployeeId) > 20
      ) {
        return NextResponse.json(
          { error: "Choose a valid teammate." },
          { status: 400 },
        );
      }

      const [connection] = await db
        .insert(connectionRequests)
        .values({
          fromEmployeeId: payload.userId!,
          toEmployeeId: Number(payload.toEmployeeId),
          note: payload.note?.trim().slice(0, 240) || null,
        })
        .returning();

      return NextResponse.json({ ok: true, connection });
    }

    if (payload.action === "mood") {
      if (
        !payload.mood ||
        !validMoods.has(payload.mood) ||
        !Number.isInteger(payload.energy) ||
        Number(payload.energy) < 1 ||
        Number(payload.energy) > 5
      ) {
        return NextResponse.json(
          { error: "Choose a mood and energy level." },
          { status: 400 },
        );
      }

      const [checkin] = await db
        .insert(moodCheckins)
        .values({
          employeeId: payload.userId!,
          mood: payload.mood,
          energy: Number(payload.energy),
          shareWithTeam: Boolean(payload.shareWithTeam),
        })
        .returning();

      return NextResponse.json({ ok: true, checkin, xpEarned: 10 });
    }

    if (payload.action === "appreciate") {
      if (
        !Number.isInteger(payload.toEmployeeId) ||
        Number(payload.toEmployeeId) < 2 ||
        Number(payload.toEmployeeId) > 20 ||
        !payload.badge ||
        !validBadges.has(payload.badge) ||
        !payload.message?.trim()
      ) {
        return NextResponse.json(
          { error: "Pick a badge and write a short note." },
          { status: 400 },
        );
      }

      const [appreciation] = await db
        .insert(appreciations)
        .values({
          fromEmployeeId: payload.userId!,
          toEmployeeId: Number(payload.toEmployeeId),
          badge: payload.badge,
          message: payload.message.trim().slice(0, 280),
        })
        .returning();

      return NextResponse.json({ ok: true, appreciation, xpEarned: 25 });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("Tandem action failed", error);
    return NextResponse.json(
      { error: "The vibes are buffering. Please try again." },
      { status: 500 },
    );
  }
}
