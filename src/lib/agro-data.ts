export const POINT_VALUE_FCFA = 10;
export const BRANCHES = ["Widikum", "Bamenda", "Yaoundé", "Mamfe", "Kumba"] as const;
export type Branch = (typeof BRANCHES)[number];

// System Analysis Section 8.4 currency formatting (XAF / FCFA)
export const xaf = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} XAF`;
export const fcfa = xaf;
export const pts = (n: number) => `${Math.round(n).toLocaleString("en-US")} pts`;

export type TierId = "seed" | "silver" | "gold" | "platinum" | "diamond";
export interface Tier {
  id: TierId;
  name: string;
  segment: string;
  ptsPer1000: number;
  rebate: string;
  perk: string;
  cardClass: string;
  hasCommission: boolean;
  customer: string;
  points: number;
  commission: number;
  sales: number;
  target: number;
}

export const TIERS: Tier[] = [
  { id: "seed", name: "Green Seed Pass", segment: "Smallholder Farmer", ptsPer1000: 1, rebate: "—", perk: "Standard Farmer Rewards", cardClass: "tier-seed", hasCommission: false, customer: "Ngwa Emmanuel", points: 2450, commission: 0, sales: 0, target: 0 },
  { id: "silver", name: "Silver Sprout Pass", segment: "Reseller / Agro-Shop", ptsPer1000: 1.25, rebate: "1.0% on restocks > 1M XAF", perk: "1.0% Volume Rebate • Priority Restock", cardClass: "tier-silver", hasCommission: true, customer: "Ayuk Agro Shop", points: 6820, commission: 48500, sales: 3_200_000, target: 5_000_000 },
  { id: "gold", name: "Gold Harvest Pass", segment: "Enterprise / Cooperative", ptsPer1000: 1.5, rebate: "1.5% quarterly commission", perk: "Dedicated Agronomist • 1.5% Commission", cardClass: "tier-gold", hasCommission: true, customer: "Momo Cocoa Coop", points: 15240, commission: 212000, sales: 7_500_000, target: 15_000_000 },
  { id: "platinum", name: "Platinum Elite Pass", segment: "Distributor / Wholesaler", ptsPer1000: 2, rebate: "Up to 3.0% volume commission", perk: "30-Day Credit Terms • 2.5x Points", cardClass: "tier-platinum", hasCommission: true, customer: "NW Inputs Distributors", points: 42800, commission: 865000, sales: 28_000_000, target: 40_000_000 },
  { id: "diamond", name: "Diamond Partner Pass", segment: "Franchise Partner", ptsPer1000: 2.5, rebate: "3.5% franchise pool", perk: "Franchise Partner • Max Commission", cardClass: "tier-diamond", hasCommission: true, customer: "Agro Hospital Kumba Franchise", points: 98500, commission: 2_140_000, sales: 61_000_000, target: 80_000_000 },
];

export const CATEGORIES = ["Insecticides", "Fungicides", "Herbicides", "Fertilisers", "Bio-stimulants", "Seeds", "Equipment"] as const;
export const CROPS = ["Cocoa", "Coffee", "Corn", "Cassava", "Tomatoes", "Oil Palm"] as const;

export interface Product {
  id: string;
  name: string;
  category: (typeof CATEGORIES)[number];
  emoji: string;
  unitPrice: number;
  cartonPrice: number;
  cartonQty: number;
  points: number;
  stock: Partial<Record<Branch, number>>;
  pests: string[];
  crops: string[];
  dosage: string;
  safety: string[];
  ppe: string[];
  phi?: string; // Pre-harvest interval
  usage: string;
  articles: string[];
  consult?: boolean;
  restricted?: boolean; // Section 6.5 restricted product flag
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Hybrid Maize Seed CMS 8704 (1kg)",
    category: "Seeds",
    emoji: "🌽",
    unitPrice: 2500,
    cartonPrice: 27000,
    cartonQty: 12,
    points: 25,
    stock: { Widikum: 40, Bamenda: 4, Yaoundé: 22, Kumba: 10 },
    pests: ["Fall armyworm"],
    crops: ["Corn"],
    dosage: "20–25 kg/ha, 2 seeds per hole, 75 × 25 cm spacing.",
    safety: ["Treated seed — do not eat or feed to animals", "Wash hands after handling"],
    ppe: ["Gloves"],
    phi: "N/A",
    usage: "Plant at onset of rains in well-prepared soil. Thin to one plant per hole after 2 weeks.",
    articles: ["a3"],
  },
  {
    id: "p2",
    name: "Tomato Seed F1 Mongal (10g)",
    category: "Seeds",
    emoji: "🍅",
    unitPrice: 6500,
    cartonPrice: 72000,
    cartonQty: 12,
    points: 65,
    stock: { Bamenda: 15, Yaoundé: 3, Mamfe: 8 },
    pests: ["Blight"],
    crops: ["Tomatoes"],
    dosage: "10 g seeds for ~1,000 m² nursery.",
    safety: ["Keep dry and cool", "Protect from rodents"],
    ppe: ["Gloves"],
    phi: "N/A",
    usage: "Raise in a nursery, transplant after 3–4 weeks when plants have 4–5 leaves.",
    articles: ["a2"],
  },
  {
    id: "p3",
    name: "Ridomil Gold Plus (1kg)",
    category: "Fungicides",
    emoji: "🧪",
    unitPrice: 9500,
    cartonPrice: 108000,
    cartonQty: 12,
    points: 95,
    stock: { Widikum: 30, Bamenda: 25, Yaoundé: 2, Kumba: 18 },
    pests: ["Black pod", "Blight"],
    crops: ["Cocoa", "Tomatoes"],
    dosage: "50 g per 15 L knapsack. Repeat every 21 days in rainy season.",
    safety: [
      "Wear full protective gear (gloves, mask, goggles, boots)",
      "Do not spray against wind or within 6 hours before rain",
      "Re-entry interval: 24 hours",
      "Keep away from children and open water sources",
    ],
    ppe: ["Gloves", "Mask", "Goggles", "Boots"],
    phi: "14 days before harvest",
    usage: "Spray pods and trunk thoroughly. Remove infected pods before spraying.",
    articles: ["a1", "a2"],
    consult: true,
  },
  {
    id: "p4",
    name: "Callomil Cocoa Fungicide (50g)",
    category: "Fungicides",
    emoji: "🍫",
    unitPrice: 1200,
    cartonPrice: 26000,
    cartonQty: 24,
    points: 12,
    stock: { Widikum: 200, Mamfe: 60, Kumba: 5 },
    pests: ["Black pod"],
    crops: ["Cocoa"],
    dosage: "1 sachet (50 g) per 15 L knapsack.",
    safety: ["Wear protective equipment", "Do not ingest or inhale spray mist"],
    ppe: ["Gloves", "Mask"],
    phi: "14 days",
    usage: "Spray every 3 weeks from start of rains.",
    articles: ["a1"],
    consult: true,
  },
  {
    id: "p5",
    name: "Emamectin 5% WG (100g)",
    category: "Insecticides",
    emoji: "🐛",
    unitPrice: 4500,
    cartonPrice: 50000,
    cartonQty: 12,
    points: 45,
    stock: { Widikum: 25, Bamenda: 30, Yaoundé: 12 },
    pests: ["Fall armyworm"],
    crops: ["Corn", "Tomatoes"],
    dosage: "10 g per 15 L knapsack, spray directly into the whorl.",
    safety: ["Toxic to bees — spray early morning or late evening", "Wear mask and gloves"],
    ppe: ["Gloves", "Mask", "Boots"],
    phi: "7 days",
    usage: "Scout fields twice a week. Spray when 10% of plants show fresh damage.",
    articles: ["a3"],
    consult: true,
  },
  {
    id: "p6",
    name: "Actara 25 WG (Capsid control)",
    category: "Insecticides",
    emoji: "🪲",
    unitPrice: 6000,
    cartonPrice: 68000,
    cartonQty: 12,
    points: 60,
    stock: { Widikum: 40, Mamfe: 20, Kumba: 15 },
    pests: ["Capsids"],
    crops: ["Cocoa"],
    dosage: "8 g per 15 L knapsack. 2 sprays per season.",
    safety: ["Highly toxic to pollinating bees", "Full protective clothing required"],
    ppe: ["Gloves", "Mask", "Goggles"],
    phi: "21 days",
    usage: "Spray canopy in August and September during capsid peak.",
    articles: ["a1"],
  },
  {
    id: "p7",
    name: "Glyphosate 360 SL (1L)",
    category: "Herbicides",
    emoji: "🌿",
    unitPrice: 3500,
    cartonPrice: 39000,
    cartonQty: 12,
    points: 35,
    stock: { Widikum: 60, Bamenda: 40, Yaoundé: 50, Kumba: 30 },
    pests: ["Weeds"],
    crops: ["Cocoa", "Oil Palm", "Corn"],
    dosage: "200 ml per 15 L knapsack on actively growing weeds.",
    safety: ["Avoid drift onto desired crops", "Do not spray before rain (6 h rainfast)"],
    ppe: ["Gloves", "Boots"],
    phi: "Pre-planting / directed spray",
    usage: "Use for land clearing or as directed spray between rows.",
    articles: ["a4"],
  },
  {
    id: "p8",
    name: "NPK 20-10-10 Fertiliser (50kg)",
    category: "Fertilisers",
    emoji: "🌾",
    unitPrice: 18000,
    cartonPrice: 175000,
    cartonQty: 10,
    points: 180,
    stock: { Widikum: 12, Bamenda: 50, Yaoundé: 40, Mamfe: 3 },
    pests: ["Nutrient deficiency"],
    crops: ["Corn", "Cocoa", "Tomatoes"],
    dosage: "200–300 kg/ha at planting.",
    safety: ["Store off the ground in a dry, ventilated place"],
    ppe: ["Gloves"],
    phi: "None",
    usage: "Apply in a ring 10 cm from the plant base and cover with soil.",
    articles: ["a4"],
  },
  {
    id: "p9",
    name: "Urea 46% (50kg)",
    category: "Fertilisers",
    emoji: "🧂",
    unitPrice: 17500,
    cartonPrice: 170000,
    cartonQty: 10,
    points: 175,
    stock: { Bamenda: 2, Yaoundé: 30, Kumba: 20 },
    pests: ["Nutrient deficiency"],
    crops: ["Corn", "Cassava"],
    dosage: "100–150 kg/ha top-dress at 4–6 weeks.",
    safety: ["Keep away from heat sources and open flames"],
    ppe: ["Gloves"],
    phi: "None",
    usage: "Apply on moist soil and lightly incorporate to avoid volatilization.",
    articles: ["a3"],
  },
  {
    id: "p10",
    name: "Bio-Boost Seaweed Extract (1L)",
    category: "Bio-stimulants",
    emoji: "🌊",
    unitPrice: 8000,
    cartonPrice: 90000,
    cartonQty: 12,
    points: 80,
    stock: { Bamenda: 18, Yaoundé: 10, Widikum: 8 },
    pests: ["Nutrient deficiency"],
    crops: ["Tomatoes", "Cocoa", "Coffee"],
    dosage: "30 ml per 15 L knapsack every 14 days.",
    safety: ["100% Organic — non-toxic to bees and pets", "Shake well before use"],
    ppe: [],
    phi: "0 days (Organic)",
    usage: "Foliar spray to boost flowering, fruit set and weather stress recovery.",
    articles: ["a2"],
  },
  {
    id: "p11",
    name: "Knapsack Sprayer 16L Heavy Duty",
    category: "Equipment",
    emoji: "🎒",
    unitPrice: 22000,
    cartonPrice: 120000,
    cartonQty: 6,
    points: 220,
    stock: { Widikum: 9, Bamenda: 14, Yaoundé: 6 },
    pests: [],
    crops: [],
    dosage: "—",
    safety: ["Rinse tank thoroughly after each use", "Never blow into blocked nozzles with mouth"],
    ppe: [],
    usage: "Pump 10–15 strokes before spraying; maintain nozzle 50 cm from foliage.",
    articles: ["a5"],
  },
  {
    id: "p12",
    name: "Motorized Mist Blower Pro (20L)",
    category: "Equipment",
    emoji: "⚙️",
    unitPrice: 185000,
    cartonPrice: 720000,
    cartonQty: 4,
    points: 1850,
    stock: { Bamenda: 3, Yaoundé: 2 },
    pests: [],
    crops: [],
    dosage: "—",
    safety: ["Wear ear protection and goggles", "Mix 2-stroke fuel with oil at 25:1 ratio"],
    ppe: ["Goggles", "Mask"],
    usage: "Ideal for tall cocoa canopies and large coffee plantations.",
    articles: ["a5"],
  },
  {
    id: "p13",
    name: "Paraquat Super Dichloride (1L) — Restricted",
    category: "Herbicides",
    emoji: "⚠️",
    unitPrice: 5500,
    cartonPrice: 62000,
    cartonQty: 12,
    points: 55,
    stock: { Bamenda: 8, Yaoundé: 12 },
    pests: ["Weeds"],
    crops: ["Oil Palm", "Cocoa"],
    dosage: "150 ml per 15 L knapsack. Directed spray.",
    safety: [
      "RESTRICTED PRODUCT: Agronomist prescription required by law.",
      "Fatal if swallowed or inhaled. Extremely toxic.",
      "Full PPE mandatory: suit, respirator, gloves, boots.",
    ],
    ppe: ["Suit", "Respirator", "Gloves", "Boots"],
    phi: "Non-crop bearing areas only",
    usage: "Agronomist must approve intended use before dispatch.",
    articles: ["a4"],
    consult: true,
    restricted: true, // Section 6.5 restricted product
  },
];

// System Analysis Section 4.2 & 5.3: Disease / Pest Database
export interface Disease {
  id: string;
  name: string;
  crop: (typeof CROPS)[number];
  symptoms: string;
  cause: string;
  prevention: string;
  emoji: string;
  recommendedProductIds: string[];
}

export const DISEASES: Disease[] = [
  {
    id: "d1",
    name: "Black Pod Disease (Phytophthora)",
    crop: "Cocoa",
    symptoms: "Brown or black rot starting at pod tip or stem, spreading rapidly across pod with whitish fungal growth in humid weather.",
    cause: "Phytophthora megakarya fungus thriving in cold damp conditions and dense unpruned canopies.",
    prevention: "Regular weeding, opening canopy shade, removing infected mummified pods weekly, timely fungicide spraying.",
    emoji: "🍫",
    recommendedProductIds: ["p3", "p4", "p11"],
  },
  {
    id: "d2",
    name: "Fall Armyworm",
    crop: "Corn",
    symptoms: "Ragged holes in leaves, window-paning on young leaves, sawdust-like frass inside whorls, damaged cobs.",
    cause: "Spodoptera frugiperda larvae feeding aggressively inside the plant whorl.",
    prevention: "Early planting, frequent crop scouting (check 20 plants twice weekly), intercropping with legumes.",
    emoji: "🐛",
    recommendedProductIds: ["p5", "p11"],
  },
  {
    id: "d3",
    name: "Early & Late Blight",
    crop: "Tomatoes",
    symptoms: "Dark concentric leaf spots, stem lesions, white mold under leaves during damp mornings, sunken fruit rot.",
    cause: "Fungal pathogens (Phytophthora infestans & Alternaria solani) favoured by rainfall and poor airflow.",
    prevention: "Avoid overhead irrigation, stake plants 2 weeks after transplanting, crop rotation, preventive copper/systemic spray.",
    emoji: "🍅",
    recommendedProductIds: ["p3", "p10", "p2"],
  },
  {
    id: "d4",
    name: "Capsids & Mirids Damage",
    crop: "Cocoa",
    symptoms: "Black lesions on green shoots, pod deformation, dieback of branch tips (witches' broom effect).",
    cause: "Sucking insects (Sahlbergella singularis & Distantiella theobroma) piercing bark and young pods.",
    prevention: "Canopy shade management, spray targeted insecticide during August–September capsid peak.",
    emoji: "🪲",
    recommendedProductIds: ["p6", "p12"],
  },
  {
    id: "d5",
    name: "Coffee Leaf Rust",
    crop: "Coffee",
    symptoms: "Yellow-orange powdery spots on the underside of leaves causing premature leaf shedding and twig dieback.",
    cause: "Hemileia vastatrix fungus spread by wind and rain splashes.",
    prevention: "Prune shade trees for sunlight penetration, maintain tree vigor with organic bio-stimulants and copper sprays.",
    emoji: "☕",
    recommendedProductIds: ["p3", "p10"],
  },
  {
    id: "d6",
    name: "Cassava Mosaic Disease",
    crop: "Cassava",
    symptoms: "Mottling, distortion, and severe curling of leaves with stunted tuber growth.",
    cause: "Whitefly-transmitted geminivirus and infected planting stem cuttings.",
    prevention: "Use certified disease-resistant stem cuttings, rogue and burn infected plants immediately.",
    emoji: "🌿",
    recommendedProductIds: ["p10", "p9"],
  },
  {
    id: "d7",
    name: "Nutrient Deficiency (Nitrogen/Potassium)",
    crop: "Corn",
    symptoms: "V-shaped yellowing along middle leaf vein, purple tints on stems, slow growth, poor grain filling.",
    cause: "Depleted soil fertility, heavy leaching from intense rains.",
    prevention: "Soil testing before planting, balanced basal NPK application, followed by Urea top-dressing at 4 weeks.",
    emoji: "🌾",
    recommendedProductIds: ["p8", "p9", "p10"],
  },
];

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  value: number; // percentage or XAF amount
  minOrder: number;
  description: string;
  expiry: string;
}

export const COUPONS: Coupon[] = [
  { code: "COCOA26", discountType: "percentage", value: 10, minOrder: 10000, description: "10% off on all fungicide and crop protection orders", expiry: "30 Nov 2026" },
  { code: "WELCOME10", discountType: "fixed", value: 2500, minOrder: 15000, description: "2,500 XAF welcome voucher on orders over 15,000 XAF", expiry: "31 Dec 2026" },
  { code: "BIOBOOST", discountType: "percentage", value: 15, minOrder: 20000, description: "15% off on bio-stimulants and organic boosters", expiry: "15 Dec 2026" },
];

export interface Workshop {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  spotsLeft: number;
  totalSpots: number;
  emoji: string;
  description: string;
}

export const WORKSHOPS: Workshop[] = [
  {
    id: "w1",
    title: "Cocoa Pruning & Black Pod Management Field Day",
    date: "Sat 14 Nov 2026",
    time: "09:00 - 13:00",
    location: "Widikum Demonstration Farm",
    instructor: "Dr. Fon Mirabel (Head of Agronomy)",
    spotsLeft: 8,
    totalSpots: 40,
    emoji: "🍫",
    description: "Hands-on field training on canopy thinning, sanitation, and correct fungicide spraying timing.",
  },
  {
    id: "w2",
    title: "Safe Chemical Application & Knapsack Calibration",
    date: "Wed 18 Nov 2026",
    time: "10:00 - 12:30",
    location: "Bamenda Farmer Hall, Commercial Ave",
    instructor: "Eng. Tabe Godlove",
    spotsLeft: 14,
    totalSpots: 35,
    emoji: "🎒",
    description: "Learn nozzle selection, pre-harvest safety intervals, PPE guidelines, and equipment maintenance.",
  },
  {
    id: "w3",
    title: "Soil Fertility & Organic Bio-Stimulants Masterclass",
    date: "Sat 28 Nov 2026",
    time: "09:30 - 14:00",
    location: "Yaoundé Agro Training Hub",
    instructor: "Mme Ngo Bassa",
    spotsLeft: 22,
    totalSpots: 50,
    emoji: "🌱",
    description: "Understanding soil pH, reading soil test reports, and optimizing foliar nutrition for maximum yield.",
  },
];

export interface NotificationItem {
  id: string;
  type: "order" | "promo" | "reminder" | "chat";
  title: string;
  body: string;
  time: string;
  read: boolean;
  deepLink?: string;
}

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", type: "order", title: "Order AH-24118 In Transit", body: "Rider Tanyi Bernard is on the way to your farm in Widikum. Delivery OTP: 4829", time: "10 mins ago", read: false, deepLink: "/orders" },
  { id: "n2", type: "promo", title: "New 10% Discount Code", body: "Use coupon COCOA26 for 10% off all fungicides this rainy season.", time: "2 hours ago", read: false, deepLink: "/learn" },
  { id: "n3", type: "reminder", title: "Upcoming Agronomist Consultation", body: "Phone consult with Eng. Tabe Godlove scheduled for Nov 10 at 14:00.", time: "Yesterday", read: true, deepLink: "/clinic" },
  { id: "n4", type: "order", title: "+91 Loyalty Points Credited", body: "Points for Order AH-24067 have been confirmed and added to your wallet balance.", time: "3 days ago", read: true, deepLink: "/profile" },
];

export interface Article {
  id: string;
  title: string;
  kind: "Guide" | "How-to" | "Product info";
  minutes: number;
  emoji: string;
  summary: string;
  body: string[];
  recommendedProductIds?: string[];
}

export const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "Beating black pod in the rainy season",
    kind: "Guide",
    minutes: 4,
    emoji: "🍫",
    summary: "Sanitation, shade control and a spray calendar that works.",
    body: [
      "Black pod spreads fast in wet weather. Remove and bury infected pods weekly to break the sporulation cycle.",
      "Prune chupons and shade trees to open the canopy so pods dry quickly after morning rains.",
      "Spray a systemic fungicide like Ridomil Gold Plus every 21 days from the first seasonal rains.",
      "Always wear protective gloves and avoid spraying when heavy rainfall is imminent.",
    ],
    recommendedProductIds: ["p3", "p4", "p11"],
  },
  {
    id: "a2",
    title: "Growing healthy tomatoes from nursery to harvest",
    kind: "How-to",
    minutes: 6,
    emoji: "🍅",
    summary: "Nursery tips, staking and blight prevention.",
    body: [
      "Start seeds in a raised, well-drained nursery bed protected by nylon mesh or palm fronds.",
      "Transplant seedlings at 3–4 weeks when 4–5 true leaves have emerged. Space at 75 × 40 cm.",
      "Stake within 2 weeks after transplanting to lift foliage off damp soil and prevent blight splash.",
      "Apply foliar Bio-Boost every 14 days to enhance flowering and fruit set.",
    ],
    recommendedProductIds: ["p2", "p3", "p10"],
  },
  {
    id: "a3",
    title: "Spotting fall armyworm early in maize",
    kind: "How-to",
    minutes: 3,
    emoji: "🐛",
    summary: "What to look for in the maize whorl and when to act.",
    body: [
      "Check 20 consecutive plants in a W-pattern across your maize field twice weekly.",
      "Look for pinhole window-pane damage on leaves and fresh sawdust-like frass deep in the central whorl.",
      "Act as soon as 10% of plants show active caterpillar feeding damage.",
      "Direct spray of Emamectin 5% WG directly down the throat of the whorl for maximum kill.",
    ],
    recommendedProductIds: ["p1", "p5", "p11"],
  },
  {
    id: "a4",
    title: "Fertiliser basics: NPK made simple",
    kind: "Product info",
    minutes: 5,
    emoji: "🌾",
    summary: "What N, P and K do and how much to apply.",
    body: [
      "Nitrogen (N) promotes rapid vegetative green leafy growth; Phosphorus (P) develops strong roots and early vigor; Potassium (K) thickens stems and enlarges fruit.",
      "Test your soil before bulk purchase — identifying acidity saves thousands in wasted fertiliser.",
      "Split your nitrogen into two doses: basal application at planting and top-dressing at flowering.",
    ],
    recommendedProductIds: ["p8", "p9", "p10"],
  },
  {
    id: "a5",
    title: "Caring for your knapsack sprayer",
    kind: "Product info",
    minutes: 2,
    emoji: "🎒",
    summary: "Simple maintenance habits that double sprayer lifespan.",
    body: [
      "Rinse the tank 3 times with clean water immediately after every spraying operation.",
      "Never use hard metal wire or mouth to unblock nozzles; use a stiff toothbrush or water rinse.",
      "Lubricate piston seals and o-rings monthly with vegetable oil, and store away from direct sunlight.",
    ],
    recommendedProductIds: ["p11", "p12"],
  },
];

export const CAMPAIGNS = [
  { id: "c1", kind: "Discount", title: "10% off all fungicides", code: "COCOA26", detail: "Rainy season offer • valid until 30 Nov", emoji: "🏷️" },
  { id: "c2", kind: "Workshop", title: "Cocoa pruning field day — Widikum", code: "FREE", detail: "Sat 14 Nov • 09:00 • Free entry", emoji: "👩🏾‍🌾" },
  { id: "c3", kind: "Campaign", title: "Double points on bio-stimulants", code: "BIOBOOST", detail: "Earn 160 pts per bottle all November", emoji: "✨" },
];

export const WEATHER = {
  place: "Widikum, Momo",
  temp: 24,
  cond: "Light rain",
  humidity: 86,
  rainChance: 70,
  forecast: "High humidity & warm moisture favors black pod fungus in cocoa. Avoid chemical spraying if rain is expected within 6 hours.",
  days: [
    { d: "Today", t: 24, e: "🌧️", desc: "Light rain" },
    { d: "Sat", t: 26, e: "⛅", desc: "Partly cloudy" },
    { d: "Sun", t: 27, e: "☀️", desc: "Sunny intervals" },
    { d: "Mon", t: 23, e: "⛈️", desc: "Thunderstorm" },
    { d: "Tue", t: 25, e: "🌦️", desc: "Scattered showers" },
  ],
};

export const DEPARTMENTS = ["Crop protection & inputs", "Orders & deliveries", "Plant clinic & lab", "Loyalty & commissions"] as const;

export const AGRONOMISTS = [
  { id: "g1", name: "Dr. Fon Mirabel", title: "Chief Agronomist", focus: "Cocoa, Coffee & Tree Crops", emoji: "👩🏾‍🔬" },
  { id: "g2", name: "Eng. Tabe Godlove", title: "Field Extension Specialist", focus: "Maize, Cereals & Vegetables", emoji: "👨🏾‍🌾" },
  { id: "g3", name: "Mme Ngo Bassa", title: "Soil & Crop Health Specialist", focus: "Soil Testing & Fertility", emoji: "👩🏾‍🌾" },
];

export const REWARD_FILTERS = ["All Rewards", "Free Seeds", "Sprayers & Tools", "Clinic Vouchers", "Fertilizer Bags"] as const;
export interface Reward { id: string; name: string; filter: (typeof REWARD_FILTERS)[number]; emoji: string; cost: number; }
export const REWARDS: Reward[] = [
  { id: "r1", name: "Hybrid Maize Seed 1kg", filter: "Free Seeds", emoji: "🌽", cost: 250 },
  { id: "r2", name: "Tomato F1 Seed Pack", filter: "Free Seeds", emoji: "🍅", cost: 650 },
  { id: "r3", name: "Knapsack Sprayer 16L", filter: "Sprayers & Tools", emoji: "🎒", cost: 2200 },
  { id: "r4", name: "Pruning Shears Pro", filter: "Sprayers & Tools", emoji: "✂️", cost: 800 },
  { id: "r5", name: "Free Soil Test Voucher", filter: "Clinic Vouchers", emoji: "🧫", cost: 2000 },
  { id: "r6", name: "Farm Visit Voucher", filter: "Clinic Vouchers", emoji: "👩🏾‍🌾", cost: 3500 },
  { id: "r7", name: "NPK 20-10-10 (50kg)", filter: "Fertilizer Bags", emoji: "🌾", cost: 1800 },
  { id: "r8", name: "Urea 46% (50kg)", filter: "Fertilizer Bags", emoji: "🧂", cost: 1750 },
];

export const LAB_TESTS = [
  { id: "soil", name: "Comprehensive Soil Testing", price: 20000, desc: "Analyzes nitrogen, phosphorus, potassium, organic matter and pH level." },
  { id: "water", name: "Irrigation Water Testing", price: 20000, desc: "Tests electrical conductivity, salinity, and mineral balance." },
  { id: "tissue", name: "Plant Tissue & Leaf Analysis", price: 15000, desc: "Determines internal nutrient uptake and hidden deficiencies." },
  { id: "visit", name: "Agronomist On-Farm Visit", price: 35000, desc: "In-person field scouting, soil inspection, and tailored farm management plan." },
];

export const ADVICE: Record<string, string> = {
  Cocoa: "Symptoms indicate Black Pod (Phytophthora megakarya). Remove infected pods, prune chupons to open light, and spray Ridomil Gold Plus every 21 days during rains.",
  Coffee: "Likely Coffee Leaf Rust. Apply copper fungicide, improve organic mulch, and prune dead branches to maintain canopy ventilation.",
  Corn: "Symptoms consistent with Fall Armyworm attack. Scout whorls in the morning; apply Emamectin 5% WG directly into the whorl and top-dress with Urea.",
  Cassava: "Indicators of Cassava Mosaic Disease. Uproot and burn diseased plants; replant with certified virus-free cuttings.",
  Tomatoes: "Classic symptoms of Tomato Late Blight. Stake plants to lift off soil, avoid overhead watering, and alternate contact and systemic fungicides.",
  "Oil Palm": "Signs of Magnesium deficiency or basal stem rot. Apply agricultural lime and potassium-magnesium fertiliser, and schedule a tissue test.",
};

export type OrderStatus = "Confirmed" | "Packed" | "Dispatched" | "In Transit" | "Delivered" | "Received";
export const ORDER_STEPS: OrderStatus[] = ["Confirmed", "Packed", "Dispatched", "In Transit", "Delivered"];

export interface Order {
  id: string;
  date: string;
  type: "Store Order" | "POS Purchase" | "Proforma";
  branch: Branch;
  items: { name: string; qty: number; price: number }[];
  status: OrderStatus;
  deliveryType: "in-town" | "out-of-town";
  fee: number;
  deliveryOtp: string; // Section 4.4 delivery OTP given to rider
  driver?: { name: string; phone: string; vehicle: string };
  courierName?: string;
  waybill?: string;
  points?: number;
  pointsAwarded?: boolean;
  rating?: number;
  ratingTags?: string[];
  feedback?: string;
  payment: string;
  address: string;
}

export const SEED_ORDERS: Order[] = [
  {
    id: "AH-24118",
    date: "2026-11-06",
    type: "Store Order",
    branch: "Bamenda",
    status: "In Transit",
    deliveryType: "in-town",
    fee: 1500,
    deliveryOtp: "4829",
    items: [
      { name: "NPK 20-10-10 Fertiliser (50kg)", qty: 4, price: 18000 },
      { name: "Ridomil Gold Plus (1kg)", qty: 2, price: 9500 },
    ],
    driver: { name: "Tanyi Bernard", phone: "+237 677 12 34 56", vehicle: "TVS Apache • NW 482 AB" },
    points: 91,
    payment: "MTN MoMo",
    address: "Ngwa Emmanuel Farm, Mile 4 Nkwen, Bamenda",
  },
  {
    id: "AH-24067",
    date: "2026-10-28",
    type: "POS Purchase",
    branch: "Widikum",
    status: "Delivered",
    deliveryType: "in-town",
    fee: 0,
    deliveryOtp: "1194",
    points: 34,
    pointsAwarded: true,
    rating: 5,
    ratingTags: ["On time", "Polite rider", "Careful handling"],
    feedback: "Items arrived clean and fast to the farm gate.",
    payment: "Cash at counter",
    address: "Widikum Central Agro Depot",
    items: [
      { name: "Knapsack Sprayer 16L Heavy Duty", qty: 1, price: 22000 },
      { name: "Callomil Cocoa Fungicide (50g)", qty: 10, price: 1200 },
    ],
  },
  {
    id: "AH-23992",
    date: "2026-10-12",
    type: "Store Order",
    branch: "Yaoundé",
    status: "Delivered",
    deliveryType: "out-of-town",
    fee: 3500,
    deliveryOtp: "7731",
    courierName: "Garantie Express Couriers",
    waybill: "GE-YDE-892144",
    points: 210,
    pointsAwarded: true,
    rating: 4,
    payment: "Orange Money",
    address: "Cooperative Warehouse, Mamfe Town",
    items: [
      { name: "Hybrid Maize Seed CMS 8704 (1kg)", qty: 12, price: 2500 },
      { name: "Bio-Boost Seaweed Extract (1L)", qty: 6, price: 8000 },
    ],
  },
];

export const LEDGER = [
  { date: "2026-11-06", label: "Store order AH-24118 (Pending Delivery)", pts: +91, kind: "Pending" },
  { date: "2026-10-30", label: "Redeemed Tomato F1 Seed Pack", pts: -650, kind: "Redeemed" },
  { date: "2026-10-28", label: "Delivered Order AH-24067", pts: +34, kind: "Earned" },
  { date: "2026-10-15", label: "Referral Commission credited (use on inputs)", pts: 0, kind: "Commission", amount: 64000 },
  { date: "2026-10-02", label: "Sign-up Welcome bonus", pts: +500, kind: "Earned" },
];

export const WHATSAPP_URL = "https://wa.me/237677001122?text=Hello%20Agro%20Hospital%20Agronomist%20Desk";
