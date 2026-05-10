import { useState, useRef } from "react";
import { User, Page } from "../App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  setUser: (u: User) => void;
  setPage: (p: Page) => void;
}

const AI_AVATARS = ["🤖", "🦾", "👾", "🎭", "🧬", "🌌", "⚡", "🔮", "💎", "🛸", "🧿", "🌀", "🎯", "🔥", "💫"];
const PREMIUM_AVATARS = ["👑", "🦋", "🌟", "💠", "🏆", "🎪", "🌈", "💫", "🌺", "🎆"];

interface BgOption {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
  pattern: { type: "emoji" | "text"; content: string }[];
}

const PREMIUM_BG_OPTIONS: BgOption[] = [
  {
    id: "astronauts", label: "Космонавты", emoji: "🚀",
    gradient: "from-slate-900 via-indigo-900 to-purple-900",
    pattern: [
      { type: "emoji", content: "👨‍🚀" }, { type: "emoji", content: "🚀" }, { type: "emoji", content: "🌌" },
      { type: "emoji", content: "👩‍🚀" }, { type: "emoji", content: "⭐" }, { type: "emoji", content: "🛸" },
      { type: "emoji", content: "🪐" }, { type: "emoji", content: "👨‍🚀" }, { type: "emoji", content: "🌠" },
    ],
  },
  {
    id: "dogs", label: "Собачки", emoji: "🐕",
    gradient: "from-amber-100 via-orange-200 to-amber-100",
    pattern: [
      { type: "emoji", content: "🐕" }, { type: "emoji", content: "🦮" }, { type: "emoji", content: "🐩" },
      { type: "emoji", content: "🐾" }, { type: "emoji", content: "🐶" }, { type: "emoji", content: "🦴" },
      { type: "emoji", content: "🐕‍🦺" }, { type: "emoji", content: "🐾" }, { type: "emoji", content: "🐶" },
    ],
  },
  {
    id: "cats", label: "Кошки", emoji: "🐈",
    gradient: "from-purple-100 via-pink-100 to-purple-100",
    pattern: [
      { type: "emoji", content: "🐈" }, { type: "emoji", content: "😺" }, { type: "emoji", content: "🐈‍⬛" },
      { type: "emoji", content: "🐾" }, { type: "emoji", content: "😸" }, { type: "emoji", content: "🧶" },
      { type: "emoji", content: "🐱" }, { type: "emoji", content: "😻" }, { type: "emoji", content: "🐾" },
    ],
  },
  {
    id: "hello", label: "Hello!", emoji: "👋",
    gradient: "from-cyan-400 via-blue-500 to-cyan-400",
    pattern: [
      { type: "text", content: "Hello!" }, { type: "text", content: "Hello!" }, { type: "text", content: "Hello!" },
      { type: "text", content: "Hello!" }, { type: "text", content: "Hello!" }, { type: "text", content: "Hello!" },
      { type: "text", content: "Hello!" }, { type: "text", content: "Hello!" }, { type: "text", content: "Hello!" },
    ],
  },
  {
    id: "premium", label: "На премиуме", emoji: "✨",
    gradient: "from-yellow-400 via-orange-500 to-yellow-400",
    pattern: [
      { type: "text", content: "На премиуме" }, { type: "emoji", content: "✨" }, { type: "text", content: "На премиуме" },
      { type: "emoji", content: "👑" }, { type: "text", content: "На премиуме" }, { type: "emoji", content: "💎" },
      { type: "text", content: "На премиуме" }, { type: "emoji", content: "⭐" }, { type: "text", content: "На премиуме" },
    ],
  },
  {
    id: "plusvibe", label: "Плюс вайб", emoji: "💜",
    gradient: "from-violet-500 via-purple-600 to-fuchsia-500",
    pattern: [
      { type: "text", content: "Плюс вайб" }, { type: "emoji", content: "💜" }, { type: "text", content: "Плюс вайб" },
      { type: "emoji", content: "🌈" }, { type: "text", content: "Плюс вайб" }, { type: "emoji", content: "💫" },
      { type: "text", content: "Плюс вайб" }, { type: "emoji", content: "🦄" }, { type: "text", content: "Плюс вайб" },
    ],
  },
  {
    id: "smile", label: "Улыбка", emoji: "😊",
    gradient: "from-yellow-300 via-amber-400 to-yellow-300",
    pattern: [
      { type: "emoji", content: "😊" }, { type: "emoji", content: "😄" }, { type: "emoji", content: "😁" },
      { type: "emoji", content: "🙂" }, { type: "emoji", content: "😊" }, { type: "emoji", content: "😀" },
      { type: "emoji", content: "😄" }, { type: "emoji", content: "🥰" }, { type: "emoji", content: "😊" },
    ],
  },
  {
    id: "lowhp", label: "Low HP", emoji: "❤️‍🩹",
    gradient: "from-red-400 via-rose-600 to-red-700",
    pattern: [
      { type: "text", content: "Low HP" }, { type: "emoji", content: "❤️‍🩹" }, { type: "text", content: "Low HP" },
      { type: "emoji", content: "💔" }, { type: "text", content: "Low HP" }, { type: "emoji", content: "🩸" },
      { type: "text", content: "Low HP" }, { type: "emoji", content: "❤️‍🩹" }, { type: "text", content: "Low HP" },
    ],
  },
  {
    id: "poop", label: "Какашки", emoji: "💩",
    gradient: "from-amber-700 via-yellow-900 to-amber-800",
    pattern: [
      { type: "emoji", content: "💩" }, { type: "emoji", content: "💩" }, { type: "emoji", content: "💩" },
      { type: "emoji", content: "💩" }, { type: "emoji", content: "💩" }, { type: "emoji", content: "💩" },
      { type: "emoji", content: "💩" }, { type: "emoji", content: "💩" }, { type: "emoji", content: "💩" },
    ],
  },
  {
    id: "best", label: "Лучший", emoji: "🏆",
    gradient: "from-yellow-500 via-amber-500 to-yellow-600",
    pattern: [
      { type: "text", content: "Лучший" }, { type: "emoji", content: "🏆" }, { type: "text", content: "Лучший" },
      { type: "emoji", content: "👑" }, { type: "text", content: "Лучший" }, { type: "emoji", content: "🥇" },
      { type: "text", content: "Лучший" }, { type: "emoji", content: "⭐" }, { type: "text", content: "Лучший" },
    ],
  },
];

