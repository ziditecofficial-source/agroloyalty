import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DEPARTMENTS } from "@/lib/agro-data";
import { useAgro } from "@/lib/agro-store";
import { Check, CheckCheck, Clock, MessageSquare, Send, Sparkles } from "lucide-react";

export function ChatDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { messages, sendMessage } = useAgro();
  const [dept, setDept] = useState<string>(DEPARTMENTS[0]);
  const [text, setText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim(), dept);
    setText("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-w-md h-[88vh] rounded-t-3xl p-0 flex flex-col bg-background">
        <SheetHeader className="p-4 border-b bg-card rounded-t-3xl">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-base font-bold text-foreground">
              <span className="p-2 rounded-xl bg-primary text-primary-foreground">
                <MessageSquare className="h-4 w-4" />
              </span>
              Agro Hospital Advisory Desk
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-leaf animate-pulse" /> Live
            </span>
          </SheetTitle>

          {/* Department selector */}
          <div className="pt-2">
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">Route inquiry to department:</label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDept(d)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold transition border ${
                    dept === d ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </SheetHeader>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="rounded-2xl bg-secondary/50 p-3 text-xs text-secondary-foreground border border-primary/10">
            <p className="font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Certified Agronomist Support
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Ask questions on pest infestations, dosage calculations, delivery schedules, or product recommendations.
            </p>
          </div>

          {messages.map((m) => {
            const isMe = m.from === "me";
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs shadow-soft ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-xs"
                      : "bg-card text-card-foreground border border-border/80 rounded-bl-xs"
                  }`}
                >
                  {m.attachment && (
                    <div className="mb-1.5 rounded-lg bg-black/10 px-2 py-1 text-[10px] font-medium">
                      📎 Context: {m.attachment}
                    </div>
                  )}
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                      isMe ? "text-primary-foreground/75" : "text-muted-foreground"
                    }`}
                  >
                    <span>{m.time}</span>
                    {isMe && (
                      m.queued ? (
                        <span title="Queued offline"><Clock className="h-2.5 w-2.5" /></span>
                      ) : (
                        <span title="Delivered"><CheckCheck className="h-3 w-3" /></span>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSend} className="p-3 border-t bg-card flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${dept}...`}
            className="flex-1 rounded-xl border bg-muted px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:bg-background"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

