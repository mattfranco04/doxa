export type Song = {
  id: number;
  number: string;
  title: string;
  theme: string;
  lastPlayed?: Date;
  timesPlayedLastMonth: number;
};

export const mockSongs: Song[] = [
  {
    id: 1,
    number: "1",
    title: "Song 1",
    theme: "Theme 1",
    lastPlayed: new Date("2024-01-01"),
    timesPlayedLastMonth: 10,
  },
  {
    id: 2,
    number: "2",
    title: "Song 2",
    theme: "Theme 2",
    lastPlayed: new Date("2024-01-02"),
    timesPlayedLastMonth: 5,
  },
  {
    id: 3,
    number: "3",
    title: "Song 3",
    theme: "Theme 3",
    lastPlayed: new Date("2024-01-03"),
    timesPlayedLastMonth: 3,
  },
  {
    id: 4,
    number: "4",
    title: "Song 4",
    theme: "Theme 4",
    timesPlayedLastMonth: 1,
  },
  {
    id: 5,
    number: "5",
    title: "Song 5",
    theme: "Theme 5",
    timesPlayedLastMonth: 2,
  },
  {
    id: 6,
    number: "6",
    title: "Song 6",
    theme: "Theme 6",
    timesPlayedLastMonth: 4,
  },
  {
    id: 7,
    number: "7",
    title: "Song 7",
    theme: "Theme 7",
    timesPlayedLastMonth: 6,
  },
];
