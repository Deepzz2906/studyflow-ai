export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Submitted' | 'Overdue';
export type TopicStatus = 'Not Started' | 'Learning' | 'Revised' | 'Mastered';

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  college: string;
  course: string;
  year: number;
  semester: number;
  targetGpa: number;
  currentGpa: number;
  availableDailyStudyMinutes: number;
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
  sessionDurationPreference: number; // e.g., 45 min
  onboardingCompleted: boolean;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  color: string;
  textColor: string;
  instructor: string;
  credits: number;
  confidenceScore: number; // 1.0 to 5.0
  syllabusProgress: number; // 0 to 100
  studyHoursLogged: number; // total hours
  examDate?: string;
  room?: string;
}

export interface AssignmentSubtask {
  id: string;
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  order: number;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  description: string;
  teacher: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  estimatedDurationMinutes: number;
  difficulty: DifficultyLevel;
  priority: PriorityLevel;
  calculatedPriorityScore: number; // 0-100 calculated by Smart Priority Engine
  status: TaskStatus;
  attachments?: string[];
  submissionLink?: string;
  notes?: string;
  createdAt: string;
  subtasks: AssignmentSubtask[];
}

export interface Homework {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string;
  dueTime?: string;
  estimatedMinutes: number;
  priority: PriorityLevel;
  status: TaskStatus;
  notes?: string;
  createdAt: string;
}

export interface TestTopic {
  id: string;
  name: string;
  unit: string;
  confidence: 'Low' | 'Medium' | 'High';
  estimatedHours: number;
  isRevised: boolean;
}

export interface TestPrepDayPlan {
  dayNumber: number;
  dayDate: string;
  sessions: {
    topic: string;
    durationMinutes: number;
    activityType: 'Concept Review' | 'Problem Solving' | 'Practice Questions' | 'Mock Test' | 'Quick Revision';
    isDone?: boolean;
  }[];
}

export interface TestExam {
  id: string;
  name: string;
  subjectId: string;
  testType: 'CAT 1' | 'CAT 2' | 'Midterm' | 'Final Exam' | 'Surprise Quiz' | 'Lab Exam';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  totalMarks: number;
  difficulty: DifficultyLevel;
  preparationPercentage: number;
  topics: TestTopic[];
  notes?: string;
  generatedPrepPlan?: TestPrepDayPlan[];
}

export interface SyllabusSubtopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface SyllabusTopic {
  id: string;
  name: string;
  status: TopicStatus;
  importance: 'High' | 'Medium' | 'Low';
  subtopics: SyllabusSubtopic[];
  notesCount?: number;
}

export interface SyllabusUnit {
  id: string;
  unitNumber: number;
  title: string;
  topics: SyllabusTopic[];
}

export interface SubjectSyllabus {
  subjectId: string;
  units: SyllabusUnit[];
}

export interface TimetableEvent {
  id: string;
  title: string;
  subjectId?: string;
  type: 'class' | 'lab' | 'study' | 'personal' | 'exam';
  dayOfWeek: number; // 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri, 5 = Sat, 6 = Sun
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  room?: string;
  location?: string;
  isRecurring: boolean;
  notes?: string;
}

export interface StudySessionLog {
  id: string;
  subjectId: string;
  topic: string;
  plannedMinutes: number;
  actualMinutes: number;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime?: string;
  confidenceRating: number; // 1-5
  notes?: string;
  status: 'completed' | 'partial' | 'skipped';
}

export interface Reminder {
  id: string;
  title: string;
  category: 'Deadline' | 'Test' | 'Assignment' | 'Homework' | 'Study' | 'Schedule' | 'AI Recommendation';
  triggerTime: string; // ISO or relative
  isRead: boolean;
  priority: PriorityLevel;
  relatedId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'test' | 'study' | 'completed' | 'ai_recommendation' | 'warning';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionPayload?: any;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subjectId: string;
  topic: string;
  masteryLevel: 'new' | 'learning' | 'mastered';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  topic?: string;
  assignmentId?: string;
  testId?: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  updatedAt: string;
  aiSummary?: string;
  flashcards?: Flashcard[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  studentAnswer?: number;
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  topic: string;
  difficulty: DifficultyLevel;
  questions: QuizQuestion[];
  score?: number;
  totalQuestions: number;
  completedAt?: string;
  status: 'pending' | 'completed';
}

export interface GamificationBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface DailyGoal {
  tasksTarget: number;
  tasksCompleted: number;
  studyMinutesTarget: number;
  studyMinutesCompleted: number;
  testPrepMinutesTarget: number;
  testPrepMinutesCompleted: number;
}

export interface AIActionPayload {
  actionType: 
    | 'CREATE_ASSIGNMENT' 
    | 'CREATE_HOMEWORK' 
    | 'CREATE_STUDY_SESSION' 
    | 'MOVE_SESSION' 
    | 'MARK_TASK_COMPLETE' 
    | 'GENERATE_TEST_PLAN' 
    | 'OPTIMIZE_WEEK' 
    | 'CREATE_REMINDER'
    | 'CREATE_QUIZ';
  data: any;
  userConfirmationRequired?: boolean;
  confirmationMessage?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  structuredCard?: {
    type: 'study_plan' | 'assignment_breakdown' | 'priority_card' | 'test_plan' | 'workload_alert' | 'quiz_preview' | 'action_confirm';
    title: string;
    data: any;
  };
  suggestedPrompts?: string[];
  actionPayload?: AIActionPayload;
  actionExecuted?: boolean;
}

export interface AIRecommendation {
  id: string;
  type: 'schedule_rebalance' | 'weak_topic_boost' | 'upcoming_deadline' | 'study_break' | 'exam_countdown';
  title: string;
  subtitle: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  actionButtonText: string;
  action: () => void;
}
