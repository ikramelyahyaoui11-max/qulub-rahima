export const BRAND = {
  name: "القلوب الرحيمة",
  fullName: "مؤسسة القلوب الرحيمة لتنفيذ المشروعات بأفريقيا",
  tagline: "مؤسسة القلوب الرحيمة لتنفيذ المشروعات بأفريقيا",
  phone: "201091344637",
  whatsapp: "201091344637",
  facebook: "https://www.facebook.com/share/1NJm2cWMJp/",
  instagram: "https://www.instagram.com/alkoloubalrahima",
};

export const NAV_LINKS = [
  { href: "#products", label: "المنتجات" },
  { href: "#services", label: "خدماتنا" },
  { href: "#journey", label: "رحلة ذبيحتك" },
  { href: "#proof", label: "معرض التوثيق" },
  { href: "#testimonials", label: "آراء العملاء" },
  { href: "#faq", label: "الأسئلة الشائعة" },
  { href: "#contact", label: "تواصل معنا" },
];

export const HERO_CATEGORIES = [
  "الأضاحي",
  "النذور",
  "الإطعام",
  "الكفارات",
  "العقيقة",
];

export type CurrencyKey = "egp" | "usd" | "sar" | "eur";

export type ProductPrice = {
  egp: number;
  usd: number;
  sar: number;
  /** Optional so existing saved products (from before EUR support) don't break; falls back to an estimate from USD. */
  eur?: number;
};

/** Manually-set prices per addon tier — no automatic currency conversion, matching how the admin enters them. */
export type ProductPricing = {
  base: ProductPrice; // بدون إضافات
  rice5kg: ProductPrice; // مع (5 كيلو) أرز
  rice10kg: ProductPrice; // مع (10 كيلو) أرز
};

export type Product = {
  id: string;
  badge: string;
  name: string;
  description: string;
  beneficiaries: string;
  tag: string;
  rating: number;
  defaultIntention: string;
  pricing: ProductPricing;
  photo: string;
  hasPosterPhoto?: boolean;
};

/** Looks up the manually-set price for a given addon selection and currency. */
export function getProductPrice(
  product: Product,
  addon: string,
  currencyKey: CurrencyKey
): number {
  const tier =
    addon === ADDON_OPTIONS[1]
      ? product.pricing.rice5kg
      : addon === ADDON_OPTIONS[2]
        ? product.pricing.rice10kg
        : product.pricing.base;
  if (currencyKey === "eur" && tier.eur === undefined) {
    // Estimate from USD for products saved before EUR pricing existed.
    return Math.round(tier.usd * 0.93);
  }
  return tier[currencyKey] ?? 0;
}

/** Seed data — used to bootstrap data/products.json on first run. After that, the JSON file (editable from /admin) is the source of truth. */
export const PRODUCTS: Product[] = [
  {
    id: "goat",
    badge: "ماعز",
    name: "ماعز",
    description: "مناسبة للعقيقة أو الأضحية، ذبح ونوزيع كامل على الفقراء",
    beneficiaries: "10 - 13 مستفيد",
    tag: "إطعام الخير",
    rating: 5,
    defaultIntention: "عقيقة",
    pricing: {
      base: { egp: 1900, usd: 40, sar: 150, eur: 37 },
      rice5kg: { egp: 2250, usd: 50, sar: 190, eur: 46 },
      rice10kg: { egp: 2600, usd: 60, sar: 230, eur: 56 },
    },
    photo: "/products/goat.jpg",
    hasPosterPhoto: true,
  },
  {
    id: "sheep",
    badge: "خروف",
    name: "خروف",
    description: "ذبح، سلخ، نوزيع كامل على المحتاجين، ونوثيق بالاسم",
    beneficiaries: "15 - 18 مستفيد",
    tag: "الأكثر طلبًا",
    rating: 5,
    defaultIntention: "عقيقة",
    pricing: {
      base: { egp: 2500, usd: 60, sar: 240, eur: 56 },
      rice5kg: { egp: 2850, usd: 70, sar: 280, eur: 65 },
      rice10kg: { egp: 3200, usd: 80, sar: 320, eur: 74 },
    },
    photo: "/products/sheep.jpg",
    hasPosterPhoto: true,
  },
  {
    id: "ram",
    badge: "كبش",
    name: "كبش",
    description: "ذبيحة بحجم أكبر من الخروف، ذبح وتوثيق كامل ونوزيع على عدد أكبر من المستفيدين",
    beneficiaries: "26 - 30 مستفيد",
    tag: "جودة ممتازة",
    rating: 5,
    defaultIntention: "أضحية",
    pricing: {
      base: { egp: 4200, usd: 85, sar: 320, eur: 79 },
      rice5kg: { egp: 4550, usd: 95, sar: 360, eur: 88 },
      rice10kg: { egp: 4900, usd: 105, sar: 400, eur: 98 },
    },
    photo: "/products/ram.jpg",
    hasPosterPhoto: true,
  },
  {
    id: "calf",
    badge: "عجل",
    name: "عجل",
    description: "ذبيحة متوسطة الحجم، ذبح وتوثيق شامل ونوزيع على عدد كبير من المستفيدين",
    beneficiaries: "80 - 100 مستفيد",
    tag: "الخيار الأمثل",
    rating: 5,
    defaultIntention: "أضحية",
    pricing: {
      base: { egp: 10000, usd: 200, sar: 750, eur: 186 },
      rice5kg: { egp: 10350, usd: 210, sar: 790, eur: 195 },
      rice10kg: { egp: 10700, usd: 220, sar: 830, eur: 205 },
    },
    photo: "/products/calf.jpg",
    hasPosterPhoto: true,
  },
  {
    id: "cow",
    badge: "بقرة",
    name: "بقرة",
    description: "ذبيحة كاملة الحجم، توثيق شامل ونوزيع على أكبر عدد من المستفيدين",
    beneficiaries: "100 - 120 مستفيد",
    tag: "إطعام أكثر",
    rating: 5,
    defaultIntention: "أضحية",
    pricing: {
      base: { egp: 13000, usd: 265, sar: 1000, eur: 246 },
      rice5kg: { egp: 13350, usd: 275, sar: 1040, eur: 256 },
      rice10kg: { egp: 13700, usd: 285, sar: 1080, eur: 265 },
    },
    photo: "/products/cow.jpg",
    hasPosterPhoto: true,
  },
];

