"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Phone,
  Calendar,
  Loader2,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

interface ChatMessage {
  id?: number | string;
  role: "user" | "assistant";
  message: string;
  topic?: string;
  suggestedActions?: string[];
  created_at?: string;
}

const QUICK_SUGGESTIONS = [
  "What packages do you offer?",
  "How much does wedding planning cost?",
  "Can you plan destination weddings?",
  "How do I book a consultation?",
  "How does the Client Studio work?",
];

export default function CelebrioChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [hasPromptedContact, setHasPromptedContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactSaved, setContactSaved] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID from localStorage or generate one
  useEffect(() => {
    let sid = "";
    try {
      sid = localStorage.getItem("celebrio_chat_session_id") || "";
    } catch {}

    if (!sid) {
      sid = `cs_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      try {
        localStorage.setItem("celebrio_chat_session_id", sid);
      } catch {}
    }
    setSessionId(sid);

    // Fetch message history if available
    fetch(`/api/chat?sessionId=${sid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // Welcome greeting
          setMessages([
            {
              role: "assistant",
              message:
                "Hello! 👋 I'm **Celebrio Concierge**, your 24/7 wedding and celebration planning assistant.\n\nHow can I help plan your special day? Feel free to ask about our packages, venue recommendations, or how our planning works!",
              suggestedActions: [
                "What packages do you offer?",
                "How much does wedding planning cost?",
                "Can you plan destination weddings?",
                "Book Free Consultation",
              ],
            },
          ]);
        }
      })
      .catch(() => {
        setMessages([
          {
            role: "assistant",
            message:
              "Hello! 👋 I'm **Celebrio Concierge**. How can I help you plan your dream wedding or celebration today?",
          },
        ]);
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: ChatMessage = { role: "user", message: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: text,
          userName: contactName || undefined,
          userPhone: contactPhone || undefined,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            message: data.reply,
            topic: data.topic,
            suggestedActions: data.suggestedActions,
          },
        ]);
      }
    } catch {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message:
            "I'm having a little trouble connecting right now, but you can always reach our wedding director directly at **+91 91825 27913** or through our consultation form!",
        },
      ]);
    }
  };

  const submitContactLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone.trim()) return;

    setContactSaved(true);
    await sendMessage(
      `Please have a celebration planner contact me. My Name: ${contactName || "Guest"}, Phone/WhatsApp: ${contactPhone}`
    );
  };

  return (
    <aside aria-label="Celebrio AI Concierge" className="fixed bottom-5 right-5 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="relative group">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-600/35 cursor-pointer"
            aria-label="Open Celebrio Concierge Chat"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400"></span>
            </span>
            <Sparkles size={18} className="text-amber-300" />
            <span>Chat with Celebrio</span>
          </button>

          {/* Prompt Badge on Hover */}
          <div className="pointer-events-none absolute -top-10 right-0 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            Ask pricing, venues &amp; planning tips ✨
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[560px] w-[370px] sm:w-[410px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-200 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-violet-800/20 bg-gradient-to-r from-violet-800 via-purple-800 to-indigo-900 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white font-bold backdrop-blur-sm border border-white/20 shadow-xs">
                  <Sparkles size={20} className="text-amber-300" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-violet-900 bg-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">
                  Celebrio Concierge
                </h3>
                <p className="flex items-center gap-1.5 text-[11px] text-violet-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online · Instant answers 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-violet-200 hover:bg-white/10 hover:text-white transition cursor-pointer"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <ChevronDown size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-violet-200 hover:bg-white/10 hover:text-white transition cursor-pointer"
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="flex items-center justify-between bg-violet-50/80 px-4 py-2 text-[11px] font-medium text-violet-900 border-b border-violet-100">
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-violet-600" />
              AI Wedding &amp; Event Planner
            </span>
            <button
              onClick={() => setHasPromptedContact(!hasPromptedContact)}
              className="text-violet-700 hover:text-violet-900 font-bold underline cursor-pointer"
            >
              {contactSaved ? "Lead Recorded ✓" : "Request Callback"}
            </button>
          </div>

          {/* Callback Form Drawer */}
          {hasPromptedContact && !contactSaved && (
            <form
              onSubmit={submitContactLead}
              className="border-b border-amber-200 bg-amber-50/90 p-3.5 text-xs text-amber-950 space-y-2 animate-fadeIn"
            >
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <Phone size={13} className="text-amber-700" />
                Want our director to call you directly?
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-1/2 rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone / WhatsApp *"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-1/2 rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setHasPromptedContact(false)}
                  className="rounded-lg px-2.5 py-1 text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-violet-700 px-3 py-1 font-bold text-white hover:bg-violet-800"
                >
                  Submit
                </button>
              </div>
            </form>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isAssistant ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`flex max-w-[85%] items-start gap-2 ${
                      isAssistant ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isAssistant
                          ? "bg-violet-100 text-violet-700"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      {isAssistant ? <Bot size={15} /> : <User size={14} />}
                    </span>

                    <div
                      className={`rounded-2xl px-4 py-3 shadow-xs leading-relaxed ${
                        isAssistant
                          ? "border border-slate-200 bg-white text-slate-800"
                          : "bg-violet-700 text-white font-medium"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.message}</div>
                    </div>
                  </div>

                  {/* Suggested Action Chips below assistant messages */}
                  {isAssistant && msg.suggestedActions && (
                    <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => sendMessage(act)}
                          className="flex items-center gap-1 rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-violet-700 transition hover:bg-violet-50 hover:border-violet-400 cursor-pointer shadow-2xs"
                        >
                          {act}
                          <ArrowRight size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading / Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs ml-9">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <Loader2 size={13} className="animate-spin" />
                </div>
                <span className="italic">Celebrio Concierge is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions header if few messages */}
          {messages.length <= 2 && (
            <div className="border-t border-slate-100 bg-white px-3 py-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Suggested Questions:
              </p>
              <div className="flex flex-wrap gap-1">
                {QUICK_SUGGESTIONS.slice(0, 3).map((qs, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(qs)}
                    className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition"
                  >
                    {qs}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              type="text"
              placeholder="Ask anything about packages, venues, pricing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-violet-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-700 text-white transition hover:bg-violet-800 disabled:opacity-40 cursor-pointer"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>

          <div className="bg-slate-50 py-1.5 text-center text-[10px] text-slate-400 border-t border-slate-100">
            Powered by Celebrio Concierge · All inquiries saved for follow-up
          </div>
        </div>
      )}
    </aside>
  );
}

