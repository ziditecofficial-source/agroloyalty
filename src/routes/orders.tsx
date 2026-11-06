import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ORDER_STEPS,
  pts,
  xaf,
  type Order,
  type OrderStatus,
} from "@/lib/agro-data";
import { useAgro } from "@/lib/agro-store";
import { printDocument } from "@/lib/print-doc";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock,
  Download,
  HelpCircle,
  MapPin,
  MessageCircle,
  Motorcycle,
  Navigation,
  Phone,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
  User,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders & Live Deliveries — Agro Hospital PLC" },
      {
        name: "description",
        content: "Track live rider delivery map, waybill courier tracking, delivery OTP handover, and reorder inputs.",
      },
      { property: "og:title", content: "Agro Hospital Orders & Deliveries" },
      { property: "og:description", content: "Live delivery tracking, OTP verification, and input reordering." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: OrdersPage,
});

export function OrdersPage() {
  const { orders } = useAgro();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "past">("all");
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);

  const activeOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Received");
  const pastOrders = orders.filter((o) => o.status === "Delivered" || o.status === "Received");
  const displayedOrders = activeTab === "all" ? orders : activeTab === "active" ? activeOrders : pastOrders;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders & Deliveries</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Follow your agricultural inputs from warehouse dispatch to farm gate handover.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 rounded-2xl bg-muted/80 p-1 border border-border/60">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "all" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "active" ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Active ({activeOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("past")}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "past" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Past ({pastOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-3.5">
        {displayedOrders.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            onOpenTracking={() => setTrackingOrder(o)}
            onOpenRating={() => setRatingOrder(o)}
          />
        ))}

        {displayedOrders.length === 0 && (
          <div className="py-16 text-center text-xs text-muted-foreground">
            No orders found under this tab.
          </div>
        )}
      </div>

      {/* LIVE TRACKING MODAL (S42) */}
      <LiveTrackingModal
        order={trackingOrder}
        open={!!trackingOrder}
        onOpenChange={(v) => !v && setTrackingOrder(null)}
        onOpenRating={(o) => {
          setTrackingOrder(null);
          setRatingOrder(o);
        }}
      />

      {/* RATE DELIVERY MODAL (S43) */}
      <RateDeliveryModal
        order={ratingOrder}
        open={!!ratingOrder}
        onOpenChange={(v) => !v && setRatingOrder(null)}
      />
    </div>
  );
}

