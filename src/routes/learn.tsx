import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ARTICLES,
  CAMPAIGNS,
  PRODUCTS,
  WORKSHOPS,
  pts,
  xaf,
  type Article,
  type Product,
} from "@/lib/agro-data";
import { useAgro } from "@/lib/agro-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  GraduationCap,
  MapPin,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn & Advisory Hub — Agro Hospital PLC" },
      {
        name: "description",
        content: "Agricultural training guides, pest control calendars, farmer workshops, and seasonal input discounts.",
      },
      { property: "og:title", content: "Agro Hospital Learn & Advisory Hub" },
      { property: "og:description", content: "Agronomic guides, workshops and discounts for Cameroonian farmers." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LearnPage,
});

export function LearnPage() {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const { workshops, registeredWorkshops, registerWorkshop, applyCoupon } = useAgro();
  const [filterKind, setFilterKind] = useState<string>("All");

  const filteredArticles = ARTICLES.filter(
    (a) => filterKind === "All" || a.kind === filterKind
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Learn & Advisory Hub</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Certified agronomic guides, seasonal campaigns, and field training workshops.
        </p>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/80 p-1 rounded-2xl">
          <TabsTrigger value="feed" className="rounded-xl text-xs font-semibold">
            Guides & Feed
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="rounded-xl text-xs font-semibold">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="workshops" className="rounded-xl text-xs font-semibold">
            Workshops
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ARTICLES FEED */}
        <TabsContent value="feed" className="mt-4 space-y-4">
          {/* Category Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["All", "Guide", "How-to", "Product info"].map((k) => (
              <button
                key={k}
                onClick={() => setFilterKind(k)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  filterKind === k
                    ? "border-primary bg-primary text-primary-foreground shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {k === "All" ? "All Content" : k}
              </button>
            ))}
          </div>

          {/* Articles list */}
          <div className="space-y-3">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-soft hover:border-primary/40 transition cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl">
                    {art.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                        {art.kind}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" /> {art.minutes} min read
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-foreground leading-snug group-hover:text-primary transition">
                      {art.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px] font-semibold text-primary">
                  <span>Read full guide & inputs</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Share2 className="h-3.5 w-3.5 hover:text-foreground" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: CAMPAIGNS & COUPONS */}
        <TabsContent value="campaigns" className="mt-4 space-y-3">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-mid p-4 text-white shadow-card">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Active Promotions</span>
            </div>
            <h3 className="mt-1 text-lg font-bold">Rainy Season Input Relief</h3>
            <p className="mt-1 text-xs text-white/80 leading-relaxed">
              Agro Hospital PLC offers subsidized rates and double loyalty points on critical fungicides and bio-stimulants.
            </p>
          </div>

          <div className="space-y-3">
            {CAMPAIGNS.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-2xl">
                      {c.emoji}
                    </span>
                    <div>
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                        {c.kind}
                      </span>
                      <h4 className="mt-0.5 text-sm font-bold text-foreground">{c.title}</h4>
                      <p className="text-xs text-muted-foreground">{c.detail}</p>
                    </div>
                  </div>
                </div>

                {c.code && (
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/60 p-2.5 border border-dashed border-border">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                      <Tag className="h-3.5 w-3.5" />
                      <span>{c.code}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(c.code);
                        applyCoupon(c.code);
                        toast.success(`Coupon ${c.code} copied & applied to your cart!`);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                    >
                      <Copy className="h-3 w-3" /> Copy & Apply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: WORKSHOPS */}
        <TabsContent value="workshops" className="mt-4 space-y-3">
          <div className="rounded-2xl bg-secondary/60 p-4 border border-primary/20">
            <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" /> Farmers' Extension Field Training
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Attend free in-person workshops hosted by our certified agronomists at Agro Hospital branch centers.
            </p>
          </div>

          <div className="space-y-3">
            {workshops.map((w) => {
              const isRegistered = registeredWorkshops.includes(w.id);
              return (
                <div key={w.id} className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                      {w.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground leading-tight">{w.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{w.description}</p>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" /> {w.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-primary" /> {w.time}
                        </span>
                        <span className="col-span-2 flex items-center gap-1 text-foreground font-medium">
                          <MapPin className="h-3.5 w-3.5 text-gold" /> {w.location}
                        </span>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between border-t border-border/60 pt-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <b className="text-primary">{w.spotsLeft}</b> spots left
                        </span>

                        <button
                          type="button"
                          disabled={isRegistered}
                          onClick={() => registerWorkshop(w.id)}
                          className={`rounded-xl px-4 py-1.5 text-xs font-bold transition flex items-center gap-1 ${
                            isRegistered
                              ? "bg-secondary text-primary border border-primary/20"
                              : "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                          }`}
                        >
                          {isRegistered ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Registered
                            </>
                          ) : (
                            "Register Free"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* ARTICLE READER MODAL */}
      <ArticleReaderModal
        article={activeArticle}
        open={!!activeArticle}
        onOpenChange={(v) => !v && setActiveArticle(null)}
      />
    </div>
  );
}

function ArticleReaderModal({
  article,
  open,
  onOpenChange,
}: {
  article: Article | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { addToCart } = useAgro();
  if (!article) return null;

  const recommended = PRODUCTS.filter((p) =>
    article.recommendedProductIds?.includes(p.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl bg-card border-none shadow-card max-h-[85vh] flex flex-col">
        {/* Header Hero */}
        <div className="bg-hero p-5 text-white">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{article.emoji}</span>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              {article.kind}
            </span>
          </div>
          <h2 className="mt-2 text-lg font-bold leading-snug">{article.title}</h2>
          <div className="mt-2 flex items-center gap-3 text-xs text-white/80">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.minutes} min read
            </span>
            <span>• Verified by Agro Hospital Agronomists</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="rounded-xl bg-secondary/50 p-3 text-xs text-secondary-foreground border border-primary/10">
            <b>Summary:</b> {article.summary}
          </div>

          <div className="space-y-3 text-xs text-foreground leading-relaxed">
            {article.body.map((paragraph, idx) => (
              <p key={idx} className="flex gap-2.5 items-start">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px] mt-0.5">
                  {idx + 1}
                </span>
                <span>{paragraph}</span>
              </p>
            ))}
          </div>

          {/* Section 6.5 / 5.5: Recommended Products inside article */}
          {recommended.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Recommended Inputs for this Guide
              </h4>
              <div className="mt-2.5 space-y-2">
                {recommended.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/40 p-1 border border-border/40 overflow-hidden">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-full w-full object-contain mix-blend-multiply" />
                        ) : (
                          <span className="text-2xl">{p.emoji}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {xaf(p.unitPrice)} • Earn {pts(p.points)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(p, "unit", 1)}
                      className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition flex items-center gap-1"
                    >
                      <ShoppingBag className="h-3 w-3" /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-muted/40 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl bg-card border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
          >
            Close Guide
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

