import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Home,
  MessageCircle,
  ShoppingBag,
  Stethoscope,
  Store,
  UserCircle2,
  WifiOff,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { BRANCHES, type Branch } from "@/lib/agro-data";
import { useAgro } from "@/lib/agro-store";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { ChatDrawer } from "./ChatDrawer";
import { OnboardingModal } from "./OnboardingModal";

// Section 3.1: Bottom navigation (5 tabs)
const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/store", label: "Shop", icon: Store },
  { to: "/clinic", label: "Doctor", icon: Stethoscope },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/profile", label: "Account", icon: UserCircle2 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const {
    branch,
    setBranch,
    tier,
    cart,
    unreadNotificationsCount,
    chatOpen,
    setChatOpen,
    onboardingOpen,
    setOnboardingOpen,
  } = useAgro();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    if (typeof window !== "undefined") {
      setOnline(navigator.onLine);
      window.addEventListener("online", up);
      window.addEventListener("offline", down);
      return () => {
        window.removeEventListener("online", up);
        window.removeEventListener("offline", down);
      };
    }
  }, []);

  const initials = tier.customer
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Section 3.1: Show floating chat shortcut on Home, Shop, and Orders screens
  const showFloatingChat = path === "/" || path === "/store" || path === "/orders";

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-32 text-foreground selection:bg-accent selection:text-accent-foreground font-sans relative antialiased">
      {/* Top Header with 20% Glassmorphism */}
      <header className="sticky top-0 z-30 glass-header shadow-xs">
        <div className="flex h-16 items-center justify-between px-4 sm:px-5">
          <Link to="/" aria-label="Agro Hospital home" className="flex items-center gap-2.5 group">
            <img
              src="/icon-512.png"
              alt="Agro Hospital PLC"
              className="h-9 w-9 rounded-xl object-contain shadow-xs border border-white/80 group-hover:scale-105 transition"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xs tracking-tight text-foreground leading-none">
                AGRO HOSPITAL
              </span>
              <span className="text-[9px] font-bold tracking-widest text-primary uppercase leading-tight mt-0.5">
                Farmer Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Branch selector */}
            <select
              aria-label="Active branch"
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value as Branch);
                toast(`Branch set to ${e.target.value}`);
              }}
              className="h-8.5 rounded-full border border-border/80 bg-card/80 px-2.5 text-[11px] font-bold text-foreground outline-none focus:border-primary shadow-xs"
            >
              {BRANCHES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>

            {/* Notifications Bell with unread badge */}
            <button
              aria-label="Notifications"
              onClick={() => setNotificationsOpen(true)}
              className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border/80 bg-card/80 hover:bg-card shadow-xs transition active:scale-95"
            >
              <Bell className="h-4 w-4 text-foreground" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Cart shortcut in header */}
            <Link
              to="/store"
              aria-label="View Cart"
              className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border/80 bg-card/80 hover:bg-card shadow-xs transition active:scale-95"
            >
              <ShoppingBag className="h-4 w-4 text-foreground" />
              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow-xs animate-in zoom-in">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Profile Avatar */}
            <Link
              to="/profile"
              aria-label="Profile"
              className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-xs hover:scale-105 transition"
            >
              {initials}
            </Link>
          </div>
        </div>

        {/* Section 7: Offline indicator */}
        {!online && (
          <div className="flex items-center justify-center gap-2 bg-warning/20 border-t border-warning/30 px-4 py-1.5 text-xs font-medium text-foreground">
            <WifiOff className="h-3.5 w-3.5 text-warning" />
            <span>You are offline. Showing cached catalogue and advisory.</span>
          </div>
        )}
      </header>

      {/* Greeting banner on Home */}
      {path === "/" && (
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{greet} 👋</p>
              <p className="text-xl font-bold tracking-tight text-foreground">{tier.customer}</p>
            </div>
            <button
              onClick={() => setOnboardingOpen(true)}
              className="rounded-full bg-secondary/80 px-3.5 py-1.5 text-[11px] font-bold text-primary border border-primary/20 hover:bg-secondary shadow-xs transition active:scale-95"
            >
              App Guide
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="px-4 sm:px-5 pt-2 pb-8 space-y-4">{children}</main>

      {/* Floating Chat shortcut button */}
      {showFloatingChat && (
        <button
          onClick={() => setChatOpen(true)}
          aria-label="Open chat with Agro Hospital"
          className="fixed bottom-24 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card border border-white/40 hover:scale-105 active:scale-95 transition"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent ring-2 ring-card" />
        </button>
      )}

      {/* 5-Tab Floating Glass Island Navigation (20% Glassmorphism + 20% Claymorphism) */}
      <div className="fixed bottom-4 inset-x-3 z-40 mx-auto max-w-md pointer-events-none">
        <nav className="glass-card rounded-3xl p-2 shadow-card border border-white/95 bg-card/94 backdrop-blur-2xl pointer-events-auto">
          <ul className="grid grid-cols-5 items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? path === "/" : path.startsWith(to);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`flex flex-col items-center justify-center py-2 px-1 transition-all rounded-2xl ${
                      active
                        ? "text-primary bg-secondary shadow-xs border border-primary/25 scale-[1.03]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 mb-1 transition-transform ${
                        active ? "scale-110 text-primary stroke-[2.4]" : "stroke-[1.85]"
                      }`}
                    />
                    <span
                      className={`tracking-tight text-[11px] leading-none ${
                        active ? "font-extrabold text-primary" : "font-semibold"
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Global Drawers & Modals */}
      <NotificationsDrawer open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      <ChatDrawer open={chatOpen} onOpenChange={setChatOpen} />
      <OnboardingModal open={onboardingOpen} onOpenChange={setOnboardingOpen} />
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between">
      <h2 className="text-base font-bold tracking-tight text-foreground">{children}</h2>
      {action}
    </div>
  );
}

