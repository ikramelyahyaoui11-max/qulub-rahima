import Image from "next/image";
import { PROOF_MEDIA, type ProofMediaItem } from "@/lib/gallery";

function Tile({ item }: { item: ProofMediaItem }) {
  return (
    <div className="relative h-44 w-64 shrink-0 overflow-hidden rounded-2xl bg-brand-green-950 sm:w-72">
      {item.type === "video" ? (
        <>
          <video
            src={item.src}
            controls
            preload="metadata"
            playsInline
            className="h-full w-full object-cover"
          />
          <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white">
            {item.caption}
          </span>
        </>
      ) : (
        <>
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="288px"
            className="object-cover"
          />
          <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white">
            {item.caption}
          </span>
        </>
      )}
    </div>
  );
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
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-brand-green-800/60 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-brand-green-800/60 to-transparent" />

          <div className="animate-marquee flex w-max gap-4">
            {[...PROOF_MEDIA, ...PROOF_MEDIA].map((item, i) => (
              <Tile key={`${item.src}-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
