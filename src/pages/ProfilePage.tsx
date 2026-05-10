import { useState } from "react";
import { User, Page } from "../App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  setUser: (u: User) => void;
  setPage: (p: Page) => void;
}

const AI_AVATARS = ["🤖", "🦾", "👾", "🎭", "🧬", "🌌", "⚡", "🔮", "💎", "🛸", "🧿", "🌀", "🎯", "🔥", "💫"];
const PREMIUM_AVATARS = ["👑", "🦋", "🌟", "💠", "🏆", "🎪", "🌈", "💫", "🌺", "🎆"];

const PREMIUM_BG_OPTIONS = [
  { id: "astronauts", label: "Космонавты", emoji: "🚀", gradient: "from-slate-900 via-blue-900 to-slate-900" },
  { id: "dogs", label: "Собачки", emoji: "🐕", gradient: "from-amber-100 via-orange-200 to-amber-100" },
  { id: "cats", label: "Кошки", emoji: "🐈", gradient: "from-purple-100 via-pink-100 to-purple-100" },
  { id: "hello", label: "Hello!", emoji: "👋", gradient: "from-cyan-400 via-blue-500 to-cyan-400" },
  { id: "premium", label: "На премиуме", emoji: "✨", gradient: "from-yellow-400 via-orange-500 to-yellow-400" },
  { id: "plusvibe", label: "Плюс вайб", emoji: "💜", gradient: "from-violet-500 via-purple-600 to-violet-500" },
  { id: "smile", label: "Улыбка", emoji: "😊", gradient: "from-yellow-300 via-amber-400 to-yellow-300" },
  { id: "lowhp", label: "Low HP", emoji: "❤️‍🩹", gradient: "from-red-400 via-rose-500 to-red-400" },
  { id: "poop", label: "Какашки", emoji: "💩", gradient: "from-amber-700 via-yellow-800 to-amber-700" },
  { id: "best", label: "Лучший", emoji: "🏆", gradient: "from-yellow-500 via-amber-500 to-yellow-500" },
];

export default function ProfilePage({ user, setUser, setPage }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);
  const [showAvatars, setShowAvatars] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const save = () => {
    setUser(draft);
    setEditing(false);
  };

  const selectedBg = PREMIUM_BG_OPTIONS.find(b => b.id === user.premiumBg);

  return (
    <div className="flex flex-col h-screen pb-20 overflow-y-auto scrollbar-thin animate-fade-in">
      {/* Profile Header */}
      <div className={`relative px-4 pt-8 pb-6 ${
        user.isPremium && selectedBg
          ? `bg-gradient-to-br ${selectedBg.gradient}`
          : "gradient-orange-violet"
      }`}>
        <div className="flex items-start justify-between mb-4">
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
        <div>
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
          <p className="font-golos font-semibold text-diva-text text-sm mb-3">Фон профиля</p>
          <div className="grid grid-cols-5 gap-2">
            {PREMIUM_BG_OPTIONS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => { setUser({ ...user, premiumBg: bg.id }); setShowBgPicker(false); }}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                  user.premiumBg === bg.id ? "ring-2 ring-diva-orange" : "hover:bg-muted"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg.gradient} flex items-center justify-center text-lg`}>
                  {bg.emoji}
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
              <p className="text-xs text-diva-text-muted font-golos">Действует до 10 июня 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* Custom stickers (premium) */}
      {user.isPremium && (
        <div className="mx-4 mt-4 p-4 bg-card rounded-3xl border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-golos font-semibold text-diva-text text-sm">Мои стикеры</p>
            <button className="text-xs font-golos text-diva-violet hover:text-diva-orange transition-colors flex items-center gap-1">
              <Icon name="Plus" size={13} />Создать
            </button>
          </div>
          <div className="flex gap-2">
            {["😎", "🔥", "💪"].map((s) => (
              <div key={s} className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                {s}
              </div>
            ))}
            <button className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-border hover:border-diva-violet transition-colors">
              <Icon name="Plus" size={18} className="text-diva-text-muted" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
