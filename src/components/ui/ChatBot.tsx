import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { sendMessage, type ChatMessage } from "../../lib/gemini";
import { useAuth } from "../../hooks/useAuth";

function formatMessage(text: string) {
  // Convert markdown code blocks and basic formatting to JSX
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
      return (
        <pre
          key={i}
          className="bg-[#1a1a1a] rounded-lg p-3 text-xs overflow-x-auto my-2 text-green-400 font-mono"
        >
          {code}
        </pre>
      );
    }
    return (
      <span key={i} className="whitespace-pre-wrap">
        {part}
      </span>
    );
  });
}

export default function ChatBot() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: `Hi ${user?.fullName?.split(" ")[0] || "there"}! 👋 I'm BigO Bot, your DSA tutor. Ask me anything about algorithms, data structures, or problem-solving!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Only show for students
  if (!isAuthenticated || user?.role !== "STUDENT") return null;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: "user", text };
    const updatedHistory = [...messages, userMessage];

    setMessages(updatedHistory);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      // Send all previous messages as history except the last user message
      const history = messages;
      const response = await sendMessage(history, text);
      setMessages([...updatedHistory, { role: "model", text: response }]);
    } catch (err: any) {
      console.error("Gemini error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border)",
            height: "500px",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#D32F2F]">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">BigO Bot</p>
              <p className="text-red-100 text-xs">DSA Tutor · Always here</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "model" && (
                  <div className="w-6 h-6 rounded-full bg-[#D32F2F]/20 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <Bot size={12} className="text-[#D32F2F]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-[#D32F2F] text-white rounded-br-sm"
                      : "rounded-bl-sm"
                  }`}
                  style={
                    msg.role === "model"
                      ? {
                          backgroundColor: "var(--bg-elevated)",
                          color: "var(--text-primary)",
                        }
                      : {}
                  }
                >
                  {formatMessage(msg.text)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-[#D32F2F]/20 flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot size={12} className="text-[#D32F2F]" />
                </div>
                <div
                  className="px-4 py-3 rounded-2xl rounded-bl-sm"
                  style={{ backgroundColor: "var(--bg-elevated)" }}
                >
                  <Loader2 size={16} className="animate-spin text-[#D32F2F]" />
                </div>
              </div>
            )}

            {error && (
              <p className="text-center text-xs text-red-400">{error}</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="px-3 py-3 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ backgroundColor: "var(--bg-elevated)" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about algorithms..."
                className="flex-1 bg-transparent text-sm focus:outline-none"
                style={{ color: "var(--text-primary)" }}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C]
                  disabled:opacity-40 flex items-center justify-center
                  transition-colors flex-shrink-0"
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
            <p
              className="text-center text-xs mt-2"
              style={{ color: "var(--text-muted)" }}
            >
              Powered by Gemini · DSA questions only
            </p>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full
          bg-[#D32F2F] hover:bg-[#B71C1C] shadow-lg
          flex items-center justify-center transition-all
          hover:scale-110 active:scale-95"
      >
        {isOpen ? (
          <X size={22} className="text-white" />
        ) : (
          <MessageCircle size={22} className="text-white" />
        )}

        {/* Pulse animation when closed */}
        {!isOpen && (
          <span className="absolute w-full h-full rounded-full bg-[#D32F2F] animate-ping opacity-30" />
        )}
      </button>
    </>
  );
}
