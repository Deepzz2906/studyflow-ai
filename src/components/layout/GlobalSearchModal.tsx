import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  FileText,
  BookOpen,
  GraduationCap,
  Layers,
  StickyNote,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAcademic } from '../../store/AcademicContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    assignments,
    homework,
    tests,
    subjects,
    notes,
    syllabus,
    setActiveView,
  } = useAcademic();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search matches
  const matchedAssignments = cleanQuery
    ? assignments.filter(a => a.title.toLowerCase().includes(cleanQuery) || a.description.toLowerCase().includes(cleanQuery))
    : assignments.slice(0, 3);

  const matchedHomework = cleanQuery
    ? homework.filter(h => h.title.toLowerCase().includes(cleanQuery))
    : homework.slice(0, 2);

  const matchedTests = cleanQuery
    ? tests.filter(t => t.name.toLowerCase().includes(cleanQuery))
    : tests.slice(0, 2);

  const matchedSubjects = cleanQuery
    ? subjects.filter(s => s.name.toLowerCase().includes(cleanQuery) || s.code.toLowerCase().includes(cleanQuery))
    : subjects;

  const matchedNotes = cleanQuery
    ? notes.filter(n => n.title.toLowerCase().includes(cleanQuery) || n.content.toLowerCase().includes(cleanQuery))
    : notes.slice(0, 2);

  const handleSelect = (view: string) => {
    setActiveView(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-text/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-card border border-slate-border rounded-2xl shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-border flex items-center gap-3">
          <Search className="w-5 h-5 text-brand shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            placeholder="Search assignments, tests, subjects, homework, notes (or type 'DBMS', 'CAT 1')..."
            className="w-full text-base bg-transparent text-slate-text placeholder:text-slate-subtle focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-secondary hover:text-slate-text rounded-lg hover:bg-background-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
          {/* Subjects */}
          {matchedSubjects.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-secondary mb-2">Subjects</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedSubjects.map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => handleSelect('subjects')}
                    className="p-2.5 rounded-xl border border-slate-border hover:border-brand-300 hover:bg-brand-50/40 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: sub.color }}
                      ></div>
                      <div>
                        <p className="text-xs font-bold text-slate-text group-hover:text-brand">{sub.code}</p>
                        <p className="text-[11px] text-slate-secondary truncate max-w-[170px]">{sub.name}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-secondary">{sub.syllabusProgress}% done</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          {matchedAssignments.length > 0 && (
            <div className="pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-secondary mb-2">Assignments</p>
              <div className="space-y-1.5">
                {matchedAssignments.map(asg => (
                  <div
                    key={asg.id}
                    onClick={() => handleSelect('assignments')}
                    className="p-2.5 rounded-xl hover:bg-background-secondary transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-brand shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-text group-hover:text-brand">{asg.title}</p>
                        <p className="text-[11px] text-slate-secondary">Due: {asg.dueDate} • Difficulty: {asg.difficulty}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-secondary">
                      {asg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tests & Exams */}
          {matchedTests.length > 0 && (
            <div className="pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-secondary mb-2">Tests & Exams</p>
              <div className="space-y-1.5">
                {matchedTests.map(test => (
                  <div
                    key={test.id}
                    onClick={() => handleSelect('tests')}
                    className="p-2.5 rounded-xl hover:bg-background-secondary transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-text group-hover:text-brand">{test.name}</p>
                        <p className="text-[11px] text-slate-secondary">Date: {test.date} • Total Marks: {test.totalMarks}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-brand">{test.preparationPercentage}% Prepared</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {matchedNotes.length > 0 && (
            <div className="pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-secondary mb-2">Notes & Cheat Sheets</p>
              <div className="space-y-1.5">
                {matchedNotes.map(note => (
                  <div
                    key={note.id}
                    onClick={() => handleSelect('notes')}
                    className="p-2.5 rounded-xl hover:bg-background-secondary transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <StickyNote className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-text group-hover:text-brand">{note.title}</p>
                        <p className="text-[11px] text-slate-secondary truncate max-w-sm">{note.aiSummary || note.content.slice(0, 60)}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-subtle group-hover:text-brand" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-background border-t border-slate-border flex items-center justify-between text-xs text-slate-secondary">
          <span>Navigate with mouse or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
