import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Bot,
  User,
  Plus,
} from 'lucide-react';
import { useAcademic } from '../../store/AcademicContext';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, openQuickAdd } = useAcademic();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'ai-assistant', label: 'Ask Me', icon: Bot, isAi: true },
    { id: 'settings', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-slate-border px-3 py-2 z-40 flex items-center justify-around shadow-elevated">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        // Middle quick add floating position
        if (idx === 2) {
          return (
            <React.Fragment key="center-add-group">
              <button
                onClick={() => openQuickAdd('assignment')}
                className="w-11 h-11 -mt-5 rounded-full bg-brand text-white flex items-center justify-center shadow-lg active:scale-95 border-2 border-white"
                title="Quick Add"
              >
                <Plus className="w-5 h-5 font-bold" />
              </button>

              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-brand font-bold' : 'text-slate-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </React.Fragment>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors relative ${
              isActive ? 'text-brand font-bold' : 'text-slate-secondary'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.isAi && (
              <span className="absolute top-0 right-1 w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};
