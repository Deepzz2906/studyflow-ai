import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAcademic } from '../../store/AcademicContext';
import confetti from 'canvas-confetti';

export const QuizModal: React.FC = () => {
  const {
    activeQuiz,
    closeQuiz,
    submitQuiz,
    startFocusSession,
  } = useAcademic();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!activeQuiz) return null;

  const currentQ = activeQuiz.questions[currentQuestionIndex];
  const isCompleted = activeQuiz.status === 'completed' || isSubmitted;

  const handleSelectOption = (optIndex: number) => {
    if (isCompleted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optIndex }));
  };

  const handleFinish = () => {
    submitQuiz(activeQuiz.id, selectedAnswers);
    setIsSubmitted(true);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const correctAnswersCount = activeQuiz.questions.filter(
    q => (q.studentAnswer ?? selectedAnswers[q.id]) === q.correctIndex
  ).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-text/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-card border border-slate-border rounded-2xl shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-background border-b border-slate-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand text-white flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-text">{activeQuiz.title}</h3>
              <p className="text-[11px] text-slate-secondary">Topic: {activeQuiz.topic}</p>
            </div>
          </div>

          <button
            onClick={closeQuiz}
            className="p-1.5 text-slate-secondary hover:text-slate-text rounded-lg hover:bg-background-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {!isCompleted ? (
            /* Active Quiz Question */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-secondary">
                <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                <span className="font-bold text-brand">{activeQuiz.difficulty} Difficulty</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all"
                  style={{
                    width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Question Text */}
              <h4 className="text-sm md:text-base font-bold text-slate-text leading-relaxed">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-50 border-brand text-brand ring-1 ring-brand'
                          : 'bg-card border-slate-border hover:border-brand-200 text-slate-text'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                        {isSelected && <span className="w-2 h-2 rounded-full bg-brand"></span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Results Summary */
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-status-success mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <h4 className="text-lg font-extrabold text-slate-text">Quiz Completed!</h4>
              <p className="text-xs text-slate-secondary">
                You scored <strong>{correctAnswersCount} / {activeQuiz.questions.length}</strong> (
                {Math.round((correctAnswersCount / activeQuiz.questions.length) * 100)}% accuracy)
              </p>

              {/* Question Review */}
              <div className="text-left space-y-3 pt-3 border-t border-slate-100 max-h-60 overflow-y-auto">
                {activeQuiz.questions.map((q, idx) => {
                  const studentAns = q.studentAnswer ?? selectedAnswers[q.id];
                  const isCorrect = studentAns === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-text">Q{idx + 1}: {q.question}</span>
                        <span className={isCorrect ? 'text-emerald-700' : 'text-red-700'}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-slate-secondary text-[11px] leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-background border-t border-slate-border flex items-center justify-between">
          {!isCompleted ? (
            <>
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="px-3.5 py-2 rounded-xl bg-card border border-slate-border text-xs font-semibold text-slate-secondary hover:text-slate-text disabled:opacity-40"
              >
                Previous
              </button>

              {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="px-5 py-2 rounded-xl bg-status-success hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  Submit Quiz
                </button>
              )}
            </>
          ) : (
            <button
              onClick={closeQuiz}
              className="w-full py-2.5 bg-brand hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Close & Update Recommendations
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
