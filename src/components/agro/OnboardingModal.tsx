import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAgro } from "@/lib/agro-store";
import { CROPS, TIERS } from "@/lib/agro-data";
import { ArrowRight, CheckCircle2, Gift, Phone, ShieldCheck, Sparkles, Sprout, User } from "lucide-react";
import { toast } from "sonner";

export function OnboardingModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { signIn } = useAgro();
  const [step, setStep] = useState<"carousel" | "phone" | "otp" | "referral" | "profile">("carousel");
  const [slide, setSlide] = useState(0);
  const [phone, setPhone] = useState("+237 677 00 11 22");
  const [otp, setOtp] = useState("");
  const [referral, setReferral] = useState("AYUK2026");
  const [name, setName] = useState("Ngwa Emmanuel");
  const [region, setRegion] = useState("North West");
  const [farmType, setFarmType] = useState<"Farmer" | "Cooperative" | "Walk-in">("Farmer");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Cocoa", "Corn"]);

  const SLIDES = [
    {
      title: "Genuine Agricultural Inputs",
      desc: "Order certified seeds, fungicides, fertilisers, and sprayers directly from Agro Hospital branches across Cameroon.",
      emoji: "🌾",
      color: "bg-secondary text-primary",
    },
    {
      title: "AI Crop Doctor & Plant Clinic",
      desc: "Take a photo of diseased leaves for instant preliminary diagnosis and book on-farm agronomist consultations.",
      emoji: "🩺",
      color: "bg-accent/40 text-accent-foreground",
    },
    {
      title: "Earn Loyalty Points & Commissions",
      desc: "Collect reward points on every delivered order and share your personal referral code to earn product credits.",
      emoji: "🎁",
      color: "bg-gold/20 text-gold-foreground",
    },
  ];

  const toggleCrop = (c: string) => {
    setSelectedCrops((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const handleFinish = () => {
    signIn(
      {
        fullName: name,
        phone,
        region,
        accountType: farmType,
        crops: selectedCrops,
      },
      referral.trim() ? referral : undefined
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl bg-card border-none shadow-card">
        {step === "carousel" && (
          <div className="p-6 text-center">
            <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl text-5xl shadow-soft ${SLIDES[slide].color}`}>
              {SLIDES[slide].emoji}
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">{SLIDES[slide].title}</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed px-2">{SLIDES[slide].desc}</p>

            <div className="mt-6 flex justify-center gap-1.5">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    slide === i ? "w-6 bg-primary" : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>

            <div className="mt-8 flex gap-2">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="flex-1 rounded-2xl border border-border py-3 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={() => {
                  if (slide < SLIDES.length - 1) setSlide((s) => s + 1);
                  else setStep("phone");
                }}
                className="flex-1 rounded-2xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-soft"
              >
                {slide === SLIDES.length - 1 ? "Get Started" : "Next"}
              </button>
            </div>
          </div>
        )}

        {step === "phone" && (
          <div className="p-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-center">Enter Phone Number</h3>
            <p className="mt-1 text-xs text-center text-muted-foreground">We will send a 6-digit SMS verification code.</p>

            <div className="mt-6">
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Mobile Phone (Cameroon)</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3.5 rounded-xl border bg-muted text-xs font-bold text-foreground">
                  🇨🇲 +237
                </span>
                <input
                  type="tel"
                  value={phone.replace("+237 ", "")}
                  onChange={(e) => setPhone(`+237 ${e.target.value}`)}
                  className="flex-1 rounded-xl border bg-background px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-primary"
                  placeholder="677 00 11 22"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                toast.success("Verification code sent via SMS", { description: "Use code 482910 to verify" });
                setStep("otp");
              }}
              className="mt-6 w-full rounded-2xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-soft flex items-center justify-center gap-1.5"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="p-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/40 text-accent-foreground">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-center">Verify 6-Digit Code</h3>
            <p className="mt-1 text-xs text-center text-muted-foreground">Sent to {phone}</p>

            <div className="mt-6">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="482910"
                className="w-full text-center tracking-[0.5em] text-2xl font-bold rounded-xl border bg-muted py-3 outline-none focus:border-primary focus:bg-background"
              />
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Demo code: <b className="text-primary font-mono">482910</b>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (otp && otp !== "482910" && otp.length < 4) {
                  toast.error("Invalid code");
                  return;
                }
                setStep("referral");
              }}
              className="mt-6 w-full rounded-2xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-soft"
            >
              Verify Code
            </button>
          </div>
        )}

        {step === "referral" && (
          <div className="p-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/20 text-gold-foreground">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-center">Have a Referral Code?</h3>
            <p className="mt-1 text-xs text-center text-muted-foreground">
              Enter a friend or field marketer's code to get 500 bonus points.
            </p>

            <div className="mt-6">
              <input
                type="text"
                value={referral}
                onChange={(e) => setReferral(e.target.value.toUpperCase())}
                placeholder="e.g. AYUK2026"
                className="w-full uppercase font-mono tracking-wider text-center rounded-xl border bg-muted py-3 text-sm font-bold outline-none focus:border-primary focus:bg-background"
              />
              {referral === "AYUK2026" && (
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-primary font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> Valid: Ayuk Agro Shop (+500 pts welcome bonus)
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => { setReferral(""); setStep("profile"); }}
                className="flex-1 rounded-2xl border border-border py-3 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                No Code, Skip
              </button>
              <button
                type="button"
                onClick={() => setStep("profile")}
                className="flex-1 rounded-2xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-soft"
              >
                Apply & Continue
              </button>
            </div>
          </div>
        )}

        {step === "profile" && (
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <User className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-center">Set Up Farm Profile</h3>
            <p className="mt-1 text-xs text-center text-muted-foreground">Tailors advisory, stock alerts & delivery zones</p>

            <div className="mt-5 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border bg-muted px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-primary focus:bg-background"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border bg-muted px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-primary"
                >
                  <option>North West</option>
                  <option>South West</option>
                  <option>Centre (Yaoundé)</option>
                  <option>Littoral (Douala)</option>
                  <option>West (Bafoussam)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Profile Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Farmer", "Cooperative", "Walk-in"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFarmType(t)}
                      className={`py-2 text-[11px] font-semibold rounded-xl border transition ${
                        farmType === t ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">Primary Crops Grown</label>
                <div className="flex flex-wrap gap-1.5">
                  {CROPS.map((c) => {
                    const active = selectedCrops.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCrop(c)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition ${
                          active ? "bg-secondary text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {active ? "✓ " : ""}{c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="mt-6 w-full rounded-2xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-soft"
            >
              Complete Registration & Enter App
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

