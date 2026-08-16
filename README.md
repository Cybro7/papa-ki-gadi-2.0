# पापा की गाड़ी — Papa Ki Gadi

A single-page Next.js nostalgia radio UI using the supplied 16:9 and portrait background artwork.

## Run

```bash
npm install
npm run dev
```

## Authorized YouTube videos

The song catalog is included as metadata, but every `videoId` is intentionally blank. Before making a track playable, add the YouTube video ID of a video you have the right to use and that allows embedding.

Each track can then be enabled with a one-line change in `lib/tracks.ts`:

```ts
videoId: "YOUR_AUTHORIZED_VIDEO_ID"
```

The player uses the visible YouTube IFrame Player API. It does not download or re-host thumbnails, and the iframe is rendered in the artwork slot rather than hidden.

## Structure

- `app/page.tsx` — server-rendered page shell and fixed visual layers
- `app/player.tsx` — client-side clock, YouTube player engine, transport, seeking and playlists
- `lib/tracks.ts` — track metadata and three grouped playlists
- `public/bg/scene-wide.png` — supplied landscape artwork
- `public/bg/scene-tall.png` — supplied portrait artwork
- `public/brand/logo.png` — supplied Hindi logo artwork
