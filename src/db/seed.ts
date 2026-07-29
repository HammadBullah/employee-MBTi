import { db } from "./index";
import { employees } from "./schema";
import { people } from "../app/tandem-data";

async function seed() {
  console.log("Seeding employees (galaxy teammates)...");
  
  for (const person of people) {
    await db.insert(employees).values(person).onConflictDoUpdate({
      target: employees.id,
      set: person,
    });
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});

