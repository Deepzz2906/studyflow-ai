import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Calendar,
  Layers,
  ListOrdered,
  StickyNote,
  Bot,
  Sparkles,
  Flame,
  BarChart3,
  Bell,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Timer,
} from 'lucide-react';
import { useAcademic } from '../../store/AcademicContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { activeView, setActiveView, openQuickAdd, assignments, homework, tests, notifications } = useAcademic();

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;
  const pendingTasksCount = assignments.filter(a => a.status !== 'Completed').length + homework.filter(h => h.status !== 'Completed').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'homework', label: 'Homework', icon: BookOpen },
    { id: 'tests', label: 'Tests & Exams', icon: GraduationCap, badge: tests.length > 0 ? tests.length : undefined },
    { id: 'planner', label: 'Study Planner', icon: Sparkles, highlight: true },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'subjects', label: 'Subjects', icon: Layers },
    { id: 'syllabus', label: 'Syllabus', icon: ListOrdered },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'ai-assistant', label: 'Ask Me (AI)', icon: Bot, isAi: true },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-card border-r border-slate-border h-screen sticky top-0 transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white shadow-card font-bold text-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-text tracking-tight text-base">StudyFlow</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand border border-brand-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-secondary font-medium">Academic Co-pilot</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white shadow-card">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-secondary hover:text-slate-text p-1.5 rounded-lg hover:bg-background-secondary transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Global Quick Add Action */}
      <div className="p-3">
        <button
          onClick={() => openQuickAdd('assignment')}
          className={`w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98] ${
            isCollapsed ? 'px-2' : 'px-4'
          }`}
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="text-sm font-semibold">Quick Add</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors relative group ${
                isActive
                  ? 'bg-brand-50 text-brand font-semibold shadow-subtle'
                  : 'text-slate-secondary hover:text-slate-text hover:bg-background-secondary'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'text-brand' : item.isAi ? 'text-accent-cyan' : 'text-slate-secondary'}`}>
                <Icon className="w-4 h-4" />
              </div>

              {!isCollapsed && (
                <span className="flex-1 text-left truncate flex items-center gap-2">
                  {item.label}
                  {item.isAi && (
                    <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
                  )}
                </span>
              )}

              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-brand text-white'
                      : 'bg-slate-100 text-slate-secondary group-hover:bg-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Collapsed Badge Dot */}
              {isCollapsed && item.badge !== undefined && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Streak Badge & User mini status */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-border bg-background-secondary/50 m-3 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs border border-amber-200">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-text">6-Day Streak</p>
                <p className="text-[10px] text-slate-secondary">1 session to milestone</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
