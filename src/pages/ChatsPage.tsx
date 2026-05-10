import { useState } from "react";
import { User, Page } from "../App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  setPage: (p: Page) => void;
}

const STICKERS = ["😂", "❤️", "🔥", "👍", "🦋", "✨", "🎉", "😎", "🥰", "😭", "💀", "🫡", "🤙", "💫", "🌈", "🎁", "🍕", "⭐", "🎮", "🦄"];
const GIFS = [
  { emoji: "🕺", anim: "gif-bounce", label: "танец" },
  { emoji: "💃", anim: "gif-shake", label: "вечеринка" },
  { emoji: "🎉", anim: "gif-pulse", label: "ура" },
  { emoji: "🚀", anim: "gif-float", label: "поехали" },
  { emoji: "🌈", anim: "gif-rainbow", label: "радуга" },
  { emoji: "💖", anim: "gif-pulse", label: "сердце" },
  { emoji: "🔥", anim: "gif-shake", label: "огонь" },
  { emoji: "⚡", anim: "gif-spin", label: "молния" },
];

const MOCK_CHATS = [
  { id: 1, name: "Мария Иванова", avatar: "🌸", lastMsg: "Привет! Как дела?", time: "14:32", unread: 3, online: true },
  { id: 2, name: "Команда проекта", avatar: "💼", lastMsg: "Встреча завтра в 10", time: "13:15", unread: 0, online: false, isGroup: true },
  { id: 3, name: "Дмитрий Смирнов", avatar: "🦊", lastMsg: "Голосовое 0:15", time: "12:00", unread: 1, online: true },
  { id: 4, name: "Канал Web-Diva", avatar: "📡", lastMsg: "Новое обновление!", time: "10:45", unread: 5, online: false, isChannel: true },
  { id: 5, name: "Анастасия", avatar: "🌺", lastMsg: "Спасибо 😊", time: "Вчера", unread: 0, online: false },
  { id: 6, name: "Разработчики", avatar: "💻", lastMsg: "Баг пофиксили", time: "Вчера", unread: 0, online: false, isGroup: true },
];

interface Message {
  id: number;
  text: string;
  out: boolean;
  time: string;
  read: boolean;
  type?: "text" | "sticker" | "gif";
  anim?: string;
}

const MOCK_MESSAGES: Message[] = [
  { id: 1, text: "Привет! Как дела?", out: false, time: "14:30", read: true, type: "text" },
  { id: 2, text: "Всё отлично! Работаю над новым проектом 🚀", out: true, time: "14:31", read: true, type: "text" },
  { id: 3, text: "Классно! Что за проект?", out: false, time: "14:31", read: true, type: "text" },
  { id: 4, text: "🦋", out: true, time: "14:32", read: true, type: "sticker" },
  { id: 5, text: "🎉", out: false, time: "14:32", read: false, type: "gif", anim: "gif-pulse" },
];

