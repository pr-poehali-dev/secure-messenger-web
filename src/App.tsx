import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import ChatsPage from "./pages/ChatsPage";
import ContactsPage from "./pages/ContactsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import PremiumPage from "./pages/PremiumPage";

export type Page = "chats" | "contacts" | "profile" | "settings" | "premium";
export type Theme = "light" | "dark";

export interface User {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  isPremium: boolean;
  premiumBg: string;
}

const defaultUser: User = {
  name: "Алексей Дива",
  email: "alex@web-diva.ru",
  phone: "+7 900 123-45-67",
  bio: "Всегда на связи 🔥",
  avatar: "🦋",
  isPremium: false,
  premiumBg: "",
};

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState<Page>("chats");
  const [theme, setTheme] = useState<Theme>("light");
  const [user, setUser] = useState<User>(defaultUser);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!authed) {
    return <AuthPage onAuth={() => setAuthed(true)} />;
  }

  return (
    <div className="gradient-bg min-h-screen flex flex-col">
      {page === "chats" && <ChatsPage user={user} setPage={setPage} />}
      {page === "contacts" && <ContactsPage user={user} setPage={setPage} />}
      {page === "profile" && <ProfilePage user={user} setUser={setUser} setPage={setPage} />}
      {page === "settings" && <SettingsPage theme={theme} toggleTheme={toggleTheme} setPage={setPage} />}
      {page === "premium" && <PremiumPage user={user} setUser={setUser} setPage={setPage} />}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="glass dark:glass-dark border-t border-border/50 px-2 pb-2">
          <div className="flex items-center justify-around max-w-lg mx-auto py-2">
            {[
              { id: "chats", icon: "💬", label: "Чаты" },
              { id: "contacts", icon: "👥", label: "Контакты" },
              { id: "profile", icon: "👤", label: "Профиль" },
              { id: "settings", icon: "⚙️", label: "Настройки" },
              { id: "premium", icon: "✨", label: "Премиум" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id as Page)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 ${
                  page === item.id
                    ? "bg-gradient-to-br from-diva-orange to-diva-violet scale-105 shadow-lg"
                    : "hover:bg-muted"
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span
                  className={`text-[10px] font-medium font-golos leading-none ${
                    page === item.id ? "text-white" : "text-diva-text-muted"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
