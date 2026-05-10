import { useState } from "react";
import { Theme, Page } from "../App";
import Icon from "@/components/ui/icon";

interface Props {
  theme: Theme;
  toggleTheme: () => void;
  setPage: (p: Page) => void;
}

export default function SettingsPage({ theme, toggleTheme, setPage }: Props) {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
        value ? "bg-gradient-to-r from-diva-orange to-diva-violet" : "bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
          value ? "left-[26px]" : "left-0.5"
        }`}
      />
    </button>
  );

  const sections = [
    {
      title: "Внешний вид",
      items: [
        {
          icon: theme === "dark" ? "Moon" : "Sun",
          label: "Тёмная тема",
          iconColor: "text-diva-violet",
          action: <Toggle value={theme === "dark"} onChange={toggleTheme} />,
        },
      ],
    },
    {
      title: "Уведомления",
      items: [
        {
          icon: "Bell",
          label: "Уведомления",
          iconColor: "text-diva-orange",
          action: <Toggle value={notifications} onChange={() => setNotifications(!notifications)} />,
        },
        {
          icon: "Volume2",
          label: "Звуки",
          iconColor: "text-diva-orange",
          action: <Toggle value={sounds} onChange={() => setSounds(!sounds)} />,
        },
      ],
    },
    {
      title: "Конфиденциальность",
      items: [
        {
          icon: "CheckCheck",
          label: "Статус прочитано",
          iconColor: "text-diva-violet",
          action: <Toggle value={readReceipts} onChange={() => setReadReceipts(!readReceipts)} />,
        },
        {
          icon: "Shield",
          label: "Сквозное шифрование",
          iconColor: "text-green-500",
          action: <span className="text-xs font-golos text-green-500 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">Активно</span>,
        },
        {
          icon: "Lock",
          label: "Сменить пароль",
          iconColor: "text-diva-brown",
          action: <Icon name="ChevronRight" size={16} className="text-diva-text-muted" />,
        },
      ],
    },
    {
      title: "Мессенджер",
      items: [
        {
          icon: "Star",
          label: "Diva Премиум",
          iconColor: "text-yellow-500",
          action: <Icon name="ChevronRight" size={16} className="text-diva-text-muted" />,
          onClick: () => setPage("premium"),
        },
        {
          icon: "HelpCircle",
          label: "Помощь и поддержка",
          iconColor: "text-diva-violet",
          action: <Icon name="ChevronRight" size={16} className="text-diva-text-muted" />,
        },
        {
          icon: "Info",
          label: "О приложении",
          iconColor: "text-diva-text-muted",
          action: <span className="text-xs font-golos text-diva-text-muted">v1.0.0</span>,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen pb-20 overflow-y-auto scrollbar-thin animate-fade-in">
      {/* Header */}
      <div className="glass dark:glass-dark border-b border-border/50 px-4 pt-4 pb-4">
        <h1 className="font-montserrat font-bold text-xl text-diva-text">Настройки</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-golos font-medium text-diva-text-muted uppercase tracking-wider mb-2 px-1">
              {section.title}
            </p>
            <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-all ${
                    i < section.items.length - 1 ? "border-b border-border/40" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} fallback="Settings" size={18} className={item.iconColor} />
                  </div>
                  <span className="flex-1 text-left font-golos font-medium text-diva-text text-sm">{item.label}</span>
                  {item.action}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div>
          <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
            <button
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
            >
              <div className="w-9 h-9 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <Icon name="LogOut" size={18} className="text-red-500" />
              </div>
              <span className="flex-1 text-left font-golos font-medium text-red-500 text-sm">Выйти из аккаунта</span>
            </button>
          </div>
        </div>

        {/* App info */}
        <div className="text-center py-4">
          <p className="font-montserrat font-black text-2xl text-diva-text">
            Web<span className="text-diva-orange">-</span><span className="text-diva-violet">Diva</span>
          </p>
          <p className="text-xs text-diva-text-muted font-golos mt-1">Версия 1.0.0 • Только русский язык</p>
          <div className="flex items-center gap-1 justify-center mt-1">
            <Icon name="Shield" size={11} className="text-green-500" />
            <span className="text-xs text-green-500 font-golos">E2E шифрование активно</span>
          </div>
        </div>
      </div>

      {/* Logout confirm */}
      {showLogout && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-5 w-full max-w-sm shadow-2xl animate-scale-in border border-border/50">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-3">
                <Icon name="LogOut" size={28} className="text-red-500" />
              </div>
              <h3 className="font-montserrat font-bold text-lg text-diva-text">Выйти?</h3>
              <p className="text-sm text-diva-text-muted font-golos mt-1">Вы уверены, что хотите выйти из аккаунта?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-3 rounded-2xl border border-border text-diva-text-muted font-golos text-sm hover:bg-muted transition-all">Отмена</button>
              <button className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-golos font-semibold text-sm hover:bg-red-600 transition-all">Выйти</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}