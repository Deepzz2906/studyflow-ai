import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Clock,
  Flame,
} from 'lucide-react';
import { useAcademic } from '../../store/AcademicContext';
import confetti from 'canvas-confetti';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onClose }) => {
  const {
    student,
    updateStudent,
  } = useAcademic();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(student.name);
  const [college, setCollege] = useState(student.college);
  const [course, setCourse] = useState(student.course);
  const [year, setYear] = useState(student.year);
  const [studyMinutes, setStudyMinutes] = useState(student.availableDailyStudyMinutes);
  const [preferredTime, setPreferredTime] = useState(student.preferredStudyTime);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      updateStudent({
        name,
        college,
        course,
        year: Number(year),
        availableDailyStudyMinutes: Number(studyMinutes),
        preferredStudyTime: preferredTime as any,
        onboardingCompleted: true,
      });

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}

      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-text/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card border border-slate-border rounded-2xl shadow-elevated p-6 md:p-8 animate-in fade-in zoom-in-95 duration-150 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-text">Welcome to StudyFlow AI</h3>
              <p className="text-[11px] text-slate-secondary">Step {step} of 4</p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <span
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  step === s ? 'bg-brand w-5' : step > s ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              ></span>
            ))}
          </div>
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-text">What's your name and university?</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-text mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-text mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic Program */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-text">What are you studying?</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-text mb-1">Degree / Major</label>
                <input
                  type="text"
                  value={course}
                  onChange={e => setCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-text mb-1">Year of Study</label>
                <select
                  value={year}
                  onChange={e => setYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                >
                  <option value={1}>1st Year (Freshman)</option>
                  <option value={2}>2nd Year (Sophomore)</option>
                  <option value={3}>3rd Year (Junior)</option>
                  <option value={4}>4th Year (Senior)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Study Habits */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-text">How do you prefer to study?</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-text mb-1">Target Daily Study Time</label>
                <select
                  value={studyMinutes}
                  onChange={e => setStudyMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                >
                  <option value={90}>1.5 Hours / day</option>
                  <option value={150}>2.5 Hours / day</option>
                  <option value={180}>3.0 Hours / day</option>
                  <option value={240}>4.0 Hours / day</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-text mb-1">Peak Focus Window</label>
                <select
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-slate-border text-sm text-slate-text focus:outline-none focus:border-brand"
                >
                  <option value="morning">Morning (6 AM - 11 AM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 9 PM)</option>
                  <option value="night">Night (9 PM - 1 AM)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: AI Plan Ready */}
        {step === 4 && (
          <div className="space-y-4 text-center py-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 mx-auto flex items-center justify-center border border-cyan-200">
              <Sparkles className="w-6 h-6 text-accent-cyan" />
            </div>

            <h4 className="text-base font-extrabold text-slate-text">
              "Let's build your academic plan!"
            </h4>
            <p className="text-xs text-slate-secondary max-w-sm mx-auto leading-relaxed">
              StudyFlow AI is pre-loaded with your courses, upcoming deadlines, exam schedules, and timetable. Your dynamic co-pilot is ready!
            </p>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-border">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl bg-card border border-slate-border hover:bg-background-secondary text-xs font-bold text-slate-text flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>{step === 4 ? 'Launch Co-pilot' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
