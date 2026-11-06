import { createFileRoute } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { POINT_VALUE_FCFA, REWARDS, REWARD_FILTERS, pts, xaf, type Reward } from "@/lib/agro-data";
import { useAgro, type Voucher } from "@/lib/agro-store";

export const Route = createFileRoute("/redeem")({
  head: () => ({
    meta: [
      { title: "AgroRewards — Agro Hospital PLC" },
      { name: "description", content: "Spend loyalty points on free seeds, sprayers, clinic vouchers and fertilizer bags." },
      { property: "og:title", content: "AgroRewards Points Store" },
      { property: "og:description", content: "Claim farm rewards with your Agro Hospital loyalty points." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RedeemPage,
});

function RedeemPage() {
  const { points, redeem, vouchers } = useAgro();
  const [filter, setFilter] = useState<string>("All Rewards");
  const [pending, setPending] = useState<Reward | null>(null);
  const [claimed, setClaimed] = useState<Voucher | null>(null);
  const list = REWARDS.filter((r) => filter === "All Rewards" || r.filter === filter);

  const claim = (pickup: "store" | "delivery") => {
    if (!pending) return;
    const v = redeem(pending.name, pending.cost, pickup);
    setPending(null);
    if (v) setClaimed(v);
  };

  return (
    <div>
      <div className="rounded-3xl bg-gold-grad p-5 text-gold-foreground shadow-card">
        <p className="text-xs font-bold uppercase tracking-widest">AgroRewards</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{pts(points)}</p>
        <p className="text-sm">Wallet value: {xaf(points * POINT_VALUE_FCFA)}</p>
      </div>
      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-2">
        {REWARD_FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${filter === f ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>{f}</button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {list.map((r) => (
          <div key={r.id} className="rounded-2xl bg-card p-3 shadow-soft">
            <div className="flex h-20 items-center justify-center rounded-xl bg-secondary text-4xl">{r.emoji}</div>
            <p className="mt-2 text-xs font-semibold">{r.name}</p>
            <p className="text-xs font-bold text-accent-foreground">{pts(r.cost)}</p>
            <button disabled={points < r.cost} onClick={() => setPending(r)} className="mt-2 w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground active:animate-pop disabled:opacity-40">
              {points < r.cost ? `Need ${pts(r.cost - points)}` : "Claim Reward"}
            </button>
          </div>
        ))}
      </div>

      {vouchers.length > 0 && (
        <div className="mt-6 space-y-2">
          <h2 className="text-lg font-semibold">My Vouchers</h2>
          {vouchers.map((v) => (
            <div key={v.code} className="flex items-center gap-3 rounded-xl border border-dashed border-gold bg-card p-3 text-xs">
              <Ticket className="h-5 w-5 text-gold" />
              <div className="flex-1"><p className="font-semibold">{v.reward}</p><p className="text-muted-foreground">{v.pickup === "store" ? "Collect in-store" : "Added to active delivery"}</p></div>
              <span className="font-mono font-bold">{v.code}</span>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader><DialogTitle>Claim {pending?.name}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Uses {pending && pts(pending.cost)}. How would you like to receive it?</p>
          <div className="grid gap-2">
            <button onClick={() => claim("store")} className="rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">Collect in-store</button>
            <button onClick={() => claim("delivery")} className="rounded-xl border py-3 text-sm font-semibold">Add to active delivery</button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={!!claimed} onOpenChange={(o) => !o && setClaimed(null)}>
        <DialogContent className="max-w-sm rounded-3xl text-center">
          <DialogHeader><DialogTitle>🎉 Reward claimed</DialogTitle></DialogHeader>
          <p className="text-sm">{claimed?.reward}</p>
          <p className="mx-auto rounded-xl border-2 border-dashed border-gold px-4 py-3 font-mono text-2xl font-bold">{claimed?.code}</p>
          <p className="text-xs text-muted-foreground">Show this code at the counter.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
