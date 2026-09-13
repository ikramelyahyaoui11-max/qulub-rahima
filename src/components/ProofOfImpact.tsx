"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { PROOF_MEDIA, type ProofMediaItem } from "@/lib/gallery";

const AUTOPLAY_MS = 4000;

function VideoSlide({ item }: { item: Extract<ProofMediaItem, { type: "video" }> }) {
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (started) videoRef.current?.play().catch(() => {});
  }, [started]);

  return (
    <div className="relative h-full w-full shrink-0 overflow-hidden bg-brand-green-950">
      <video
        ref={videoRef}
        src={started ? item.src : undefined}
        poster={item.poster}
        controls={started}
        preload="none"
        playsInline
        className="h-full w-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
          aria-label={`تشغيل ${item.caption}`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/90 bg-white/15 text-white backdrop-blur-sm transition-transform hover:scale-105">
            <Play className="h-5 w-5 translate-x-[-2px] fill-white" />
          </span>
        </button>
      )}
    </div>
  );
}

function PhotoSlide({ item }: { item: Extract<ProofMediaItem, { type: "photo" }> }) {
  return (
    <div className="relative h-full w-full shrink-0 overflow-hidden bg-brand-green-950">
      <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 500px, 80vw" className="object-cover" />
    </div>
  );
}

function Slide({ item }: { item: ProofMediaItem }) {
  return item.type === "video" ? <VideoSlide item={item} /> : <PhotoSlide item={item} />;
}

export default function ProofOfImpact() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const count = PROOF_MEDIA.length;

  useEffect(() => {
    function measure() {
      const viewport = viewportRef.current;
      const tile = trackRef.current?.firstElementChild as HTMLElement | null;
      if (!viewport || !tile) return;
      const gap = parseFloat(getComputedStyle(trackRef.current!).columnGap || "0");
      const tileStep = tile.getBoundingClientRect().width + gap;
      setStep(tileStep);
      setVisible(Math.max(1, Math.round(viewport.clientWidth / tileStep)));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const maxIndex = Math.max(0, count - visible);
  const goNext = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  const goPrev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));

  useEffect(() => {
    if (paused) return;
    const id = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, maxIndex]);

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

        <div
          ref={viewportRef}
          className="relative mt-8 h-56 overflow-hidden rounded-2xl sm:h-72 lg:h-80"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex h-full gap-3 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${index * step}px)` }}
          >
            {PROOF_MEDIA.map((item, i) => (
              <div key={`${item.src}-${i}`} className="h-full w-[78%] shrink-0 sm:w-[46%] lg:w-[24%]">
                <Slide item={item} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="التالي"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gold-500 text-white shadow-lg transition-transform hover:scale-105 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goPrev}
            aria-label="السابق"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-brand-green-900 shadow-lg backdrop-blur-sm transition-transform hover:scale-105 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