export default function ProfilePage({ user, setUser, setPage }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);
  const [showAvatars, setShowAvatars] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showCreateSticker, setShowCreateSticker] = useState(false);
  const [stickerImage, setStickerImage] = useState("");
  const [stickerName, setStickerName] = useState("");
  const [myStickers, setMyStickers] = useState<{ image: string; name: string }[]>([]);
  const stickerFileRef = useRef<HTMLInputElement>(null);

  const handleStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setStickerImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const createSticker = () => {
    if (!stickerImage || !stickerName.trim()) return;
    setMyStickers(prev => [...prev, { image: stickerImage, name: stickerName }]);
    setStickerImage("");
    setStickerName("");
    setShowCreateSticker(false);
  };

  const save = () => {
    setUser(draft);
    setEditing(false);
  };

  const selectedBg = PREMIUM_BG_OPTIONS.find(b => b.id === user.premiumBg);

  return (
    <div className="flex flex-col h-screen pb-20 overflow-y-auto scrollbar-thin animate-fade-in">
      {/* Profile Header */}
      <div className={`relative px-4 pt-8 pb-6 overflow-hidden ${
        user.isPremium && selectedBg
          ? `bg-gradient-to-br ${selectedBg.gradient}`
          : "gradient-orange-violet"
      }`}>
        {/* Pattern overlay */}
        {user.isPremium && selectedBg && (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none">
            {selectedBg.pattern.map((item, i) => (
              <div key={i} className="flex items-center justify-center">
                {item.type === "emoji" ? (
                  <span className="text-3xl">{item.content}</span>
                ) : (
                  <span className="font-montserrat font-black text-white text-xs uppercase tracking-wider rotate-[-12deg]">
                    {item.content}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="relative z-10 flex items-start justify-between mb-4">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center text-5xl shadow-2xl border-2 border-white/40 backdrop-blur-sm">
            {user.avatar}
          </div>
          {user.isPremium && (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-montserrat font-bold shadow-lg">
                ✨ Diva на премиум
              </div>
              {user.isPremium && (
                <button
                  onClick={() => setShowBgPicker(!showBgPicker)}
                  className="flex items-center gap-1 bg-white/20 text-white px-2 py-1 rounded-full text-xs font-golos border border-white/30"
                >
                  <Icon name="Image" size={11} />
                  Фон профиля
                </button>
              )}
            </div>
          )}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <h2 className="font-montserrat font-black text-2xl text-white">{user.name}</h2>
            {user.isPremium && <span className="text-yellow-300 text-lg">✔</span>}
          </div>
          <p className="text-white/70 text-sm font-golos mt-0.5">{user.bio}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-white/60 text-xs font-golos flex items-center gap-1">
              <Icon name="Mail" size={11} />{user.email}
            </span>
            <span className="text-white/60 text-xs font-golos flex items-center gap-1">
              <Icon name="Phone" size={11} />{user.phone}
            </span>
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all border border-white/30"
        >
          <Icon name="Pencil" size={15} className="text-white" />
        </button>
      </div>

      {/* Background picker */}
      {showBgPicker && user.isPremium && (
        <div className="mx-4 mt-3 p-4 bg-card rounded-3xl border border-border/50 shadow-lg animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <p className="font-golos font-semibold text-diva-text text-sm">Фон профиля</p>
            {user.premiumBg && (
              <button
                onClick={() => { setUser({ ...user, premiumBg: "" }); setShowBgPicker(false); }}
                className="text-xs font-golos font-medium text-red-500 flex items-center gap-1 hover:text-red-600 transition-colors"
              >
                <Icon name="X" size={12} />Убрать фон
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => { setUser({ ...user, premiumBg: "" }); setShowBgPicker(false); }}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                !user.premiumBg ? "ring-2 ring-diva-orange" : "hover:bg-muted"
              }`}
            >
              <div className="w-12 h-12 rounded-xl gradient-orange-violet flex items-center justify-center shadow-md">
                <Icon name="Ban" size={18} className="text-white" />
              </div>
              <span className="text-[9px] font-golos text-diva-text-muted text-center leading-tight">Без фона</span>
            </button>
            {PREMIUM_BG_OPTIONS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => { setUser({ ...user, premiumBg: bg.id }); setShowBgPicker(false); }}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                  user.premiumBg === bg.id ? "ring-2 ring-diva-orange" : "hover:bg-muted"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bg.gradient} flex items-center justify-center text-lg relative overflow-hidden shadow-md`}>
                  <span className="absolute top-0.5 left-1 text-[8px] opacity-50">{bg.emoji}</span>
                  <span className="text-xl">{bg.emoji}</span>
                  <span className="absolute bottom-0.5 right-1 text-[8px] opacity-50">{bg.emoji}</span>
                </div>
                <span className="text-[9px] font-golos text-diva-text-muted text-center leading-tight">{bg.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="w-full bg-card rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-bold text-lg text-diva-text">Редактировать профиль</h3>
              <button onClick={() => { setEditing(false); setDraft(user); }}>
                <Icon name="X" size={20} className="text-diva-text-muted" />
              </button>
            </div>

            {/* Avatar section */}
            <div className="mb-5">
              <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2">Аватар</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-diva-orange/20 to-diva-violet/20 flex items-center justify-center text-4xl">
                  {draft.avatar}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowAvatars(!showAvatars)}
                    className="text-xs font-golos font-medium text-diva-violet hover:text-diva-orange transition-colors"
                  >
                    Выбрать из ИИ-аватарок
                  </button>
                  <button className="text-xs font-golos font-medium text-diva-text-muted">
                    Загрузить из галереи
                  </button>
                </div>
              </div>
              {showAvatars && (
                <div className="animate-scale-in">
                  <p className="text-xs font-golos text-diva-text-muted mb-2">Стандартные (15 штук)</p>
                  <div className="grid grid-cols-8 gap-1.5 mb-3">
                    {AI_AVATARS.map((a) => (
                      <button
                        key={a}
                        onClick={() => { setDraft({ ...draft, avatar: a }); }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-all ${
                          draft.avatar === a ? "ring-2 ring-diva-orange bg-diva-orange/10 scale-110" : "hover:bg-muted"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  {user.isPremium && (
                    <>
                      <p className="text-xs font-golos text-yellow-500 font-medium mb-2">✨ Премиум-аватарки (10 штук)</p>
                      <div className="grid grid-cols-8 gap-1.5">
                        {PREMIUM_AVATARS.map((a) => (
                          <button
                            key={a}
                            onClick={() => { setDraft({ ...draft, avatar: a }); }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-all ${
                              draft.avatar === a ? "ring-2 ring-yellow-400 bg-yellow-400/10 scale-110" : "hover:bg-muted"
                            }`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {!user.isPremium && (
                    <button
                      onClick={() => setPage("premium")}
                      className="w-full mt-2 py-2.5 border border-dashed border-yellow-400 rounded-2xl text-xs font-golos text-yellow-600 hover:bg-yellow-50 transition-all"
                    >
                      ✨ Получить 10 премиум-аватарок
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Fields */}
            {[
              { label: "Имя", key: "name", placeholder: "Ваше имя" },
              { label: "О себе", key: "bio", placeholder: "Расскажите о себе..." },
            ].map((field) => (
              <div key={field.key} className="mb-3">
                <label className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider block mb-1.5">
                  {field.label}
                </label>
                <input
                  value={draft[field.key as "name" | "bio"]}
                  onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 bg-muted/60 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/50 focus:outline-none focus:ring-2 focus:ring-diva-orange/40"
                />
              </div>
            ))}

            <div className="flex gap-3 mt-4">
              <button onClick={() => { setEditing(false); setDraft(user); }} className="flex-1 py-3 rounded-2xl border border-border text-diva-text-muted font-golos text-sm">Отмена</button>
              <button onClick={save} className="flex-1 py-3 rounded-2xl gradient-orange-violet text-white font-golos font-semibold text-sm shadow-lg">Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Чатов", value: "6", icon: "💬" },
          { label: "Контактов", value: "6", icon: "👥" },
          { label: "Стикеров", value: "50+", icon: "🎉" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl p-3 text-center border border-border/50 shadow-sm hover-scale">
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="font-montserrat font-bold text-diva-text text-lg">{stat.value}</p>
            <p className="text-xs text-diva-text-muted font-golos">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Premium CTA */}
      {!user.isPremium && (
        <div className="mx-4 mt-4">
          <button
            onClick={() => setPage("premium")}
            className="w-full p-4 rounded-3xl gradient-orange-violet text-white text-left hover:opacity-90 transition-all shadow-xl hover-scale"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-montserrat font-bold text-lg">✨ Diva на премиум</p>
                <p className="text-white/80 text-xs font-golos mt-0.5">Жёлтая галочка, аватарки, стикеры и фоны</p>
              </div>
              <div className="text-right">
                <p className="font-montserrat font-black text-2xl">10₽</p>
                <p className="text-white/60 text-xs font-golos">в месяц</p>
              </div>
            </div>
          </button>
        </div>
      )}

      {user.isPremium && (
        <div className="mx-4 mt-4 p-4 rounded-3xl bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-yellow-400/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-montserrat font-bold text-diva-text">У вас активен Diva Премиум</p>
              <p className="text-xs text-diva-text-muted font-golos">
                {user.premiumExpiresAt ? (() => {
                  const d = new Date(user.premiumExpiresAt);
                  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
                  const days = Math.ceil((user.premiumExpiresAt - Date.now()) / (24 * 60 * 60 * 1000));
                  return `Действует до ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} · осталось ${days} дн.`;
                })() : "Активна подписка"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom stickers (premium) */}
      {user.isPremium && (
        <div className="mx-4 mt-4 mb-4 p-4 bg-card rounded-3xl border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-golos font-semibold text-diva-text text-sm">Мои стикеры</p>
            <button
              onClick={() => setShowCreateSticker(true)}
              className="text-xs font-golos text-diva-violet hover:text-diva-orange transition-colors flex items-center gap-1"
            >
              <Icon name="Plus" size={13} />Создать
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {myStickers.length === 0 && (
              <p className="text-xs text-diva-text-muted font-golos py-2">У вас пока нет своих стикеров</p>
            )}
            {myStickers.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="sticker overflow-hidden p-0" style={{ width: 56, height: 56 }}>
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-[10px] font-golos text-diva-text-muted">{s.name}</span>
              </div>
            ))}
            <button
              onClick={() => setShowCreateSticker(true)}
              className="w-14 h-14 bg-muted/50 rounded-full flex items-center justify-center border-2 border-dashed border-border hover:border-diva-violet hover:bg-diva-violet/5 transition-all"
            >
              <Icon name="Plus" size={20} className="text-diva-text-muted" />
            </button>
          </div>
        </div>
      )}

      {/* Create sticker modal */}
      {showCreateSticker && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowCreateSticker(false)}>
          <div className="w-full bg-card rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-montserrat font-bold text-lg text-diva-text">Создать стикер</h3>
                <p className="text-xs text-diva-text-muted font-golos">Премиум-функция ✨</p>
              </div>
              <button onClick={() => setShowCreateSticker(false)}>
                <Icon name="X" size={20} className="text-diva-text-muted" />
              </button>
            </div>

            {/* Preview */}
            <div className="flex items-center justify-center py-4 mb-4 bg-gradient-to-br from-diva-orange/10 to-diva-violet/10 rounded-3xl">
              {stickerImage ? (
                <div className="sticker overflow-hidden p-0" style={{ width: 96, height: 96 }}>
                  <img src={stickerImage} alt="" className="w-full h-full object-cover rounded-full" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center text-diva-text-muted text-xs font-golos text-center px-2 gap-1">
                  <Icon name="Image" size={24} className="text-diva-text-muted" />
                  Превью
                </div>
              )}
            </div>

            <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2">Название стикера *</p>
            <input
              value={stickerName}
              onChange={(e) => setStickerName(e.target.value)}
              placeholder="Например: Огонь"
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3 bg-muted/60 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/50 focus:outline-none focus:ring-2 focus:ring-diva-violet/40 mb-4"
            />

            <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2">Изображение из галереи *</p>
            <button
              onClick={() => stickerFileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 mb-4 bg-muted/60 rounded-2xl border-2 border-dashed border-border hover:border-diva-violet hover:bg-diva-violet/5 transition-all text-sm font-golos font-medium text-diva-text"
            >
              <Icon name="Image" size={16} className="text-diva-violet" />
              {stickerImage ? "Изменить изображение" : "Выбрать из галереи"}
            </button>
            <input
              ref={stickerFileRef}
              type="file"
              accept="image/*"
              onChange={handleStickerUpload}
              className="hidden"
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setShowCreateSticker(false); setStickerImage(""); setStickerName(""); }}
                className="flex-1 py-3 rounded-2xl border border-border text-diva-text-muted font-golos text-sm"
              >
                Отмена
              </button>
              <button
                onClick={createSticker}
                disabled={!stickerImage || !stickerName.trim()}
                className="flex-1 py-3 rounded-2xl gradient-orange-violet text-white font-golos font-semibold text-sm shadow-lg disabled:opacity-50"
              >
                Создать стикер
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}