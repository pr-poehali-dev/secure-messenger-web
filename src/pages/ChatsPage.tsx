import { useState, useRef, useEffect } from "react";
import { User, Page } from "../App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  setPage: (p: Page) => void;
}

const STICKERS = ["😂", "❤️", "🔥", "👍", "🦋", "✨", "🎉", "😎", "🥰", "😭", "💀", "🫡", "🤙", "💫", "🌈", "🎁", "🍕", "⭐", "🎮", "🦄"];

const BG_GRADIENTS: Record<string, string> = {
  astronauts: "from-slate-900 via-indigo-900 to-purple-900",
  dogs: "from-amber-100 via-orange-200 to-amber-100",
  cats: "from-purple-100 via-pink-100 to-purple-100",
  hello: "from-cyan-400 via-blue-500 to-cyan-400",
  premium: "from-yellow-400 via-orange-500 to-yellow-400",
  plusvibe: "from-violet-500 via-purple-600 to-fuchsia-500",
  smile: "from-yellow-300 via-amber-400 to-yellow-300",
  lowhp: "from-red-400 via-rose-600 to-red-700",
  poop: "from-amber-700 via-yellow-900 to-amber-800",
  best: "from-yellow-500 via-amber-500 to-yellow-600",
};
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

const GROUP_AI_AVATARS = ["💼", "🎯", "🚀", "🎨", "🎪", "🌟", "🔥", "💎", "🎭", "🏆"];
const CHANNEL_AI_AVATARS = ["📡", "📢", "📣", "🌐", "📰", "🎬", "🎙️", "📺", "🎵", "📚"];

interface Message {
  id: number;
  text: string;
  out: boolean;
  time: string;
  read: boolean;
  type?: "text" | "sticker" | "gif";
  anim?: string;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  description?: string;
  type: "saved" | "chat" | "group" | "channel";
  messages: Message[];
}

const SAVED_INTRO: Message[] = [
  { id: 1, text: "Это «Избранное» — личное пространство для заметок 📝", out: false, time: "00:00", read: true, type: "text" },
  { id: 2, text: "Сохраняй сюда что угодно: ссылки, идеи, фото", out: false, time: "00:00", read: true, type: "text" },
];

