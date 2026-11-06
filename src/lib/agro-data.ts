export const POINT_VALUE_FCFA = 10;
export const BRANCHES = ["Bamenda", "Yaounde"] as const;
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
  image: string;
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
    name: "ACEPLANT 40EC (1L)",
    category: "Insecticides",
    emoji: "🦟",
    image: "/products/aceplant-40ec.jpg",
    unitPrice: 5068,
    cartonPrice: 58000,
    cartonQty: 12,
    points: 51,
    stock: { Bamenda: 30, Yaounde: 20 },
    pests: ["Sucking insects", "Aphids", "Whiteflies", "Thrips"],
    crops: ["Tomatoes", "Corn", "Coffee"],
    dosage: "15–20 ml per 15L knapsack. Systemic neonicotinoid acetamiprid.",
    safety: ["Wear protective mask and gloves", "Do not spray in bright hot sun", "Keep away from bees"],
    ppe: ["Gloves", "Mask"],
    phi: "7 days",
    usage: "Systemic translaminar action against sucking pests on vegetables and cash crops.",
    articles: ["a2", "a3"],
    consult: true,
  },
  {
    id: "p2",
    name: "CYPERPLANT 100EC (1L)",
    category: "Insecticides",
    emoji: "🐛",
    image: "/products/cyperplant-100ec.jpg",
    unitPrice: 4175,
    cartonPrice: 48000,
    cartonQty: 12,
    points: 42,
    stock: { Bamenda: 50, Yaounde: 35 },
    pests: ["Fall armyworm", "Capsids", "Caterpillars"],
    crops: ["Corn", "Cocoa", "Tomatoes"],
    dosage: "25–30 ml per 15L knapsack. Rapid knockdown pyrethroid cypermethrin.",
    safety: ["Toxic to aquatic organisms", "Wear full protective clothing and boots"],
    ppe: ["Gloves", "Mask", "Boots"],
    phi: "14 days",
    usage: "Broad-spectrum contact and stomach poison for rapid suppression of caterpillars and capsids.",
    articles: ["a1", "a3"],
    consult: true,
  },
  {
    id: "p3",
    name: "PLANTOMIL SUPER (50g)",
    category: "Fungicides",
    emoji: "🍫",
    image: "/products/plantomil-super.jpg",
    unitPrice: 739,
    cartonPrice: 16000,
    cartonQty: 24,
    points: 8,
    stock: { Bamenda: 180, Yaounde: 100 },
    pests: ["Black pod", "Blight"],
    crops: ["Cocoa", "Tomatoes"],
    dosage: "1 sachet (50g) per 15L knapsack. Metalaxyl + Copper formulation.",
    safety: [
      "Wear full protective gear (gloves, mask, goggles, boots)",
      "Do not spray against wind or within 6 hours before rain",
      "Re-entry interval: 24 hours",
    ],
    ppe: ["Gloves", "Mask", "Goggles", "Boots"],
    phi: "14 days before harvest",
    usage: "Dual-action systemic and contact protection against cocoa black pod rot and vegetable blight.",
    articles: ["a1", "a2"],
    consult: true,
  },
  {
    id: "p4",
    name: "CHLOROPLANT 720 SC (1L)",
    category: "Fungicides",
    emoji: "🧪",
    image: "/products/chloroplant-720sc.jpg",
    unitPrice: 5009,
    cartonPrice: 57000,
    cartonQty: 12,
    points: 50,
    stock: { Bamenda: 40, Yaounde: 28 },
    pests: ["Early & Late Blight", "Anthracnose", "Leaf spot"],
    crops: ["Tomatoes", "Coffee", "Cassava"],
    dosage: "40–50 ml per 15L knapsack every 10–14 days.",
    safety: ["Avoid skin and eye contact", "Store in cool ventilated place out of reach of children"],
    ppe: ["Gloves", "Mask", "Goggles"],
    phi: "7 days",
    usage: "Multi-site protectant chlorothalonil fungicide preventing blight spore germination on foliage.",
    articles: ["a2"],
    consult: true,
  },
  {
    id: "p5",
    name: "HYDROX SUPER (50g)",
    category: "Fungicides",
    emoji: "🛡️",
    image: "/products/hydrox-super.jpg",
    unitPrice: 441,
    cartonPrice: 9800,
    cartonQty: 24,
    points: 5,
    stock: { Bamenda: 150, Yaounde: 90 },
    pests: ["Black pod", "Coffee Leaf Rust"],
    crops: ["Cocoa", "Coffee"],
    dosage: "50g sachet per 15L knapsack. Copper hydroxide active.",
    safety: ["Wash thoroughly after handling", "Do not inhale spray dust"],
    ppe: ["Gloves", "Mask"],
    phi: "14 days",
    usage: "Protective contact fungicide providing durable rain-resistant barrier against cocoa brown rot and rust.",
    articles: ["a1"],
  },
  {
    id: "p6",
    name: "PLANTIZEB 80WP (1kg)",
    category: "Fungicides",
    emoji: "🍂",
    image: "/products/plantizeb-80wp.jpg",
    unitPrice: 4175,
    cartonPrice: 46000,
    cartonQty: 12,
    points: 42,
    stock: { Bamenda: 60, Yaounde: 30 },
    pests: ["Blight", "Downy mildew", "Leaf spot"],
    crops: ["Tomatoes", "Corn", "Cocoa"],
    dosage: "40g per 15L knapsack. Mancozeb 800 g/kg broad-spectrum.",
    safety: ["Wear protective equipment", "Do not ingest or inhale dust"],
    ppe: ["Gloves", "Mask"],
    phi: "14 days",
    usage: "Multipurpose preventative fungicide for food, cereal and fruit crops.",
    articles: ["a2"],
  },
  {
    id: "p7",
    name: "PLANTOP 360SL Herbicide (1L)",
    category: "Herbicides",
    emoji: "🌿",
    image: "/products/plantop-360sl.jpg",
    unitPrice: 2862,
    cartonPrice: 32000,
    cartonQty: 12,
    points: 29,
    stock: { Bamenda: 65, Yaounde: 70 },
    pests: ["Weeds", "Perennial grasses"],
    crops: ["Cocoa", "Oil Palm", "Corn"],
    dosage: "150–200 ml per 15L knapsack on actively growing green weeds.",
    safety: ["Avoid spray drift onto crop leaves", "Ensure 6 hours rainfast window"],
    ppe: ["Gloves", "Boots"],
    phi: "Pre-planting / directed spray",
    usage: "Non-selective systemic glyphosate herbicide for land clearing and plantation weed control.",
    articles: ["a4"],
  },
  {
    id: "p8",
    name: "PLANTOMAIS 40 OD (1L)",
    category: "Herbicides",
    emoji: "🌽",
    image: "/products/plantomais-40od.jpg",
    unitPrice: 4175,
    cartonPrice: 48000,
    cartonQty: 12,
    points: 42,
    stock: { Bamenda: 55, Yaounde: 30 },
    pests: ["Weeds", "Annual grasses in maize"],
    crops: ["Corn"],
    dosage: "100–125 ml per 15L knapsack applied at 2–6 corn leaf stage.",
    safety: ["Apply when corn is young and vigorous", "Do not tank-mix with organophosphates"],
    ppe: ["Gloves", "Boots"],
    phi: "30 days",
    usage: "Selective post-emergence nicosulfuron herbicide targeting tough weeds in maize fields.",
    articles: ["a3"],
  },
  {
    id: "p9",
    name: "HERBAPLANT 200SL (1L) — Restricted",
    category: "Herbicides",
    emoji: "⚠️",
    image: "/products/herbaplant-200sl.jpg",
    unitPrice: 3220,
    cartonPrice: 36000,
    cartonQty: 12,
    points: 32,
    stock: { Bamenda: 14, Yaounde: 18 },
    pests: ["Weeds"],
    crops: ["Oil Palm", "Cocoa"],
    dosage: "150 ml per 15L knapsack. Directed spray on non-crop areas.",
    safety: [
      "RESTRICTED PRODUCT: Agronomist prescription and authorization required.",
      "Extremely toxic contact herbicide. Never swallow or inhale mist.",
      "Full PPE mandatory: suit, respirator, chemical gloves, safety boots.",
    ],
    ppe: ["Suit", "Respirator", "Gloves", "Boots"],
    phi: "Non-crop bearing areas only",
    usage: "Rapid-burn contact herbicide for tough perimeter weeds. Agronomist clearance mandatory.",
    articles: ["a4"],
    consult: true,
    restricted: true,
  },
  {
    id: "p10",
    name: "MAWIN Biological Growth Regulator (1L)",
    category: "Bio-stimulants",
    emoji: "✨",
    image: "/products/mawin-growth-regulator.jpg",
    unitPrice: 13118,
    cartonPrice: 145000,
    cartonQty: 12,
    points: 131,
    stock: { Bamenda: 35, Yaounde: 24 },
    pests: ["Nutrient deficiency"],
    crops: ["Cocoa", "Coffee", "Tomatoes", "Corn"],
    dosage: "25–30 ml per 15L knapsack every 14–21 days.",
    safety: ["100% Organic active biostimulant", "Safe for bees and beneficial organisms", "Shake well"],
    ppe: ["Gloves"],
    phi: "0 days (Organic)",
    usage: "Natural foliar biostimulant rich in humic & fulvic acids to maximize flowering and drought resilience.",
    articles: ["a2", "a4"],
  },
  {
    id: "p11",
    name: "PLANTONUS Foliar Fertilizer (1L)",
    category: "Fertilisers",
    emoji: "🌾",
    image: "/products/plantonus-foliar.jpg",
    unitPrice: 9500,
    cartonPrice: 105000,
    cartonQty: 12,
    points: 95,
    stock: { Bamenda: 45, Yaounde: 32 },
    pests: ["Nutrient deficiency"],
    crops: ["Corn", "Cocoa", "Tomatoes"],
    dosage: "30–40 ml per 15L knapsack at 14 day intervals.",
    safety: ["Store off the ground in a dry, ventilated warehouse"],
    ppe: ["Gloves"],
    phi: "None",
    usage: "High-nutrient liquid foliar fertilizer with micronutrients for rapid vegetative growth and yield boost.",
    articles: ["a4"],
  },
  {
    id: "p12",
    name: "Carotte Kuroda Seed (Griffaton 100g)",
    category: "Seeds",
    emoji: "🥕",
    image: "/products/carotte-kuroda.jpg",
    unitPrice: 3575,
    cartonPrice: 39000,
    cartonQty: 12,
    points: 36,
    stock: { Bamenda: 25, Yaounde: 18 },
    pests: ["Root pests"],
    crops: ["Tomatoes"],
    dosage: "3–4 kg/ha. Sow on finely tilled ridges.",
    safety: ["Treated seed — do not eat or feed to animals"],
    ppe: ["Gloves"],
    phi: "N/A",
    usage: "High yielding cylindrical carrot with deep orange core, excellent heat tolerance and sweet flavor.",
    articles: ["a2"],
  },
  {
    id: "p13",
    name: "Chou Baccara F1 Seed (Griffaton 5g)",
    category: "Seeds",
    emoji: "🥬",
    image: "/products/chou-baccara.jpg",
    unitPrice: 3697,
    cartonPrice: 40000,
    cartonQty: 12,
    points: 37,
    stock: { Bamenda: 22, Yaounde: 30 },
    pests: ["Caterpillars", "Blight"],
    crops: ["Tomatoes"],
    dosage: "Nursery 300g/ha. Transplant at 60 × 50 cm.",
    safety: ["Store in a cool dry seed bin"],
    ppe: ["Gloves"],
    phi: "N/A",
    usage: "Tropical hybrid cabbage producing firm, compact, heat and split-resistant round heads.",
    articles: ["a2"],
  },
  {
    id: "p14",
    name: "Oignon Violet de Galmi Seed (50g)",
    category: "Seeds",
    emoji: "🧅",
    image: "/products/oignon-violet-galmi.jpg",
    unitPrice: 8350,
    cartonPrice: 92000,
    cartonQty: 12,
    points: 84,
    stock: { Bamenda: 20, Yaounde: 25 },
    pests: ["Thrips"],
    crops: ["Tomatoes"],
    dosage: "4–5 kg/ha. Transplant at 40 days.",
    safety: ["Store in cool, dry conditions away from moisture"],
    ppe: ["Gloves"],
    phi: "N/A",
    usage: "Premier short-day purple onion variety with high market pungency and long storage shelf life.",
    articles: ["a2"],
  },
  {
    id: "p15",
    name: "Piment Jaune Africain Seed (50g)",
    category: "Seeds",
    emoji: "🌶️",
    image: "/products/piment-jaune.jpg",
    unitPrice: 14950,
    cartonPrice: 165000,
    cartonQty: 12,
    points: 150,
    stock: { Bamenda: 14, Yaounde: 10 },
    pests: ["Mites"],
    crops: ["Tomatoes"],
    dosage: "200–300 g/ha in nursery. Transplant after 5 weeks.",
    safety: ["Wash hands thoroughly after handling seed"],
    ppe: ["Gloves"],
    phi: "N/A",
    usage: "Strongly aromatic golden-yellow habanero pepper fetching premium market prices across Cameroon.",
    articles: ["a2"],
  },
  {
    id: "p16",
    name: "Inter Green Sprayer 16L Goizper",
    category: "Equipment",
    emoji: "🎒",
    image: "/products/inter-green-sprayer.jpg",
    unitPrice: 53662,
    cartonPrice: 290000,
    cartonQty: 6,
    points: 537,
    stock: { Bamenda: 18, Yaounde: 12 },
    pests: [],
    crops: [],
    dosage: "—",
    safety: ["Rinse with clean water 3 times after each use", "Inspect pressure valve periodically"],
    ppe: [],
    usage: "Heavy-duty Spanish Goizper knapsack sprayer with pressure regulator and ergonomic padded straps.",
    articles: ["a5"],
  },
  {
    id: "p17",
    name: "Cifarelli M1200 Motorized Atomizer",
    category: "Equipment",
    emoji: "⚙️",
    image: "/products/cifarelli-m1200.jpg",
    unitPrice: 447188,
    cartonPrice: 880000,
    cartonQty: 2,
    points: 4472,
    stock: { Bamenda: 4, Yaounde: 3 },
    pests: [],
    crops: [],
    dosage: "—",
    safety: ["Wear ear defenders, goggles and respirator", "Use 2-stroke oil at 50:1 mix"],
    ppe: ["Goggles", "Mask"],
    usage: "Professional 5HP mist blower for rapid treatment of mature cocoa canopies and large coffee farms.",
    articles: ["a5"],
  },
  {
    id: "p18",
    name: "Safety Wellington Gumboots (Heavy-Duty)",
    category: "Equipment",
    emoji: "🥾",
    image: "/products/safety-boots.jpg",
    unitPrice: 5963,
    cartonPrice: 55000,
    cartonQty: 10,
    points: 60,
    stock: { Bamenda: 50, Yaounde: 40 },
    pests: [],
    crops: [],
    dosage: "—",
    safety: ["Wash off chemical residue and soil after each farm shift"],
    ppe: [],
    usage: "Waterproof, steel-shank reinforced PVC gumboots for safe chemical spraying and muddy terrain.",
    articles: ["a5"],
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
    recommendedProductIds: ["p3", "p5", "p16"],
  },
  {
    id: "d2",
    name: "Fall Armyworm",
    crop: "Corn",
    symptoms: "Ragged holes in leaves, window-paning on young leaves, sawdust-like frass inside whorls, damaged cobs.",
    cause: "Spodoptera frugiperda larvae feeding aggressively inside the plant whorl.",
    prevention: "Early planting, frequent crop scouting (check 20 plants twice weekly), intercropping with legumes.",
    emoji: "🐛",
    recommendedProductIds: ["p2", "p8", "p16"],
  },
  {
    id: "d3",
    name: "Early & Late Blight",
    crop: "Tomatoes",
    symptoms: "Dark concentric leaf spots, stem lesions, white mold under leaves during damp mornings, sunken fruit rot.",
    cause: "Fungal pathogens (Phytophthora infestans & Alternaria solani) favoured by rainfall and poor airflow.",
    prevention: "Avoid overhead irrigation, stake plants 2 weeks after transplanting, crop rotation, preventive copper/systemic spray.",
    emoji: "🍅",
    recommendedProductIds: ["p4", "p6", "p10"],
  },
  {
    id: "d4",
    name: "Capsids & Mirids Damage",
    crop: "Cocoa",
    symptoms: "Black lesions on green shoots, pod deformation, dieback of branch tips (witches' broom effect).",
    cause: "Sucking insects (Sahlbergella singularis & Distantiella theobroma) piercing bark and young pods.",
    prevention: "Canopy shade management, spray targeted insecticide during August–September capsid peak.",
    emoji: "🪲",
    recommendedProductIds: ["p2", "p17", "p16"],
  },
  {
    id: "d5",
    name: "Coffee Leaf Rust",
    crop: "Coffee",
    symptoms: "Yellow-orange powdery spots on the underside of leaves causing premature leaf shedding and twig dieback.",
    cause: "Hemileia vastatrix fungus spread by wind and rain splashes.",
    prevention: "Prune shade trees for sunlight penetration, maintain tree vigor with organic bio-stimulants and copper sprays.",
    emoji: "☕",
    recommendedProductIds: ["p5", "p4", "p10"],
  },
  {
    id: "d6",
    name: "Cassava Mosaic Disease",
    crop: "Cassava",
    symptoms: "Mottling, distortion, and severe curling of leaves with stunted tuber growth.",
    cause: "Whitefly-transmitted geminivirus and infected planting stem cuttings.",
    prevention: "Use certified disease-resistant stem cuttings, control whitefly vectors, rogue and burn infected plants immediately.",
    emoji: "🌿",
    recommendedProductIds: ["p1", "p10"],
  },
  {
    id: "d7",
    name: "Nutrient Deficiency (Nitrogen/Potassium)",
    crop: "Corn",
    symptoms: "V-shaped yellowing along middle leaf vein, purple tints on stems, slow growth, poor grain filling.",
    cause: "Depleted soil fertility, heavy leaching from intense rains.",
    prevention: "Soil testing before planting, balanced basal NPK application, followed by foliar bio-stimulant boosters.",
    emoji: "🌾",
    recommendedProductIds: ["p11", "p10"],
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
    location: "Yaounde Agro Training Hub",
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
      "Spray a dual-action systemic fungicide like PLANTOMIL SUPER every 21 days from the first seasonal rains.",
      "Always wear protective gloves and avoid spraying when heavy rainfall is imminent.",
    ],
    recommendedProductIds: ["p3", "p5", "p16"],
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
      "Apply foliar MAWIN Biological Growth Regulator every 14 days to enhance flowering and fruit set.",
    ],
    recommendedProductIds: ["p4", "p6", "p10"],
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
      "Direct spray of CYPERPLANT 100EC directly down the throat of the whorl for rapid knockdown.",
    ],
    recommendedProductIds: ["p2", "p8", "p16"],
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
    recommendedProductIds: ["p11", "p10"],
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
    recommendedProductIds: ["p16", "p18"],
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
export interface Reward { id: string; name: string; filter: (typeof REWARD_FILTERS)[number]; emoji: string; image?: string; cost: number; }
export const REWARDS: Reward[] = [
  { id: "r1", name: "Chou Baccara F1 Cabbage Pack", filter: "Free Seeds", emoji: "🥬", image: "/products/chou-baccara.jpg", cost: 370 },
  { id: "r2", name: "Carotte Kuroda Seed Pack", filter: "Free Seeds", emoji: "🥕", image: "/products/carotte-kuroda.jpg", cost: 360 },
  { id: "r3", name: "Oignon Violet de Galmi Pack", filter: "Free Seeds", emoji: "🧅", image: "/products/oignon-violet-galmi.jpg", cost: 830 },
  { id: "r4", name: "Safety Wellington Gumboots", filter: "Sprayers & Tools", emoji: "🥾", image: "/products/safety-boots.jpg", cost: 600 },
  { id: "r5", name: "Inter Green Sprayer 16L Goizper", filter: "Sprayers & Tools", emoji: "🎒", image: "/products/inter-green-sprayer.jpg", cost: 5300 },
  { id: "r6", name: "Free Soil Test Voucher", filter: "Clinic Vouchers", emoji: "🧫", cost: 2000 },
  { id: "r7", name: "Agronomist On-Farm Visit Voucher", filter: "Clinic Vouchers", emoji: "👩🏾‍🌾", cost: 3500 },
  { id: "r8", name: "PLANTONUS Foliar Fertilizer (1L)", filter: "Fertilizer Bags", emoji: "🌾", image: "/products/plantonus-foliar.jpg", cost: 950 },
];

