import { db } from "./index";
import { employees, employeeProgress } from "./schema";
import { people } from "../app/tandem-data";

async function seed() {
  console.log("Seeding employees...");
  
  for (const person of people) {
    await db.insert(employees).values(person);
  }

  // Seed progress for current user (Hammad, id 1)
  await db.insert(employeeProgress).values({
    employeeId: 1,
    xp: 1720,
    level: 17,
    streak: 8,
    unlockedBadges: ["Deep Work DJ", "Meeting Survivor"],
  });

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