export default function ChatsPage({ user, setPage }: Props) {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 0,
      name: "Избранное",
      avatar: user.avatar,
      type: "saved",
      messages: SAVED_INTRO,
    },
  ]);
  const [openChatId, setOpenChatId] = useState<number | null>(null);

  // Sync saved-chat avatar with user avatar
  useEffect(() => {
    setChats(prev => prev.map(c => c.type === "saved" ? { ...c, avatar: user.avatar } : c));
  }, [user.avatar]);

  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [recording, setRecording] = useState(false);
  const [search, setSearch] = useState("");

  // Group/Channel creation
  const [createMode, setCreateMode] = useState<"group" | "channel" | null>(null);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createAvatar, setCreateAvatar] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openChat = chats.find(c => c.id === openChatId) || null;
  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const sendMessage = (text: string, type: "text" | "sticker" | "gif" = "text", anim?: string) => {
    if (!text.trim() || !openChat) return;
    const newMsg: Message = {
      id: Date.now(),
      text,
      out: true,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      read: openChat.type === "saved",
      type,
      anim,
    };
    setChats(prev => prev.map(c =>
      c.id === openChat.id ? { ...c, messages: [...c.messages, newMsg] } : c
    ));
    setInput("");
    setShowStickers(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCreateAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const finishCreate = () => {
    if (!createName.trim() || !createMode) return;
    const newChat: Chat = {
      id: Date.now(),
      name: createName,
      avatar: createAvatar || (createMode === "group" ? "💼" : "📡"),
      description: createDesc,
      type: createMode,
      messages: createMode === "channel"
        ? [{ id: 1, text: `Канал «${createName}» создан 🎉`, out: false, time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }), read: true, type: "text" }]
        : [],
    };
    setChats(prev => [...prev, newChat]);
    setCreateMode(null);
    setCreateStep(1);
    setCreateName("");
    setCreateDesc("");
    setCreateAvatar("");
    setOpenChatId(newChat.id);
  };

  const cancelCreate = () => {
    setCreateMode(null);
    setCreateStep(1);
    setCreateName("");
    setCreateDesc("");
    setCreateAvatar("");
  };

  // === Open chat view ===
  if (openChat) {
    const isChannel = openChat.type === "channel";
    const isSaved = openChat.type === "saved";
    const canWrite = !isChannel; // channels read-only for subscribers
    const savedBgGradient = isSaved && user.isPremium && user.premiumBg ? BG_GRADIENTS[user.premiumBg] : null;
    return (
      <div className="flex flex-col h-screen pb-20 animate-fade-in">
        <div className="glass dark:glass-dark border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setOpenChatId(null)} className="text-diva-text-muted hover:text-diva-orange transition-colors">
            <Icon name="ArrowLeft" size={22} />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-diva-orange/20 to-diva-violet/20 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
            {openChat.avatar.startsWith("data:") ? (
              <img src={openChat.avatar} className="w-full h-full object-cover" alt="" />
            ) : openChat.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-golos font-semibold text-diva-text text-sm truncate">{openChat.name}</span>
              {openChat.type === "group" && <span className="text-xs bg-diva-violet/10 text-diva-violet px-1.5 py-0.5 rounded-full">группа</span>}
              {openChat.type === "channel" && <span className="text-xs bg-diva-orange/10 text-diva-orange px-1.5 py-0.5 rounded-full">канал</span>}
              {isSaved && <span className="text-xs bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded-full">избранное</span>}
            </div>
            <p className="text-xs text-diva-text-muted font-golos">
              {isSaved ? "только вы" : openChat.description || (isChannel ? "канал" : "группа")}
            </p>
          </div>
        </div>

        <div className="flex justify-center py-2">
          <div className="flex items-center gap-1 bg-diva-orange/10 text-diva-orange px-3 py-1 rounded-full text-xs font-golos">
            <Icon name="Shield" size={11} />
            {isSaved ? "Только вы видите эти сообщения" : "Сообщения защищены сквозным шифрованием"}
          </div>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-thin relative ${
          savedBgGradient ? `bg-gradient-to-br ${savedBgGradient}` : ""
        }`}>
          {openChat.messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-diva-text-muted text-sm font-golos">Сообщений пока нет</p>
            </div>
          )}
          {openChat.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.out ? "justify-end" : "justify-start"} animate-fade-in`}>
              {msg.type === "sticker" ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="sticker-msg">{msg.text}</span>
                  <div className="flex items-center gap-1 text-diva-text-muted">
                    <span className="text-[10px] font-golos">{msg.time}</span>
                    {msg.out && !isSaved && <Icon name={msg.read ? "CheckCheck" : "Check"} size={11} />}
                  </div>
                </div>
              ) : msg.type === "gif" ? (
                <div className="flex flex-col items-end gap-1">
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-diva-orange/15 to-diva-violet/15 border border-border/50 flex items-center justify-center shadow-md overflow-hidden">
                    <span className={`text-6xl ${msg.anim || "gif-bounce"}`}>{msg.text}</span>
                  </div>
                  <div className="flex items-center gap-1 text-diva-text-muted">
                    <span className="text-[10px] font-golos">GIF · {msg.time}</span>
                    {msg.out && !isSaved && <Icon name={msg.read ? "CheckCheck" : "Check"} size={11} />}
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
                    {msg.out && !isSaved && <Icon name={msg.read ? "CheckCheck" : "Check"} size={11} />}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stickers panel */}
        {showStickers && canWrite && (
          <div className="glass dark:glass-dark border-t border-border/50 p-4 animate-slide-up max-h-[50vh] overflow-y-auto scrollbar-thin">
            <p className="text-xs text-diva-text-muted font-golos font-medium uppercase tracking-wider mb-3">Стикеры</p>
            <div className="flex flex-wrap gap-3">
              {STICKERS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s, "sticker")} className="sticker">{s}</button>
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
        {canWrite ? (
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
                  placeholder={isSaved ? "Заметка для себя..." : "Сообщение..."}
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
        ) : (
          <div className="glass dark:glass-dark border-t border-border/50 px-4 py-4 text-center">
            <p className="text-xs font-golos text-diva-text-muted flex items-center justify-center gap-1.5">
              <Icon name="Lock" size={12} />
              В канал могут писать только администраторы
            </p>
          </div>
        )}
      </div>
    );
  }

  // === Chat list view ===
  return (
    <div className="flex flex-col h-screen pb-20 animate-fade-in">
      <div className="glass dark:glass-dark border-b border-border/50 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-montserrat font-black text-xl text-diva-text">
            Web<span className="text-diva-orange">-</span><span className="text-diva-violet">Diva</span>
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewMenu(true)}
              className="px-3 h-8 rounded-full gradient-orange-violet flex items-center gap-1 shadow-md hover:opacity-90 transition-all"
            >
              <Icon name="Plus" size={14} className="text-white" />
              <span className="text-xs font-golos font-semibold text-white">Создать</span>
            </button>
          </div>
        </div>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-diva-text-muted" />
          <input
            type="text"
            placeholder="Поиск чатов и каналов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-muted/70 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/30 focus:outline-none focus:ring-2 focus:ring-diva-orange/30"
          />
        </div>
      </div>

      {/* New menu */}
      {showNewMenu && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowNewMenu(false)}>
          <div className="w-full bg-card rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-montserrat font-bold text-lg text-diva-text mb-4">Создать новое</h3>
            <button
              onClick={() => { setShowNewMenu(false); setCreateMode("group"); setCreateStep(1); }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-all mb-2 border border-diva-violet/20 bg-diva-violet/5"
            >
              <div className="w-12 h-12 rounded-2xl gradient-violet-orange flex items-center justify-center shadow-md">
                <Icon name="Users" size={22} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-golos font-semibold text-diva-text">Группа</p>
                <p className="text-xs text-diva-text-muted font-golos">Общение с друзьями и коллегами</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-diva-text-muted" />
            </button>
            <button
              onClick={() => { setShowNewMenu(false); setCreateMode("channel"); setCreateStep(1); }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-all border-2 border-diva-orange/40 bg-gradient-to-r from-diva-orange/10 to-diva-violet/10"
            >
              <div className="w-12 h-12 rounded-2xl gradient-orange-violet flex items-center justify-center shadow-lg">
                <Icon name="Radio" size={22} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-golos font-bold text-diva-text">Канал</p>
                <p className="text-xs text-diva-text-muted font-golos">Публикации для подписчиков</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-diva-orange" />
            </button>
          </div>
        </div>
      )}

      {/* Create group/channel modal */}
      {createMode && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={cancelCreate}>
          <div className="w-full bg-card rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-montserrat font-bold text-lg text-diva-text">
                  {createMode === "group" ? "Новая группа" : "Новый канал"}
                </h3>
                <p className="text-xs text-diva-text-muted font-golos">Шаг {createStep} из 2</p>
              </div>
              <button onClick={cancelCreate}><Icon name="X" size={20} className="text-diva-text-muted" /></button>
            </div>

            {createStep === 1 && (
              <>
                <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2">Аватар</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-diva-orange/20 to-diva-violet/20 flex items-center justify-center text-3xl overflow-hidden">
                    {createAvatar.startsWith("data:") ? (
                      <img src={createAvatar} className="w-full h-full object-cover" alt="" />
                    ) : createAvatar || (createMode === "group" ? "👥" : "📡")}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-2xl text-xs font-golos font-medium text-diva-text hover:bg-muted/80 transition-all"
                  >
                    <Icon name="Image" size={14} className="text-diva-violet" />
                    Из галереи
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2">Или выберите ИИ-аватар</p>
                <div className="grid grid-cols-10 gap-1.5 mb-4">
                  {(createMode === "group" ? GROUP_AI_AVATARS : CHANNEL_AI_AVATARS).map((a) => (
                    <button
                      key={a}
                      onClick={() => setCreateAvatar(a)}
                      className={`aspect-square rounded-xl flex items-center justify-center text-lg transition-all ${
                        createAvatar === a ? "ring-2 ring-diva-orange bg-diva-orange/10 scale-110" : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCreateStep(2)}
                  className="w-full py-3 rounded-2xl gradient-orange-violet text-white font-golos font-semibold text-sm shadow-lg"
                >
                  Далее
                </button>
              </>
            )}

            {createStep === 2 && (
              <>
                <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2">
                  Название {createMode === "group" ? "группы" : "канала"}
                </p>
                <input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder={createMode === "group" ? "Моя группа" : "Мой канал"}
                  maxLength={50}
                  autoFocus
                  className="w-full px-4 py-3 bg-muted/60 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/50 focus:outline-none focus:ring-2 focus:ring-diva-orange/40 mb-4"
                />

                <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2">Описание</p>
                <textarea
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
                  placeholder="Расскажите о чём этот канал/группа..."
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-3 bg-muted/60 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/50 focus:outline-none focus:ring-2 focus:ring-diva-orange/40 mb-4 resize-none"
                />

                <div className="flex gap-3">
                  <button onClick={() => setCreateStep(1)} className="flex-1 py-3 rounded-2xl border border-border text-diva-text-muted font-golos text-sm">Назад</button>
                  <button
                    onClick={finishCreate}
                    disabled={!createName.trim()}
                    className="flex-1 py-3 rounded-2xl gradient-orange-violet text-white font-golos font-semibold text-sm shadow-lg disabled:opacity-50"
                  >
                    Создать
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredChats.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-sm text-diva-text-muted font-golos">Ничего не найдено</p>
          </div>
        )}
        {filteredChats.map((chat, i) => {
          const lastMsg = chat.messages[chat.messages.length - 1];
          const isSaved = chat.type === "saved";
          return (
            <button
              key={chat.id}
              onClick={() => setOpenChatId(chat.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all border-b border-border/20 animate-fade-in"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl overflow-hidden ${
                  isSaved ? "gradient-orange-violet" : "bg-gradient-to-br from-diva-orange/20 to-diva-violet/20"
                }`}>
                  {chat.avatar.startsWith("data:") ? (
                    <img src={chat.avatar} className="w-full h-full object-cover" alt="" />
                  ) : chat.avatar}
                </div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-golos font-semibold text-diva-text text-sm">{chat.name}</span>
                    {chat.type === "group" && <Icon name="Users" size={12} className="text-diva-violet" />}
                    {chat.type === "channel" && <Icon name="Radio" size={12} className="text-diva-orange" />}
                    {isSaved && <Icon name="Bookmark" size={12} className="text-yellow-500" />}
                  </div>
                  <span className="text-xs text-diva-text-muted font-golos">{lastMsg?.time || ""}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-diva-text-muted font-golos truncate max-w-[240px]">
                    {lastMsg?.text || (chat.type === "channel" ? "Канал создан" : "Нет сообщений")}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}