import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", icon: "🏠", path: "/dashboard" },
  { label: "Opportunities", icon: "📚", path: "/opportunities" },
  { label: "Companies", icon: "🏢", path: "/companies" },
  { label: "Resources", icon: "📖", path: "/resources" },
  { label: "Events", icon: "📅", path: "/events" },
  { label: "Resume Review", icon: "📄", path: "/resume-review" },
  { label: "Application Review", icon: "✅", path: "/application-review" },
  { label: "Ask AI", icon: "💬", path: "/ai-assistant" },
];

export function PortalSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-stone-200 min-h-screen p-4 space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              isActive
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-md"
                : "text-gray-600 hover:bg-teal-50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}