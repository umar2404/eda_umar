"use client";

import { useState, useRef, useEffect } from "react";

export default function AIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "Kechirasiz, tizimda xatolik yuz berdi." }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Kechirasiz, aloqa uzildi." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="ai-chat-btn"
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "var(--gradient)",
          border: "none",
          boxShadow: "0 8px 32px rgba(99,102,241,0.5)",
          color: "white",
          fontSize: "1.8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10000,
          transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: isOpen ? "scale(0.8)" : "scale(1)",
        }}
      >
        {isOpen ? "✖" : "✨"}
      </button>

      {/* Chat Window */}
      <div className="ai-chat-window" style={{
        position: "fixed",
        bottom: "6rem",
        right: "2rem",
        width: "350px",
        height: "500px",
        background: "var(--bg-glass-strong)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--border-accent)",
        borderRadius: "var(--radius)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transformOrigin: "bottom right",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: isOpen ? "scale(1) translateY(0)" : "scale(0.8) translateY(20px)",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
      }}>
        {/* Header */}
        <div style={{
          padding: "1.25rem",
          background: "var(--gradient)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <div style={{ fontSize: "1.5rem" }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>AI Maslahatchi</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>Sizning shaxsiy dietologingiz</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--foreground-muted)", marginTop: "2rem", fontSize: "0.9rem" }}>
              Salom! Dietalar, mashqlar yoki vazn haqida savollaringiz bo'lsa bering.
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              background: msg.role === "user" ? "var(--primary)" : "rgba(255,255,255,0.05)",
              color: msg.role === "user" ? "#fff" : "var(--foreground)",
              border: msg.role === "user" ? "none" : "1px solid var(--border)",
              fontSize: "0.9rem",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}>
              {msg.content}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: "flex-start", padding: "0.5rem 1rem", background: "rgba(255,255,255,0.05)", borderRadius: "12px", display: "flex", gap: "4px" }}>
              <div className="typing-dot" style={{ animationDelay: "0s" }}></div>
              <div className="typing-dot" style={{ animationDelay: "0.2s" }}></div>
              <div className="typing-dot" style={{ animationDelay: "0.4s" }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} style={{
          padding: "1rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          gap: "0.5rem",
          background: "rgba(0,0,0,0.2)"
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Savolingizni yozing..."
            style={{
              flex: 1,
              background: "var(--bg-glass)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              padding: "0.75rem 1rem",
              color: "white",
              outline: "none",
              fontSize: "0.9rem"
            }}
          />
          <button type="submit" disabled={!input.trim() || loading} style={{
            background: "var(--gradient)",
            border: "none",
            borderRadius: "50%",
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer",
            flexShrink: 0
          }}>
            ➤
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .typing-dot {
          width: 6px;
          height: 6px;
          background: var(--foreground-muted);
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out both;
        }
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}} />
    </>
  );
}
