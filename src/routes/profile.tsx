import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  Copy,
  Database,
  ExternalLink,
  Fingerprint,
  Gift,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  QrCode,
  RotateCcw,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Trash2,
  Truck,
  User,
  Users,
  Wallet,
  Wifi,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BRANCHES, CROPS, LEDGER, POINT_VALUE_FCFA, TIERS, WHATSAPP_URL, pts, xaf } from "@/lib/agro-data";
import { useAgro, type Profile } from "@/lib/agro-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Farm Account & Settings — Agro Hospital PLC" },
      {
        name: "description",
        content: "Manage farm details, loyalty points ledger, referral bonuses, and language preferences.",
      },
      { property: "og:title", content: "Agro Hospital Account & Wallet" },
      { property: "og:description", content: "Manage farm profile, referral earnings and settings." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ProfilePage,
});

const fieldClass = "mt-1 w-full rounded-xl border bg-muted px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-primary focus:bg-background";

export function ProfilePage() {
  const {
    tier,
    tierId,
    setTierId,
    profile,
    setProfile,
    points,
    productCredit,
    orders,
    referralCode,
    referrals,
    setChatOpen,
    setOnboardingOpen,
  } = useAgro();

  const [editingProfile, setEditingProfile] = useState(false);
  const [offlineSettingsOpen, setOfflineSettingsOpen] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);

  // Edit form state
  const [formName, setFormName] = useState(profile.fullName);
  const [formPhone, setFormPhone] = useState(profile.phone);
  const [formLocation, setFormLocation] = useState(profile.location);
  const [formFarmSize, setFormFarmSize] = useState(profile.farmSize);
  const [formCrops, setFormCrops] = useState<string[]>(profile.crops);

  const initials = tier.customer
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      fullName: formName,
      phone: formPhone,
      location: formLocation,
      farmSize: formFarmSize,
      crops: formCrops,
    });
    setEditingProfile(false);
    toast.success("Profile updated successfully!");
  };

  const copyReferral = () => {
    navigator.clipboard?.writeText(referralCode);
    toast.success("Referral code copied to clipboard!", { description: referralCode });
  };

  const shareWhatsApp = () => {
    const text = `Join Agro Hospital for genuine agricultural inputs, AI crop disease diagnosis, and loyalty rewards! Use my referral code: ${referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Account Hero Card */}
      <div className="overflow-hidden rounded-3xl bg-hero p-5 text-white shadow-card">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold ring-2 ring-accent">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold">{tier.customer}</p>
            <p className="truncate text-xs text-white/80">{profile.email}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground">
              <ShieldCheck className="h-3 w-3" /> {tier.name}
            </span>
          </div>
          <button
            onClick={() => setEditingProfile(true)}
            aria-label="Edit farm profile"
            className="rounded-full bg-white/15 p-2.5 hover:bg-white/25 transition"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Stats Overview */}
        <div className="mt-5 grid grid-cols-3 gap-2 text-center border-t border-white/15 pt-3">
          <div>
            <p className="text-[10px] uppercase font-bold text-accent">Loyalty Pts</p>
            <p className="text-base font-extrabold">{points.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-accent">Referral Credit</p>
            <p className="text-base font-extrabold">{xaf(productCredit)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-accent">Orders</p>
            <p className="text-base font-extrabold">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Account Sub-Tabs */}
      <Tabs defaultValue="farm" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/80 p-1 rounded-2xl">
          <TabsTrigger value="farm" className="rounded-xl text-xs font-semibold">
            Farm Profile
          </TabsTrigger>
          <TabsTrigger value="wallet" className="rounded-xl text-xs font-semibold">
            Wallet & Ledger
          </TabsTrigger>
          <TabsTrigger value="referrals" className="rounded-xl text-xs font-semibold">
            Referrals
          </TabsTrigger>
        </TabsList>

        {/* SUBTAB 1: FARM & MEMBERSHIP PROFILE */}
        <TabsContent value="farm" className="mt-4 space-y-4">
          <SectionGroup title="Membership Tier">
            <InfoRow icon={<ShieldCheck />} label="Customer Type" value={tier.segment} />
            <InfoRow icon={<Wallet />} label="Points Earning Rate" value={`${tier.ptsPer1000} pt / 1,000 XAF`} />
            {tier.hasCommission && (
              <InfoRow icon={<Building2 />} label="Volume Rebate" value={tier.rebate} />
            )}
            <p className="px-4 pb-3 text-[11px] text-muted-foreground">
              Assigned by Agro Hospital PLC based on cumulative seasonal restocks. Contact your branch manager for cooperative reviews.
            </p>
          </SectionGroup>

          <SectionGroup
            title="Personal & Contact Info"
            action={
              <button onClick={() => setEditingProfile(true)} className="text-xs font-bold text-primary">
                Edit
              </button>
            }
          >
            <InfoRow icon={<User />} label="Full Name" value={profile.fullName} />
            <InfoRow icon={<Smartphone />} label="Phone" value={profile.phone} />
            <InfoRow icon={<MessageCircle />} label="WhatsApp" value={profile.whatsapp} />
            <InfoRow icon={<ShieldCheck />} label="CNI ID Number" value={profile.idNumber} />
            {profile.businessName && <InfoRow icon={<Building2 />} label="Farm / Business" value={profile.businessName} />}
          </SectionGroup>

          <SectionGroup title="Farm Coordinates & Crops">
            <InfoRow icon={<MapPin />} label="Farm Location" value={`${profile.location} • ${profile.region}`} />
            <InfoRow icon={<MapPin />} label="GPS Coordinates" value={profile.gps} />
            <InfoRow icon={<Sprout />} label="Farm Size" value={`${profile.farmSize} Hectares`} />
            <InfoRow icon={<Sprout />} label="Primary Crops" value={profile.crops.join(", ") || "None"} />
            <InfoRow icon={<Sprout />} label="Livestock" value={profile.livestock || "—"} />
          </SectionGroup>
        </TabsContent>

        {/* SUBTAB 2: WALLET & POINTS STATEMENT (S44) */}
        <TabsContent value="wallet" className="mt-4 space-y-4">
          {/* Two Distinct Balances */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-primary/20 bg-secondary/50 p-4 shadow-soft">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Loyalty Points</span>
              <p className="mt-1 text-2xl font-extrabold text-primary">{pts(points)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Redeemable for free inputs & vouchers</p>
              <Link
                to="/redeem"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Redeem Rewards <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 shadow-soft">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-foreground">Referral Credit</span>
              <p className="mt-1 text-2xl font-extrabold text-gold">{xaf(productCredit)}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Applies automatically at checkout</p>
              <span className="mt-3 inline-block text-[10px] font-semibold text-muted-foreground">
                Strictly on products
              </span>
            </div>
          </div>

          {/* Section 6.1 & 6.2 Rule Disclaimer */}
          <div className="rounded-xl bg-muted/60 p-3 text-[11px] text-muted-foreground leading-relaxed border border-border">
            ℹ️ <b>Redemption Policy:</b> Points and referral credits are redeemable exclusively against product purchases, farm vouchers, and clinic services. No cash withdrawals are permitted by system regulations.
          </div>

          {/* Ledger History List */}
          <SectionGroup title="Points & Commission Ledger">
            <ul className="divide-y divide-border text-xs">
              {LEDGER.map((l, idx) => (
                <li key={idx} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-bold text-foreground">{l.label}</p>
                    <p className="text-[11px] text-muted-foreground">{l.date} • {l.kind}</p>
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      l.kind === "Redeemed"
                        ? "text-destructive"
                        : l.kind === "Pending"
                        ? "text-muted-foreground"
                        : "text-primary"
                    }`}
                  >
                    {l.kind === "Commission"
                      ? `+${xaf(l.amount ?? 0)}`
                      : `${l.pts > 0 ? "+" : ""}${pts(l.pts)}`}
                  </span>
                </li>
              ))}
            </ul>
          </SectionGroup>
        </TabsContent>

        {/* SUBTAB 3: REFERRALS PROGRAM (S45) */}
        <TabsContent value="referrals" className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border/80 bg-card p-5 text-center shadow-soft space-y-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/20 text-2xl mx-auto">
              🎁
            </span>
            <h3 className="text-base font-bold text-foreground">Invite Farmers, Earn Product Credits</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Share your personal referral code. When a referred farmer joins and completes their first delivered order, you receive product credit!
            </p>

            <div className="flex items-center justify-between rounded-2xl border-2 border-dashed border-primary/40 bg-secondary/30 p-3.5">
              <span className="font-mono text-base font-extrabold tracking-wider text-primary">
                {referralCode}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={copyReferral}
                  className="rounded-xl bg-card border border-border p-2 text-primary hover:bg-muted transition"
                  aria-label="Copy referral code"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setQrCodeOpen(true)}
                  className="rounded-xl bg-card border border-border p-2 text-foreground hover:bg-muted transition"
                  aria-label="Show QR Code"
                >
                  <QrCode className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={shareWhatsApp}
              className="w-full rounded-2xl bg-[#25D366] text-white py-3 text-xs font-bold shadow-soft flex items-center justify-center gap-2 hover:opacity-95 transition"
            >
              <Share2 className="h-4 w-4" /> Share via WhatsApp
            </button>
          </div>

          {/* Referred Farmers Table */}
          <SectionGroup title="Referred Farmers">
            <ul className="divide-y divide-border text-xs">
              {referrals.map((r, idx) => (
                <li key={idx} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-bold text-foreground">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground">Joined: {r.date} • {r.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                      {r.status}
                    </span>
                    <p className="mt-0.5 text-xs font-mono font-bold text-gold">+{xaf(r.commission)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionGroup>
        </TabsContent>
      </Tabs>

      {/* General Settings Group */}
      <SectionGroup title="App Preferences & Settings">
        <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
          <Globe className="h-4 w-4 text-primary" />
          <span className="flex-1 text-xs font-semibold text-foreground">Language</span>
          <select
            value={profile.language}
            onChange={(e) => {
              setProfile({ ...profile, language: e.target.value as any });
              toast.success(`Language set to ${e.target.value}`);
            }}
            className="rounded-lg bg-muted px-2.5 py-1 text-xs font-bold outline-none border border-border"
          >
            <option>English</option>
            <option>Français</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => setOfflineSettingsOpen(true)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition"
        >
          <Database className="h-4 w-4 text-primary" />
          <span className="flex-1 text-xs font-semibold text-foreground">Offline & Data Cache</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={() => setOnboardingOpen(true)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition"
        >
          <HelpCircle className="h-4 w-4 text-primary" />
          <span className="flex-1 text-xs font-semibold text-foreground">Replay App Onboarding Tour</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </SectionGroup>

      {/* Support & Logout */}
      <SectionGroup title="Customer Support">
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition"
        >
          <MessageCircle className="h-4 w-4 text-primary" />
          <span className="flex-1 text-xs font-semibold text-foreground">Live Chat with Advisory Desk</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition"
        >
          <Smartphone className="h-4 w-4 text-primary" />
          <span className="flex-1 text-xs font-semibold text-foreground">WhatsApp Extension Officer</span>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </a>
      </SectionGroup>

      {/* EDIT PROFILE MODAL */}
      <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-card border-none shadow-card max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Edit Farm Profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-3 mt-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Phone Number</label>
              <input
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Farm Location</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Farm Size (Hectares)</label>
              <input
                type="number"
                step="0.1"
                value={formFarmSize}
                onChange={(e) => setFormFarmSize(e.target.value)}
                className={fieldClass}
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-soft"
            >
              Save Changes
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* OFFLINE SETTINGS MODAL (S71) */}
      <Dialog open={offlineSettingsOpen} onOpenChange={setOfflineSettingsOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-card border-none shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Offline Storage & Cache</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Agro Hospital caches product catalogues, crop disease photos, and guides locally so you can browse offline on your farm.
          </p>

          <div className="mt-4 space-y-3 rounded-2xl bg-muted/60 p-3.5 text-xs">
            <div className="flex justify-between">
              <span>Catalogue Cache Size:</span>
              <span className="font-bold text-foreground">12.4 MB</span>
            </div>
            <div className="flex justify-between">
              <span>Offline Articles Saved:</span>
              <span className="font-bold text-foreground">5 Guides</span>
            </div>
            <div className="flex justify-between">
              <span>Last Synchronized:</span>
              <span className="font-bold text-primary">Just now</span>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                toast.success("Cache cleared and freshly synced!");
                setOfflineSettingsOpen(false);
              }}
              className="flex-1 rounded-2xl border border-destructive/40 text-destructive py-2.5 text-xs font-bold hover:bg-destructive/10"
            >
              Clear Cache
            </button>
            <button
              type="button"
              onClick={() => setOfflineSettingsOpen(false)}
              className="flex-1 rounded-2xl bg-primary text-primary-foreground py-2.5 text-xs font-bold"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR CODE MODAL */}
      <Dialog open={qrCodeOpen} onOpenChange={setQrCodeOpen}>
        <DialogContent className="sm:max-w-xs p-6 rounded-3xl bg-card border-none shadow-card text-center">
          <h3 className="text-base font-bold text-foreground">Referral QR Code</h3>
          <p className="text-xs text-muted-foreground mt-1">Scan this at meetings or cooperative gatherings.</p>

          <div className="my-5 mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-primary/20 bg-secondary/40 p-4">
            <div className="space-y-1">
              <QrCode className="h-32 w-32 mx-auto text-primary" />
              <span className="font-mono text-xs font-bold text-primary block">{referralCode}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setQrCodeOpen(false)}
            className="w-full rounded-2xl bg-primary py-2.5 text-xs font-bold text-primary-foreground"
          >
            Done
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SectionGroup({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-soft">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 text-xs border-b border-border/40 last:border-b-0">
      <span className="text-primary h-4 w-4 flex items-center justify-center">{icon}</span>
      <span className="text-muted-foreground flex-1">{label}</span>
      <span className="font-bold text-foreground text-right">{value}</span>
    </div>
  );
}
