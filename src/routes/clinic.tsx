import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ADVICE,
  AGRONOMISTS,
  CROPS,
  DISEASES,
  LAB_TESTS,
  PRODUCTS,
  pts,
  xaf,
  type Product,
} from "@/lib/agro-data";
import { useAgro, type DiagnosisResult } from "@/lib/agro-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertCircle,
  Bot,
  Calendar,
  CalendarCheck,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  FileText,
  FlaskConical,
  HelpCircle,
  History,
  Lightbulb,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Upload,
  User,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/clinic")({
  head: () => ({
    meta: [
      { title: "Plant Doctor & Consultations — Agro Hospital PLC" },
      {
        name: "description",
        content: "AI-powered crop disease diagnosis, agronomist field visits, and comprehensive soil & water laboratory testing.",
      },
      { property: "og:title", content: "Agro Hospital AI Crop Doctor & Clinic" },
      { property: "og:description", content: "Camera leaf diagnosis and agronomist consultations for Cameroonian farmers." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ClinicPage,
});

export function ClinicPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Plant Doctor & Clinic</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          AI camera leaf diagnosis, certified agronomist consultations, and soil/water lab tests.
        </p>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/80 p-1 rounded-2xl">
          <TabsTrigger value="ai" className="rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> AI Doctor
          </TabsTrigger>
          <TabsTrigger value="consult" className="rounded-xl text-xs font-semibold">
            Consultations
          </TabsTrigger>
          <TabsTrigger value="lab" className="rounded-xl text-xs font-semibold">
            Lab Tests
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: AI CROP DOCTOR (Section 4.5 & 5.6) */}
        <TabsContent value="ai" className="mt-4">
          <AiCropDoctorSection />
        </TabsContent>

        {/* TAB 2: AGRONOMIST CONSULTATIONS (Section 4.6 & 5.5) */}
        <TabsContent value="consult" className="mt-4">
          <ConsultationsSection />
        </TabsContent>

        {/* TAB 3: LAB TESTING */}
        <TabsContent value="lab" className="mt-4">
          <LabTestsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 1: AI CROP DOCTOR
// -------------------------------------------------------------
function AiCropDoctorSection() {
  const { diagnoses, saveDiagnosis, addToCart, openChatWithDept } = useAgro();
  const [selectedCrop, setSelectedCrop] = useState<string>("Cocoa");
  const [symptomsText, setSymptomsText] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<DiagnosisResult | null>(diagnoses[0] ?? null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your Agro Hospital Crop Doctor. You can ask follow-up questions about symptoms, fungicide rotation, or application timing.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      // Pick disease based on crop
      const diseaseMatch = DISEASES.find((d) => d.crop === selectedCrop) ?? DISEASES[0];
      const result: DiagnosisResult = {
        id: `diag-${Date.now()}`,
        crop: selectedCrop,
        issue: diseaseMatch.name,
        confidence: "High",
        confidencePct: 92,
        photoUrl: photoUri || undefined,
        explanation: `${diseaseMatch.symptoms} Caused by ${diseaseMatch.cause}.`,
        prevention: diseaseMatch.prevention,
        recommendedProductIds: diseaseMatch.recommendedProductIds,
        date: new Date().toISOString().slice(0, 10),
      };

      saveDiagnosis(result);
      setCurrentResult(result);
      toast.success("AI Crop Diagnosis Complete!", { description: `Identified: ${result.issue}` });
    }, 2200);
  };

  const handleSendAiChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setAiChatMessages((prev) => [...prev, { sender: "user", text: msg }]);

    setTimeout(() => {
      setAiChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `For ${currentResult?.issue ?? "this condition"}, we recommend applying the systemic fungicide every 21 days during the heavy rain months. Always inspect the undersides of the leaves and ensure proper PPE.`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="rounded-2xl bg-hero p-5 text-white shadow-card">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-white/10 text-accent">
            <Bot className="h-5 w-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Computer Vision AI</span>
        </div>
        <h2 className="mt-2 text-lg font-bold">Diagnose Crop Infestations</h2>
        <p className="mt-1 text-xs text-white/80 leading-relaxed">
          Upload 1–3 clear photos of the affected leaves or stems. Our AI model cross-references thousands of Cameroonian plant pathology patterns.
        </p>
      </div>

      {/* Diagnosis Form */}
      <form onSubmit={handleDiagnose} className="clay-card p-4 space-y-3.5">
        <div>
          <label className="text-xs font-bold text-foreground block mb-1">Select Affected Crop</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-primary"
          >
            {CROPS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Section 5.6: Camera Guidance Overlay */}
        <div>
          <label className="text-xs font-bold text-foreground block mb-1">Upload or Capture Leaf Photo</label>
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/30 bg-secondary/30 p-5 text-center">
            {photoUri ? (
              <div className="relative mx-auto h-36 w-full max-w-xs overflow-hidden rounded-xl border border-border shadow-xs">
                <img src={photoUri} alt="Uploaded leaf" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUri(null)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary shadow-xs">
                  <Camera className="h-6 w-6" />
                </span>
                <p className="text-xs font-bold text-foreground">Tap to take photo or choose file</p>
                <p className="text-[11px] text-muted-foreground max-w-xs">
                  💡 <b>Guidance overlay:</b> Hold camera 15–20 cm away in good daylight. Focus sharply on the affected lesion or discoloration.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPhotoUri(URL.createObjectURL(file));
                  }}
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-foreground block mb-1">Describe Visual Symptoms (Optional)</label>
          <textarea
            rows={2}
            value={symptomsText}
            onChange={(e) => setSymptomsText(e.target.value)}
            placeholder="e.g. Brown water-soaked spots spreading on cocoa pods after heavy rain..."
            className="w-full rounded-xl border border-border bg-muted px-3.5 py-2 text-xs font-medium outline-none focus:border-primary focus:bg-background"
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className="clay-btn-primary w-full rounded-2xl py-3 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Analyzing pathology patterns...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-accent" /> Run Preliminary AI Diagnosis
            </>
          )}
        </button>
      </form>

      {/* Section 5.6: RESULT CARD (S83) */}
      {currentResult && (
        <div className="clay-card p-4 space-y-3.5 border border-primary/30 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  {currentResult.crop} Diagnosis
                </span>
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                  {currentResult.confidence} Confidence ({currentResult.confidencePct}%)
                </span>
              </div>
              <h3 className="mt-1 text-base font-bold text-foreground">{currentResult.issue}</h3>
              <span className="text-[10px] text-muted-foreground">Scanned on {currentResult.date}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="rounded-xl bg-muted/60 p-3 leading-relaxed">
              <b className="text-foreground">Analysis: </b>
              <span className="text-muted-foreground">{currentResult.explanation}</span>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3 leading-relaxed border border-primary/10">
              <b className="text-primary font-bold">Recommended Farm Action: </b>
              <span className="text-secondary-foreground">{currentResult.prevention}</span>
            </div>
          </div>

          {/* Section 4.5: Mandatory Disclaimer */}
          <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-900 dark:text-amber-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              <b>Important Disclaimer:</b> AI crop diagnosis provides preliminary decision support and is not a 100% guarantee. For commercial or severe infestations, book a field visit with an agronomist.
            </span>
          </div>

          {/* Recommended Products with 1-tap Add to Cart */}
          {currentResult.recommendedProductIds.length > 0 && (
            <div className="border-t border-border pt-3">
              <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Recommended Input Solutions
              </h4>
              <div className="space-y-2">
                {PRODUCTS.filter((p) => currentResult.recommendedProductIds.includes(p.id)).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl">{p.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {xaf(p.unitPrice)} • Earn {pts(p.points)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(p, "unit", 1);
                        toast.success(`Added ${p.name} to cart!`);
                      }}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition flex items-center gap-1"
                    >
                      <ShoppingBag className="h-3 w-3" /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4.5 Actions: Ask follow-up in AI chat or Book agronomist */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setAiChatOpen(true)}
              className="rounded-xl border border-border bg-card py-2.5 text-xs font-bold text-foreground hover:bg-muted transition flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="h-3.5 w-3.5 text-primary" /> Ask Follow-up
            </button>
            <button
              type="button"
              onClick={() => {
                openChatWithDept("Plant clinic & lab", `Booking consult for diagnosis: ${currentResult.issue}`);
              }}
              className="rounded-xl bg-secondary py-2.5 text-xs font-bold text-primary border border-primary/20 hover:bg-secondary/80 transition flex items-center justify-center gap-1.5"
            >
              <Stethoscope className="h-3.5 w-3.5" /> Book Agronomist
            </button>
          </div>
        </div>
      )}

      {/* AI Follow-up Chat Dialog (S84) */}
      <Dialog open={aiChatOpen} onOpenChange={setAiChatOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl bg-card border-none shadow-card h-[80vh] flex flex-col">
          <div className="bg-hero p-4 text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-accent" />
            <div>
              <h3 className="text-sm font-bold">AI Crop Doctor Chat</h3>
              <p className="text-[10px] text-white/80">Context: {currentResult?.issue}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiChatMessages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-soft ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-xs"
                      : "bg-muted text-foreground rounded-bl-xs"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendAiChat} className="p-3 border-t bg-card flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about dosage, weather timing, pruning..."
              className="flex-1 rounded-xl border bg-muted px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="rounded-xl bg-primary px-3 text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 2: CONSULTATIONS (S51-S53)