function OrderCard({
  order,
  onOpenTracking,
  onOpenRating,
}: {
  order: Order;
  onOpenTracking: () => void;
  onOpenRating: () => void;
}) {
  const { confirmReceipt, reorder, tier, openChatWithDept } = useAgro();
  const total = order.items.reduce((s, i) => s + i.qty * i.price, 0) + (order.fee || 0);

  const invoice = () =>
    printDocument(
      `Invoice ${order.id}`,
      `<h2>Agro Hospital PLC — Tax Invoice / Receipt</h2>
      <p><b>Order Ref:</b> ${order.id}<br/><b>Date:</b> ${order.date}<br/><b>Branch:</b> ${order.branch}<br/><b>Customer:</b> ${tier.customer} (${tier.name})<br/><b>Payment:</b> ${order.payment}</p>
      <hr/>
      <table><tr><th>Item Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
      ${order.items.map((i) => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${xaf(i.price)}</td><td>${xaf(i.qty * i.price)}</td></tr>`).join("")}
      </table>
      <p><b>Delivery Fee:</b> ${xaf(order.fee || 0)}</p>
      <h3><b>Total Paid:</b> ${xaf(total)}</h3>
      <p><i>Earned: ${pts(order.points || 0)} loyalty points</i></p>`
    );

  const isDelivered = order.status === "Delivered" || order.status === "Received";

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground">{order.id}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                isDelivered
                  ? "bg-secondary text-primary"
                  : order.status === "In Transit"
                  ? "bg-accent text-accent-foreground animate-pulse"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {order.date} • {order.branch} • {order.type}
          </p>
        </div>
        <p className="text-sm font-extrabold text-foreground">{xaf(total)}</p>
      </div>

      {/* Items List */}
      <div className="rounded-xl bg-muted/40 p-2.5 text-xs text-muted-foreground space-y-1">
        {order.items.map((i, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="text-foreground">
              {i.qty} × {i.name}
            </span>
            <span className="font-mono">{xaf(i.price * i.qty)}</span>
          </div>
        ))}
      </div>

      {/* Handover OTP card (Section 4.4 & 6.4) */}
      {!isDelivered && (
        <div className="flex items-center justify-between rounded-xl bg-secondary/60 p-3 border border-primary/20">
          <div>
            <p className="text-[10px] uppercase font-bold text-primary">Handover Delivery OTP</p>
            <p className="text-xs text-muted-foreground">Give this 4-digit code to rider upon inspection</p>
          </div>
          <span className="font-mono text-base font-extrabold tracking-widest text-primary bg-card px-3 py-1 rounded-lg border border-primary/30 shadow-xs">
            {order.deliveryOtp}
          </span>
        </div>
      )}

      {/* Rider / Courier status snapshot */}
      {order.status === "In Transit" && order.driver && (
        <div className="flex items-center justify-between rounded-xl bg-muted p-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-card text-primary shadow-xs">
              <Truck className="h-4 w-4" />
            </span>
            <div>
              <p className="font-bold text-foreground">{order.driver.name}</p>
              <p className="text-[10px] text-muted-foreground">{order.driver.vehicle}</p>
            </div>
          </div>
          <a
            href={`tel:${order.driver.phone}`}
            className="flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs"
          >
            <Phone className="h-3 w-3" /> Call Rider
          </a>
        </div>
      )}

      {/* Delivered rating preview */}
      {isDelivered && order.rating && (
        <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-2.5 text-xs">
          <div className="flex items-center gap-1 text-gold font-bold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < order.rating! ? "fill-gold text-gold" : "text-border"}`}
              />
            ))}
            <span className="ml-1 text-foreground text-[11px]">"{order.ratingTags?.join(", ") || "Great service"}"</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Rated</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={invoice}
          className="flex-1 rounded-xl border border-border bg-card py-2 text-xs font-semibold text-foreground hover:bg-muted transition flex items-center justify-center gap-1"
        >
          <Download className="h-3.5 w-3.5" /> Invoice
        </button>

        {!isDelivered ? (
          <button
            type="button"
            onClick={onOpenTracking}
            className="flex-1 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground shadow-soft hover:bg-primary/90 transition flex items-center justify-center gap-1"
          >
            <Navigation className="h-3.5 w-3.5" /> Track Live Map
          </button>
        ) : (
          <>
            {!order.rating && (
              <button
                type="button"
                onClick={onOpenRating}
                className="flex-1 rounded-xl bg-accent py-2 text-xs font-bold text-accent-foreground shadow-xs hover:bg-accent/80 transition flex items-center justify-center gap-1"
              >
                <Star className="h-3.5 w-3.5" /> Rate Delivery
              </button>
            )}
            <button
              type="button"
              onClick={() => reorder(order)}
              className="flex-1 rounded-xl bg-secondary py-2 text-xs font-bold text-primary border border-primary/20 hover:bg-secondary/80 transition flex items-center justify-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> 1-Tap Reorder
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LiveTrackingModal({
  order,
  open,
  onOpenChange,
  onOpenRating,
}: {
  order: Order | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onOpenRating: (o: Order) => void;
}) {
  const { advance, confirmReceipt } = useAgro();
  if (!order) return null;

  const isInTown = order.deliveryType === "in-town";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl bg-card border-none shadow-card max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="bg-hero p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground uppercase">
                {order.status}
              </span>
              <h2 className="mt-1 text-base font-bold">Delivery Tracking • {order.id}</h2>
            </div>
            <span className="text-xs text-white/80 font-mono font-bold">OTP: {order.deliveryOtp}</span>
          </div>
          <p className="mt-2 text-xs text-white/80">Destination: {order.address}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Section 4.4: In-town Live Rider Map Simulation */}
          {isInTown ? (
            <div className="relative h-44 w-full rounded-2xl bg-secondary/50 border border-border overflow-hidden flex flex-col justify-between p-3">
              {/* Simulated Map SVG Background */}
              <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 400 200" fill="none">
                <path d="M20 50 Q120 20 200 90 T380 140" stroke="#1B4D2E" strokeWidth="6" strokeDasharray="6 6" />
                <path d="M40 180 Q160 140 240 60 T360 40" stroke="#2F7D45" strokeWidth="4" />
                <circle cx="200" cy="90" r="14" fill="#8DC63F" fillOpacity="0.4" />
              </svg>

              <div className="relative z-10 flex items-center justify-between">
                <span className="rounded-lg bg-card/90 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-primary shadow-xs">
                  Estimated Arrival: 18 mins
                </span>
                <span className="rounded-lg bg-card/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-foreground">
                  In-Town Delivery
                </span>
              </div>

              {/* Rider Pin */}
              <div className="relative z-10 flex items-center gap-2 self-center bg-card px-3 py-1.5 rounded-full shadow-card border border-primary/20">
                <span className="h-2 w-2 rounded-full bg-leaf animate-ping" />
                <span className="font-bold text-xs text-primary flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" /> Rider Tanyi Bernard
                </span>
              </div>

              <div className="relative z-10 flex justify-between items-center text-[10px] text-muted-foreground bg-card/85 backdrop-blur p-2 rounded-xl">
                <span>📍 Dispatch: {order.branch} Warehouse</span>
                <span>🏁 Farm Gate: Widikum</span>
              </div>
            </div>
          ) : (
            /* Out-of-town Courier Details */
            <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-primary" /> {order.courierName || "Regional Logistics"}
                </span>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                  Waybill
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-primary">
                Tracking #: {order.waybill || "GE-892110"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Dispatched via inter-city logistics van. Depot scan completed at central sorting hub.
              </p>
            </div>
          )}

          {/* Section 4.4: Milestone Timeline */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">Delivery Milestones</h4>
            <div className="space-y-2.5 pl-2 border-l-2 border-primary/30">
              {[
                { title: "Order Confirmed & Payment Verified", time: "09:30 AM", done: true },
                { title: "Inputs Packed & Sealed at Warehouse", time: "10:15 AM", done: true },
                {
                  title: isInTown ? "Rider Assigned & Dispatched" : "Handed over to Courier Service",
                  time: "10:45 AM",
                  done: order.status === "In Transit" || order.status === "Delivered",
                },
                {
                  title: "En Route to Farm Location",
                  time: "11:15 AM",
                  done: order.status === "In Transit" || order.status === "Delivered",
                },
                {
                  title: "Inspected, Delivery OTP Verified & Handed Over",
                  time: order.status === "Delivered" ? "Delivered" : "Pending",
                  done: order.status === "Delivered",
                },
              ].map((m, idx) => (
                <div key={idx} className="relative pl-4">
                  <span
                    className={`absolute -left-[13px] top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                      m.done ? "bg-primary text-white" : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {m.done ? "✓" : idx + 1}
                  </span>
                  <p className={`font-semibold ${m.done ? "text-foreground" : "text-muted-foreground"}`}>{m.title}</p>
                  <span className="text-[10px] text-muted-foreground">{m.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t bg-card space-y-2">
          {order.status !== "Delivered" ? (
            <button
              type="button"
              onClick={() => {
                confirmReceipt(order.id);
                onOpenRating(order);
              }}
              className="w-full rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-soft hover:bg-primary/90 transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" /> Confirm Inspection & Receipt
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-2xl bg-secondary py-3 text-xs font-bold text-primary"
            >
              Close
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RateDeliveryModal({
  order,
  open,
  onOpenChange,
}: {
  order: Order | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { rateOrder } = useAgro();
  const [stars, setStars] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(["On time", "Careful handling"]);
  const [feedback, setFeedback] = useState("");

  if (!order) return null;

  const TAGS = ["On time", "Careful handling", "Polite rider", "Clean packages", "Clear directions"];

  const toggleTag = (t: string) => {
    setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateOrder(order.id, stars, selectedTags, feedback);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-card border-none shadow-card text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
          <Star className="h-7 w-7 fill-gold" />
        </div>
        <h3 className="text-base font-bold text-foreground">Rate Your Delivery Experience</h3>
        <p className="mt-1 text-xs text-muted-foreground">Order {order.id} • Helps improve rider service</p>

        {/* Stars */}
        <div className="mt-4 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStars(s)}
              className="p-1 text-2xl transition hover:scale-110"
            >
              <Star
                className={`h-7 w-7 ${s <= stars ? "fill-gold text-gold" : "text-border"}`}
              />
            </button>
          ))}
        </div>

        {/* Quick Tags */}
        <div className="mt-4">
          <p className="text-[11px] font-semibold text-muted-foreground mb-2">Select quick feedback tags:</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {TAGS.map((t) => {
              const active = selectedTags.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold border transition ${
                    active ? "bg-secondary text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {active ? "✓ " : ""}{t}
                </button>
              );
            })}
          </div>
        </div>

        <textarea
          rows={2}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Optional comment about packaging, rider courtesy, or delivery route..."
          className="mt-4 w-full rounded-xl border bg-muted p-3 text-xs outline-none focus:border-primary focus:bg-background"
        />

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-2xl border border-border py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-2xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-soft"
          >
            Submit Feedback
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
