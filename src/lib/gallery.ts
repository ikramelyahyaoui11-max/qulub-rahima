export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export const IMPACT_PHOTOS: GalleryPhoto[] = [
  {
    src: "/gallery/impact-1.png",
    alt: "توزيع وجبات اللحم على المستفيدين تحت الشجرة",
    caption: "يوم التوزيع",
  },
  {
    src: "/gallery/impact-2.png",
    alt: "تجمع المستفيدين لاستلام وجباتهم",
    caption: "تجهيز التوزيع",
  },
  {
    src: "/gallery/impact-3.png",
    alt: "أطباق الوجبات جاهزة للتوزيع على المستفيدين",
    caption: "الأطباق جاهزة",
  },
  {
    src: "/gallery/impact-4.png",
    alt: "توزيع اللحوم على الأسر المستفيدة",
    caption: "توزيع اللحوم",
  },
];

export type ProofMediaItem =
  | { type: "photo"; src: string; alt: string; caption: string }
  | { type: "video"; src: string; alt: string; caption: string };

export const PROOF_MEDIA: ProofMediaItem[] = [
  {
    type: "video",
    src: "/gallery/impact-video-1.mp4",
    alt: "فيديو توثيقي لعملية التوزيع على المستفيدين",
    caption: "توثيق فيديو 1",
  },
  { type: "photo", ...IMPACT_PHOTOS[0] },
  {
    type: "video",
    src: "/gallery/impact-video-2.mp4",
    alt: "فيديو توثيقي لعملية التوزيع على المستفيدين",
    caption: "توثيق فيديو 2",
  },
  {
    type: "photo",
    src: "/gallery/impact-6.jpeg",
    alt: "أطفال يحملون أطباق الفاكهة والعصائر لتوزيعها على المستفيدين",
    caption: "توزيع الفاكهة والعصائر",
  },
  {
    type: "video",
    src: "/gallery/impact-video-3.mp4",
    alt: "فيديو توثيقي لعملية التوزيع على المستفيدين",
    caption: "توثيق فيديو 3",
  },
  { type: "photo", ...IMPACT_PHOTOS[1] },
  {
    type: "video",
    src: "/gallery/impact-video-4.mp4",
    alt: "فيديو توثيقي لعملية التوزيع على المستفيدين",
    caption: "توثيق فيديو 4",
  },
  {
    type: "photo",
    src: "/gallery/impact-5.jpeg",
    alt: "وجبات موزعة تحت المظلات على المستفيدين",
    caption: "التوزيع تحت المظلات",
  },
  { type: "photo", ...IMPACT_PHOTOS[3] },
];

