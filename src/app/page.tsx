import ServicePlanner from "~/components/service-planner";
import { db } from "~/server/db";
import { songs as songSchema} from "~/server/db/schema";

export default async function Home() {
  const songs = await db.select().from(songSchema);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Church Service Planner
      </h1>
      <ServicePlanner songs={songs} />
    </main>
  );
}