// -------------------------------------------------------------
function ConsultationsSection() {
  const { consultations, book, toggleReminder } = useAgro();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [service, setService] = useState("Plant Clinic Consultation");
  const [mode, setMode] = useState<"Phone" | "Farm visit" | "Video">("Phone");
  const [agronomist, setAgronomist] = useState(AGRONOMISTS[0].name);
  const [date, setDate] = useState("2026-11-14");
  const [slot, setSlot] = useState("10:00");
  const [topic, setTopic] = useState("");

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    book({
      service,
      agronomist,
      date,
      slot,
      mode,
      topic: topic || "General crop checkup",
      reminders: true,
    });
    setShowBookingModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Action banner */}
      <div className="flex items-center justify-between rounded-2xl bg-secondary/50 p-4 border border-primary/20">
        <div>
          <h3 className="text-sm font-bold text-foreground">Dedicated Agronomist Advisory</h3>
          <p className="text-xs text-muted-foreground">Book scheduled sessions or farm visits with specialists.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowBookingModal(true)}
          className="rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition flex items-center gap-1.5"
        >
          <CalendarCheck className="h-4 w-4" /> Book New
        </button>
      </div>

      {/* Consultations List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Appointments</h3>
        {consultations.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    c.status === "Upcoming"
                      ? "bg-secondary text-primary"
                      : c.status === "Completed"
                      ? "bg-muted text-muted-foreground"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {c.status}
                </span>
                <h4 className="mt-1 text-sm font-bold text-foreground">{c.topic}</h4>
                <p className="text-xs text-muted-foreground">{c.agronomist}</p>
              </div>

              <div className="text-right text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1 justify-end">
                  <Calendar className="h-3 w-3 text-primary" /> {c.date}
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                  <Clock className="h-3 w-3 text-muted-foreground" /> {c.slot} ({c.mode})
                </span>
              </div>
            </div>

            {c.notes && (
              <div className="rounded-xl bg-muted/60 p-2.5 text-xs text-muted-foreground border-l-2 border-primary">
                <b>Agronomist Notes: </b>
                {c.notes}
              </div>
            )}

            <div className="border-t border-border/60 pt-2 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => toggleReminder(c.id)}
                className={`text-[11px] font-semibold transition ${
                  c.reminders ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {c.reminders ? "🔔 SMS reminder active" : "🔕 Set reminder"}
              </button>

              <button
                type="button"
                onClick={() => toast("Details sent to your SMS")}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Appointment Info
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL (S52) */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-card border-none shadow-card">
          <h3 className="text-base font-bold text-foreground">Book Agronomist Consultation</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Choose your advisory format and preferred slot.</p>

          <form onSubmit={handleBook} className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Service Type</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full rounded-xl border bg-muted px-3 py-2 text-xs font-semibold"
              >
                <option>Plant Clinic Consultation</option>
                <option>On-Farm Agronomist Visit</option>
                <option>Soil Fertility Advisory</option>
                <option>Post-Harvest & Storage Plan</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Phone", "Farm visit", "Video"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      mode === m ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Specialist Agronomist</label>
              <select
                value={agronomist}
                onChange={(e) => setAgronomist(e.target.value)}
                className="w-full rounded-xl border bg-muted px-3 py-2 text-xs font-semibold"
              >
                {AGRONOMISTS.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name} ({g.focus})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border bg-muted px-3 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Time Slot</label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full rounded-xl border bg-muted px-3 py-2 text-xs font-semibold"
                >
                  <option>09:00 - 10:00</option>
                  <option>10:00 - 11:00</option>
                  <option>14:00 - 15:00</option>
                  <option>16:00 - 17:00</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Topic or Pest Concern</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Maize leaf rust and fertiliser timing"
                className="w-full rounded-xl border bg-muted px-3 py-2 text-xs font-semibold"
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-soft"
            >
              Confirm Appointment
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 3: LAB TESTS
// -------------------------------------------------------------
function LabTestsSection() {
  const { branch } = useAgro();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-secondary/60 p-4 border border-primary/20">
        <h3 className="text-sm font-bold text-primary flex items-center gap-1.5">
          <FlaskConical className="h-4 w-4" /> Certified Soil, Water & Tissue Laboratory
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Bring your soil or water samples to any Agro Hospital branch ({branch}, Widikum, Bamenda, Yaoundé, Mamfe, Kumba). Full analysis reports issued in 48 hours.
        </p>
      </div>

      <div className="space-y-3">
        {LAB_TESTS.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                <p className="mt-2 text-xs font-extrabold text-primary font-mono">{xaf(t.price)}</p>
              </div>
            </div>

            <div className="mt-3.5 border-t border-border/60 pt-2.5 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Sample kits available at counter</span>
              <button
                type="button"
                onClick={() =>
                  toast.success("Lab test booked", {
                    description: `Drop sample at ${branch} branch with order voucher.`,
                  })
                }
                className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
              >
                Book Lab Analysis
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
