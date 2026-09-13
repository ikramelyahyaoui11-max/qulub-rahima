"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { IMPACT_PHOTOS } from "@/lib/gallery";
import { useCountUp } from "@/lib/useCountUp";

const INTERVAL_MS = 4000;
const DOCUMENTED_SLAUGHTERS = 5200;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const count = IMPACT_PHOTOS.length;
  const documentedCount = useCountUp(DOCUMENTED_SLAUGHTERS, true);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [count]);

  const secondaryIndex = (index + 1) % count;

  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-brand-gold-400/40 to-brand-green-700/40 blur-xl" />
      <div className="shadow-brand relative h-[340px] w-full max-w-md overflow-hidden rounded-[2rem] bg-brand-green-900 ring-4 ring-white sm:h-[420px]">
        {IMPACT_PHOTOS.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 448px, 90vw"
            priority={i === 0}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/70 via-brand-green-950/5 to-transparent" />

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {IMPACT_PHOTOS.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`الصورة ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="shadow-brand absolute -bottom-8 -left-4 h-40 w-52 overflow-hidden rounded-2xl border-4 border-brand-cream-100 sm:-left-8">
        {IMPACT_PHOTOS.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="208px"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === secondaryIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute -top-5 right-2 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg sm:right-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-800/10 text-brand-green-800">
          <Camera className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-lg font-extrabold text-brand-green-900">
            {documentedCount.toLocaleString("en-US")}+
          </p>
          <p className="text-xs text-brand-green-800/70">عملية ذبح موثقة بالصور</p>
        </div>
      </div>
    </div>
  );
}
