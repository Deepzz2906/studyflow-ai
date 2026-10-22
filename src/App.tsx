import React, { useState } from 'react';
import { AcademicProvider, useAcademic } from './store/AcademicContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { FloatingAskMe } from './components/layout/FloatingAskMe';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { QuizModal } from './components/modals/QuizModal';
import { OnboardingWizard } from './components/modals/OnboardingWizard';

// Views
import { DashboardView } from './views/DashboardView';
import { TasksView } from './views/TasksView';
import { AssignmentsView } from './views/AssignmentsView';
import { HomeworkView } from './views/HomeworkView';
import { TestsExamsView } from './views/TestsExamsView';
import { StudyPlannerView } from './views/StudyPlannerView';
import { TimetableWeeklyView } from './views/TimetableWeeklyView';
import { CalendarView } from './views/CalendarView';
import { SubjectsView } from './views/SubjectsView';
import { SyllabusView } from './views/SyllabusView';
import { NotesView } from './views/NotesView';
import { AskMeAiView } from './views/AskMeAiView';
import { FocusModeView } from './views/FocusModeView';
import { ProgressAnalyticsView } from './views/ProgressAnalyticsView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';

const MainLayout: React.FC = () => {
  const {
    activeView,
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddDefaultTab,
    student,
  } = useAcademic();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!student.onboardingCompleted);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'homework':
        return <HomeworkView />;
      case 'tests':
        return <TestsExamsView />;
      case 'planner':
        return <StudyPlannerView />;
      case 'timetable':
        return <TimetableWeeklyView />;
      case 'calendar':
        return <CalendarView />;
      case 'subjects':
        return <SubjectsView />;
      case 'syllabus':
        return <SyllabusView />;
      case 'notes':
        return <NotesView />;
      case 'ai-assistant':
        return <AskMeAiView />;
      case 'focus':
        return <FocusModeView />;
      case 'progress':
        return <ProgressAnalyticsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background text-slate-text flex flex-row antialiased selection:bg-brand-100 selection:text-brand-900">
      {/* Collapsible Left Sidebar (Desktop) */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header - shown on subpages; Dashboard features its own clean integrated header */}
        {activeView !== 'dashboard' && (
          <Header onOpenSearch={() => setIsSearchOpen(true)} />
        )}

        {/* Dynamic View Canvas */}
        <main className={`flex-1 px-4 md:px-8 py-6 max-w-7xl w-full mx-auto ${activeView === 'dashboard' ? 'pt-6' : ''}`}>
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Ask Me AI Drawer */}
      <FloatingAskMe />

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultTab={quickAddDefaultTab}
      />

      <QuizModal />

      <OnboardingWizard
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AcademicProvider>
      <MainLayout />
    </AcademicProvider>
  );
}
