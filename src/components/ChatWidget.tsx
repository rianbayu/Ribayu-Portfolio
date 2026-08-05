import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { greetingReply, quickPrompts, resolveReply } from "../data/chatKnowledge";
import { profile } from "../data/portfolio";
import TetrisRain from "./TetrisRain";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  chips?: string[];
  time: string;
};

const STORAGE_KEY = "rb-portfolio-chat";
const TEASER_KEY = "rb-portfolio-chat-teaser";

const stamp = () =>
  new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const openingMessage = (): ChatMessage => ({
  id: createId(),
  role: "bot",
  text: greetingReply.text,
  chips: greetingReply.chips,
  time: stamp(),
});

function readStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [openingMessage()];

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [openingMessage()];

    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [openingMessage()];

    return parsed;
  } catch {
    return [openingMessage()];
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(readStoredMessages);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [teaser, setTeaser] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const replyTimer = useRef<number | null>(null);

  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* penyimpanan penuh atau diblokir, abaikan */
    }
  }, [messages]);

  useEffect(() => {
    const log = logRef.current;
    if (!open || !log) return;

    log.scrollTo({
      top: log.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, typing, open, reduceMotion]);

  useEffect(() => {
    if (!open) return undefined;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 220);
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) return undefined;

    try {
      if (window.sessionStorage.getItem(TEASER_KEY)) return undefined;
    } catch {
      return undefined;
    }

    const timer = window.setTimeout(() => setTeaser(true), 7000);

    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(
    () => () => {
      if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    },
    [],
  );

  const dismissTeaser = useCallback(() => {
    setTeaser(false);
    try {
      window.sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      /* abaikan */
    }
  }, []);

  const sendMessage = useCallback(
    (value: string) => {
      const question = value.trim();
      if (!question || typing) return;

      setMessages((current) => [
        ...current,
        { id: createId(), role: "user", text: question, time: stamp() },
      ]);
      setDraft("");
      setTyping(true);

      const reply = resolveReply(question);
      const delay = reduceMotion
        ? 220
        : Math.min(1200, 420 + reply.text.length * 3);

      replyTimer.current = window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            id: createId(),
            role: "bot",
            text: reply.text,
            chips: reply.chips,
            time: stamp(),
          },
        ]);
        setTyping(false);
      }, delay);
    },
    [reduceMotion, typing],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    sendMessage(draft);
  };

  const toggleOpen = () => {
    dismissTeaser();
    setOpen((value) => !value);
  };

  const resetChat = () => {
    if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    setTyping(false);
    setMessages([openingMessage()]);
    inputRef.current?.focus();
  };

  const lastMessage = messages[messages.length - 1];
  const activeChips =
    !typing && lastMessage?.role === "bot"
      ? (lastMessage.chips ?? quickPrompts)
      : [];

  return (
    <div className={`chat-widget${open ? " is-open" : ""}`}>
      {teaser && !open && (
        <div className="chat-teaser" role="status">
          <button
            type="button"
            className="chat-teaser-body"
            onClick={toggleOpen}
          >
            <Sparkles size={14} />
            <span>Butuh info cepat soal profil ini? Tanya di sini.</span>
          </button>
          <button
            type="button"
            className="chat-teaser-close"
            onClick={dismissTeaser}
            aria-label="Tutup pesan"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div
        ref={panelRef}
        id="chat-panel"
        className="chat-panel"
        role="dialog"
        aria-modal="false"
        aria-label="Asisten portofolio"
        aria-hidden={!open}
      >
        <div className="chat-head">
          <span className="chat-avatar" aria-hidden="true">
            RB
          </span>
          <div className="chat-identity">
            <p>Asisten Portofolio</p>
            <small>
              <i aria-hidden="true" />
              Online · balasan otomatis
            </small>
          </div>
          <button
            type="button"
            className="chat-reset"
            onClick={resetChat}
            title="Mulai ulang percakapan"
          >
            Reset
          </button>
          <button
            type="button"
            className="chat-close"
            onClick={() => setOpen(false)}
            aria-label="Tutup chat"
          >
            <X size={16} />
          </button>
        </div>

        <div className="chat-log" ref={logRef} aria-live="polite">
          {messages.map((message) => (
            <div key={message.id} className={`chat-row is-${message.role}`}>
              <div className="chat-bubble">
                {message.text.split("\n").map((line, index) => (
                  <p key={index}>{line || " "}</p>
                ))}
              </div>
              <span className="chat-time">{message.time}</span>
            </div>
          ))}

          {typing && (
            <div className="chat-row is-bot">
              <div className="chat-bubble chat-typing" aria-label="Sedang mengetik">
                <i />
                <i />
                <i />
              </div>
            </div>
          )}
        </div>

        {activeChips.length > 0 && (
          <div className="chat-chips">
            {activeChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="chat-chip"
                onClick={() => sendMessage(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <form className="chat-composer" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleInputKeyDown}
            rows={1}
            maxLength={400}
            placeholder="Tulis pertanyaan..."
            aria-label="Tulis pesan"
          />
          <button
            type="submit"
            className="chat-send"
            disabled={!draft.trim() || typing}
            aria-label="Kirim pesan"
          >
            <Send size={16} />
          </button>
        </form>

        <p className="chat-note">
          Jawaban otomatis berdasarkan data portofolio. Untuk diskusi langsung:{" "}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      </div>

      <button
        type="button"
        className="chat-launcher tetris-host"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Tutup chat" : "Buka chat asisten portofolio"}
      >
        <TetrisRain />
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </div>
  );
}
