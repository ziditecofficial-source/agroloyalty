import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CATEGORIES,
  CROPS,
  DISEASES,
  PRODUCTS,
  pts,
  xaf,
  type Disease,
  type Product,
} from "@/lib/agro-data";
import { useAgro } from "@/lib/agro-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  Filter,
  Flame,
  HelpCircle,
  Info,
  MapPin,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Input Store & Catalogue — Agro Hospital PLC" },
      {
        name: "description",
        content: "Certified fungicides, insecticides, fertilizers, hybrid seeds, and sprayers with branch inventory in Cameroon.",
      },
      { property: "og:title", content: "Agro Hospital Input Store" },
      { property: "og:description", content: "Order inputs by category or crop disease with loyalty points in Cameroon." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: StorePage,
});

export function StorePage() {
  const { branch, cart, removeFromCart, setQty, pay, appliedCoupon, applyCoupon, removeCoupon, deliveryZone, setDeliveryZone, productCredit, openChatWithDept } = useAgro();

  // Mode switcher: Category vs Disease (Section 4.2)
  const [mode, setMode] = useState<"category" | "disease">("category");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCrop, setSelectedCrop] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(true);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "waiting" | "confirmed">("cart");
  const [paymentMethod, setPaymentMethod] = useState<"MTN MoMo" | "Orange Money" | "Card">("MTN MoMo");
  const [momoNumber, setMomoNumber] = useState("+237 677 00 11 22");
  const [useCredit, setUseCredit] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // Chemical safety modal
  const [safetyAcknowledgedProduct, setSafetyAcknowledgedProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStock = !inStockOnly || (p.stock[branch] ?? 0) > 0;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.pests.some((pest) => pest.toLowerCase().includes(q)) ||
      p.crops.some((crop) => crop.toLowerCase().includes(q));
    return matchesCat && matchesStock && matchesQuery;
  });

  // Filter diseases
  const filteredDiseases = DISEASES.filter((d) => {
    const matchesCrop = selectedCrop === "All" || d.crop === selectedCrop;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.crop.toLowerCase().includes(q) ||
      d.symptoms.toLowerCase().includes(q);
    return matchesCrop && matchesQuery;
  });

  // Calculate pricing
  const subtotal = cart.reduce(
    (sum, c) => sum + (c.mode === "unit" ? c.product.unitPrice : c.product.cartonPrice) * c.qty,
    0
  );
  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.discountType === "percentage" ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value;
  }
  const deliveryFee = deliveryZone === "in-town" ? 1500 : 3500;
  const netOrder = Math.max(0, subtotal - discount) + deliveryFee;
  const creditDeduction = useCredit ? Math.min(productCredit, netOrder) : 0;
  const finalTotal = Math.max(0, netOrder - creditDeduction);
  const totalEarnedPoints = cart.reduce(
    (s, c) => s + c.product.points * c.qty * (c.mode === "carton" ? c.product.cartonQty : 1),
    0
  );

  const handlePlaceOrder = async () => {
    setCheckoutStep("waiting");
    const orderId = await pay(paymentMethod, useCredit);
    if (orderId) {
      setLastOrderId(orderId);
      setCheckoutStep("confirmed");
    } else {
      setCheckoutStep("checkout");
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Cart trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Input Store</h1>
          <p className="text-xs text-muted-foreground">Certified farm supplies with {branch} branch inventory.</p>
        </div>

        <button
          onClick={() => {
            setCheckoutStep("cart");
            setCartOpen(true);
          }}
          className="relative flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-soft hover:bg-primary/90 transition"
          aria-label="View Cart"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground ml-0.5">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by input name, crop (e.g. Cocoa), or disease..."
          className="w-full rounded-2xl border border-border bg-card pl-10 pr-9 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary focus:bg-background shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Section 4.2 / 5.3: Mode Switcher */}
      <div className="grid grid-cols-2 rounded-2xl bg-muted/80 p-1 border border-border/60">
        <button
          onClick={() => setMode("category")}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            mode === "category" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          By Category
        </button>
        <button
          onClick={() => setMode("disease")}
          className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mode === "disease" ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          By Disease / Pest
        </button>
      </div>

      {/* MODE 1: BY CATEGORY */}
      {mode === "category" && (
        <div className="space-y-3">
          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {["All", ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === c
                    ? "border-primary bg-primary text-primary-foreground shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-primary rounded"
            />
            <span>
              Only show items in stock at <b className="text-foreground">{branch}</b>
            </span>
          </label>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={() => setSelectedProduct(p)}
                onSafetyCheck={() => setSafetyAcknowledgedProduct(p)}
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-2 py-12 text-center text-xs text-muted-foreground">
                No items match your criteria at {branch}. Try clearing filters or switching branches.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: BY DISEASE / PEST (Section 4.2: Disease to purchase flow) */}
      {mode === "disease" && (
        <div className="space-y-3">
          {/* Crop Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {["All", ...CROPS].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCrop === c
                    ? "border-primary bg-primary text-primary-foreground shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {c === "All" ? "All Crops" : c}
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-secondary/50 p-3 text-xs text-secondary-foreground border border-primary/20 flex items-center justify-between">
            <span>Diagnose visual symptoms and view agronomist-recommended products.</span>
          </div>

          <div className="space-y-3">
            {filteredDiseases.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDisease(d)}
                className="group rounded-2xl border border-border/80 bg-card p-4 shadow-soft hover:border-primary/40 transition cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl">
                    {d.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                      {d.crop}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-foreground group-hover:text-primary transition leading-snug">
                      {d.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {d.symptoms}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px] font-semibold text-primary">
                  <span>View treatments & recommended inputs</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL (S23) */}
      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(v) => !v && setSelectedProduct(null)}
        onSafetyCheck={(p) => setSafetyAcknowledgedProduct(p)}
      />

      {/* DISEASE DETAIL MODAL (S25) */}
      <DiseaseDetailModal
        disease={selectedDisease}
        open={!!selectedDisease}
        onOpenChange={(v) => !v && setSelectedDisease(null)}
        onSelectProduct={(p) => {
          setSelectedDisease(null);
          setSelectedProduct(p);
        }}
      />

      {/* CHEMICAL SAFETY ACKNOWLEDGMENT MODAL (Section 6.5) */}
      <ChemicalSafetyModal
        product={safetyAcknowledgedProduct}
        open={!!safetyAcknowledgedProduct}
        onOpenChange={(v) => !v && setSafetyAcknowledgedProduct(null)}
      />

      {/* CART & CHECKOUT SHEET (S27, S28, S29, S30) */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="bottom" className="mx-auto max-w-md h-[90vh] rounded-t-3xl p-0 flex flex-col bg-background">
          <SheetHeader className="p-4 border-b bg-card rounded-t-3xl">
            <SheetTitle className="flex items-center justify-between text-base font-bold text-foreground">
              <span>
                {checkoutStep === "cart" && `Your Cart (${cart.length} items)`}
                {checkoutStep === "checkout" && "Order Checkout"}
                {checkoutStep === "waiting" && "Processing Payment"}
                {checkoutStep === "confirmed" && "Order Confirmed!"}
              </span>
              <span className="text-xs font-normal text-muted-foreground">{branch} Branch</span>
            </SheetTitle>
          </SheetHeader>

          {/* STEP 1: CART REVIEW */}
          {checkoutStep === "cart" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {cart.length === 0 ? (
                  <div className="py-20 text-center text-muted-foreground text-xs">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    Your cart is currently empty.
                  </div>
                ) : (
                  cart.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-soft"
                    >
                      <span className="text-3xl">{c.product.emoji}</span>
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-foreground truncate">{c.product.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {xaf(c.mode === "unit" ? c.product.unitPrice : c.product.cartonPrice)} • Earn{" "}
                          <span className="text-primary font-bold">
                            {pts(c.product.points * c.qty * (c.mode === "carton" ? c.product.cartonQty : 1))}
                          </span>
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQty(i, c.qty - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted font-bold text-foreground"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs">{c.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(i, c.qty + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted font-bold text-foreground"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(i)}
                        className="text-destructive p-2 hover:bg-destructive/10 rounded-xl transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t bg-card space-y-3">
                  {/* Coupon section */}
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-2.5 text-xs text-primary border border-primary/20">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" /> Coupon: <b>{appliedCoupon.code}</b> ({xaf(discount)} off)
                      </span>
                      <button type="button" onClick={removeCoupon} className="text-xs font-bold text-destructive">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Coupon code (e.g. COCOA26)"
                        className="flex-1 rounded-xl border bg-muted px-3 py-2 text-xs font-semibold uppercase outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (applyCoupon(couponInput)) setCouponInput("");
                        }}
                        className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-xs"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border pt-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-foreground font-semibold">{xaf(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-primary font-semibold">
                        <span>Discount</span>
                        <span>-{xaf(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Est. Points Earned</span>
                      <span className="text-primary font-bold">+{pts(totalEarnedPoints)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCheckoutStep("checkout")}
                    className="w-full rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-soft hover:bg-primary/90 transition flex items-center justify-center gap-2"
                  >
                    Proceed to Delivery & Payment <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CHECKOUT DETAILS & PAYMENT */}
          {checkoutStep === "checkout" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Delivery Zone Selector */}
                <div className="rounded-2xl border border-border bg-card p-3.5 shadow-soft">
                  <label className="text-xs font-bold text-foreground block mb-2 flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-primary" /> Delivery Zone & Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryZone("in-town")}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        deliveryZone === "in-town"
                          ? "border-primary bg-secondary/50 text-foreground"
                          : "border-border bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <p className="text-xs font-bold text-primary">In-Town Rider</p>
                      <p className="text-[11px] text-muted-foreground">Within 15km • 1 500 XAF</p>
                      <p className="text-[10px] text-primary/80 mt-1">Live GPS tracking</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryZone("out-of-town")}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        deliveryZone === "out-of-town"
                          ? "border-primary bg-secondary/50 text-foreground"
                          : "border-border bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <p className="text-xs font-bold text-primary">Regional Courier</p>
                      <p className="text-[11px] text-muted-foreground">Garantie Express • 3 500 XAF</p>
                      <p className="text-[10px] text-primary/80 mt-1">Waybill tracking</p>
                    </button>
                  </div>
                </div>

                {/* Section 6.2: Loyalty / Referral Credit toggle */}
                {productCredit > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-3.5 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-foreground">Use Referral Product Credit</p>
                        <p className="text-[11px] text-muted-foreground">
                          Available balance: <b className="text-primary">{xaf(productCredit)}</b>
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={useCredit}
                        onChange={(e) => setUseCredit(e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                    </div>
                    {useCredit && (
                      <p className="mt-2 text-[10px] text-muted-foreground bg-muted p-2 rounded-lg">
                        Applied -{xaf(creditDeduction)} to this order. (Credits are redeemable on agricultural products only).
                      </p>
                    )}
                  </div>
                )}

                {/* Payment Method Selector */}
                <div className="rounded-2xl border border-border bg-card p-3.5 shadow-soft">
                  <label className="text-xs font-bold text-foreground block mb-2">Select Payment Method</label>
                  <div className="space-y-2">
                    {[
                      { id: "MTN MoMo", label: "MTN Mobile Money", emoji: "🟡" },
                      { id: "Orange Money", label: "Orange Money Cameroon", emoji: "🟠" },
                      { id: "Card", label: "Debit / Credit Card (Stripe)", emoji: "💳" },
                    ].map((m) => (
                      <label
                        key={m.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                          paymentMethod === m.id
                            ? "border-primary bg-secondary/40 text-foreground font-semibold"
                            : "border-border bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-xs">
                          <span>{m.emoji}</span>
                          <span>{m.label}</span>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === m.id}
                          onChange={() => setPaymentMethod(m.id as any)}
                          className="accent-primary"
                        />
                      </label>
                    ))}
                  </div>

                  {(paymentMethod === "MTN MoMo" || paymentMethod === "Orange Money") && (
                    <div className="mt-3">
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Payer Phone Number
                      </label>
                      <input
                        type="tel"
                        value={momoNumber}
                        onChange={(e) => setMomoNumber(e.target.value)}
                        className="w-full rounded-xl border bg-muted px-3 py-2 text-xs font-bold outline-none focus:border-primary"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Summary and Pay Action */}
              <div className="p-4 border-t bg-card space-y-3">
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Products</span>
                    <span>{xaf(subtotal - discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{xaf(deliveryFee)}</span>
                  </div>
                  {creditDeduction > 0 && (
                    <div className="flex justify-between text-primary font-semibold">
                      <span>Product Credit Applied</span>
                      <span>-{xaf(creditDeduction)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-foreground border-t border-border pt-1">
                    <span>Total Due</span>
                    <span className="text-primary">{xaf(finalTotal)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className="rounded-2xl border border-border px-4 py-3 text-xs font-bold text-muted-foreground hover:bg-muted"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="flex-1 rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-soft hover:bg-primary/90 transition"
                  >
                    Pay {xaf(finalTotal)} with {paymentMethod}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT WAITING PROMPT (S29) */}
          {checkoutStep === "waiting" && (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
              <h3 className="text-lg font-bold text-foreground">Waiting for Payment Confirmation</h3>
              <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                A payment authorization prompt has been sent to <b className="text-foreground">{momoNumber}</b>.
                Please enter your PIN on your phone to approve the transaction.
              </p>
              <div className="mt-4 rounded-xl bg-secondary px-3 py-1.5 text-[11px] font-semibold text-primary">
                Listening for gateway callback...
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMED (S30) */}
          {checkoutStep === "confirmed" && (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-primary mb-4 shadow-soft">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Order Successfully Placed!</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Order reference: <b className="text-primary font-mono">{lastOrderId}</b>
              </p>
              <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                Your items are now being prepared at the {branch} warehouse. You will earn{" "}
                <b className="text-primary font-bold">+{pts(totalEarnedPoints)}</b> once delivery is inspected and received!
              </p>

              <div className="mt-6 w-full space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(false);
                    // navigate to orders
                    window.location.href = "/orders";
                  }}
                  className="w-full rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-soft flex items-center justify-center gap-1.5"
                >
                  <Truck className="h-4 w-4" /> Track Order Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="w-full rounded-2xl border border-border py-2.5 text-xs font-semibold text-muted-foreground"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ProductCard({
  product,
  onSelect,
  onSafetyCheck,
}: {
  product: Product;
  onSelect: () => void;
  onSafetyCheck: () => void;
}) {
  const { branch, addToCart } = useAgro();
  const [packMode, setPackMode] = useState<"unit" | "carton">("unit");
  const qty = product.stock[branch] ?? 0;
  const isOutOfStock = qty === 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error("Item out of stock at this branch");
      return;
    }
    // If it's a chemical fungicide/insecticide, prompt safety check once
    if (
      (product.category === "Fungicides" || product.category === "Insecticides" || product.category === "Herbicides") &&
      !product.restricted
    ) {
      onSafetyCheck();
      return;
    }
    if (product.restricted) {
      toast.error("Agronomist authorization required", {
        description: "This restricted chemical cannot be added directly without approval.",
      });
      onSelect();
      return;
    }
    addToCart(product, packMode, 1);
  };

  return (
    <div
      onClick={onSelect}
      className="clay-card clay-card-hover group flex flex-col justify-between p-3.5 cursor-pointer"
    >
      <div>
        {/* Emoji Image Container */}
        <div className="relative flex h-28 items-center justify-center rounded-2xl bg-secondary/70 text-5xl group-hover:scale-105 transition shadow-xs">
          {product.emoji}
          {/* Section 6.1: Points tag */}
          <span className="absolute left-2 top-2 rounded-full bg-gold px-2.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
            +{pts(packMode === "unit" ? product.points : product.points * product.cartonQty)}
          </span>

          {product.restricted && (
            <span className="absolute right-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
              Restricted
            </span>
          )}
        </div>

        <div className="mt-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="text-xs font-bold text-foreground leading-snug line-clamp-2 mt-0.5 group-hover:text-primary transition">
            {product.name}
          </h3>

          {/* Pack Mode selector */}
          <div className="mt-2.5 flex rounded-xl bg-muted p-1 text-[10px] font-bold">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPackMode("unit");
              }}
              className={`flex-1 py-1 rounded-lg transition ${
                packMode === "unit" ? "bg-white text-foreground shadow-xs font-extrabold" : "text-muted-foreground"
              }`}
            >
              1 Unit
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPackMode("carton");
              }}
              className={`flex-1 py-1 rounded-lg transition ${
                packMode === "carton" ? "bg-white text-foreground shadow-xs font-extrabold" : "text-muted-foreground"
              }`}
            >
              Carton (×{product.cartonQty})
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3.5 border-t border-border/60 pt-2.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold text-foreground">
            {xaf(packMode === "unit" ? product.unitPrice : product.cartonPrice)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {isOutOfStock ? (
              <span className="text-destructive font-bold">Out of stock</span>
            ) : qty < 6 ? (
              <span className="text-earth font-bold">{qty} left</span>
            ) : (
              <span className="text-primary font-bold">In stock</span>
            )}
          </p>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAdd}
          className="clay-btn-primary rounded-xl p-2.5 text-primary-foreground shadow-xs hover:scale-105 active:scale-95 disabled:opacity-40 transition"
          aria-label="Add to cart"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ProductDetailModal({
  product,
  open,
  onOpenChange,
  onSafetyCheck,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSafetyCheck: (p: Product) => void;
}) {
  const { addToCart, branch, openChatWithDept } = useAgro();
  const [mode, setMode] = useState<"unit" | "carton">("unit");
  if (!product) return null;

  const qty = product.stock[branch] ?? 0;
  const isOutOfStock = qty === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl bg-card border-none shadow-card max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="bg-secondary/60 p-6 flex flex-col items-center justify-center relative text-center">
          <span className="text-6xl mb-2">{product.emoji}</span>
          <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
            {product.category}
          </span>
          <h2 className="mt-2 text-base font-bold text-foreground max-w-xs">{product.name}</h2>
          <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Branch stock: {qty} units</span> •{" "}
            <span className="text-primary font-bold">Earn {pts(product.points)}</span>
          </div>

          {product.restricted && (
            <div className="mt-3 flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
              <ShieldAlert className="h-3.5 w-3.5" /> Agronomist Approval Required
            </div>
          )}
        </div>

        {/* Details Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Section 6.5: Safety / PPE tab */}
          {product.safety && product.safety.length > 0 && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-3.5">
              <h4 className="font-bold text-destructive flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="h-4 w-4" /> Safety & Handling Warnings
              </h4>
              <ul className="space-y-1 text-muted-foreground list-disc pl-4 text-[11px]">
                {product.safety.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
              {product.ppe && product.ppe.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-foreground">Required PPE:</span>
                  {product.ppe.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-card px-2 py-0.5 text-[10px] font-bold text-foreground border border-border"
                    >
                      🛡️ {item}
                    </span>
                  ))}
                </div>
              )}
              {product.phi && (
                <div className="mt-2 text-[10px] text-muted-foreground">
                  <b>Pre-Harvest Interval (PHI):</b> {product.phi}
                </div>
              )}
            </div>
          )}

          {/* Dosage & Usage */}
          <div>
            <h4 className="font-bold text-foreground mb-1">Recommended Dosage & Application</h4>
            <p className="text-muted-foreground leading-relaxed bg-muted p-3 rounded-xl">{product.dosage}</p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-1">Field Usage Instructions</h4>
            <p className="text-muted-foreground leading-relaxed">{product.usage}</p>
          </div>

          {product.pests.length > 0 && (
            <div>
              <h4 className="font-bold text-foreground mb-1.5">Target Pests & Diseases</h4>
              <div className="flex flex-wrap gap-1.5">
                {product.pests.map((p) => (
                  <span key={p} className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t bg-card flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Price ({mode})</p>
            <p className="text-base font-extrabold text-foreground">
              {xaf(mode === "unit" ? product.unitPrice : product.cartonPrice)}
            </p>
          </div>

          {product.restricted ? (
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                openChatWithDept("Crop protection & inputs", `Requesting approval to purchase: ${product.name}`);
              }}
              className="rounded-2xl bg-destructive px-5 py-3 text-xs font-bold text-white shadow-soft flex items-center gap-1.5"
            >
              <MessageCircle className="h-4 w-4" /> Request Agronomist Approval
            </button>
          ) : (
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => {
                addToCart(product, mode, 1);
                onOpenChange(false);
              }}
              className="rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DiseaseDetailModal({
  disease,
  open,
  onOpenChange,
  onSelectProduct,
}: {
  disease: Disease | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelectProduct: (p: Product) => void;
}) {
  const { addToCart } = useAgro();
  if (!disease) return null;

  const recommended = PRODUCTS.filter((p) => disease.recommendedProductIds.includes(p.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl bg-card border-none shadow-card max-h-[85vh] flex flex-col">
        <div className="bg-hero p-5 text-white">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{disease.emoji}</span>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              {disease.crop}
            </span>
          </div>
          <h2 className="mt-2 text-base font-bold leading-snug">{disease.name}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-foreground mb-1">Observed Symptoms</h4>
            <p className="text-muted-foreground leading-relaxed bg-muted/60 p-3 rounded-xl">{disease.symptoms}</p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-1">Underlying Cause</h4>
            <p className="text-muted-foreground leading-relaxed">{disease.cause}</p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-1">Field Prevention & Sanitation</h4>
            <p className="text-muted-foreground leading-relaxed">{disease.prevention}</p>
          </div>

          <div className="border-t border-border pt-3">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Recommended Input Solutions
            </h4>
            <div className="space-y-2">
              {recommended.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-2.5 shadow-xs"
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
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 border-t bg-muted/40 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl bg-card border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChemicalSafetyModal({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { addToCart } = useAgro();
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-3xl bg-card border-none shadow-card text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-foreground">Mandatory Chemical Safety Notice</h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          You are adding <b className="text-foreground">{product.name}</b> to your cart. As per pesticide safety regulations:
        </p>

        <div className="my-4 rounded-xl bg-muted p-3 text-left text-xs text-muted-foreground space-y-1.5">
          <p className="flex items-center gap-2">
            <span>🧤</span> Always wear chemical-resistant gloves, mask & goggles.
          </p>
          <p className="flex items-center gap-2">
            <span>🌧️</span> Never spray if heavy rains are predicted within 6 hours.
          </p>
          <p className="flex items-center gap-2">
            <span>👶</span> Keep out of reach of children and domestic livestock.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-2xl border border-border py-3 text-xs font-semibold text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              addToCart(product, "unit", 1);
              onOpenChange(false);
            }}
            className="flex-1 rounded-2xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-soft"
          >
            I Acknowledge & Add
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
