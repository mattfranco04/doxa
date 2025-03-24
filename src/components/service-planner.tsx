"use client";

import { useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Printer, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import SongSearch from "./song-search";
import SongList from "./song-list";
import type { Song } from "~/lib/types";
import type { songs } from "~/server/db/schema";

// Sample data - in a real app, this would come from a database
const sampleSongs: Song[] = [
  {
    id: "1",
    title: "Amazing Grace",
    number: "101",
    category: "Hymn",
    lastPlayed: "2023-12-10",
    playCount: 2,
  },
  {
    id: "2",
    title: "How Great Thou Art",
    number: "102",
    category: "Hymn",
    lastPlayed: "2023-11-15",
    playCount: 1,
  },
  {
    id: "3",
    title: "Great Is Thy Faithfulness",
    number: "103",
    category: "Hymn",
    lastPlayed: "2023-12-24",
    playCount: 3,
  },
  {
    id: "4",
    title: "Holy Spirit",
    number: "201",
    category: "Contemporary",
    lastPlayed: "2024-01-07",
    playCount: 2,
  },
  {
    id: "5",
    title: "10,000 Reasons",
    number: "202",
    category: "Contemporary",
    lastPlayed: "2023-12-17",
    playCount: 1,
  },
  {
    id: "6",
    title: "Cornerstone",
    number: "203",
    category: "Contemporary",
    lastPlayed: "2024-01-14",
    playCount: 2,
  },
  {
    id: "7",
    title: "Blessed Assurance",
    number: "104",
    category: "Hymn",
    lastPlayed: "2023-10-22",
    playCount: 0,
  },
  {
    id: "8",
    title: "What A Beautiful Name",
    number: "204",
    category: "Contemporary",
    lastPlayed: "2023-12-03",
    playCount: 1,
  },
];

// Types for spiritual gifts and announcements
type SpiritualGiftType = "vision" | "revelation" | "dream";

interface SpiritualGift {
  id: string;
  type: SpiritualGiftType;
  content: string;
}

interface Announcement {
  id: string;
  content: string;
}

export default function ServicePlanner(props: {
  songs: (typeof songs.$inferSelect)[];
}) {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [spiritualGifts, setSpiritualGifts] = useState<SpiritualGift[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [serviceDate, setServiceDate] = useState("");
  const [serviceName, setServiceName] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const handleAddSong = (song: Song) => {
    setSelectedSongs((prev) => [...prev, song]);
  };

  const handleRemoveSong = (index: number) => {
    setSelectedSongs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveSong = (dragIndex: number, hoverIndex: number) => {
    const newSongs = [...selectedSongs];
    const draggedSong = newSongs[dragIndex];
    newSongs.splice(dragIndex, 1);
    newSongs.splice(hoverIndex, 0, draggedSong);
    setSelectedSongs(newSongs);
  };

  const handleAddSpiritualGift = () => {
    const newGift: SpiritualGift = {
      id: Date.now().toString(),
      type: "vision",
      content: "",
    };
    setSpiritualGifts((prev) => [...prev, newGift]);
  };

  const handleUpdateSpiritualGift = (id: string, content: string) => {
    setSpiritualGifts((prev) =>
      prev.map((gift) => (gift.id === id ? { ...gift, content } : gift)),
    );
  };

  const handleUpdateSpiritualGiftType = (
    id: string,
    type: SpiritualGiftType,
  ) => {
    setSpiritualGifts((prev) =>
      prev.map((gift) => (gift.id === id ? { ...gift, type } : gift)),
    );
  };

  const handleRemoveSpiritualGift = (id: string) => {
    setSpiritualGifts((prev) => prev.filter((gift) => gift.id !== id));
  };

  const handleAddAnnouncement = () => {
    const announcement: Announcement = {
      id: Date.now().toString(),
      content: "",
    };
    setAnnouncements((prev) => [...prev, announcement]);
  };

  const handleUpdateAnnouncement = (id: string, content: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === id ? { ...announcement, content } : announcement,
      ),
    );
  };

  const handleRemoveAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.filter((announcement) => announcement.id !== id),
    );
  };

  const handlePrint = () => {
    if (printRef.current) {
      // Create a new window
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      // Get the HTML content to print
      const contentToPrint = printRef.current.innerHTML;

      // Write to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>Church Service Plan - ${serviceDate || "Undated"}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { font-size: 24px; margin-bottom: 16px; }
              h2 { font-size: 20px; margin-bottom: 8px; }
              ol { padding-left: 20px; }
              li { margin-bottom: 8px; }
              p { white-space: pre-line; }
              .gift-type { font-weight: bold; text-transform: capitalize; }
            </style>
          </head>
          <body>
            ${contentToPrint}
          </body>
        </html>
      `);

      // Print and close
      printWindow.document.close();
      printWindow.focus();

      // Use setTimeout to ensure content is loaded before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="service-date">Service Date</Label>
                <Input
                  id="service-date"
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="service-name">Service Name/Type</Label>
                <Input
                  id="service-name"
                  placeholder="Sunday Morning Service"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Songs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Songs</CardTitle>
          </CardHeader>
          <CardContent>
            <DndProvider backend={HTML5Backend}>
              <SongList
                songs={selectedSongs}
                onRemove={handleRemoveSong}
                onMove={handleMoveSong}
              />
            </DndProvider>
          </CardContent>
        </Card>

        {/* Spiritual Gifts Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Spiritual Gifts</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSpiritualGift}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Spiritual Gift
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* List of spiritual gifts */}
              {spiritualGifts.length > 0 ? (
                <div className="space-y-4">
                  {spiritualGifts.map((gift) => (
                    <div key={gift.id} className="space-y-3 px-4">
                      <div>
                        <Label htmlFor={`gift-type-${gift.id}`}>Type</Label>
                        <Select
                          value={gift.type}
                          onValueChange={(value) =>
                            handleUpdateSpiritualGiftType(
                              gift.id,
                              value as SpiritualGiftType,
                            )
                          }
                        >
                          <SelectTrigger id={`gift-type-${gift.id}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vision">Vision</SelectItem>
                            <SelectItem value="revelation">
                              Revelation
                            </SelectItem>
                            <SelectItem value="dream">Dream</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`gift-content-${gift.id}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`gift-content-${gift.id}`}
                          className="min-h-[100px]"
                          placeholder="Enter spiritual gift details..."
                          value={gift.content}
                          onChange={(e) =>
                            handleUpdateSpiritualGift(gift.id, e.target.value)
                          }
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveSpiritualGift(gift.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border py-8 text-center">
                  <p className="text-muted-foreground">
                    No spiritual gifts added yet
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Announcements Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Announcements</CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddAnnouncement}>
              <Plus className="mr-2 h-4 w-4" /> Add Announcement
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* List of announcements */}
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="space-y-3 px-4">
                      <div>
                        <Label htmlFor={`announcement-${announcement.id}`}>
                          Announcement
                        </Label>
                        <Textarea
                          id={`announcement-${announcement.id}`}
                          className="min-h-[100px]"
                          placeholder="Enter announcement details..."
                          value={announcement.content}
                          onChange={(e) =>
                            handleUpdateAnnouncement(
                              announcement.id,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleRemoveAnnouncement(announcement.id)
                          }
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border py-8 text-center">
                  <p className="text-muted-foreground">
                    No announcements added yet
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        <Button className="mt-6 w-full" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Export to PDF
        </Button>
      </div>

      <div className="/*lg:pt-8 pb-8 lg:sticky lg:top-0 lg:h-screen">
        <SongSearch songs={props.songs} onAddSong={handleAddSong} />
      </div>

      {/* Hidden div for PDF printing */}
      <div className="hidden">
        <div ref={printRef} className="p-8">
          <h1 className="mb-4 text-2xl font-bold">
            {serviceName || "Church Service"} - {serviceDate || "Undated"}
          </h1>

          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Songs</h2>
            {selectedSongs.length > 0 ? (
              <ol className="list-decimal pl-5">
                {selectedSongs.map((song, index) => (
                  <li key={index} className="mb-2">
                    {song.title} (#{song.number}) - {song.category}
                  </li>
                ))}
              </ol>
            ) : (
              <p>No songs selected</p>
            )}
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Spiritual Gifts</h2>
            {spiritualGifts.length > 0 ? (
              <ul className="list-disc pl-5">
                {spiritualGifts.map((gift) => (
                  <li key={gift.id} className="mb-2">
                    <span className="gift-type">{gift.type}: </span>
                    {gift.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No spiritual gifts recorded</p>
            )}
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Announcements</h2>
            {announcements.length > 0 ? (
              <ul className="list-disc pl-5">
                {announcements.map((announcement) => (
                  <li key={announcement.id} className="mb-2">
                    {announcement.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No announcements recorded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
