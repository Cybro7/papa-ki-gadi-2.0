export type Track = {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: number;
  duration: string;
  videoId: string;
};

/*
 * IMPORTANT:
 * Only put YouTube video IDs here for videos you are authorized
 * to embed/use. Do not use unofficial reuploads of copyrighted music.
 *
 * Adding a track = one object.
 */

export const tracks: Track[] = [
  {
    id: "track-01",
    title: "Authorized Track 01",
    artist: "Artist",
    film: "Film",
    year: 1990,
    duration: "0:00",
    videoId: "",
  },

  {
    id: "track-02",
    title: "Authorized Track 02",
    artist: "Artist",
    film: "Film",
    year: 1990,
    duration: "0:00",
    videoId: "",
  },

  {
    id: "track-03",
    title: "Authorized Track 03",
    artist: "Artist",
    film: "Film",
    year: 1990,
    duration: "0:00",
    videoId: "",
  },
];

export const playlists = [
  {
    id: "slow-romantic",
    name: "धीमे सफ़र",
    subtitle: "Slow Romantic / Nostalgic",
    tracks,
  },
];