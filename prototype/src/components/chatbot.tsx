"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, RotateCcw, Sparkles, ArrowRight } from "lucide-react";
import { useDemo } from "@/lib/store";
import { replyTo } from "@/lib/chat";
import { AssistantAvatar, Dialog } from "./ui";
export function Chatbot({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const demo = useDemo();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [demo.data?.chat.messages, typing, open]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  if (!demo.data) return null;
  const chat = demo.data.chat;
  const ask = (text: string) => {
    if (typing || !text.trim()) return;
    if (text === "Plan my kitchen") {
      demo.useChatDraft();
      setOpen(false);
      router.push("/kitchen-enquiry");
      return;
    }
    if (text === "Official contact page") {
      window.open(
        "https://www.onestopcabinets.com.au/contact-us/",
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    const user = {
      id: crypto.randomUUID(),
      role: "user" as const,
      text: text.trim().slice(0, 1000),
    };
    demo.setChat({ ...chat, messages: [...chat.messages, user] });
    setInput("");
    setTyping(true);
    timer.current = setTimeout(() => {
      const result = replyTo(user.text, chat);
      demo.setChat({
        ...chat,
        captured: result.captured,
        pending: result.pending,
        messages: [
          ...chat.messages,
          user,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: result.text,
            actions: result.actions,
          },
        ],
      });
      setTyping(false);
    }, 650);
  };
  return (
    <>
      <button
        className="chat-launch"
        aria-label="Ask Our Kitchen Assistant"
        onClick={() => setOpen(true)}
      >
        <AssistantAvatar small />
        <span className="chat-launch-copy">
          <strong>Ask Kiki</strong>
          <small>Your kitchen assistant</small>
        </span>
        <span className="chat-launch-dot" />
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Your kitchen assistant"
        className="chat-dialog"
        heading={
          <div className="assistant-heading">
            <AssistantAvatar />
            <div>
              <h2>Meet Kiki.</h2>
              <span>Your kitchen planning assistant</span>
            </div>
          </div>
        }
      >
        <div className="chat-subtitle">
          <Sparkles size={14} /> A little guidance. A clearer kitchen plan.
        </div>
        <div className="chat-messages" aria-live="polite">
          {chat.messages.map((m, i) => (
            <div key={m.id} className={`chat-row ${m.role}`}>
              <div className="chat-bubble">
                {m.role === "assistant" && <AssistantAvatar small />}
                <p>{m.text}</p>
              </div>
              {i === chat.messages.length - 1 &&
                m.role === "assistant" &&
                !typing && (
                  <div className="chat-suggestions">
                    {m.actions?.map((a) => (
                      <button key={a} onClick={() => ask(a)}>
                        {a}
                        <ArrowRight size={13} />
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
          {typing && (
            <div className="assistant-typing">
              <AssistantAvatar small />
              <div className="typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
              <small>Kiki is thinking…</small>
            </div>
          )}
          <div ref={end} />
        </div>
        {Object.keys(chat.captured).length > 0 && (
          <button
            className="chat-transfer"
            onClick={() => ask("Plan my kitchen")}
          >
            Continue with my kitchen plan <ArrowRight size={15} />
          </button>
        )}
        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            aria-label="Message the kitchen assistant"
            placeholder="Ask Kiki about your kitchen…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1000}
          />
          <button
            className="icon-button"
            aria-label="Send message"
            disabled={typing || !input.trim()}
          >
            <Send size={19} />
          </button>
        </form>
        <div className="chat-footer">
          <span>Demo assistant · nothing is sent</span>
          <button
            aria-label="Restart conversation"
            className="icon-button"
            disabled={typing}
            onClick={() => demo.restartChat()}
          >
            <RotateCcw size={14} />
            <span>Restart</span>
          </button>
        </div>
      </Dialog>
    </>
  );
}