export const ADDON_OPTIONS = ["بدون إضافات", "مع (5 كيلو) أرز", "مع (10 كيلو) أرز"];

export const INTENTIONS = ["أضحية", "عقيقة", "صدقة", "نذر", "كفارة يمين", "إطعام"];

export const DELIVERY_NOTE =
  "تتولى مؤسسة القلوب الرحيمة شراء الذبيحة وذبحها ونوزيعها ونرسل لكم تقرير موثق بالصور والفيديوهات";

export type OtherProject = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  photo?: string;
};

/** Seed data — used to bootstrap data/other-projects.json on first run. After that, the JSON file (editable from /admin) is the source of truth. */
export const OTHER_PROJECTS: OtherProject[] = [
  {
    id: "pregnant-ewe",
    category: "يبقى الأثر",
    name: "مشروع النعجة الحامل",
    description:
      "نعجة حامل أو وشك على الحمل، تُسلّم لأسرة فقيرة لتربيتها والاستفادة من إنتاجها وليست ذبحها",
    price: 2600,
  },
  {
    id: "solar-lighting",
    category: "يبقى الأثر",
    name: "إنارة منزل بالطاقة الشمسية",
    description:
      "لوح طاقة شمسية وبطارية ولمبات، توضع في بيت ليس فيه إنارة",
    price: 5000,
  },
  {
    id: "blanket",
    category: "صدقة جارية",
    name: "بطانية",
    description:
      "بطانية تُسلّم لأسرة فقيرة أو للعمال والفقراء، من الصدقات الجارية المهمة في هذا الوقت",
    price: 1000,
  },
  {
    id: "water-well-egypt",
    category: "صدقة جارية",
    name: "بئر مياه (مصر)",
    description:
      "حفر مواسير مياه جوفية بموتور وحنفية وخزان مياه 500 لتر، التنفيذ خلال 10 أيام مع نوثيق بالحفر والتنفيذ ورقمه",
    price: 8000,
  },
  {
    id: "water-well-tanzania-pump",
    category: "صدقة جارية",
    name: "بئر تنزانيا (بالطرمبة)",
    description: "حفر بئر مزود بطرمبة نوفير مياه الشرب النظيفة لأهالي تنزانيا",
    price: 50000,
  },
  {
    id: "water-well-tanzania-manual",
    category: "صدقة جارية",
    name: "بئر تنزانيا (يدوي)",
    description: "حفر بئر يدوي نوفير مياه الشرب النظيفة لأهالي تنزانيا",
    price: 25000,
  },
  {
    id: "sewing-kiosk",
    category: "مشروع رزق",
    name: "كشك أكل صغير / ماكينة خياطة",
    description:
      "مشروع صغير (كشك أكل أو ماكينة خياطة) يساعد أسرة على الاعتماد على نفسها ونوفير مصدر رزق",
    price: 10000,
  },
];

