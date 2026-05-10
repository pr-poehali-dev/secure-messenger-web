import { useState } from "react";
import { User, Page } from "../App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  setUser: (u: User) => void;
  setPage: (p: Page) => void;
}

const FEATURES = [
  { icon: "✔", label: "Жёлтая галочка рядом с ником", desc: "Видна всем пользователям", premium: true },
  { icon: "🎨", label: "10 эксклюзивных ИИ-аватарок", desc: "Красивые и стильные, видны всем", premium: true },
  { icon: "🎭", label: "Создание своих стикеров", desc: "Персональный набор в настройках профиля", premium: true },
  { icon: "🖼️", label: "Фон профиля", desc: "10 красивых фонов на выбор", premium: true },
];

const FREE_FEATURES = [
  { icon: "💬", label: "Чаты, группы и каналы" },
  { icon: "📞", label: "Звонки и голосовые сообщения" },
  { icon: "🔒", label: "E2E шифрование" },
  { icon: "🎉", label: "50+ стикеров и гифок" },
  { icon: "📸", label: "Отправка фото и видео" },
  { icon: "🌙", label: "Тёмная и светлая тема" },
];

const PAYMENT_METHODS = [
  { id: "sbp", icon: "⚡", label: "СБП (Система быстрых платежей)", desc: "Мгновенно" },
  { id: "mir", icon: "💳", label: "Карта МИР", desc: "Visa/МИР" },
  { id: "sber", icon: "🟢", label: "Карта Сбербанк", desc: "СберПей" },
];

export default function PremiumPage({ user, setUser, setPage }: Props) {
  const [payMethod, setPayMethod] = useState("sbp");
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setSuccess(true);
      setUser({ ...user, isPremium: true });
    }, 2500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-screen pb-20 p-6 animate-fade-in">
        <div className="text-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-6xl">✨</span>
          </div>
          <h1 className="font-montserrat font-black text-2xl text-diva-text mb-2">Добро пожаловать!</h1>
          <p className="text-diva-violet font-montserrat font-bold text-xl mb-3">Diva на Премиум</p>
          <p className="text-diva-text-muted font-golos text-sm mb-6">
            Теперь у вас есть жёлтая галочка, эксклюзивные аватарки, свои стикеры и фоны профиля!
          </p>
          <div className="flex items-center justify-center gap-1 bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-full text-sm font-golos font-medium mb-6">
            <span>✔</span>
            <span>Активно до 10 июня 2026</span>
          </div>
          <button
            onClick={() => setPage("profile")}
            className="w-full py-4 gradient-orange-violet rounded-3xl text-white font-montserrat font-bold text-base shadow-2xl hover:opacity-90 transition-all"
          >
            Настроить профиль
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen pb-20 overflow-y-auto scrollbar-thin animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden px-5 pt-8 pb-6 bg-gradient-to-br from-yellow-400 via-orange-500 to-diva-violet">
        <div className="absolute inset-0 opacity-20">
          {["✨","⭐","💫","🌟"].map((s, i) => (
            <span key={i} className="absolute text-4xl animate-pulse-dot" style={{
              top: `${[20, 60, 30, 75][i]}%`,
              left: `${[10, 80, 50, 20][i]}%`,
              animationDelay: `${i * 0.5}s`
            }}>{s}</span>
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-4xl">✨</span>
            <h1 className="font-montserrat font-black text-white text-2xl">Diva на Премиум</h1>
          </div>
          <div className="flex items-end gap-1 mb-2">
            <span className="font-montserrat font-black text-white text-5xl">10₽</span>
            <span className="text-white/70 font-golos text-sm mb-1">/месяц</span>
          </div>
          <p className="text-white/80 font-golos text-sm">Разблокируй всё лучшее в Web-Diva</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Premium features */}
        <div>
          <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2 px-1">
            Только для премиума
          </p>
          <div className="bg-card rounded-3xl border border-yellow-400/30 overflow-hidden shadow-sm">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className={`flex items-start gap-3 px-4 py-3.5 ${i < FEATURES.length - 1 ? "border-b border-border/40" : ""}`}
              >
                <span className="text-xl mt-0.5">{f.icon}</span>
                <div>
                  <p className="font-golos font-semibold text-diva-text text-sm">{f.label}</p>
                  <p className="text-xs text-diva-text-muted font-golos">{f.desc}</p>
                </div>
                <Icon name="Check" size={16} className="text-yellow-500 ml-auto mt-1 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Free features */}
        <div>
          <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2 px-1">
            Бесплатно всем
          </p>
          <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 p-3 gap-2">
              {FREE_FEATURES.map((f) => (
                <div key={f.label} className="flex items-center gap-2 p-2">
                  <span className="text-base">{f.icon}</span>
                  <span className="text-xs font-golos text-diva-text leading-tight">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment */}
        {!user.isPremium ? (
          <div>
            <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2 px-1">
              Способ оплаты
            </p>
            <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm mb-3">
              {PAYMENT_METHODS.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all ${
                    i < PAYMENT_METHODS.length - 1 ? "border-b border-border/40" : ""
                  } ${payMethod === m.id ? "bg-diva-orange/5" : "hover:bg-muted/40"}`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-golos font-medium text-diva-text text-sm">{m.label}</p>
                    <p className="text-xs text-diva-text-muted font-golos">{m.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    payMethod === m.id ? "border-diva-orange" : "border-border"
                  }`}>
                    {payMethod === m.id && <div className="w-2.5 h-2.5 rounded-full bg-diva-orange" />}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full py-4 rounded-3xl gradient-orange-violet text-white font-montserrat font-bold text-base shadow-2xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-70"
            >
              {paying ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Обрабатываем...
                </span>
              ) : (
                "Подписаться за 10₽"
              )}
            </button>

            <p className="text-center text-xs text-diva-text-muted font-golos mt-3">
              Безопасная оплата • Отмена в любое время
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-3xl p-5 text-center">
            <span className="text-4xl block mb-2">✨</span>
            <p className="font-montserrat font-bold text-diva-text text-lg">Премиум активен!</p>
            <p className="text-xs text-diva-text-muted font-golos mt-1">Действует до 10 июня 2026</p>
            <button
              onClick={() => setPage("profile")}
              className="mt-4 px-6 py-2.5 gradient-orange-violet text-white rounded-2xl text-sm font-golos font-semibold shadow-lg hover:opacity-90 transition-all"
            >
              Настроить профиль
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
