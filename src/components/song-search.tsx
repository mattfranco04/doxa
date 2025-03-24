"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search, Plus } from "lucide-react";
import type { Song } from "~/lib/types";
import type { songs } from "~/server/db/schema";

interface SongSearchProps {
  songs: (typeof songs.$inferSelect)[];
  onAddSong: (song: Song) => void;
}

export default function SongSearch({ songs, onAddSong }: SongSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSongs =
    searchTerm.trim() !== ""
      ? songs.filter(
          (song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()),
          // ||
          // song.number.includes(searchTerm) ||
          // song.theme.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Song Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search songs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="max-h-[calc(100vh-220px)] space-y-2 overflow-y-auto pr-1">
          {searchTerm.trim() === "" ? (
            <div className="py-8 text-center text-muted-foreground">
              Enter a search term to find songs
            </div>
          ) : filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <div
                key={song.id}
                className="flex items-start justify-between rounded-md border p-3"
              >
                <div>
                  <div className="font-medium">{song.title}</div>
                  <div className="text-sm text-muted-foreground">
                    #{song.number} • {song.theme}
                  </div>
                  <div className="mt-1 text-xs">
                    <span className="text-muted-foreground">Last played: </span>
                    {new Date(song.lastPlayed).toLocaleDateString() ?? "N/A"}
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">
                      Played in last 3 months:{" "}
                    </span>
                    {song.timesPlayedLastMonth ?? "0"} times
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddSong(song)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add song</span>
                </Button>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No songs found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
