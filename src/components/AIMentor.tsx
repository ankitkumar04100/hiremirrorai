import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Trash2, Sparkles, Download, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const MENTOR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mentor-chat`;

const quickChips = [
  { label: "Improve Communication", emoji: "🗣️" },
  { label: "Prepare for FAANG", emoji: "🚀" },
  { label: "Fix Resume", emoji: "📄" },
  { label: "Explain My Score", emoji: "📊" },
  { label: "Mock Behavioral Question", emoji: "🎯" },
  { label: "Give Me Weekly Plan", emoji: "📅" },
];

const SESSION_KEY = "hiremirror_mentor_session";

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// User context — in a real app this would come from DB/state
const userContext = {
  name: "Ankit",
  targetRole: "Frontend Engineer",
  readinessScore: 79,
  streak: 12,
  interviewsDone: 23,
  rank: 147,
  technicalScore: 78,
  communicationScore: 65,
  problemSolvingScore: 82,
  softSkillsScore: 70,
  leadershipScore: 55,
  domainScore: 85,
  atsScore: 72,
  missingKeywords: ["TypeScript", "GraphQL", "CI/CD", "Agile"],
  strongAreas: ["React", "JavaScript", "Problem Solving"],
  lastInterviewScore: 82,
  behavioralScore: 65,
  weakestArea: "Communication & Soft Skills",
  strongestArea: "Domain Knowledge",
  badges: ["First Interview", "7-Day Streak", "Resume Pro", "Quick Thinker"],
};

export default function AIMentor() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(getSessionId());

  // Load chat history on first open
  useEffect(() => {
    if (!open || messages.length > 0) return;
    loadHistory();
  }, [open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data } = await supabase
        .from("mentor_chat_messages")
        .select("role, content")
        .eq("session_id", sessionId.current)
        .order("created_at", { ascending: true })
        .limit(50);
      if (data && data.length > 0) {
        setMessages(data.map((d) => ({ role: d.role as "user" | "assistant", content: d.content })));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
    setLoadingHistory(false);
  };

  const persistMsg = async (role: string, content: string) => {
    await supabase.from("mentor_chat_messages").insert({
      session_id: sessionId.current,
      role,
      content,
    });
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    persistMsg("user", userMsg.content);

    let assistantSoFar = "";
    const updateAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(MENTOR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.slice(-20), // last 20 messages for context
          userContext,
        }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to connect to AI Mentor");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Flush remaining
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) updateAssistant(content);
          } catch {}
        }
      }

      // Persist full assistant response
      if (assistantSoFar) {
        persistMsg("assistant", assistantSoFar);
      }
    } catch (e: any) {
      console.error("Mentor chat error:", e);
      const errorMsg: Msg = { role: "assistant", content: `⚠️ ${e.message || "Something went wrong. Please try again."}` };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setIsLoading(false);
  }, [messages, isLoading]);

  const clearChat = async () => {
    await supabase.from("mentor_chat_messages").delete().eq("session_id", sessionId.current);
    setMessages([]);
  };

  const downloadTranscript = () => {
    const text = messages.map((m) => `[${m.role.toUpperCase()}]\n${m.content}\n`).join("\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mentor-chat-transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg glow-blue cursor-pointer"
            aria-label="Open AI Mentor"
          >
            <Bot className="w-6 h-6 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-green animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] flex flex-col rounded-2xl border border-border overflow-hidden"
            style={{ background: "hsl(var(--card))", boxShadow: "var(--shadow-card)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">AI Career Mentor</h3>
                  <p className="text-[10px] text-muted-foreground">Context-aware • Personalized</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={downloadTranscript} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" title="Download transcript">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors" title="Clear chat">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" title="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {loadingHistory && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}

              {!loadingHistory && messages.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🤖</div>
                  <h4 className="font-semibold text-foreground text-sm">Hi {userContext.name}!</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto">
                    I'm your AI Career Mentor. I know your scores, resume, and interview history. Ask me anything!
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                    {quickChips.map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => sendMessage(chip.label)}
                        className="text-[11px] px-2.5 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all"
                      >
                        {chip.emoji} {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/50 text-foreground rounded-bl-md border border-border/50"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_strong]:text-foreground [&_code]:text-primary [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3 border border-border/50">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick chips when conversation is active */}
            {messages.length > 0 && !isLoading && (
              <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
                {quickChips.slice(0, 3).map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => sendMessage(chip.label)}
                    className="text-[10px] px-2 py-1 rounded-full border border-border hover:border-primary/50 hover:bg-primary/10 text-muted-foreground whitespace-nowrap transition-all flex-shrink-0"
                  >
                    {chip.emoji} {chip.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-border bg-muted/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your AI mentor..."
                  disabled={isLoading}
                  className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
