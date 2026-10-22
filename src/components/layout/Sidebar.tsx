import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  GraduationCap,
  Sparkles,
  CalendarDays,
  Calendar,
  Layers,
  Bot,
  BarChart3,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAcademic } from '../../store/AcademicContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { activeView, setActiveView, openQuickAdd, assignments, homework, tests } = useAcademic();

  const pendingTasksCount = assignments.filter(a => a.status !== 'Completed' && a.status !== 'Submitted').length +
    homework.filter(h => h.status !== 'Completed').length;

  // The 11 core navigation items specified in design guidelines
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'tests', label: 'Tests', icon: GraduationCap, badge: tests.length > 0 ? tests.length : undefined },
    { id: 'planner', label: 'Study Planner', icon: Sparkles },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'subjects', label: 'Subjects', icon: Layers },
    { id: 'ai-assistant', label: 'Ask Me AI', icon: Bot, isAi: true },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-[#E2E8F0] h-screen sticky top-0 transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-[72px]' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[#E2E8F0]">
        {!isCollapsed ? (
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveView('dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-[#3563E9] flex items-center justify-center text-white font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#172B4D] tracking-tight text-sm">StudyFlow</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#EFF4FF] text-[#3563E9] border border-[#BFD6FE]">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">Academic Planner</p>
            </div>
          </div>
        ) : (
          <div
            className="mx-auto cursor-pointer"
            onClick={() => setActiveView('dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-[#3563E9] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#64748B] hover:text-[#172B4D] p-1.5 rounded-md hover:bg-[#F5F7FB] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Compact Quick Add Button */}
      <div className="p-3">
        <button
          onClick={() => openQuickAdd('assignment')}
          className={`w-full flex items-center justify-center gap-2 bg-[#3563E9] hover:bg-[#254EDB] text-white font-medium py-2 rounded-lg transition-all shadow-sm active:scale-[0.98] ${
            isCollapsed ? 'px-2' : 'px-3'
          }`}
          title="Quick Add"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="text-xs font-semibold">Quick Add</span>}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors relative group ${
                isActive
                  ? 'bg-[#EFF4FF] text-[#3563E9] font-semibold'
                  : 'text-[#64748B] hover:text-[#172B4D] hover:bg-[#F5F7FB]'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#3563E9]' : 'text-[#64748B] group-hover:text-[#172B4D]'}`} />

              {!isCollapsed && (
                <span className="flex-1 text-left truncate">
                  {item.label}
                </span>
              )}

              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#3563E9] text-white'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Collapsed dot */}
              {isCollapsed && item.badge !== undefined && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#3563E9] rounded-full"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Compact User / Status Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[#E2E8F0] m-2 rounded-lg bg-[#F8FAFC]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B] text-[11px] font-medium">Study Streak</span>
            <span className="font-semibold text-[#16A34A] text-[11px]">6 Days Active</span>
          </div>
        </div>
      )}
    </aside>
  );
};
