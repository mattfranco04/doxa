
import {
  int,
  bigint,
  text,
  date,
  singlestoreTableCreator,
} from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator((name) => `doxa_${name}`);

export const songs = createTable("songs_table", {
  id: bigint("id", { mode: "number", unsigned: true }).primaryKey().autoincrement(),
  number: text("number"),
  title: text("title").notNull(),
  theme: text("theme").notNull(),
  lastPlayed: date("last_played"),
  timesPlayedLastMonth: int("times_played_last_month"),
});
