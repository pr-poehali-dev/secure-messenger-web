import { useState } from "react";
import { User, Page } from "../App";
import Icon from "@/components/ui/icon";

interface Props {
  user: User;
  setPage: (p: Page) => void;
}

const MOCK_CONTACTS = [
  { id: 1, name: "Мария Иванова", avatar: "🌸", phone: "+7 900 111-22-33", online: true },
  { id: 2, name: "Дмитрий Смирнов", avatar: "🦊", phone: "+7 900 444-55-66", online: true },
  { id: 3, name: "Анастасия Белова", avatar: "🌺", phone: "+7 900 777-88-99", online: false },
  { id: 4, name: "Игорь Петров", avatar: "🐻", phone: "+7 900 000-11-22", online: false },
  { id: 5, name: "Екатерина Новикова", avatar: "🦁", phone: "+7 900 333-44-55", online: true },
  { id: 6, name: "Андрей Козлов", avatar: "🐺", phone: "+7 900 666-77-88", online: false },
];

export default function ContactsPage({ user, setPage }: Props) {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addMethod, setAddMethod] = useState<"email" | "phone">("phone");
  const [addValue, setAddValue] = useState("");
  const [showCall, setShowCall] = useState<(typeof MOCK_CONTACTS)[0] | null>(null);
  const [calling, setCalling] = useState(false);

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setContacts(prev => [...prev, {
      id: Date.now(),
      name: addValue,
      avatar: "👤",
      phone: addMethod === "phone" ? addValue : "",
      online: false,
    }]);
    setAddValue("");
    setShowAdd(false);
  };

  const startCall = (contact: (typeof MOCK_CONTACTS)[0]) => {
    setShowCall(contact);
    setCalling(true);
    setTimeout(() => setCalling(false), 3000);
  };

  return (
    <div className="flex flex-col h-screen pb-20 animate-fade-in">
      {/* Header */}
      <div className="glass dark:glass-dark border-b border-border/50 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-montserrat font-bold text-xl text-diva-text">Контакты</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl gradient-orange-violet text-white text-xs font-golos font-semibold shadow-md hover:opacity-90 transition-all"
          >
            <Icon name="UserPlus" size={14} />
            Добавить
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-diva-text-muted" />
          <input
            type="text"
            placeholder="Поиск контактов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-muted/70 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/30 focus:outline-none focus:ring-2 focus:ring-diva-orange/30"
          />
        </div>
      </div>

      {/* Add contact modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowAdd(false)}>
          <div className="w-full bg-card rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-montserrat font-bold text-lg text-diva-text mb-1">Добавить контакт</h3>
            <p className="text-sm text-diva-text-muted font-golos mb-4">По номеру телефона или email</p>
            <div className="flex gap-2 mb-4">
              {[
                { id: "phone", icon: "Phone", label: "Телефон" },
                { id: "email", icon: "Mail", label: "Email" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAddMethod(m.id as "email" | "phone")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-golos font-medium transition-all ${
                    addMethod === m.id
                      ? "gradient-orange-violet text-white shadow-md"
                      : "bg-muted text-diva-text-muted"
                  }`}
                >
                  <Icon name={m.icon as "Phone" | "Mail"} size={13} />
                  {m.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <input
                type={addMethod === "email" ? "email" : "tel"}
                placeholder={addMethod === "email" ? "email@example.ru" : "+7 900 000-00-00"}
                value={addValue}
                onChange={(e) => setAddValue(e.target.value)}
                className="w-full px-4 py-3.5 bg-muted/60 rounded-2xl text-sm font-golos text-diva-text placeholder:text-diva-text-muted/60 border border-border/50 focus:outline-none focus:ring-2 focus:ring-diva-orange/40"
                required
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-2xl border border-border text-diva-text-muted font-golos text-sm">Отмена</button>
                <button type="submit" className="flex-1 py-3 rounded-2xl gradient-orange-violet text-white font-golos font-semibold text-sm shadow-lg">Найти и добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Call overlay */}
      {showCall && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-diva-orange/30 to-diva-violet/30 flex items-center justify-center text-5xl mb-4">
            {showCall.avatar}
          </div>
          <h2 className="font-montserrat font-bold text-white text-2xl mb-2">{showCall.name}</h2>
          <p className="text-white/60 font-golos mb-8">
            {calling ? "Вызов..." : "Соединяем..."}
          </p>
          {calling && (
            <div className="flex gap-2 mb-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-diva-orange animate-pulse-dot"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          )}
          <div className="flex gap-6">
            <button
              onClick={() => setShowCall(null)}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-2xl hover:bg-red-600 transition-all active:scale-90"
            >
              <Icon name="PhoneOff" size={24} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="px-4 py-3">
          <p className="text-xs text-diva-text-muted font-golos font-medium uppercase tracking-wider mb-2">
            {filtered.length} контактов
          </p>
        </div>
        {filtered.map((contact, i) => (
          <div
            key={contact.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-border/20 hover:bg-muted/30 transition-all animate-fade-in"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-diva-orange/20 to-diva-violet/20 flex items-center justify-center text-2xl">
                {contact.avatar}
              </div>
              {contact.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background animate-pulse-dot" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-golos font-semibold text-diva-text text-sm">{contact.name}</p>
              <p className="text-xs text-diva-text-muted font-golos">{contact.phone}</p>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => startCall(contact)}
                className="w-8 h-8 rounded-full bg-diva-orange/10 flex items-center justify-center hover:bg-diva-orange hover:text-white transition-all"
              >
                <Icon name="Phone" size={14} className="text-diva-orange group-hover:text-white" />
              </button>
              <button className="w-8 h-8 rounded-full bg-diva-violet/10 flex items-center justify-center hover:bg-diva-violet hover:text-white transition-all">
                <Icon name="MessageCircle" size={14} className="text-diva-violet" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
