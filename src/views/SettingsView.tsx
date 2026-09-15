import React, { useState } from 'react';
import {
  Settings,
  User,
  Sparkles,
  Clock,
  Palette,
  Shield,
  RotateCcw,
  CheckCircle2,
  Key,
  Database,
  Link,
  RefreshCw,
  Layers,
  Activity,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';
import { OpenClawAdapter } from '../services/agent/OpenClawAdapter';

export const SettingsView: React.FC = () => {
  const {
    student,
    updateStudent,
    resetAllData,
    integrations,
    toggleIntegrationConnection,
    syncIntegrationFeed,
    actionLogs,
    agentMemory,
  } = useAcademic();

  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'agent_logs'>('profile');
  const [name, setName] = useState(student.name);
  const [college, setCollege] = useState(student.college);
  const [course, setCourse] = useState(student.course);
  const [targetGpa, setTargetGpa] = useState(student.targetGpa);
  const [studyMinutes, setStudyMinutes] = useState(student.availableDailyStudyMinutes);
  const [studyTimePref, setStudyTimePref] = useState(student.preferredStudyTime);
  const [sessionDuration, setSessionDuration] = useState(student.sessionDurationPreference);
  const [openClawApiKey, setOpenClawApiKey] = useState('');
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      name,
      college,
      course,
      targetGpa: Number(targetGpa),
      availableDailyStudyMinutes: Number(studyMinutes),
      preferredStudyTime: studyTimePref as any,
      sessionDurationPreference: Number(sessionDuration),
    });

    if (openClawApiKey) {
      OpenClawAdapter.setCustomConfig(openClawApiKey);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSync = async (providerId: any) => {
    setSyncingProvider(providerId);
    await syncIntegrationFeed(providerId);
    setSyncingProvider(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-text">Settings & Architecture</h1>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Manage academic profile, OpenClaw Agent runtime, LMS/Teams integrations, and action audit logs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-card border border-slate-border rounded-2xl p-1 shadow-subtle">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile' ? 'bg-brand text-white shadow-sm' : 'text-slate-secondary hover:text-slate-text'
            }`}
          >
            Profile & AI
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'integrations' ? 'bg-brand text-white shadow-sm' : 'text-slate-secondary hover:text-slate-text'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Integrations ({integrations.filter(i => i.status === 'connected').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('agent_logs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'agent_logs' ? 'bg-brand text-white shadow-sm' : 'text-slate-secondary hover:text-slate-text'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Agent Logs</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-status-success font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences and OpenClaw Agent settings updated successfully!</span>
        </div>
      )}

      {/* TAB 1: PROFILE & AI PREFERENCES */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Profile Details */}
          <div className="bg-card border border-slate-border rounded-2xl p-5 md:p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-border">
              <User className="w-4 h-4 text-brand" />
              <h3 className="text-sm font-bold text-slate-text">Student Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-xs text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Target GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.0"
                  max="4.0"
                  value={targetGpa}
                  onChange={e => setTargetGpa(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-xs text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">University / College</label>
                <input
                  type="text"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-xs text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Degree / Course</label>
                <input
                  type="text"
                  value={course}
                  onChange={e => setCourse(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-xs text-slate-text focus:outline-none focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* AI Study Preferences */}
          <div className="bg-card border border-slate-border rounded-2xl p-5 md:p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-border">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              <h3 className="text-sm font-bold text-slate-text">AI & Study Preferences</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Target Daily Study Time</label>
                <select
                  value={studyMinutes}
                  onChange={e => setStudyMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-xs text-slate-text focus:outline-none focus:border-brand"
                >
                  <option value={90}>1.5 Hours / day</option>
                  <option value={120}>2.0 Hours / day</option>
                  <option value={180}>3.0 Hours / day</option>
                  <option value={240}>4.0 Hours / day</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Peak Cognitive Window</label>
                <select
                  value={studyTimePref}
                  onChange={e => setStudyTimePref(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-xs text-slate-text focus:outline-none focus:border-brand"
                >
                  <option value="morning">Morning (6 AM - 11 AM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 9 PM)</option>
                  <option value="night">Night (9 PM - 1 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-text mb-1">Default Focus Cycle</label>
                <select
                  value={sessionDuration}
                  onChange={e => setSessionDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-xs text-slate-text focus:outline-none focus:border-brand"
                >
                  <option value={25}>25 mins (Pomodoro standard)</option>
                  <option value={45}>45 mins (Balanced retention)</option>
                  <option value={60}>60 mins (Deep flow block)</option>
                </select>
              </div>
            </div>
          </div>

          {/* OpenClaw Agent Architecture & Config */}
          <div className="bg-card border border-slate-border rounded-2xl p-5 md:p-6 shadow-subtle space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-border">
              <Key className="w-4 h-4 text-brand" />
              <h3 className="text-sm font-bold text-slate-text">OpenClaw Agent Runtime Config</h3>
            </div>

            <p className="text-xs text-slate-secondary leading-relaxed">
              StudyFlow AI is running the <strong>OpenClaw Agent Runtime</strong>. If no external API key is supplied, it operates via the deterministic <code>MockOpenClawService</code> using memory and tool registry.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-text mb-1">OpenClaw API Key (Optional)</label>
              <input
                type="password"
                placeholder="openclaw_sk_..."
                value={openClawApiKey}
                onChange={e => setOpenClawApiKey(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-background border border-slate-border text-xs text-slate-text focus:outline-none focus:border-brand font-mono"
              />
            </div>
          </div>

          {/* Theme Badge */}
          <div className="bg-card border border-slate-border rounded-2xl p-5 md:p-6 shadow-subtle space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-border">
              <Palette className="w-4 h-4 text-brand" />
              <h3 className="text-sm font-bold text-slate-text">Design System Theme</h3>
            </div>

            <p className="text-xs text-slate-secondary">
              Theme locked to <strong>Cool Light Academic</strong> (`#F5F7FB` background, white cards, Indigo primary) for maximum focus.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <span className="px-3.5 py-1.5 rounded-xl bg-brand text-white font-bold text-xs shadow-sm">
                ✓ Light Mode Active
              </span>
            </div>
          </div>

          {/* Submit and Reset */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all demo data back to default initial state?')) {
                  resetAllData();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-status-danger font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: ACADEMIC CONNECTIONS & INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 text-xs text-slate-secondary flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-text text-sm mb-0.5">Unified Academic Data Pipeline</p>
              When external platforms sync, data passes through the <strong>Data Normalizer</strong> into unified internal assignments, exam calendars, and study priorities.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {integrations.map(int => (
              <div
                key={int.id}
                className="p-5 rounded-2xl bg-card border border-slate-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <span className="text-3xl">{int.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-text">{int.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          int.status === 'connected'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : int.status === 'syncing'
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 animate-pulse'
                            : 'bg-slate-100 text-slate-secondary'
                        }`}
                      >
                        {int.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-secondary mt-1">{int.description}</p>

                    {int.lastSyncedAt && (
                      <p className="text-[11px] text-slate-subtle mt-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last Synced: {int.lastSyncedAt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 justify-end">
                  {int.status === 'connected' && (
                    <button
                      disabled={syncingProvider === int.id}
                      onClick={() => handleSync(int.id)}
                      className="px-3.5 py-2 rounded-xl bg-background hover:bg-background-secondary border border-slate-border text-xs font-bold text-slate-text flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingProvider === int.id ? 'animate-spin text-brand' : ''}`} />
                      <span>{syncingProvider === int.id ? 'Syncing...' : 'Sync Now'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleIntegrationConnection(int.id)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                      int.status === 'connected'
                        ? 'bg-red-50 hover:bg-red-100 text-status-danger'
                        : 'bg-brand hover:bg-brand-700 text-white shadow-sm'
                    }`}
                  >
                    {int.status === 'connected' ? 'Disconnect' : 'Connect OAuth'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OPENCLAW AGENT ACTION AUDIT LOGS */}
      {activeTab === 'agent_logs' && (
        <div className="space-y-4">
          <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-text">OpenClaw Agent Execution Audit Trail</h3>
                <p className="text-xs text-slate-secondary">Transparent log of every sub-agent tool invocation</p>
              </div>
              <span className="text-xs font-bold text-brand">{actionLogs.length} Total Logs</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {actionLogs.length === 0 ? (
                <p className="text-xs text-slate-secondary py-6 text-center">No agent actions recorded yet.</p>
              ) : (
                actionLogs.map(log => (
                  <div key={log.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-text">{log.actionType}</span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                          {log.agentRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-subtle">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>

                    <p className="text-slate-secondary">{log.description}</p>
                    {log.resultSummary && (
                      <p className="text-brand font-medium text-[11px]">• {log.resultSummary}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
