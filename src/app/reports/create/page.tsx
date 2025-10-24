"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Music, Plus, Search, X } from "lucide-react";
import { useRef, useState } from "react";

const MOCK_SONGS = [
  { id: 1, title: "Amazing Grace", artist: "John Newton", key: "G" },
  { id: 2, title: "How Great Thou Art", artist: "Carl Boberg", key: "C" },
  {
    id: 3,
    title: "Great Is Thy Faithfulness",
    artist: "Thomas Chisholm",
    key: "F",
  },
  { id: 4, title: "Holy Holy Holy", artist: "Reginald Heber", key: "D" },
  { id: 5, title: "Blessed Assurance", artist: "Fanny Crosby", key: "A" },
  {
    id: 6,
    title: "Be Still My Soul",
    artist: "Katharina von Schlegel",
    key: "Bb",
  },
];

type SpiritualGift = {
  id: number;
  type: string;
  description: string;
};

export default function CreateReportsPage() {
  const [currentGiftType, setCurrentGiftType] = useState("");
  const [currentGiftDescription, setCurrentGiftDescription] = useState("");
  const [spiritualGifts, setSpiritualGifts] = useState<SpiritualGift[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<typeof MOCK_SONGS>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredSongs = MOCK_SONGS.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  ).filter(
    (song) => !selectedSongs.find((selected) => selected.id === song.id),
  );

  const addSong = (song: (typeof MOCK_SONGS)[0]) => {
    setSelectedSongs([...selectedSongs, song]);
  };

  const removeSong = (songId: number) => {
    setSelectedSongs(selectedSongs.filter((song) => song.id !== songId));
  };

  const focusSearchInput = () => {
    searchInputRef.current?.focus();
  };

  const addSpiritualGift = () => {
    if (currentGiftType && currentGiftDescription.trim()) {
      const newGift: SpiritualGift = {
        id: Date.now(),
        type: currentGiftType,
        description: currentGiftDescription.trim(),
      };
      setSpiritualGifts([...spiritualGifts, newGift]);
      setCurrentGiftType("");
      setCurrentGiftDescription("");
    }
  };

  const removeSpiritualGift = (giftId: number) => {
    setSpiritualGifts(spiritualGifts.filter((gift) => gift.id !== giftId));
  };

  return (
    <div className="container mx-auto space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Create Service Report</h1>
        <p className="text-muted-foreground">
          Document today&apos;s service with songs, spiritual gifts, and other
          details.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Spiritual Gifts */}
          <Card>
            <CardHeader>
              <CardTitle>Spiritual Gifts</CardTitle>
              <CardDescription>
                Record any spiritual manifestations during the service (
                {spiritualGifts.length} added)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing spiritual gifts */}
              {spiritualGifts.length > 0 && (
                <div className="space-y-2">
                  {spiritualGifts.map((gift) => (
                    <div
                      key={gift.id}
                      className="flex items-start justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium capitalize">{gift.type}</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {gift.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpiritualGift(gift.id)}
                        className="ml-2 h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new spiritual gift */}
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="gift-type">Add New Gift</Label>
                  <Select
                    value={currentGiftType}
                    onValueChange={setCurrentGiftType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a spiritual gift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dream">Dream</SelectItem>
                      <SelectItem value="revelation">Revelation</SelectItem>
                      <SelectItem value="vision">Vision</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {currentGiftType && (
                  <div className="space-y-2">
                    <Label htmlFor="gift-description">Description</Label>
                    <Textarea
                      id="gift-description"
                      placeholder="Describe the spiritual gift in detail..."
                      value={currentGiftDescription}
                      onChange={(e) =>
                        setCurrentGiftDescription(e.target.value)
                      }
                      className="min-h-[100px]"
                    />
                    <Button
                      onClick={addSpiritualGift}
                      disabled={!currentGiftDescription.trim()}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Spiritual Gift
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Selected Songs */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Songs</CardTitle>
              <CardDescription>
                Songs chosen for this service ({selectedSongs.length} selected)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSongs.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Music />
                    </EmptyMedia>
                    <EmptyTitle>No songs yet</EmptyTitle>
                    <EmptyDescription>
                      You haven&apos;t added any songs yet. Get started by
                      adding some songs.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button onClick={focusSearchInput}>Add songs</Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <div className="space-y-3">
                  {selectedSongs.map((song, index) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{song.title}</p>
                          <p className="text-muted-foreground text-sm">
                            by {song.artist} • Key: {song.key}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSong(song.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Song Search */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Song Library</CardTitle>
              <CardDescription>
                Search and add songs to your service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search songs or artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="max-h-96 space-y-2 overflow-y-auto">
                {filteredSongs.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center">
                    {searchQuery ? (
                      <p>No songs found matching {searchQuery}</p>
                    ) : (
                      <p>All songs have been selected</p>
                    )}
                  </div>
                ) : (
                  filteredSongs.map((song) => (
                    <div
                      key={song.id}
                      className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-muted-foreground text-sm">
                          by {song.artist} • Key: {song.key}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSong(song)}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button>Create Report</Button>
      </div>
    </div>
  );
}