export const JOURNEY_STEPS = [
  { step: 1, title: "نرصد", description: "الفري الأكثر احتياجًا" },
  { step: 2, title: "نشتريها", description: "عن طريق كوادرنا المتخصصة" },
  { step: 3, title: "نكتب الاسم", description: "بشكل سريع للتوثيق" },
  { step: 4, title: "نذبحها", description: "وفق الضوابط الشرعية" },
  { step: 5, title: "نوصلها", description: "ونوزيعها حسب العنوان" },
  { step: 6, title: "نوثقها", description: "بالصور والفيديوهات" },
  { step: 7, title: "نرسل التقرير", description: "النهائي عبر الواتساب" },
];

export const SERVICES = [
  { id: "vow", icon: "scroll", name: "نذر وكفارة", description: "وفاء بالنذر والكفارة" },
  { id: "charity", icon: "hands", name: "صدقة", description: "صدقة جارية" },
  { id: "aqiqah", icon: "baby", name: "عقيقة", description: "عقيقة المولود" },
  { id: "sacrifice", icon: "sheep", name: "أضاحي", description: "ذبح ونوزيع الأضاحي" },
];

export const STATS = [
  { value: 98, suffix: "%", label: "رضا العملاء" },
  { value: 3, suffix: "", label: "دول أفريقية" },
  { value: 120000, suffix: "+", label: "مستفيد" },
  { value: 5200, suffix: "+", label: "عملية ذبح" },
];

export const WHY_US = [
  {
    icon: "globe",
    title: "تغطية واسعة",
    description: "نعمل في تنزانيا وعدة دول أفريقية أخرى",
  },
  {
    icon: "zap",
    title: "تنفيذ سريع",
    description: "يتم تنفيذ الطلب خلال 3 أيام من تاريخ الطلب",
  },
  {
    icon: "video",
    title: "توثيق بالفيديو",
    description: "نوثق عملية الذبح والتوزيع بالصور والفيديو ونرسلها لك",
  },
  {
    icon: "shield",
    title: "مؤسسة موثوقة",
    description: "خبرة كبيرة في تنفيذ المشروعات في أفريقيا",
  },
];

export const TESTIMONIALS = [
  {
    name: "محمود حسن",
    text: "مؤسسة موثوقة وأمينة، التوثيق ممتاز والتوزيع على المحتاجين يتم بعناية، بارك الله فيكم.",
  },
  {
    name: "فاطمة علي",
    text: "خدمة رائعة وسريعة، تم ذبح العقيقة باسم المولود ووصلني الفيديو خلال أيام، شكرًا لكم.",
  },
  {
    name: "أحمد محمد",
    text: "جزاكم الله خيرًا، تعامل ممتاز ونوثيق سريع بالفيديو والصور، أنصح الجميع بالتعامل معهم.",
  },
  {
    name: "نورهان خالد",
    text: "منتج يستحق الدعم والثقة، خدمة سريعة ونوثيق بالفيديو، شكرًا جزيلًا.",
  },
  {
    name: "عبدالله إبراهيم",
    text: "تعاملت معهم أكثر من مرة ودائقًا المعاملة ممتازة، الله بجزاكم خير الجزاء.",
  },
  {
    name: "سارة أحمد",
    text: "سهولة في الطلب وسرعة في التنفيذ، وصلني تقرير كامل بالصور، نسأل الله الفبول.",
  },
];

export const FAQS = [
  {
    question: "هل أنتم جهة خيرية أم مؤسسة تجارية؟",
    answer:
      "نحن مؤسسة القلوب الرحيمة لتنفيذ المشروعات بأفريقيا، نوفر حلاً متكاملاً يجمع بين السهولة والموثوقية لتنفيذ الذبائح والأضاحي وتوزيعها على الفقراء.",
  },
  {
    question: "كيف يتم تسليم الطلبات؟",
    answer:
      "يتم تنفيذ الطلب على أرض الواقع من الشراء إلى الذبح والتوزيع، ثم إرسال تقرير موثق بالصور والفيديو عبر الواتساب.",
  },
  {
    question: "كم المدة الزمنية للتنفيذ؟",
    answer: "يتم تنفيذ معظم الطلبات خلال 3 أيام من تاريخ تأكيد الطلب.",
  },
  {
    question: "كيف أستلم التقرير النهائي؟",
    answer: "يُرسل التقرير النهائي متضمنًا الصور والفيديوهات عبر واتساب على الرقم الذي تزودنا به.",
  },
  {
    question: "هل يمكن تحديد اسم للذبيحة؟",
    answer: "نعم، يمكنك كتابة الاسم الذي تريده وسيتم ذكره وتوثيقه أثناء التنفيذ.",
  },
  {
    question: "ما هي الدول التي تعملون فيها؟",
    answer: "نعمل حاليًا في تنزانيا وعدة دول أفريقية أخرى، ونعمل على التوسع باستمرار.",
  },
];
