"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { PROOF_MEDIA, type ProofMediaItem } from "@/lib/gallery";

function VideoTile({ item }: { item: Extract<ProofMediaItem, { type: "video" }> }) {
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative h-48 w-72 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-brand-green-950 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] sm:w-80">
      <video
        ref={videoRef}
        src={item.src}
        controls={started}
        preload="metadata"
        playsInline
        className="h-full w-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            videoRef.current?.play().catch(() => {});
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35"
          aria-label={`تشغيل ${item.caption}`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold-500 text-white shadow-lg transition-transform hover:scale-105">
            <Play className="h-6 w-6 translate-x-[-2px] fill-white" />
          </span>
        </button>
      )}
      <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white">
        {item.caption}
      </span>
    </div>
  );
}

function PhotoTile({ item }: { item: Extract<ProofMediaItem, { type: "photo" }> }) {
  return (
    <div className="relative h-48 w-72 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-brand-green-950 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] sm:w-80">
      <Image src={item.src} alt={item.alt} fill sizes="320px" className="object-cover" />
      <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white">
        {item.caption}
      </span>
    </div>
  );
}

function Tile({ item }: { item: ProofMediaItem }) {
  return item.type === "video" ? <VideoTile item={item} /> : <PhotoTile item={item} />;
}

export default function ProofOfImpact() {
  return (
    <section id="proof" className="bg-brand-green-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl bg-brand-green-800/60 p-6 text-center sm:p-10">
        <span className="section-eyebrow bg-white/10 text-white">Proof of Impact</span>
        <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
          توثيق ميداني من أرض الواقع
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
          صور وفيديوهات حقيقية من رحلة الذبيحة والوجبات من التنفيذ حتى وصولها للمستفيدين
        </p>

        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-green-800/60 to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-green-800/60 to-transparent sm:w-24" />

          <div className="animate-marquee flex w-max gap-5">
            {[...PROOF_MEDIA, ...PROOF_MEDIA].map((item, i) => (
              <Tile key={`${item.src}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
