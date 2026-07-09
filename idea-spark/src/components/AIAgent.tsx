import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { chatWithAgent, type AgentMessage } from "@/lib/agent";
import { Link } from "@tanstack/react-router";

const STARTER_PROMPTS = [
  "Is my idea any good?",
  "What makes a startup idea HOT?",
  "How do I find my first 100 users?",
  "What's a good TAM for India?",
];

const WELCOME_MSG: AgentMessage = {
  role: "assistant",
  content:
    "Hey! I'm **Spark** ⚡ — your AI startup advisor.\n\nShare your idea or ask me anything. I'll give you a straight answer in seconds. For a full deep-dive report, hit the Validate button!",
};

export function AIAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Show a nudge bubble after 8 seconds
  useEffect(() => {
    const t = setTimeout(() => setNudgeVisible(true), 8000);
    return () => clearTimeout(t);
  }, []);

  // Hide nudge once opened
  useEffect(() => {
    if (open) {
      setNudgeVisible(false);
      setHasUnread(false);
    }
  }, [open]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: AgentMessage = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Strip any leading assistant messages — Anthropic requires first msg to be "user"
      const historyToSend = newMessages
        .slice(-10)
        .filter((_, idx, arr) => {
          // Find the first user message index and only send from there
          const firstUserIdx = arr.findIndex((m) => m.role === "user");
          return idx >= firstUserIdx;
        });

      const { reply } = await chatWithAgent({ data: { messages: historyToSend } });
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      // Only mark as unread if the panel is closed
      if (!open) setHasUnread(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Spark agent error:", msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Oops — something went wrong on my end. Try again! 🙏\n\n_Error: ${msg.slice(0, 120)}_`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* ── Floating chat button ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 print:hidden">
        {/* Nudge bubble */}
        {nudgeVisible && !open && (
          <div
            className="animate-fade-up rounded-2xl border border-border/60 bg-surface/95 backdrop-blur px-4 py-2.5 shadow-glow text-sm max-w-[200px] text-right cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <p className="font-semibold text-foreground text-xs">👋 Got a startup idea?</p>
            <p className="text-muted-foreground text-xs mt-0.5">Ask Spark AI for a quick take!</p>
          </div>
        )}

        {/* FAB button */}
        <button
          id="ai-agent-fab"
          onClick={() => setOpen((v) => !v)}
          className="relative h-14 w-14 rounded-full bg-gradient-emerald shadow-glow hover:shadow-glow hover:scale-105 active:scale-95 transition-all duration-200 grid place-items-center"
          aria-label="Open AI advisor"
        >
          {open ? (
            <X className="h-5 w-5 text-background" />
          ) : (
            <MessageCircle className="h-5 w-5 text-background" />
          )}
          {/* Unread dot */}
          {hasUnread && !open && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive border-2 border-background animate-pulse" />
          )}
          {/* Pulse ring */}
          {!open && (
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          )}
        </button>
      </div>

      {/* ── Chat window ── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/60 bg-[#0d0d0d] shadow-glow flex flex-col overflow-hidden print:hidden animate-scale-in"
          style={{ maxHeight: "min(560px, calc(100dvh - 120px))" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/40 bg-surface/80 px-4 py-3 shrink-0">
            <div className="relative h-8 w-8 rounded-full bg-gradient-emerald grid place-items-center shrink-0">
              <Sparkles className="h-4 w-4 text-background" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-[#0d0d0d]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">Spark AI</p>
              <p className="text-xs text-muted-foreground">Startup advisor · Always online</p>
            </div>
            <Link
              to="/app"
              id="agent-validate-link"
              className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-gradient-emerald px-2.5 py-1.5 text-xs font-semibold text-background shadow-glow-sm hover:opacity-90 transition-all"
            >
              Validate <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} />
            ))}

            {/* Loading bubble */}
            {loading && (
              <div className="flex gap-2.5">
                <div className="h-7 w-7 rounded-full bg-gradient-emerald grid place-items-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-background" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-surface/80 border border-border/40 px-3 py-2.5 flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground">Thinking…</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Starter prompts — only show at start */}
          {messages.length <= 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full border border-border/50 bg-surface/60 px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-surface transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border/40 px-3 py-3 shrink-0 bg-surface/40">
            <div className="flex items-end gap-2 rounded-xl border border-border/50 bg-background/60 px-3 py-2 focus-within:border-primary/50 transition-colors">
              <textarea
                ref={inputRef}
                id="agent-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your idea…"
                rows={1}
                disabled={loading}
                className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/40 disabled:opacity-50 max-h-28 leading-relaxed"
                style={{ height: "auto" }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                id="agent-send-btn"
                className="h-7 w-7 rounded-lg bg-gradient-emerald grid place-items-center shrink-0 hover:opacity-90 disabled:opacity-30 transition-all"
                aria-label="Send"
              >
                <Send className="h-3.5 w-3.5 text-background" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground/40">
              Powered by Claude · Enter to send · Shift+Enter for newline
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ── ChatBubble ── */
function ChatBubble({ msg }: { msg: AgentMessage }) {
  const isUser = msg.role === "user";

  // Simple markdown-ish renderer: **bold**, newlines
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i, arr) => {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((p, j) =>
            j % 2 === 1 ? <strong key={j}>{p}</strong> : p
          )}
          {i < arr.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="h-7 w-7 rounded-full bg-gradient-emerald grid place-items-center shrink-0 self-end">
          <Sparkles className="h-3.5 w-3.5 text-background" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary/20 border border-primary/30 text-foreground rounded-tr-sm"
            : "bg-surface/80 border border-border/40 text-foreground/90 rounded-tl-sm"
        }`}
      >
        {renderContent(msg.content)}
      </div>
    </div>
  );
}
