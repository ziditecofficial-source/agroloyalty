import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  COUPONS,
  NOTIFICATIONS,
  POINT_VALUE_FCFA,
  PRODUCTS,
  SEED_ORDERS,
  TIERS,
  WORKSHOPS,
  pts,
  xaf,
  type Branch,
  type Coupon,
  type NotificationItem,
  type Order,
  type OrderStatus,
  type Product,
  type TierId,
  type Workshop,
} from "./agro-data";
import { tr, type Lang } from "./i18n";

export interface CartItem {
  product: Product;
  mode: "unit" | "carton";
  qty: number;
}

export interface Profile {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  gender: string;
  dob: string;
  idNumber: string;
  businessName: string;
  taxId: string;
  location: string;
  region: string;
  gps: string;
  farmSize: string;
  crops: string[];
  livestock: string;
  preferredBranch: string;
  payout: string;
  payoutNumber: string;
  language: Lang;
  notifyOrders: boolean;
  notifyPromos: boolean;
  notifyAdvisory: boolean;
  smsAlerts: boolean;
  biometric: boolean;
  accountType: "Farmer" | "Cooperative" | "Walk-in";
}

export interface Voucher {
  code: string;
  reward: string;
  pickup: "store" | "delivery";
}

export interface Referral {
  name: string;
  date: string;
  orders: number;
  commission: number;
  status: "Active" | "Pending" | "Flagged";
}

export interface ChatMsg {
  id: string;
  from: "me" | "agent";
  text: string;
  dept: string;
  time: string;
  queued?: boolean;
  attachment?: string;
}

export interface Consultation {
  id: string;
  service: string;
  agronomist: string;
  date: string;
  slot: string;
  topic: string;
  mode: "Phone" | "Farm visit" | "Video";
  status: "Upcoming" | "Completed" | "Cancelled";
  reminders: boolean;
  notes?: string;
}

export interface DiagnosisResult {
  id: string;
  crop: string;
  issue: string;
  confidence: "High" | "Possible";
  confidencePct: number;
  photoUrl?: string;
  explanation: string;
  prevention: string;
  recommendedProductIds: string[];
  date: string;
}

export type PayMethod = "MTN MoMo" | "Orange Money" | "Card";

interface Ctx {
  t: (s: string) => string;
  signedIn: boolean;
  signIn: (p: Partial<Profile>, referral?: string) => void;
  signOut: () => void;
  tierId: TierId;
  setTierId: (t: TierId) => void;
  tier: (typeof TIERS)[number];
  points: number;
  productCredit: number;
  branch: Branch;
  setBranch: (b: Branch) => void;
  cart: CartItem[];
  addToCart: (p: Product, mode: "unit" | "carton", qty?: number) => void;
  removeFromCart: (i: number) => void;
  setQty: (i: number, q: number) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  deliveryZone: "in-town" | "out-of-town";
  setDeliveryZone: (z: "in-town" | "out-of-town") => void;
  chemicalSafetyAcknowledged: boolean;
  setChemicalSafetyAcknowledged: (v: boolean) => void;
  pay: (method: PayMethod, useCredit: boolean) => Promise<string | null>;
  reorder: (o: Order) => void;
  redeem: (name: string, cost: number, pickup?: "store" | "delivery") => Voucher | null;
  orders: Order[];
  activeOrder: Order | undefined;
  advance: (id: string) => void;
  confirmReceipt: (id: string) => void;
  rateOrder: (id: string, r: number, tags: string[], fb: string) => void;
  vouchers: Voucher[];
  referralCode: string;
  referrals: Referral[];
  messages: ChatMsg[];
  sendMessage: (text: string, dept: string, attachment?: string) => void;
  consultations: Consultation[];
  book: (c: Omit<Consultation, "id" | "status">) => void;
  toggleReminder: (id: string) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  workshops: Workshop[];
  registeredWorkshops: string[];
  registerWorkshop: (id: string) => void;
  diagnoses: DiagnosisResult[];
  saveDiagnosis: (d: DiagnosisResult) => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  openChatWithDept: (dept: string, attachmentContext?: string) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (v: boolean) => void;
}

