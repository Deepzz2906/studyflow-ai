import React from 'react';
import {
  BarChart3,
  Flame,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const ProgressAnalyticsView: React.FC = () => {
  const {
    subjects,
    studyLogs,
    badges,
    assignments,
    homework,
    student,
  } = useAcademic();

  const totalLoggedHours = subjects.reduce((acc, s) => acc + s.studyHoursLogged, 0);
  const completedAssignments = assignments.filter(a => a.status === 'Completed' || a.status === 'Submitted').length;
  const completedHw = homework.filter(h => h.status === 'Completed').length;

  // Chart Data: Study Hours by Subject
  const subjectChartData = subjects.map(s => ({
    name: s.code,
    hours: s.studyHoursLogged,
    color: s.color,
    fullName: s.name,
  }));

  // Weekly study distribution sample
  const weeklyStudyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 2.0 },
    { day: 'Thu', hours: 1.5 },
    { day: 'Fri', hours: 2.8 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 2.2 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-text">My Academic Progress</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              GPA: {student.currentGpa.toFixed(2)} / {student.targetGpa.toFixed(2)}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Holistic analytics on study consistency, subject mastery, completed tasks, and AI weekly reviews.
          </p>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-slate-border rounded-2xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-secondary">Total Study Time</span>
            <div className="p-2 rounded-xl bg-blue-50 text-brand">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-text mt-2">{totalLoggedHours.toFixed(1)}h</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">+4.5h this week</p>
        </div>

        <div className="bg-card border border-slate-border rounded-2xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-secondary">Active Streak</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-text mt-2">6 Days</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Personal Best: 14 Days</p>
        </div>

        <div className="bg-card border border-slate-border rounded-2xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-secondary">Completed Work</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-text mt-2">
            {completedAssignments + completedHw} Items
          </p>
          <p className="text-[11px] text-slate-secondary mt-0.5">92% on-time submission</p>
        </div>

        <div className="bg-card border border-slate-border rounded-2xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-secondary">Badges Unlocked</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-text mt-2">
            {badges.filter(b => b.unlockedAt).length} / {badges.length}
          </p>
          <p className="text-[11px] text-purple-600 font-semibold mt-0.5">Level 4 Scholar</p>
        </div>
      </div>

      {/* AI Weekly Review Summary */}
      <div className="bg-card border border-cyan-200 rounded-2xl p-5 md:p-6 shadow-subtle bg-gradient-to-r from-card to-cyan-50/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs border border-cyan-200">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
          </div>
          <h3 className="text-sm font-bold text-slate-text">AI Weekly Academic Review</h3>
        </div>

        <p className="text-xs text-slate-secondary leading-relaxed">
          "Great focus this past week! Your strongest performance was in <strong>Artificial Intelligence (19h logged)</strong> and <strong>Data Structures (16.5h)</strong>. Your best focus window was <strong>7:00 PM – 9:00 PM</strong>. Next week, allocate an additional 1.5 hours to <strong>Operating Systems</strong> to prepare for the upcoming Midterm."
        </p>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Study Hours by Subject */}
        <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-text mb-4">Total Study Hours per Subject</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="h" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                  {subjectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly Daily Study Distribution */}
        <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
          <h3 className="text-sm font-bold text-slate-text mb-4">Daily Study Distribution (This Week)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStudyData}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="h" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="hours" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gamification Achievements Showcase */}
      <div className="bg-card border border-slate-border rounded-2xl p-5 md:p-6 shadow-subtle">
        <h3 className="text-sm font-bold text-slate-text mb-4">Academic Achievements & Badges</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map(badge => {
            const isUnlocked = !!badge.unlockedAt;

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-card border-brand-200 shadow-subtle'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <span className="text-2xl shrink-0">{badge.icon}</span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-text truncate">{badge.name}</h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-secondary mt-0.5 line-clamp-2">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study History Table */}
      <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
        <h3 className="text-sm font-bold text-slate-text mb-3">Recent Focus Sessions Log</h3>

        <div className="divide-y divide-slate-100 text-xs">
          {studyLogs.map(log => {
            const sub = subjects.find(s => s.id === log.subjectId);
            return (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-text">{log.topic}</p>
                  <p className="text-slate-secondary text-[11px]">{sub?.code} • {log.date} ({log.startTime})</p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-brand">{log.actualMinutes} mins</span>
                  <p className="text-[10px] text-amber-500 font-semibold">⭐ {log.confidenceRating}/5 confidence</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
