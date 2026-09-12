export type HardwareCategory = 'input' | 'process' | 'output' | 'storage' | 'motherboard' | 'network';

export interface QuizQuestion {
  id: string;
  category: HardwareCategory;
  categoryLabel: string;
  question: string;
  iconName: string;
  accentColor: string;
  options: string[];
  answer: number;
  explanation: string;
  fact?: string;
}

export interface StudentScoreRecord {
  studentName: string;
  session: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
  timeSpentSeconds: number;
  userAnswers: {
    questionId: string;
    question: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    explanation: string;
    options: string[];
  }[];
}

export interface QuizSettings {
  questionsPerQuiz: number;
  timePerQuestion: number; // in seconds, 0 = untimed
  soundEnabled: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  passScore: number; // KKM, e.g. 75
}

export type AppScreen =
  | 'home'
  | 'material'
  | 'session-select'
  | 'student-select'
  | 'quiz'
  | 'result'
  | 'leaderboard'
  | 'settings';
