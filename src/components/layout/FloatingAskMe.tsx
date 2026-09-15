import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  X,
  Send,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { useAcademic } from '../../store/AcademicContext';

export const FloatingAskMe: React.FC = () => {
  const {
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    chatMessages,
    sendChatMessage,
    executeAIAction,
    activeView,
    setActiveView,
  } = useAcademic();

  const [inputVal, setInputVal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiDrawerOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal.trim());
    setInputVal('');
  };

  const handlePromptClick = (prompt: string) => {
    sendChatMessage(prompt);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isAiDrawerOpen && (
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-brand text-white shadow-elevated hover:bg-brand-700 transition-all hover:scale-105 active:scale-95 group border border-white/20"
          title="Ask Me (AI Co-pilot)"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
          </div>
          <span className="font-semibold text-sm tracking-wide">Ask Me</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
            AI
          </span>
        </button>
      )}

      {/* Slide-in Chat Drawer */}
      {isAiDrawerOpen && (
        <div
          className={`fixed z-50 bg-card border border-slate-border shadow-elevated flex flex-col transition-all duration-200 overflow-hidden ${
            isExpanded
              ? 'inset-4 md:inset-10 rounded-2xl'
              : 'bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[420px] h-[580px] rounded-t-2xl md:rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="h-14 px-4 bg-background border-b border-slate-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Sparkles className="w-4 h-4 text-accent-cyan" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-text">Ask Me</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                    Page: {activeView}
                  </span>
                </div>
                <p className="text-[10px] text-slate-secondary">Your real-time academic assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-secondary hover:text-slate-text rounded-lg hover:bg-background-secondary transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand full'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-1.5 text-slate-secondary hover:text-slate-text rounded-lg hover:bg-background-secondary transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-background/30">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand text-white rounded-br-none shadow-sm'
                      : 'bg-card border border-slate-border text-slate-text rounded-bl-none shadow-subtle'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Structured Cards (if any) */}
                {msg.structuredCard && (
                  <div className="w-full max-w-[95%] mt-2 bg-card border border-cyan-200 rounded-xl p-3.5 shadow-subtle">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-900 border-b border-cyan-100 pb-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                      <span>{msg.structuredCard.title}</span>
                    </div>

                    {msg.structuredCard.type === 'study_plan' && msg.structuredCard.data.blocks && (
                      <div className="space-y-1.5 text-xs">
                        {msg.structuredCard.data.blocks.map((b: any, idx: number) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg flex items-center justify-between ${
                              b.isBreak ? 'bg-slate-50 text-slate-secondary italic' : 'bg-brand-50/50 text-slate-text'
                            }`}
                          >
                            <span className="font-semibold">{b.timeSlot}</span>
                            <span className="truncate max-w-[180px] font-medium">{b.title}</span>
                            <span className="text-[11px] font-bold text-slate-secondary">{b.durationMinutes}m</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.structuredCard.type === 'action_confirm' && (
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-slate-text">{msg.structuredCard.data.title}</p>
                        <p className="text-slate-secondary">Due: {msg.structuredCard.data.dueDate}</p>
                        <p className="text-slate-secondary">Estimated: {msg.structuredCard.data.estimatedTime}</p>
                        <p className="font-semibold text-brand">{msg.structuredCard.data.priority}</p>
                      </div>
                    )}

                    {msg.structuredCard.type === 'priority_card' && (
                      <div className="text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-text">{msg.structuredCard.data.task}</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                            {msg.structuredCard.data.urgency}
                          </span>
                        </div>
                        <p className="text-slate-secondary mt-1">{msg.structuredCard.data.reason}</p>
                      </div>
                    )}

                    {msg.actionPayload && (
                      <div className="mt-3 pt-2 border-t border-cyan-100 flex items-center justify-between">
                        {msg.actionExecuted ? (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Action Executed Successfully
                          </span>
                        ) : (
                          <button
                            onClick={() => executeAIAction(msg.actionPayload!)}
                            className="w-full py-1.5 px-3 rounded-lg bg-brand hover:bg-brand-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <span>Confirm & Apply to App</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested Follow-up Prompts */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.suggestedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePromptClick(p)}
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

          {/* Quick Context Action Bar */}
          <div className="px-3 py-1.5 bg-background border-t border-slate-border flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-secondary scrollbar-none">
            <span className="font-bold shrink-0 text-slate-text">Tools:</span>
            <button
              onClick={() => handlePromptClick('What should I study right now?')}
              className="px-2 py-0.5 rounded-md bg-card border border-slate-border hover:border-brand shrink-0"
            >
              What to do now?
            </button>
            <button
              onClick={() => handlePromptClick('Make me a study plan for tonight')}
              className="px-2 py-0.5 rounded-md bg-card border border-slate-border hover:border-brand shrink-0"
            >
              Tonight's Plan
            </button>
            <button
              onClick={() => handlePromptClick('When is my next test?')}
              className="px-2 py-0.5 rounded-md bg-card border border-slate-border hover:border-brand shrink-0"
            >
              Next Exam
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-card border-t border-slate-border flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Ask anything or command AI (e.g., 'Add DBMS assignment due Friday')..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-slate-border text-xs md:text-sm focus:outline-none focus:border-brand text-slate-text placeholder:text-slate-subtle"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
