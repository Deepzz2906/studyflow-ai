import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Layers,
  ListTodo,
  FileText,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';

export const AskMeAiView: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    executeAIAction,
    student,
    subjects,
    assignments,
    tests,
    startNewQuiz,
  } = useAcademic();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal.trim());
    setInputVal('');
  };

  const aiTools = [
    { label: 'What to study now?', prompt: 'What should I study right now based on my deadlines?' },
    { label: 'Tonight\'s 3h Plan', prompt: 'Make me an optimized 3-hour study plan for tonight.' },
    { label: 'Next Exam Prep', prompt: 'What should I study for my next test (Data Structures CAT 1)?' },
    { label: 'Break Down DBMS Assignment', prompt: 'Break my DBMS B+ Tree assignment into smaller subtasks.' },
    { label: 'Check Timetable Free Slots', prompt: 'Where can I fit 1 hour of Networks study tomorrow?' },
    { label: 'Am I falling behind?', prompt: 'Am I falling behind in any enrolled subject?' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-bold mb-1 shadow-subtle">
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Intelligent Academic Co-pilot</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-text tracking-tight">
          Ask Me
        </h1>
        <p className="text-xs md:text-sm text-slate-secondary">
          Ask anything about your coursework, assignments, upcoming tests, or command AI to organize your schedule.
        </p>
      </div>

      {/* Quick Prompt Tool Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {aiTools.map((tool, idx) => (
          <button
            key={idx}
            onClick={() => sendChatMessage(tool.prompt)}
            className="text-xs px-3 py-1.5 rounded-xl bg-card hover:bg-brand-50 text-slate-text hover:text-brand border border-slate-border hover:border-brand-200 transition-all font-semibold shadow-subtle text-left"
          >
            ⚡ {tool.label}
          </button>
        ))}
      </div>

      {/* Main Conversation Box */}
      <div className="bg-card border border-slate-border rounded-2xl shadow-subtle overflow-hidden flex flex-col min-h-[500px] max-h-[640px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background/20">
          {chatMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand text-white rounded-br-none shadow-sm'
                    : 'bg-card border border-slate-border text-slate-text rounded-bl-none shadow-subtle'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>

              {/* Structured Card Display */}
              {msg.structuredCard && (
                <div className="w-full max-w-[90%] mt-2.5 bg-card border border-cyan-200 rounded-2xl p-4 shadow-subtle">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-900 border-b border-cyan-100 pb-2 mb-3">
                    <Sparkles className="w-4 h-4 text-accent-cyan" />
                    <span>{msg.structuredCard.title}</span>
                  </div>

                  {msg.structuredCard.type === 'study_plan' && msg.structuredCard.data.blocks && (
                    <div className="space-y-2 text-xs">
                      {msg.structuredCard.data.blocks.map((b: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl flex items-center justify-between ${
                            b.isBreak ? 'bg-slate-50 text-slate-secondary italic' : 'bg-brand-50/60 text-slate-text font-medium'
                          }`}
                        >
                          <span className="font-bold">{b.timeSlot}</span>
                          <span className="truncate max-w-[240px]">{b.title}</span>
                          <span className="font-bold text-slate-secondary">{b.durationMinutes}m</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.structuredCard.type === 'test_plan' && (
                    <div className="text-xs space-y-2">
                      <p className="font-bold text-slate-text">{msg.structuredCard.data.test}</p>
                      <p className="text-slate-secondary">Date: {msg.structuredCard.data.date}</p>
                      <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
                        <p className="font-bold text-[11px] mb-1">Recommended Focus Topics:</p>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {msg.structuredCard.data.weakestTopics.map((t: string, idx: number) => (
                            <li key={idx}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {msg.structuredCard.type === 'action_confirm' && (
                    <div className="text-xs space-y-1.5">
                      <p className="font-bold text-slate-text text-sm">{msg.structuredCard.data.title}</p>
                      <p className="text-slate-secondary">Subject: <strong>{msg.structuredCard.data.subject}</strong></p>
                      <p className="text-slate-secondary">Due Date: <strong>{msg.structuredCard.data.dueDate}</strong></p>
                      <p className="font-semibold text-brand">{msg.structuredCard.data.priority}</p>
                    </div>
                  )}

                  {/* Action Execution Button */}
                  {msg.actionPayload && (
                    <div className="mt-3.5 pt-2.5 border-t border-cyan-100 flex items-center justify-between">
                      {msg.actionExecuted ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Action Applied Successfully to StudyFlow</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => executeAIAction(msg.actionPayload!)}
                          className="w-full py-2 px-4 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                        >
                          <span>Confirm & Save Action</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Suggested Followups */}
              {msg.suggestedPrompts && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {msg.suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendChatMessage(p)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-card hover:bg-brand-50 hover:text-brand text-slate-secondary border border-slate-border hover:border-brand-200 transition-colors font-medium text-left"
                    >
                      ⚡ {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-4 bg-card border-t border-slate-border flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Ask anything or command AI (e.g., 'Add DBMS assignment due Friday', 'Schedule 1h Networks tomorrow')..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-slate-border text-xs md:text-sm text-slate-text focus:outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
