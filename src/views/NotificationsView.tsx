import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Filter,
  Trash2,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveView,
  } = useAcademic();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-text">Notification Center</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand">
              {notifications.filter(n => !n.isRead).length} Unread
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Personalized alerts, upcoming deadline reminders, exam milestones, and AI suggestions.
          </p>
        </div>

        <button
          onClick={clearAllNotifications}
          className="px-4 py-2 rounded-xl bg-card hover:bg-background-secondary border border-slate-border text-xs font-bold text-slate-text shadow-subtle transition-all"
        >
          Mark All Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'deadline', 'test', 'ai_recommendation', 'completed'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filterType === type
                ? 'bg-brand text-white shadow-sm'
                : 'bg-card text-slate-secondary border border-slate-border hover:text-slate-text'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Notifications Stream */}
      <div className="bg-card border border-slate-border rounded-2xl shadow-subtle divide-y divide-slate-100 overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-secondary">
            No notifications found under this filter.
          </div>
        ) : (
          filteredNotifs.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.actionUrl) {
                  setActiveView(notif.actionUrl.replace('/', ''));
                }
              }}
              className={`p-4 md:p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-slate-50/70 ${
                !notif.isRead ? 'bg-brand-50/20' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${
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
                  <AlertTriangle className="w-4 h-4" />
                ) : notif.type === 'test' ? (
                  <Clock className="w-4 h-4" />
                ) : notif.type === 'ai_recommendation' ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs md:text-sm font-bold text-slate-text">{notif.title}</h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-brand shrink-0"></span>
                  )}
                </div>
                <p className="text-xs text-slate-secondary mt-1 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
