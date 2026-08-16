import Image from "next/image";
import { Clock, PapaPlayer } from "./player";

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" }
];

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      <div className="hero-bg fixed inset-0 -z-20 bg-cover bg-center" aria-hidden="true" />
      <div className="fixed inset-0 -z-[15] bg-gradient-to-b from-black/35 via-transparent to-black/80" aria-hidden="true" />
      <div
        className="pointer-events-none fixed inset-0 -z-10 mix-blend-overlay opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E")`
        }}
      />

      <header className="fixed left-0 right-0 top-0 z-20 flex items-start justify-between px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))]">
        <Clock />
        <div className="absolute left-1/2 top-[max(1rem,env(safe-area-inset-top))] -translate-x-1/2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-bold tracking-[.14em] text-white/75 backdrop-blur-md">
          1,997 LISTENERS
        </div>
        <nav aria-label="Social links" className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-md">
          {SOCIALS.map((social) => (
            <a key={social.label} href={social.href} className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
              {social.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="pointer-events-none fixed left-1/2 top-[14%] z-0 flex -translate-x-1/2 flex-col items-center text-center">
        <Image src="/brand/logo.png" alt="पापा की गाड़ी" width={520} height={185} className="mb-3 h-auto w-[min(82vw,520px)] drop-shadow-[0_12px_28px_rgba(0,0,0,.45)]" priority />
        <div className="rounded-full border border-white/15 bg-black/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[.26em] text-white/75 backdrop-blur-md">
          पापा ड्राइव कर रहे हैं • यादें बज रही हैं
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-[22%] left-1/2 z-0 hidden -translate-x-1/2 text-center sm:block">
        <p className="text-[11px] font-semibold tracking-[.22em] text-white/60">CASSETTE ERA • OLD ROADS • HOMEBOUND</p>
      </div>

      <PapaPlayer />
    </main>
  );
}
