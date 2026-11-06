import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarCheck,
  ChevronRight,
  CloudRain,
  PhoneCall,
  ShoppingBag,
  ShoppingBasket,
  Sparkles,
  Truck,
} from "lucide-react";
import { LoyaltyCard } from "@/components/agro/LoyaltyCard";
import { SectionTitle } from "@/components/agro/AppShell";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PRODUCTS, WEATHER, pts, xaf } from "@/lib/agro-data";
import { useAgro } from "@/lib/agro-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home & Farm Dashboard — Agro Hospital PLC" },
      {
        name: "description",
        content: "Agro Hospital digital loyalty card, active order delivery tracking, weather advisory, and input store.",
      },
      { property: "og:title", content: "Agro Hospital PLC — Farmer Portal" },
      { property: "og:description", content: "Loyalty rewards, inputs, crop doctor and delivery tracking for Cameroonian farmers." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

function Home() {
  const { tier, points, productCredit, activeOrder } = useAgro();
  const [weatherDetailOpen, setWeatherDetailOpen] = useState(false);
  const featured = PRODUCTS.slice(0, 4);
  const pct = tier.target ? (tier.sales / tier.target) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* 1. DIGITAL LOYALTY CARD (Up before weather update) */}
      <div className="pt-1">
        <LoyaltyCard />
      </div>

      {/* 2. ACTIVE ORDER TRACKER CARD (if an order is currently active) */}
      {activeOrder && (
        <div className="clay-card p-4 border border-primary/25 bg-gradient-to-br from-white via-secondary/20 to-secondary/40 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
                <Truck className="h-5 w-5 animate-pulse" />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-accent/80 px-2 py-0.5 text-[9px] font-extrabold text-accent-foreground uppercase tracking-wider">
                    {activeOrder.status}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-muted-foreground">
                    #{activeOrder.id}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-foreground mt-0.5">
                  {activeOrder.items[0]?.name}
                </h3>
              </div>
            </div>

            <Link
              to="/orders"
              className="clay-btn-primary rounded-xl px-3.5 py-1.5 text-xs font-bold flex items-center gap-1"
            >
              Track Live
            </Link>
          </div>

          <div className="mt-3.5 space-y-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Delivery Status</span>
              <span className="font-mono font-bold text-primary">
                Handover OTP: <b>{activeOrder.deliveryOtp}</b>
              </span>
            </div>
            <Progress value={activeOrder.status === "In Transit" ? 75 : 40} className="h-2 rounded-full" />
          </div>

          {activeOrder.driver && (
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-2.5">
              <span>
                Rider: <b className="text-foreground">{activeOrder.driver.name}</b> ({activeOrder.driver.vehicle})
              </span>
              <a
                href={`tel:${activeOrder.driver.phone}`}
                className="text-primary font-bold flex items-center gap-1 hover:underline"
              >
                <PhoneCall className="h-3 w-3" /> Call
              </a>
            </div>
          )}
        </div>
      )}

      {/* 3. WEATHER UPDATE CARD (Glass + 20% Claymorphism) */}
      <div
        onClick={() => setWeatherDetailOpen(true)}
        className="clay-card clay-card-hover p-4 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/80 text-2xl shadow-xs">
              🌧️
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">{WEATHER.place}</span>
                <span className="text-[10px] text-muted-foreground">• {WEATHER.cond}</span>
              </div>
              <p className="text-sm font-extrabold text-primary">
                {WEATHER.temp}°C <span className="text-xs font-medium text-muted-foreground">/ 70% Rain Risk</span>
              </p>
            </div>
          </div>
          <span className="clay-pill rounded-full bg-secondary/70 px-2.5 py-1 text-[11px] font-bold text-primary flex items-center gap-0.5">
            7-Day <ChevronRight className="h-3 w-3" />
          </span>
        </div>
        <p className="mt-2.5 text-[11px] text-muted-foreground bg-secondary/40 p-2.5 rounded-xl border border-primary/10 leading-relaxed">
          💡 <b>Field Advisory:</b> {WEATHER.forecast}
        </p>
      </div>

      {/* 4. QUICK ACTIONS: Order Inputs, AI Doctor, Book Expert (Live Chat removed) */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <Link
          to="/store"
          className="clay-card clay-card-hover flex flex-col items-center gap-2 p-3.5 text-center group"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary group-hover:scale-105 transition shadow-xs">
            <ShoppingBasket className="h-5 w-5" />
          </span>
          <span className="text-xs font-bold text-foreground leading-tight">Order Inputs</span>
        </Link>

        <Link
          to="/clinic"
          className="clay-card clay-card-hover flex flex-col items-center gap-2 p-3.5 text-center group"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/40 text-accent-foreground group-hover:scale-105 transition shadow-xs">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-xs font-bold text-foreground leading-tight">AI Doctor</span>
        </Link>

        <Link
          to="/clinic"
          className="clay-card clay-card-hover flex flex-col items-center gap-2 p-3.5 text-center group"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/20 text-gold-foreground group-hover:scale-105 transition shadow-xs">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <span className="text-xs font-bold text-foreground leading-tight">Book Expert</span>
        </Link>
      </div>

      {/* 5. WALLET & REWARDS BALANCES (20% Claymorphism) */}
      <div className="clay-card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Farm Wallet</p>
          <Link to="/profile" className="text-xs font-bold text-primary hover:underline">
            View Ledger
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary/50 p-3.5 border border-primary/15 shadow-xs">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Loyalty Points</p>
            <p className="text-xl font-extrabold text-primary mt-0.5">{pts(points)}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Worth {xaf(points * 10)}</p>
          </div>
          <div className="rounded-2xl bg-gold/10 p-3.5 border border-gold/25 shadow-xs">
            <p className="text-[10px] text-gold-foreground uppercase font-bold tracking-wider">Referral Credit</p>
            <p className="text-xl font-extrabold text-gold mt-0.5">{xaf(productCredit)}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Usable on products</p>
          </div>
        </div>
      </div>

      {/* Commission & Cashback Progress for Resellers / Coops */}
      {tier.hasCommission && (
        <div className="clay-card p-4">
          <div className="flex items-center justify-between text-sm">
            <p className="font-bold text-foreground">Commercial Volume Rebate</p>
            <span className="rounded-full bg-accent/80 px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground">
              {tier.rebate}
            </span>
          </div>
          <Progress value={pct} className="mt-3 h-2 rounded-full" />
          <p className="mt-2 text-xs text-muted-foreground">
            <b className="text-foreground">
              {(tier.sales / 1e6).toFixed(1)}M / {(tier.target / 1e6).toFixed(0)}M XAF
            </b>{" "}
            to next bonus tier • Earned this month: <b className="text-primary">{xaf(tier.commission)}</b>
          </p>
        </div>
      )}

      {/* Featured Inputs Grid */}
      <div>
        <SectionTitle action={<Link to="/store" className="text-xs font-bold text-primary hover:underline">View all catalogue</Link>}>
          Seasonal Inputs
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              to="/store"
              className="clay-card clay-card-hover p-3.5 flex flex-col justify-between group"
            >
              <div className="flex h-20 items-center justify-center rounded-xl bg-secondary/60 text-4xl group-hover:scale-105 transition shadow-xs">
                {p.emoji}
              </div>
              <div className="mt-2.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{p.category}</span>
                <p className="text-xs font-bold text-foreground truncate mt-0.5 group-hover:text-primary transition">{p.name}</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <p className="text-xs font-extrabold text-foreground">{xaf(p.unitPrice)}</p>
                  <span className="text-[10px] text-primary font-bold">+{pts(p.points)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Field Tip Card linking to Learn */}
      <div className="clay-card p-4">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl shadow-xs">
            🍫
          </span>
          <div className="flex-1 min-w-0">
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
              Today's Field Tip
            </span>
            <h4 className="mt-1 text-xs font-bold text-foreground">Beating black pod in the rainy season</h4>
            <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              Remove and bury infected pods weekly to break the sporulation cycle before spraying Ridomil Gold.
            </p>
            <Link to="/learn" className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
              Read in Learn Hub <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Weather Detail Dialog */}
      <Dialog open={weatherDetailOpen} onOpenChange={setWeatherDetailOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-card border-none shadow-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <CloudRain className="h-5 w-5 text-primary" /> {WEATHER.place} 7-Day Forecast
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-secondary/60 p-3 text-xs text-secondary-foreground leading-relaxed border border-primary/15">
              <b>Farming Weather Advisory:</b> {WEATHER.forecast}
            </div>

            <div className="space-y-2">
              {WEATHER.days.map((d, idx) => (
                <div key={idx} className="clay-card p-2.5 flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground w-16">{d.d}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{d.e}</span>
                    <span className="text-muted-foreground">{d.desc}</span>
                  </div>
                  <span className="font-bold font-mono text-primary">{d.t}°C</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
