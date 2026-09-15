import { Assignment, Homework, TestExam, Subject } from '../types';

export interface PriorityCalculationResult {
  score: number; // 0 - 100
  urgencyLabel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reasons: string[];
}

export function calculateTaskPriorityScore(
  task: {
    title: string;
    subjectId: string;
    dueDate: string;
    estimatedMinutes: number;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
  },
  subjects: Subject[],
  tests: TestExam[],
  currentDateStr = '2026-09-08'
): PriorityCalculationResult {
  let score = 30; // base score
  const reasons: string[] = [];

  const taskDate = new Date(task.dueDate);
  const now = new Date(currentDateStr);
  const diffTime = taskDate.getTime() - now.getTime();
  const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 1. Deadline Proximity Score
  if (daysUntilDue < 0) {
    score += 55;
    reasons.push('Overdue deadline');
  } else if (daysUntilDue === 0) {
    score += 48;
    reasons.push('Due today');
  } else if (daysUntilDue === 1) {
    score += 40;
    reasons.push('Due tomorrow');
  } else if (daysUntilDue <= 3) {
    score += 26;
    reasons.push(`Due in ${daysUntilDue} days`);
  } else if (daysUntilDue <= 7) {
    score += 15;
    reasons.push(`Due in ${daysUntilDue} days`);
  } else {
    score += 5;
    reasons.push('Due in more than a week');
  }

  // 2. Subject Confidence & Importance
  const subject = subjects.find(s => s.id === task.subjectId);
  if (subject) {
    if (subject.confidenceScore < 3.5) {
      score += 15;
      reasons.push(`Low subject confidence (${subject.confidenceScore}/5)`);
    } else if (subject.confidenceScore < 4.0) {
      score += 8;
      reasons.push(`Medium subject confidence (${subject.confidenceScore}/5)`);
    }

    if (subject.credits >= 4) {
      score += 6;
      reasons.push(`High credit weight (${subject.credits} credits)`);
    }
  }

  // 3. Proximity to Upcoming Test in same subject
  const upcomingSubjectTest = tests.find(t => {
    if (t.subjectId !== task.subjectId) return false;
    const testDate = new Date(t.date);
    const testDiffDays = Math.ceil((testDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return testDiffDays >= 0 && testDiffDays <= 7;
  });

  if (upcomingSubjectTest) {
    score += 14;
    reasons.push(`Test approaching: ${upcomingSubjectTest.name}`);
  }

  // 4. Task Difficulty & Effort
  if (task.difficulty === 'Hard' || task.estimatedMinutes > 180) {
    score += 12;
    reasons.push(`Heavy effort required (~${Math.round(task.estimatedMinutes / 60)}h)`);
  } else if (task.difficulty === 'Medium' || task.estimatedMinutes >= 60) {
    score += 6;
  }

  // Normalize between 0 and 100
  const finalScore = Math.min(Math.max(Math.round(score), 5), 99);

  let urgencyLabel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (finalScore >= 85) urgencyLabel = 'CRITICAL';
  else if (finalScore >= 70) urgencyLabel = 'HIGH';
  else if (finalScore >= 45) urgencyLabel = 'MEDIUM';

  return {
    score: finalScore,
    urgencyLabel,
    reasons,
  };
}
