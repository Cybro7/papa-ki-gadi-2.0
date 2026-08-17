"use client";

import { useEffect, useRef, useState } from "react";
import { playlists, type Track } from "../lib/tracks";

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: (event: { data: number }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo?: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (existing) {
      window.onYouTubeIframeAPIReady = () => resolve();
      return;
    }

    window.onYouTubeIframeAPIReady = () => resolve();

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
      );
    };

    update();

    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="text-xs font-semibold tracking-wide text-white/85">
      <span>{time}</span>
      <span className="mx-1 animate-[blink_1s_steps(1)_infinite]">:</span>
      <span>INDIA</span>
    </div>
  );
}

function Vinyl({
  playing,
  videoId,
}: {
  playing: boolean;
  videoId: string;
}) {
  const artworkRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/20 bg-black/70 shadow-xl ${
        playing ? "animate-[spin_8s_linear_infinite]" : ""
      }`}
    >
      {videoId ? (
        <div
          ref={artworkRef}
          className="h-full w-full overflow-hidden rounded-full"
        >
          <div className="flex h-full w-full items-center justify-center bg-black">
            <span className="text-center text-[8px] uppercase tracking-widest text-white/60">
              YouTube
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#c58b3d] via-[#72502e] to-black">
          <span className="font-serif text-2xl text-white/70">पापा</span>
        </div>
      )}

      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 ring-2 ring-white/40" />
    </div>
  );
}

function Transport({
  playing,
  onPrevious,
  onPlayPause,
  onNext,
}: {
  playing: boolean;
  onPrevious: () => void;
  onPlayPause: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Previous track"
        onClick={onPrevious}
        className="flex h-11 w-11 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
      >
        <span className="text-xl">‹</span>
      </button>

      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={onPlayPause}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-b from-[#e7b957] to-[#a96c18] text-black ring-1 ring-white/25 shadow-[0_8px_24px_rgba(214,154,43,.35)] transition hover:scale-105"
      >
        <span className="text-xl">{playing ? "Ⅱ" : "▶"}</span>
      </button>

      <button
        type="button"
        aria-label="Next track"
        onClick={onNext}
        className="flex h-11 w-11 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
      >
        <span className="text-xl">›</span>
      </button>
    </div>
  );
}

export function PapaPlayer() {
  const playlist = playlists[0];

  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef<YTPlayer | null>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);

  const track: Track = playlist.tracks[trackIndex];

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      await loadYouTubeAPI();

      if (cancelled || !playerHostRef.current || !window.YT?.Player) {
        return;
      }

      if (!track.videoId) {
        return;
      }

      playerRef.current?.destroy();

      playerRef.current = new window.YT.Player(playerHostRef.current, {
        videoId: track.videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            setDuration(event.target.getDuration());
          },

          onStateChange: (event) => {
            if (!window.YT) return;

            if (event.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
            }

            if (event.data === window.YT.PlayerState.PAUSED) {
              setPlaying(false);
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              setPlaying(false);

              setTrackIndex((current) =>
                current + 1 < playlist.tracks.length ? current + 1 : 0,
              );
            }
          },

          onError: (event) => {
            console.warn(
              "YouTube playback error:",
              event.data,
              track.videoId,
            );

            setTrackIndex((current) =>
              current + 1 < playlist.tracks.length ? current + 1 : 0,
            );
          },
        },
      });
    }

    setup();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [track.videoId, playlist.tracks.length]);

  useEffect(() => {
    if (!playing) return;

    const interval = window.setInterval(() => {
      if (!playerRef.current) return;

      setElapsed(playerRef.current.getCurrentTime());

      const currentDuration = playerRef.current.getDuration();

      if (currentDuration > 0) {
        setDuration(currentDuration);
      }
    }, 400);

    return () => window.clearInterval(interval);
  }, [playing]);

  const playPause = () => {
    if (!track.videoId || !playerRef.current) return;

    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const previous = () => {
    setTrackIndex((current) =>
      current === 0 ? playlist.tracks.length - 1 : current - 1,
    );
    setElapsed(0);
    setPlaying(false);
  };

  const next = () => {
    setTrackIndex((current) =>
      current + 1 < playlist.tracks.length ? current + 1 : 0,
    );
    setElapsed(0);
    setPlaying(false);
  };

  const seek = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!playerRef.current || duration <= 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const position = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );

    playerRef.current.seekTo(position * duration, true);
    setElapsed(position * duration);
  };

  const progress =
    duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0;

  return (
    <>
      {/* Visible YouTube player.
          It is deliberately NOT hidden or reduced to 1px. */}
      <div className="fixed left-1/2 top-1/2 z-[-5] h-[180px] w-[320px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl opacity-0 pointer-events-none">
        <div ref={playerHostRef} className="h-full w-full" />
      </div>

      {/* Desktop */}
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 hidden w-[min(92vw,720px)] -translate-x-1/2 sm:flex">
        <div className="flex w-full items-center gap-4 rounded-full border border-white/10 bg-gradient-to-b from-white/[0.15] to-white/[0.055] p-3 pr-5 backdrop-blur-3xl backdrop-saturate-[1.7] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)]">
          <Vinyl playing={playing} videoId={track.videoId} />

          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-semibold text-white">
              {track.title}
            </div>

            <div className="truncate text-[12.5px] text-white/70">
              {track.artist} • {track.film} ({track.year})
            </div>

            <div
              onPointerDown={seek}
              className="group mt-1 flex h-6 touch-none items-center"
            >
              <div className="relative h-[3px] w-full rounded-full bg-white/15">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#d89b32] shadow-[0_0_10px_rgba(216,155,50,.7)]"
                  style={{ width: `${progress}%` }}
                />

                <div
                  className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#e7b957] opacity-0 transition group-hover:opacity-100"
                  style={{ left: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-[10.5px] tabular-nums text-white/55">
              <span>{formatTime(elapsed)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <Transport
            playing={playing}
            onPrevious={previous}
            onPlayPause={playPause}
            onNext={next}
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 w-[calc(100%-2rem)] -translate-x-1/2 sm:hidden">
        <div className="rounded-[26px] border border-white/10 bg-gradient-to-b from-white/[0.15] to-white/[0.055] p-4 backdrop-blur-3xl backdrop-saturate-[1.7] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)]">
          <div className="flex items-center gap-3">
            <div className="scale-80 origin-left">
              <Vinyl playing={playing} videoId={track.videoId} />
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">
                {track.title}
              </div>

              <div className="truncate text-xs text-white/65">
                {track.artist} • {track.year}
              </div>
            </div>
          </div>

          <div
            onPointerDown={seek}
            className="group mt-3 flex h-6 touch-none items-center"
          >
            <div className="relative h-[3px] w-full rounded-full bg-white/15">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[#d89b32] shadow-[0_0_10px_rgba(216,155,50,.7)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between">
            <div className="text-[10.5px] tabular-nums text-white/55">
              {formatTime(elapsed)} / {formatTime(duration)}
            </div>

            <Transport
              playing={playing}
              onPrevious={previous}
              onPlayPause={playPause}
              onNext={next}
            />
          </div>
        </div>
      </div>
    </>
  );
}