const AgroCtx = createContext<Ctx | null>(null);
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function AgroProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(true);
  const [tierId, setTierIdRaw] = useState<TierId>("seed");
  const tier = TIERS.find((x) => x.id === tierId) ?? TIERS[0];
  const [pointsByTier, setPointsByTier] = useState<Record<string, number>>(() =>
    Object.fromEntries(TIERS.map((x) => [x.id, x.points]))
  );
  const [productCredit, setCredit] = useState(12500); // Only redeemable on products (Section 6.2)
  const [branch, setBranch] = useState<Branch>("Bamenda");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [deliveryZone, setDeliveryZone] = useState<"in-town" | "out-of-town">("in-town");
  const [chemicalSafetyAcknowledged, setChemicalSafetyAcknowledged] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatAttachment, setChatAttachment] = useState<string | undefined>();
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [workshops] = useState<Workshop[]>(WORKSHOPS);
  const [registeredWorkshops, setRegisteredWorkshops] = useState<string[]>(["w1"]);

  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([
    {
      id: "diag-1",
      crop: "Cocoa",
      issue: "Black Pod Disease (Phytophthora megakarya)",
      confidence: "High",
      confidencePct: 94,
      explanation: "Water-soaked lesions expanding rapidly on cocoa pod surface with typical white sporulation.",
      prevention: "Improve canopy shade ventilation, remove and bury infected pods, apply PLANTOMIL SUPER and copper fungicide.",
      recommendedProductIds: ["p3", "p5", "p16"],
      date: "2026-11-04",
    },
  ]);

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "m0",
      from: "agent",
      text: "Hello Ngwa! Welcome to Agro Hospital Customer Support. How can our agronomists assist your farm today?",
      dept: "Crop protection & inputs",
      time: "08:00",
    },
  ]);

  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: "k1",
      service: "Plant Clinic Visit",
      agronomist: "Dr. Fon Mirabel",
      date: "2026-10-12",
      slot: "10:00",
      topic: "Cocoa black pod management & pruning",
      mode: "Farm visit",
      status: "Completed",
      reminders: false,
      notes: "Canopy is dense on southern slope. Advised thinning shade trees and 21-day spray schedule with Ridomil Gold.",
    },
    {
      id: "k2",
      service: "Agronomist Consultation",
      agronomist: "Eng. Tabe Godlove",
      date: "2026-11-10",
      slot: "14:00",
      topic: "Maize fertiliser schedule & armyworm control",
      mode: "Phone",
      status: "Upcoming",
      reminders: true,
    },
  ]);

  const referrals: Referral[] = [
    { name: "Achu Pascal", date: "2026-09-20", orders: 3, commission: 6800, status: "Active" },
    { name: "Bih Comfort", date: "2026-10-14", orders: 1, commission: 2100, status: "Active" },
    { name: "Mbah Joseph", date: "2026-11-01", orders: 0, commission: 0, status: "Pending" },
  ];

  const [profile, setProfile] = useState<Profile>({
    fullName: "Ngwa Emmanuel",
    email: "ngwa.emmanuel@example.cm",
    phone: "+237 677 00 11 22",
    whatsapp: "+237 677 00 11 22",
    gender: "Male",
    dob: "1984-03-12",
    idNumber: "CNI 112233445",
    businessName: "Ngwa Mixed Crops Farm",
    taxId: "M05261899014T",
    location: "Widikum, Momo",
    region: "North West",
    gps: "5.8712, 9.7653",
    farmSize: "4.5",
    crops: ["Cocoa", "Corn"],
    livestock: "Poultry (200 birds)",
    preferredBranch: "Bamenda",
    payout: "MTN Mobile Money",
    payoutNumber: "+237 677 00 11 22",
    language: "English",
    notifyOrders: true,
    notifyPromos: true,
    notifyAdvisory: true,
    smsAlerts: false,
    biometric: true,
    accountType: "Farmer",
  });

  const pendingRef = useRef<string | null>(null);
  const points = pointsByTier[tierId] ?? 0;
  const addPoints = useCallback(
    (n: number) => setPointsByTier((s) => ({ ...s, [tierId]: (s[tierId] ?? 0) + n })),
    [tierId]
  );
  const t = useCallback((s: string) => tr(profile.language, s), [profile.language]);

  const activeOrder = orders.find((o) => o.status === "In Transit" || o.status === "Confirmed" || o.status === "Packed" || o.status === "Dispatched");
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const setStatus = (id: string, status: OrderStatus) =>
    setOrders((list) =>
      list.map((o) => {
        if (o.id !== id) return o;
        const delivered = status === "Delivered" || status === "Received";
        if (delivered && !o.pointsAwarded && o.points) {
          addPoints(o.points);
          toast.success(`+${pts(o.points)} earned`, { description: `Order ${id} delivered successfully` });
          return { ...o, status, pointsAwarded: true };
        }
        return { ...o, status };
      })
    );

  const applyCoupon = useCallback(
    (code: string) => {
      const found = COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
      if (!found) {
        toast.error("Invalid coupon code", { description: "Please verify the promo code and try again." });
        return false;
      }
      setAppliedCoupon(found);
      toast.success(`Coupon ${found.code} applied!`, { description: found.description });
      return true;
    },
    []
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    toast("Coupon removed");
  }, []);

  const openChatWithDept = useCallback((dept: string, attachmentContext?: string) => {
    setChatAttachment(attachmentContext);
    setChatOpen(true);
    if (attachmentContext) {
      toast("Chat opened with product/order context", { description: attachmentContext });
    }
  }, []);

  const registerWorkshop = useCallback((id: string) => {
    if (registeredWorkshops.includes(id)) {
      toast("Already registered for this workshop");
      return;
    }
    setRegisteredWorkshops((prev) => [...prev, id]);
    toast.success("Registration confirmed!", { description: "We will send an SMS reminder 24h prior to the session." });
  }, [registeredWorkshops]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const saveDiagnosis = useCallback((d: DiagnosisResult) => {
    setDiagnoses((prev) => [d, ...prev]);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      t,
      signedIn,
      tierId,
      tier,
      points,
      productCredit,
      branch,
      setBranch,
      cart,
      orders,
      activeOrder,
      vouchers,
      profile,
      setProfile,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      deliveryZone,
      setDeliveryZone,
      chemicalSafetyAcknowledged,
      setChemicalSafetyAcknowledged,
      referralCode: `AGRO-${profile.fullName.split(" ")[0]!.toUpperCase().slice(0, 4)}-${profile.phone.replace(/\D/g, "").slice(-3)}`,
      referrals,
      messages,
      consultations,
      notifications,
      unreadNotificationsCount,
      markNotificationRead,
      workshops,
      registeredWorkshops,
      registerWorkshop,
      diagnoses,
      saveDiagnosis,
      chatOpen,
      setChatOpen,
      openChatWithDept,
      onboardingOpen,
      setOnboardingOpen,
      signIn: (p, referral) => {
        setProfile((cur) => ({ ...cur, ...p }));
        setSignedIn(true);
        toast.success("Welcome to Agro Hospital!", {
          description: referral ? `Referral code ${referral} applied — 500 bonus points credited` : "Account ready",
        });
        if (referral) addPoints(500);
      },
      signOut: () => {
        setSignedIn(false);
        toast("Signed out");
      },
      setTierId: (x) => {
        setTierIdRaw(x);
        toast.success(`Previewing ${TIERS.find((y) => y.id === x)!.name}`);
      },
      addToCart: (p, mode, qty = 1) => {
        setCart((c) => {
          const existing = c.find((item) => item.product.id === p.id && item.mode === mode);
          if (existing) {
            return c.map((item) => (item === existing ? { ...item, qty: item.qty + qty } : item));
          }
          return [...c, { product: p, mode, qty }];
        });
        pendingRef.current = null;
        toast.success("Added to cart", { description: `${p.name} (Earn ${pts(p.points * qty)})` });
      },
      removeFromCart: (i) => {
        setCart((c) => c.filter((_, j) => j !== i));
        pendingRef.current = null;
      },
      setQty: (i, q) => {
        setCart((c) => c.map((x, j) => (j === i ? { ...x, qty: Math.max(1, q) } : x)));
        pendingRef.current = null;
      },
      pay: async (method, useCredit) => {
        if (!cart.length) return null;
        const ref = pendingRef.current ?? `AH-${24200 + orders.length}`;
        pendingRef.current = ref;

        // Base subtotal
        const subtotal = cart.reduce(
          (s, c) => s + (c.mode === "unit" ? c.product.unitPrice : c.product.cartonPrice) * c.qty,
          0
        );
        // Coupon discount
        let discount = 0;
        if (appliedCoupon) {
          discount = appliedCoupon.discountType === "percentage" ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value;
        }
        const deliveryFee = deliveryZone === "in-town" ? 1500 : 3500;
        const netOrder = Math.max(0, subtotal - discount) + deliveryFee;

        // Credit deduction (non-cashoutable, strictly reducing product payment)
        const creditUsed = useCredit ? Math.min(productCredit, netOrder) : 0;
        const earnedPoints = cart.reduce(
          (s, c) => s + c.product.points * c.qty * (c.mode === "carton" ? c.product.cartonQty : 1),
          0
        );

        // Simulation delay for MoMo / Card callback
        await new Promise((r) => setTimeout(r, 1800));
        if (orders.some((o) => o.id === ref)) return ref;

        const newOrder: Order = {
          id: ref,
          date: new Date().toISOString().slice(0, 10),
          type: "Store Order",
          branch,
          status: "In Transit",
          deliveryType: deliveryZone,
          fee: deliveryFee,
          deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
          driver:
            deliveryZone === "in-town"
              ? { name: "Tanyi Bernard", phone: "+237 677 12 34 56", vehicle: "TVS Apache • NW 482 AB" }
              : undefined,
          courierName: deliveryZone === "out-of-town" ? "Garantie Express Couriers" : undefined,
          waybill: deliveryZone === "out-of-town" ? `GE-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
          points: earnedPoints,
          payment: method,
          address: `${profile.fullName} Farm, ${profile.location}`,
          items: cart.map((c) => ({
            name: `${c.product.name}${c.mode === "carton" ? ` (Carton ×${c.product.cartonQty})` : ""}`,
            qty: c.qty,
            price: c.mode === "unit" ? c.product.unitPrice : c.product.cartonPrice,
          })),
        };

        setOrders((o) => [newOrder, ...o]);
        if (creditUsed > 0) setCredit((c) => c - creditUsed);
        setCart([]);
        setAppliedCoupon(null);
        pendingRef.current = null;

        toast.success(`Payment confirmed! Order ${ref}`, {
          description: `${pts(earnedPoints)} will be credited upon delivery inspection. Delivery OTP: ${newOrder.deliveryOtp}`,
        });
        return ref;
      },
      reorder: (o) => {
        setCart(
          o.items
            .map((i) => {
              const base = i.name.replace(/ \(Carton ×\d+\)$/, "");
              const product = PRODUCTS.find((p) => p.name === base);
              return product
                ? {
                    product,
                    mode: i.name.includes("Carton") ? ("carton" as const) : ("unit" as const),
                    qty: i.qty,
                  }
                : null;
            })
            .filter(Boolean) as CartItem[]
        );
        toast.success("Items added to cart", { description: `From Order ${o.id}` });
      },
      redeem: (name, cost, pickup = "store") => {
        if (points < cost) {
          toast.error("Insufficient points", { description: `You need ${pts(cost - points)} more points.` });
          return null;
        }
        addPoints(-cost);
        const v: Voucher = {
          code: `AGR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          reward: name,
          pickup,
        };
        setVouchers((vs) => [v, ...vs]);
        toast.success("Reward voucher issued!", {
          description: `${name} • Voucher code: ${v.code} (${xaf(cost * POINT_VALUE_FCFA)} value)`,
        });
        return v;
      },
      advance: (id) => {
        const o = orders.find((x) => x.id === id);
        if (!o) return;
        const nextMap: Record<OrderStatus, OrderStatus> = {
          Confirmed: "Packed",
          Packed: "Dispatched",
          Dispatched: "In Transit",
          "In Transit": "Delivered",
          Delivered: "Received",
          Received: "Received",
        };
        const next = nextMap[o.status] || "Delivered";
        setStatus(id, next);
      },
      confirmReceipt: (id) => {
        setStatus(id, "Delivered");
        toast.success("Delivery confirmed", { description: `Order ${id} completed.` });
      },
      rateOrder: (id, r, tags, fb) => {
        setOrders((l) =>
          l.map((o) => (o.id === id ? { ...o, rating: r, ratingTags: tags, feedback: fb } : o))
        );
        toast.success("Thank you for rating your delivery!");
      },
      sendMessage: (text, dept, attachment) => {
        const offline = typeof navigator !== "undefined" && !navigator.onLine;
        const id = `m${Date.now()}`;
        setMessages((m) => [
          ...m,
          { id, from: "me", text, dept, time: now(), queued: offline, attachment: attachment || chatAttachment },
        ]);
        if (offline) {
          toast("Message queued offline", { description: "It will send automatically when you reconnect." });
          return;
        }
        setTimeout(() => {
          setMessages((m) => [
            ...m,
            {
              id: id + "r",
              from: "agent",
              dept,
              time: now(),
              text: `Hello ${profile.fullName}! An agronomist from ${dept} is reviewing your message and will answer right away.`,
            },
          ]);
        }, 1200);
      },
      book: (c) => {
        setConsultations((l) => [{ ...c, id: `k${Date.now()}`, status: "Upcoming" }, ...l]);
        toast.success("Consultation confirmed", {
          description: `${c.service} with ${c.agronomist} on ${c.date} at ${c.slot}. Reminder scheduled.`,
        });
      },
      toggleReminder: (id) =>
        setConsultations((l) => l.map((c) => (c.id === id ? { ...c, reminders: !c.reminders } : c))),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      t,
      signedIn,
      tierId,
      tier,
      points,
      productCredit,
      branch,
      cart,
      orders,
      activeOrder,
      vouchers,
      profile,
      appliedCoupon,
      deliveryZone,
      chemicalSafetyAcknowledged,
      messages,
      consultations,
      notifications,
      unreadNotificationsCount,
      workshops,
      registeredWorkshops,
      diagnoses,
      chatOpen,
      chatAttachment,
      onboardingOpen,
      addPoints,
    ]
  );

  return <AgroCtx.Provider value={value}>{children}</AgroCtx.Provider>;
}

export function useAgro() {
  const c = useContext(AgroCtx);
  if (!c) throw new Error("useAgro must be used within an AgroProvider");
  return c;
}
