import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Bell, CheckCheck, Clock, ExternalLink, Sparkles, Truck } from "lucide-react";
import { useAgro } from "@/lib/agro-store";
import { Link } from "@tanstack/react-router";

export function NotificationsDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { notifications, markNotificationRead } = useAgro();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-sm sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b bg-card">
          <SheetTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <Bell className="h-5 w-5 text-primary" /> Notifications Inbox
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              <CheckCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
              All caught up! No new notifications.
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = n.type === "order" ? Truck : n.type === "promo" ? Sparkles : Clock;
              return (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3.5 rounded-2xl border transition ${
                    n.read ? "bg-card/70 border-border/60" : "bg-secondary/40 border-primary/20 shadow-soft"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-xl bg-card text-primary shadow-xs">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-semibold truncate ${n.read ? "text-foreground" : "text-primary"}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                      {n.deepLink && (
                        <div className="mt-2.5">
                          <Link
                            to={n.deepLink}
                            onClick={() => onOpenChange(false)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                          >
                            View details <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

