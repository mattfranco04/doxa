"use client"

import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { PlusCircle, Trash2, FileDown, Search } from "lucide-react"

// Simulated database of songs
const songDatabase = [
  { id: 1, number: "1", title: "Amazing Grace", timesPlayedLastMonth: 3 },
  { id: 2, number: "2", title: "How Great Thou Art", timesPlayedLastMonth: 2 },
  { id: 3, number: "3", title: "Holy, Holy, Holy", timesPlayedLastMonth: 1 },
  { id: 4, number: "4", title: "It Is Well With My Soul", timesPlayedLastMonth: 4 },
  { id: 5, number: "5", title: "Great Is Thy Faithfulness", timesPlayedLastMonth: 2 },
  // Add more songs as needed
]

interface Song {
  id: number
  number: string
  title: string
  timesPlayedLastMonth: number
}

interface Announcement {
  title: string
  content: string
}

interface SpiritualGift {
  type: "vision" | "revelation" | "dream"
  description: string
}

interface ReportData {
  date: string
  theme: string
  songs: Song[]
  announcements: Announcement[]
  spiritualGifts: SpiritualGift[]
}

export default function ChurchServiceReport() {
  const [reportData, setReportData] = useState<ReportData>({
    date: "",
    theme: "",
    songs: Array(4).fill({ id: 0, number: "", title: "", timesPlayedLastMonth: 0 }),
    announcements: [],
    spiritualGifts: [],
  })
  const [songSearch, setSongSearch] = useState<string[]>(Array(4).fill(""))

  useEffect(() => {
    // Initialize with 4 empty song slots
    setReportData((prev) => ({
      ...prev,
      songs: Array(4).fill({ id: 0, number: "", title: "", timesPlayedLastMonth: 0 }),
    }))
  }, [])

  const updateSong = (index: number, song: Song) => {
    setReportData((prev) => ({
      ...prev,
      songs: prev.songs.map((s, i) => (i === index ? song : s)),
    }))
    setSongSearch((prev) => prev.map((s, i) => (i === index ? "" : s)))
  }

  const addSong = () => {
    setReportData((prev) => ({
      ...prev,
      songs: [...prev.songs, { id: 0, number: "", title: "", timesPlayedLastMonth: 0 }],
    }))
    setSongSearch((prev) => [...prev, ""])
  }

  const removeSong = (index: number) => {
    setReportData((prev) => ({
      ...prev,
      songs: prev.songs.filter((_, i) => i !== index),
    }))
    setSongSearch((prev) => prev.filter((_, i) => i !== index))
  }

  const addAnnouncement = () => {
    setReportData((prev) => ({
      ...prev,
      announcements: [...prev.announcements, { title: "", content: "" }],
    }))
  }

  const updateAnnouncement = (index: number, field: keyof Announcement, value: string) => {
    setReportData((prev) => ({
      ...prev,
      announcements: prev.announcements.map((announcement, i) =>
        i === index ? { ...announcement, [field]: value } : announcement,
      ),
    }))
  }

  const removeAnnouncement = (index: number) => {
    setReportData((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((_, i) => i !== index),
    }))
  }

  const addSpiritualGift = () => {
    setReportData((prev) => ({
      ...prev,
      spiritualGifts: [...prev.spiritualGifts, { type: "vision", description: "" }],
    }))
  }

  const updateSpiritualGift = (index: number, field: keyof SpiritualGift, value: any) => {
    setReportData((prev) => ({
      ...prev,
      spiritualGifts: prev.spiritualGifts.map((gift, i) => (i === index ? { ...gift, [field]: value } : gift)),
    }))
  }

  const removeSpiritualGift = (index: number) => {
    setReportData((prev) => ({
      ...prev,
      spiritualGifts: prev.spiritualGifts.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4 sm:px-6 lg:px-8 dark">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-100">Church Service Report Creator</h1>
        <div className="space-y-6">
          <Card className="shadow-md bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-100">Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date" className="text-gray-100">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={reportData.date}
                    onChange={(e) => setReportData((prev) => ({ ...prev, date: e.target.value }))}
                    className="mt-1 border-b border-gray-600 focus:border-yellow-500 transition-colors bg-gray-700 text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="theme" className="text-gray-100">
                    Service Theme
                  </Label>
                  <Input
                    id="theme"
                    value={reportData.theme}
                    onChange={(e) => setReportData((prev) => ({ ...prev, theme: e.target.value }))}
                    placeholder="Enter service theme"
                    className="mt-1 border-b border-gray-600 focus:border-yellow-500 transition-colors bg-gray-700 text-gray-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-100">Songs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.songs.map((song, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="relative flex-grow">
                      <Input
                        value={songSearch[index]}
                        onChange={(e) => {
                          const newSearch = [...songSearch]
                          newSearch[index] = e.target.value
                          setSongSearch(newSearch)
                        }}
                        placeholder="Search for a song"
                        className="border-b border-gray-300 focus:border-yellow-500 transition-colors pr-10 bg-gray-700 text-gray-100"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    {songSearch[index] && (
                      <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        {songDatabase
                          .filter((s) => s.title.toLowerCase().includes(songSearch[index]?.toLowerCase() ?? ""))
                          .map((s) => (
                            <div
                              key={s.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                              onClick={() => updateSong(index, s)}
                            >
                              <span>
                                {s.number}. {s.title}
                              </span>
                              <span className="text-sm text-gray-500">
                                Played {s.timesPlayedLastMonth} time(s) last month
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                    {index >= 4 && (
                      <Button variant="ghost" size="icon" onClick={() => removeSong(index)}>
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addSong} className="bg-yellow-600 hover:bg-yellow-700 text-gray-100 transition-colors">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Song
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-100">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.announcements.map((announcement, index) => (
                  <div key={index} className="space-y-2">
                    <Input
                      value={announcement.title}
                      onChange={(e) => updateAnnouncement(index, "title", e.target.value)}
                      placeholder="Announcement title"
                      className="mt-1 border-b border-gray-600 focus:border-yellow-500 transition-colors bg-gray-700 text-gray-100"
                    />
                    <Textarea
                      value={announcement.content}
                      onChange={(e) => updateAnnouncement(index, "content", e.target.value)}
                      placeholder="Announcement content"
                      className="mt-1 border-b border-gray-600 focus:border-yellow-500 transition-colors bg-gray-700 text-gray-100"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAnnouncement(index)}
                      className="text-gray-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={addAnnouncement}
                className="bg-yellow-600 hover:bg-yellow-700 text-gray-100 transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Announcement
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-100">Spiritual Gifts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.spiritualGifts.map((gift, index) => (
                  <div key={index} className="space-y-2">
                    <Select
                      value={gift.type}
                      onValueChange={(value: "vision" | "revelation" | "dream") =>
                        updateSpiritualGift(index, "type", value)
                      }
                    >
                      <SelectTrigger className="w-full bg-gray-700 text-gray-100">
                        <SelectValue placeholder="Select gift type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vision">Vision</SelectItem>
                        <SelectItem value="revelation">Revelation</SelectItem>
                        <SelectItem value="dream">Dream</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      value={gift.description}
                      onChange={(e) => updateSpiritualGift(index, "description", e.target.value)}
                      placeholder="Description of the spiritual gift"
                      className="mt-1 border-b border-gray-600 focus:border-yellow-500 transition-colors bg-gray-700 text-gray-100"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpiritualGift(index)}
                      className="text-gray-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={addSpiritualGift}
                className="bg-yellow-600 hover:bg-yellow-700 text-gray-100 transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Spiritual Gift
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => alert("PDF export functionality would be implemented here.")}
              className="bg-yellow-600 hover:bg-yellow-700 text-gray-100 transition-colors"
            >
              <FileDown className="mr-2 h-4 w-4" /> Export to PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

