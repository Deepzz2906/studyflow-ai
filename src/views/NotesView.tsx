import React, { useState } from 'react';
import {
  StickyNote,
  Plus,
  Sparkles,
  Search,
  Pin,
  Trash2,
  Tag,
  BookOpen,
  HelpCircle,
  Layers,
  CheckCircle2,
  RotateCcw,
  X,
} from 'lucide-react';
import { useAcademic } from '../store/AcademicContext';

export const NotesView: React.FC = () => {
  const {
    notes,
    subjects,
    addNote,
    updateNote,
    deleteNote,
    startNewQuiz,
  } = useAcademic();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'flashcards'>('editor');
  
  // Flashcard flip modal state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeNote = notes.find(n => n.id === selectedNoteId) || notes[0];
  const activeSubject = activeNote ? subjects.find(s => s.id === activeNote.subjectId) : null;

  const filteredNotes = notes.filter(n => {
    if (!searchQuery) return true;
    return n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAiSummarize = () => {
    if (!activeNote) return;
    const summary = `AI Summary for ${activeNote.title}: Invariant rules, time complexities O(log N), and critical corner cases for exams.`;
    updateNote(activeNote.id, { aiSummary: summary });
  };

  const handleAiCreateFlashcards = () => {
    if (!activeNote) return;
    const newCards = [
      { id: `fc-${Date.now()}-1`, question: `What is the core definition in ${activeNote.title}?`, answer: 'Guarantees balanced height search performance and minimal tree rotations.', subjectId: activeNote.subjectId, topic: activeNote.topic || 'General', masteryLevel: 'learning' as const },
      { id: `fc-${Date.now()}-2`, question: 'What is the worst-case runtime complexity?', answer: 'O(log N) for search, insert, and delete operations.', subjectId: activeNote.subjectId, topic: activeNote.topic || 'General', masteryLevel: 'learning' as const },
      { id: `fc-${Date.now()}-3`, question: 'How to handle double rotation cases?', answer: 'Perform child rotation first in the opposing direction, followed by parent rotation.', subjectId: activeNote.subjectId, topic: activeNote.topic || 'General', masteryLevel: 'new' as const },
    ];
    updateNote(activeNote.id, { flashcards: newCards });
    setActiveTab('flashcards');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-text">Notes & AI Study Tools</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand">
              {notes.length} Notes
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-secondary mt-0.5">
            Rich study notes, cheatsheets, and one-click AI flashcards & summary generation.
          </p>
        </div>

        <button
          onClick={() => {
            const newId = `note-${Date.now()}`;
            addNote({
              title: 'Untitled Study Note',
              subjectId: subjects[0]?.id || 'sub-ds',
              content: 'Write notes, formulas, or copy code snippets here...',
              tags: ['Concept'],
              isPinned: false,
              isArchived: false,
            });
            setSelectedNoteId(newId);
          }}
          className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Notes List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-subtle absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search notes & tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-card border border-slate-border text-xs text-slate-text focus:outline-none focus:border-brand shadow-subtle"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredNotes.map(note => {
              const sub = subjects.find(s => s.id === note.subjectId);
              const isSelected = note.id === selectedNoteId;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-subtle ${
                    isSelected
                      ? 'bg-card border-brand shadow-card ring-2 ring-brand/10'
                      : 'bg-card border-slate-border hover:border-brand-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${sub?.color}15`, color: sub?.color }}
                    >
                      {sub?.code}
                    </span>
                    {note.isPinned && (
                      <Pin className="w-3.5 h-3.5 text-brand fill-brand" />
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-text mt-1.5 line-clamp-1">{note.title}</h3>
                  <p className="text-[11px] text-slate-secondary mt-1 line-clamp-2">{note.aiSummary || note.content}</p>

                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {note.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-secondary">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Note Editor & AI Tools */}
        {activeNote && (
          <div className="lg:col-span-2 space-y-4">
            {/* Toolbar */}
            <div className="bg-card border border-slate-border rounded-2xl p-4 shadow-subtle flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'editor' ? 'bg-brand text-white' : 'text-slate-secondary hover:text-slate-text'
                  }`}
                >
                  Note Editor
                </button>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'flashcards' ? 'bg-brand text-white' : 'text-slate-secondary hover:text-slate-text'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Flashcards ({activeNote.flashcards?.length || 0})</span>
                </button>
              </div>

              {/* AI Study Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleAiSummarize}
                  className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition-colors flex items-center gap-1.5 border border-cyan-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>AI Summarize</span>
                </button>

                <button
                  onClick={handleAiCreateFlashcards}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors flex items-center gap-1.5 border border-purple-200"
                >
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Generate Flashcards</span>
                </button>

                <button
                  onClick={() => startNewQuiz(activeNote.subjectId, activeNote.title)}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand text-brand hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Quiz Me</span>
                </button>

                <button
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-1.5 rounded-lg text-slate-subtle hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            {activeTab === 'editor' ? (
              <div className="bg-card border border-slate-border rounded-2xl p-5 shadow-subtle space-y-4">
                {/* Note Title Input */}
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={e => updateNote(activeNote.id, { title: e.target.value })}
                  className="w-full text-lg font-extrabold text-slate-text bg-transparent border-b border-slate-100 pb-2 focus:outline-none"
                  placeholder="Note Title..."
                />

                {/* AI Summary Card (if generated) */}
                {activeNote.aiSummary && (
                  <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200 text-xs leading-relaxed text-slate-text">
                    <div className="flex items-center gap-1.5 text-cyan-900 font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                      <span>AI Key Insights Summary</span>
                    </div>
                    {activeNote.aiSummary}
                  </div>
                )}

                {/* Rich Content Text Area */}
                <textarea
                  rows={14}
                  value={activeNote.content}
                  onChange={e => updateNote(activeNote.id, { content: e.target.value })}
                  className="w-full text-xs md:text-sm text-slate-text leading-relaxed bg-transparent focus:outline-none font-mono resize-none"
                  placeholder="Write detailed notes here..."
                />
              </div>
            ) : (
              /* Interactive Flashcards Viewer */
              <div className="bg-card border border-slate-border rounded-2xl p-6 shadow-subtle text-center space-y-4">
                {activeNote.flashcards && activeNote.flashcards.length > 0 ? (
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-secondary">
                      <span>Card {activeCardIndex + 1} of {activeNote.flashcards.length}</span>
                      <span className="font-bold text-brand uppercase">{activeNote.flashcards[activeCardIndex].masteryLevel}</span>
                    </div>

                    {/* Flippable Flashcard */}
                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="min-h-[220px] p-6 rounded-2xl bg-gradient-to-b from-brand-50/50 to-white border-2 border-brand/20 shadow-card flex flex-col items-center justify-center cursor-pointer transition-all hover:border-brand"
                    >
                      <span className="text-[10px] font-bold text-brand uppercase tracking-wider mb-2">
                        {isFlipped ? 'Answer' : 'Question (Click to Flip)'}
                      </span>

                      <p className="text-sm md:text-base font-bold text-slate-text leading-relaxed">
                        {isFlipped ? activeNote.flashcards[activeCardIndex].answer : activeNote.flashcards[activeCardIndex].question}
                      </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          setActiveCardIndex(prev => (prev > 0 ? prev - 1 : activeNote.flashcards!.length - 1));
                          setIsFlipped(false);
                        }}
                        className="px-4 py-2 bg-background border border-slate-border hover:bg-slate-100 text-slate-text font-bold text-xs rounded-xl"
                      >
                        Previous
                      </button>

                      <button
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="px-4 py-2 bg-brand-50 hover:bg-brand text-brand hover:text-white font-bold text-xs rounded-xl transition-colors"
                      >
                        Flip Card
                      </button>

                      <button
                        onClick={() => {
                          setActiveCardIndex(prev => (prev < activeNote.flashcards!.length - 1 ? prev + 1 : 0));
                          setIsFlipped(false);
                        }}
                        className="px-4 py-2 bg-brand hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8">
                    <p className="text-xs text-slate-secondary mb-3">No flashcards generated for this note yet.</p>
                    <button
                      onClick={handleAiCreateFlashcards}
                      className="px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      Generate AI Flashcards
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
