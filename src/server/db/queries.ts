import { db } from "~/server/db";
import { songs } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const QUERIES = {
  getSongs: function () {
    return db.select().from(songs);
  },
  getSongById: function (id: number) {
    return db.select().from(songs).where(eq(songs.id, id));
  },
};
