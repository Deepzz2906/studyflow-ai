import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Bot,
  Flame,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAcademic } from '../../store/AcademicContext';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const {
    student,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    openQuickAdd,
    setIsAiDrawerOpen,
    setActiveView,
    activeView,
  } = useAcademic();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 bg-card border-b border-slate-border sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between">
      {/* Left Search / Breadcrumb */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-background border border-slate-border text-slate-secondary hover:text-slate-text hover:border-brand-300 transition-all text-sm group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-subtle group-hover:text-brand" />
            <span className="text-xs md:text-sm text-slate-subtle group-hover:text-slate-text">
              Search assignments, subjects, notes, tests...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-subtle bg-card px-2 py-0.5 rounded border border-slate-border">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3 ml-3">
        {/* Ask Me AI Quick Button */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-semibold transition-all shadow-subtle"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="hidden sm:inline">Ask Me</span>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={() => openQuickAdd('assignment')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-700 text-white text-xs font-semibold transition-all shadow-subtle active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="p-2 rounded-xl text-slate-secondary hover:text-slate-text hover:bg-background-secondary transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-status-danger text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-card border border-slate-border rounded-2xl shadow-elevated py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-border">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-text">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-brand hover:underline font-medium"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-secondary">
                    No notifications right now. You're completely up to date!
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.actionUrl) {
                          setActiveView(notif.actionUrl.replace('/', ''));
                          setIsNotifDropdownOpen(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-background-secondary/70 transition-colors cursor-pointer flex items-start gap-3 ${
                        !notif.isRead ? 'bg-brand-50/30' : ''
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                          notif.type === 'deadline'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : notif.type === 'test'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : notif.type === 'ai_recommendation'
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}
                      >
                        {notif.type === 'deadline' ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : notif.type === 'test' ? (
                          <Clock className="w-3.5 h-3.5" />
                        ) : notif.type === 'ai_recommendation' ? (
                          <Sparkles className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-text truncate">{notif.title}</p>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-brand"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-secondary mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-border text-center">
                <button
                  onClick={() => {
                    setActiveView('notifications');
                    setIsNotifDropdownOpen(false);
                  }}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Chip */}
        <div
          onClick={() => setActiveView('settings')}
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl hover:bg-background-secondary transition-colors cursor-pointer border border-transparent hover:border-slate-border"
        >
          <img
            src={student.avatar}
            alt={student.name}
            className="w-8 h-8 rounded-lg object-cover border border-slate-border"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-text leading-tight">{student.name}</p>
            <p className="text-[10px] text-slate-secondary font-medium">GPA: {student.currentGpa.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