export const LAB_TESTS = [
  { id: "soil", name: "Comprehensive Soil Testing", price: 20000, desc: "Analyzes nitrogen, phosphorus, potassium, organic matter and pH level." },
  { id: "water", name: "Irrigation Water Testing", price: 20000, desc: "Tests electrical conductivity, salinity, and mineral balance." },
  { id: "tissue", name: "Plant Tissue & Leaf Analysis", price: 15000, desc: "Determines internal nutrient uptake and hidden deficiencies." },
  { id: "visit", name: "Agronomist On-Farm Visit", price: 35000, desc: "In-person field scouting, soil inspection, and tailored farm management plan." },
];

export const ADVICE: Record<string, string> = {
  Cocoa: "Symptoms indicate Black Pod (Phytophthora megakarya). Remove infected pods, prune chupons to open light, and spray PLANTOMIL SUPER or HYDROX SUPER every 21 days during rains.",
  Coffee: "Likely Coffee Leaf Rust. Apply HYDROX SUPER copper fungicide, boost vigor with MAWIN Biological Growth Regulator, and prune dead branches for canopy ventilation.",
  Corn: "Symptoms consistent with Fall Armyworm attack. Scout whorls in early morning; apply CYPERPLANT 100EC directly into whorls and nourish with NPK 20-10-10.",
  Cassava: "Indicators of Cassava Mosaic Disease. Uproot and burn diseased plants; control vector whiteflies with ACEPLANT 40EC and replant certified virus-free cuttings.",
  Tomatoes: "Classic symptoms of Tomato Late Blight. Stake plants to lift off soil, avoid overhead watering, and alternate CHLOROPLANT 720 SC with PLANTIZEB 80WP.",
  "Oil Palm": "Signs of Magnesium deficiency or weed competition. Apply PLANTOP 360SL for ring weeding, followed by balanced fertilizer and a soil/tissue clinic test.",
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
      { name: "NPK 20-10-10 Fertiliser (50kg)", qty: 2, price: 18000 },
      { name: "PLANTOMIL SUPER (50g)", qty: 10, price: 739 },
      { name: "ACEPLANT 40EC (1L)", qty: 1, price: 5068 },
    ],
    driver: { name: "Tanyi Bernard", phone: "+237 677 12 34 56", vehicle: "TVS Apache • NW 482 AB" },
    points: 48,
    payment: "MTN MoMo",
    address: "Ngwa Emmanuel Farm, Mile 4 Nkwen, Bamenda",
  },
  {
    id: "AH-24067",
    date: "2026-10-28",
    type: "POS Purchase",
    branch: "Bamenda",
    status: "Delivered",
    deliveryType: "in-town",
    fee: 0,
    deliveryOtp: "1194",
    points: 59,
    pointsAwarded: true,
    rating: 5,
    ratingTags: ["On time", "Polite rider", "Careful handling"],
    feedback: "Items arrived clean and fast to the farm gate.",
    payment: "Cash at counter",
    address: "Bamenda Central Agro Depot",
    items: [
      { name: "Inter Green Sprayer 16L Goizper", qty: 1, price: 53662 },
      { name: "Safety Wellington Gumboots (Heavy-Duty)", qty: 1, price: 5963 },
    ],
  },
  {
    id: "AH-23992",
    date: "2026-10-12",
    type: "Store Order",
    branch: "Yaounde",
    status: "Delivered",
    deliveryType: "out-of-town",
    fee: 3500,
    deliveryOtp: "7731",
    courierName: "Garantie Express Couriers",
    waybill: "GE-YDE-892144",
    points: 38,
    pointsAwarded: true,
    rating: 4,
    payment: "Orange Money",
    address: "Cooperative Warehouse, Mamfe Town",
    items: [
      { name: "MAWIN Biological Growth Regulator (1L)", qty: 2, price: 13118 },
      { name: "PLANTOP 360SL Herbicide (1L)", qty: 4, price: 2862 },
    ],
  },
];

export const LEDGER = [
  { date: "2026-11-06", label: "Store order AH-24118 (Pending Delivery)", pts: +48, kind: "Pending" },
  { date: "2026-10-30", label: "Redeemed Carotte Kuroda Seed Pack", pts: -360, kind: "Redeemed" },
  { date: "2026-10-28", label: "Delivered Order AH-24067", pts: +59, kind: "Earned" },
  { date: "2026-10-15", label: "Referral Commission credited (use on inputs)", pts: 0, kind: "Commission", amount: 64000 },
  { date: "2026-10-02", label: "Sign-up Welcome bonus", pts: +500, kind: "Earned" },
];

export const WHATSAPP_URL = "https://wa.me/237677001122?text=Hello%20Agro%20Hospital%20Agronomist%20Desk";