export default function ChatsPage({ user, setPage }: Props) {
  const [openChat, setOpenChat] = useState<(typeof MOCK_CHATS)[0] | null>(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [recording, setRecording] = useState(false);
  const [search, setSearch] = useState("");

  const filteredChats = MOCK_CHATS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = (text: string, type: "text" | "sticker" | "gif" = "text", anim?: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      out: true,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      read: false,
      type,
      anim,
    }]);
    setInput("");
    setShowStickers(false);
  };

  if (openChat) {
    return (
      <div className="flex flex-col h-screen pb-20 animate-fade-in">
        {/* Header */}
        <div className="glass dark:glass-dark border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setOpenChat(null)} className="text-diva-text-muted hover:text-diva-orange transition-colors">
            <Icon name="ArrowLeft" size={22} />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-diva-orange/20 to-diva-violet/20 flex items-center justify-center text-xl flex-shrink-0">
            {openChat.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-golos font-semibold text-diva-text text-sm truncate">{openChat.name}</span>
              {openChat.isGroup && <span className="text-xs bg-diva-violet/10 text-diva-violet px-1.5 py-0.5 rounded-full">группа</span>}
              {openChat.isChannel && <span className="text-xs bg-diva-orange/10 text-diva-orange px-1.5 py-0.5 rounded-full">канал</span>}
            </div>
            <p className="text-xs text-diva-text-muted font-golos flex items-center gap-1">
              {openChat.online ? (
                <><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot inline-block" />в сети</>
              ) : "не в сети"}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-diva-orange/10 hover:text-diva-orange transition-all">
              <Icon name="Phone" size={16} />
            </button>
            <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-diva-violet/10 hover:text-diva-violet transition-all">
              <Icon name="Video" size={16} />
            </button>
          </div>
        </div>

        {/* E2E badge */}
        <div className="flex justify-center py-2">
          <div className="flex items-center gap-1 bg-diva-orange/10 text-diva-orange px-3 py-1 rounded-full text-xs font-golos">
            <Icon name="Shield" size={11} />
            Сообщения защищены сквозным шифрованием
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.out ? "justify-end" : "justify-start"} animate-fade-in`}>
              {msg.type === "sticker" ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="sticker-msg">{msg.text}</span>
                  <div className={`flex items-center gap-1 ${msg.out ? "text-diva-text-muted" : "text-diva-text-muted"}`}>
                    <span className="text-[10px] font-golos">{msg.time}</span>
                    {msg.out && <Icon name={msg.read ? "CheckCheck" : "Check"} size={11} />}
                  </div>
                </div>
              ) : msg.type === "gif" ? (
                <div className="flex flex-col items-end gap-1">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-diva-orange/15 to-diva-violet/15 border border-border/50 flex items-center justify-center shadow-md overflow-hidden">
                    <span className={`text-6xl ${msg.anim || "gif-bounce"}`}>{msg.text}</span>
                  </div>
                  <div className="flex items-center gap-1 text-diva-text-muted">
                    <span className="text-[10px] font-golos">GIF · {msg.time}</span>
                    {msg.out && <Icon name={msg.read ? "CheckCheck" : "Check"} size={11} />}
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-[75%] px-4 py-2.5 ${
                    msg.out
                      ? "gradient-orange-violet text-white msg-bubble-out"
                      : "bg-card border border-border/50 text-diva-text msg-bubble-in"
                  } shadow-sm`}
                >
                  <p className="text-sm font-golos leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 justify-end mt-1 ${msg.out ? "text-white/60" : "text-diva-text-muted"}`}>
                    <span className="text-[10px] font-golos">{msg.time}</span>
                    {msg.out && <Icon name={msg.read ? "CheckCheck" : "Check"} size={11} />}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stickers panel */}
        {showStickers && (
          <div className="glass dark:glass-dark border-t border-border/50 p-4 animate-slide-up max-h-[50vh] overflow-y-auto scrollbar-thin">
            <p className="text-xs text-diva-text-muted font-golos font-medium uppercase tracking-wider mb-3">Стикеры</p>
            <div className="flex flex-wrap gap-3">
              {STICKERS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s, "sticker")}
                  className="sticker"
                  style={{ animationDelay: `${i * 0.02}s` }}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs text-diva-text-muted font-golos font-medium uppercase tracking-wider mt-5 mb-3">Анимированные гифки</p>
            <div className="grid grid-cols-4 gap-2">
              {GIFS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(g.emoji, "gif", g.anim)}
                  className="aspect-square bg-gradient-to-br from-diva-orange/10 to-diva-violet/10 border border-border/50 rounded-2xl flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform shadow-sm"
                >
                  <span className={`text-3xl ${g.anim}`}>{g.emoji}</span>
                  <span className="text-[9px] font-golos text-diva-text-muted uppercase">{g.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="glass dark:glass-dark border-t border-border/50 px-3 py-2">
          <div className="flex items-end gap-2">
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-diva-text-muted hover:bg-diva-orange/10 hover:text-diva-orange transition-all flex-shrink-0"
            >
              <Icon name="Plus" size={18} />
            </button>
            {showActions && (
              <div className="absolute bottom-28 left-4 bg-card border border-border rounded-2xl shadow-xl p-2 flex flex-col gap-1 z-10 animate-scale-in">
                {[
                  { icon: "Image", label: "Фото из галереи" },
                  { icon: "Video", label: "Видео из галереи" },
                ].map((a) => (
                  <button key={a.label} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted text-sm font-golos text-diva-text">
                    <Icon name={a.icon as "Image" | "Video"} size={16} className="text-diva-violet" />
                    {a.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                className="w-full px-4 py-2.5 bg-muted/60 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/50 focus:outline-none focus:ring-2 focus:ring-diva-orange/30 pr-10"
              />
              <button
                onClick={() => setShowStickers(!showStickers)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xl"
              >
                😊
              </button>
            </div>
            {input.trim() ? (
              <button
                onClick={() => sendMessage(input)}
                className="w-9 h-9 rounded-full gradient-orange-violet flex items-center justify-center shadow-md hover:opacity-90 transition-all active:scale-90 flex-shrink-0"
              >
                <Icon name="Send" size={16} className="text-white" />
              </button>
            ) : (
              <button
                onMouseDown={() => setRecording(true)}
                onMouseUp={() => { setRecording(false); sendMessage("🎤 Голосовое 0:03"); }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                  recording ? "bg-red-500 scale-110" : "bg-muted hover:bg-diva-orange/10 hover:text-diva-orange"
                }`}
              >
                <Icon name="Mic" size={16} className={recording ? "text-white" : "text-diva-text-muted"} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen pb-20 animate-fade-in">
      {/* Header */}
      <div className="glass dark:glass-dark border-b border-border/50 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-montserrat font-black text-xl text-diva-text">
            Web<span className="text-diva-orange">-</span><span className="text-diva-violet">Diva</span>
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewChat(true)}
              className="w-8 h-8 rounded-full gradient-orange-violet flex items-center justify-center shadow-md hover:opacity-90 transition-all"
            >
              <Icon name="Plus" size={16} className="text-white" />
            </button>
            <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-all">
              <Icon name="Search" size={16} className="text-diva-text-muted" />
            </button>
          </div>
        </div>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-diva-text-muted" />
          <input
            type="text"
            placeholder="Поиск чатов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-muted/70 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/30 focus:outline-none focus:ring-2 focus:ring-diva-orange/30"
          />
        </div>
      </div>

      {/* New chat modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowNewChat(false)}>
          <div className="w-full bg-card rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-montserrat font-bold text-lg text-diva-text mb-4">Создать</h3>
            {[
              { icon: "MessageCircle", label: "Новый чат", color: "text-diva-orange" },
              { icon: "Users", label: "Новая группа", color: "text-diva-violet" },
              { icon: "Radio", label: "Новый канал", color: "text-diva-brown" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setShowNewChat(false)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-all mb-1"
              >
                <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center">
                  <Icon name={item.icon as "MessageCircle" | "Users" | "Radio"} size={20} className={item.color} />
                </div>
                <span className="font-golos font-medium text-diva-text">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredChats.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => setOpenChat(chat)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all border-b border-border/20 animate-fade-in"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-diva-orange/20 to-diva-violet/20 flex items-center justify-center text-2xl">
                {chat.avatar}
              </div>
              {chat.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background animate-pulse-dot" />
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-golos font-semibold text-diva-text text-sm">{chat.name}</span>
                  {chat.isGroup && <Icon name="Users" size={12} className="text-diva-violet" />}
                  {chat.isChannel && <Icon name="Radio" size={12} className="text-diva-orange" />}
                </div>
                <span className="text-xs text-diva-text-muted font-golos">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs text-diva-text-muted font-golos truncate max-w-[200px]">{chat.lastMsg}</p>
                {chat.unread > 0 && (
                  <span className="min-w-[20px] h-5 rounded-full gradient-orange-violet text-white text-[10px] font-montserrat font-bold flex items-center justify-center px-1.5">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}