import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onAuth: () => void;
}

const POLICY_TEXT = `Политика пользователя Web-Diva

Используя мессенджер Web-Diva, вы соглашаетесь со следующими условиями:

Создатель не несёт ответственности если вас взломают, украдут личные данные и т.д. Вы пользуетесь мессенджером на свой страх и риск.

Web-Diva применяет сквозное шифрование (E2E) для всех сообщений. Тем не менее, безопасность ваших учётных данных — ваша ответственность.

Запрещено использовать сервис в незаконных целях. Запрещено рассылать спам и вредоносный контент.

Продолжая регистрацию, вы подтверждаете, что прочитали и приняли данную политику.`;

export default function AuthPage({ onAuth }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPolicy, setShowPolicy] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [step, setStep] = useState<"form" | "policy">("form");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && !policyAccepted) {
      setStep("policy");
      return;
    }
    onAuth();
  };

  const handleAcceptPolicy = () => {
    setPolicyAccepted(true);
    setStep("form");
    onAuth();
  };

  if (step === "policy") {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm animate-scale-in">
          <div className="bg-card rounded-3xl shadow-2xl overflow-hidden">
            <div className="gradient-orange-violet p-5">
              <h2 className="font-montserrat font-bold text-white text-xl">Политика пользователя</h2>
              <p className="text-white/70 text-sm mt-1">Прочитайте и примите условия</p>
            </div>
            <div className="p-5">
              <div className="bg-muted rounded-2xl p-4 h-60 overflow-y-auto scrollbar-thin text-sm text-diva-text-muted font-golos leading-relaxed whitespace-pre-line">
                {POLICY_TEXT}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep("form")}
                  className="flex-1 py-3 rounded-2xl border border-border text-diva-text-muted font-golos font-medium text-sm hover:bg-muted transition-all"
                >
                  Назад
                </button>
                <button
                  onClick={handleAcceptPolicy}
                  className="flex-1 py-3 rounded-2xl gradient-orange-violet text-white font-golos font-semibold text-sm shadow-lg hover:opacity-90 transition-all"
                >
                  Принимаю
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 animate-fade-in text-center">
        <div className="w-20 h-20 rounded-3xl gradient-orange-violet flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <span className="text-4xl">🦋</span>
        </div>
        <h1 className="font-montserrat font-black text-3xl text-diva-text tracking-tight">
          Web<span className="text-diva-orange">-</span><span className="text-diva-violet">Diva</span>
        </h1>
        <p className="text-diva-text-muted text-sm mt-1 font-golos">Защищённый мессенджер со сквозным шифрованием</p>
        <div className="flex items-center gap-1 justify-center mt-2">
          <Icon name="Shield" size={13} className="text-diva-orange" />
          <span className="text-xs text-diva-orange font-golos font-medium">E2E шифрование</span>
          <Icon name="Lock" size={13} className="text-diva-orange ml-1" />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm animate-slide-up">
        <div className="bg-card/90 glass rounded-3xl shadow-2xl overflow-hidden border border-border/30">
          {/* Tabs */}
          <div className="flex bg-muted/60 m-4 rounded-2xl p-1">
            {[
              { id: "login", label: "Вход" },
              { id: "register", label: "Регистрация" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id as "login" | "register")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-golos font-semibold transition-all duration-200 ${
                  mode === tab.id
                    ? "bg-white dark:bg-card shadow-md text-diva-violet"
                    : "text-diva-text-muted hover:text-diva-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="px-5 pb-5">
            {/* Method switch */}
            <div className="flex gap-2 mb-4">
              {[
                { id: "email", icon: "Mail", label: "Email" },
                { id: "phone", icon: "Phone", label: "Телефон" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMethod(m.id as "email" | "phone"); setValue(""); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-golos font-medium transition-all ${
                    method === m.id
                      ? "bg-diva-orange/10 text-diva-orange border border-diva-orange/30"
                      : "bg-muted text-diva-text-muted hover:bg-muted/80"
                  }`}
                >
                  <Icon name={m.icon as "Mail" | "Phone"} size={13} />
                  {m.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-diva-text-muted">
                  <Icon name={method === "email" ? "Mail" : "Phone"} size={16} />
                </div>
                <input
                  type={method === "email" ? "email" : "tel"}
                  placeholder={method === "email" ? "your@email.ru" : "+7 900 000-00-00"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-muted/60 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/50 focus:outline-none focus:ring-2 focus:ring-diva-orange/40 focus:border-diva-orange transition-all"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-diva-text-muted">
                  <Icon name="Lock" size={16} />
                </div>
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-muted/60 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/50 focus:outline-none focus:ring-2 focus:ring-diva-orange/40 focus:border-diva-orange transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 gradient-orange-violet rounded-2xl text-white font-montserrat font-bold text-sm shadow-lg hover:opacity-90 hover:shadow-xl transition-all duration-200 active:scale-95"
              >
                {mode === "login" ? "Войти в Web-Diva" : "Создать аккаунт"}
              </button>
            </form>

            <p className="text-center text-xs text-diva-text-muted mt-4 font-golos">
              Используя сервис, вы принимаете{" "}
              <button
                onClick={() => setShowPolicy(!showPolicy)}
                className="text-diva-violet underline hover:text-diva-orange transition-colors"
              >
                политику пользователя
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
