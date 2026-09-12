import { useState, useEffect, useMemo } from 'react';
import { AppScreen, QuizQuestion, QuizSettings, StudentScoreRecord } from './types';
import { QUESTION_BANK } from './data/questions';
import { findStudentSession } from './data/students';
import {
  loadScores,
  saveScore,
  resetStudentScore,
  clearAllScores,
  loadSettings,
  saveSettings,
  loadStudents,
  saveStudents,
} from './utils/storage';
import { sounds } from './utils/audio';

import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { MaterialScreen } from './components/MaterialScreen';
import { SessionScreen } from './components/SessionScreen';
import { StudentSelectScreen } from './components/StudentSelectScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { SettingsScreen } from './components/SettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [students, setStudents] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, StudentScoreRecord>>({});
  const [settings, setSettings] = useState<QuizSettings>(loadSettings);

  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0);
  const [activeStudentName, setActiveStudentName] = useState<string>('');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [lastQuizResult, setLastQuizResult] = useState<StudentScoreRecord | null>(null);

  // Initialize data on mount
  useEffect(() => {
    setStudents(loadStudents());
    setScores(loadScores());
    const loadedSets = loadSettings();
    setSettings(loadedSets);
    sounds.enabled = loadedSets.soundEnabled;
  }, []);

  // Sync sound manager enabled state with settings
  useEffect(() => {
    sounds.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Handle toggling sound
  const handleToggleSound = () => {
    const updated = !settings.soundEnabled;
    const newSettings = { ...settings, soundEnabled: updated };
    setSettings(newSettings);
    saveSettings(newSettings);
    sounds.enabled = updated;
    if (updated) {
      sounds.playClick();
    }
  };

  // Prepare randomized quiz for student
  const startQuizForStudent = (studentName: string) => {
    setActiveStudentName(studentName);
    const sessionNum = findStudentSession(students, studentName);
    setSelectedSessionIndex(sessionNum - 1);

    // Shuffle and pick N questions from question bank
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(settings.questionsPerQuiz, QUESTION_BANK.length));

    setActiveQuizQuestions(selected);
    setCurrentScreen('quiz');
  };

  // Finish quiz handler
  const handleFinishQuiz = (resultData: {
    score: number;
    correctCount: number;
    totalQuestions: number;
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
  }) => {
    const sessionNum = findStudentSession(students, activeStudentName);
    const record: StudentScoreRecord = {
      studentName: activeStudentName,
      session: sessionNum,
      score: resultData.score,
      correctCount: resultData.correctCount,
      totalQuestions: resultData.totalQuestions,
      completedAt: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      timeSpentSeconds: resultData.timeSpentSeconds,
      userAnswers: resultData.userAnswers,
    };

    saveScore(record);
    setScores(prev => ({ ...prev, [activeStudentName]: record }));
    setLastQuizResult(record);
    setCurrentScreen('result');
  };

  // Reset single student's score
  const handleResetStudent = (studentName: string) => {
    resetStudentScore(studentName);
    setScores(prev => {
      const next = { ...prev };
      delete next[studentName];
      return next;
    });
  };

  // Clear all scores
  const handleClearAllScores = () => {
    clearAllScores();
    setScores({});
  };

  // Save new settings
  const handleSaveSettings = (newSettings: QuizSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Save modified student roster
  const handleSaveStudents = (newStudents: string[]) => {
    setStudents(newStudents);
    saveStudents(newStudents);
  };

  const completedCount = useMemo(() => {
    return students.filter(name => !!scores[name]).length;
  }, [students, scores]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-600 selection:text-white pb-12">
      {/* Top Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        completedCount={completedCount}
        totalStudents={students.length}
      />

      {/* Main Screen Switcher */}
      <main className="flex-1 flex flex-col justify-start">
        {currentScreen === 'home' && (
          <HomeScreen
            onNavigate={setCurrentScreen}
            onSelectStudent={startQuizForStudent}
            students={students}
            scores={scores}
            settings={settings}
          />
        )}

        {currentScreen === 'material' && (
          <MaterialScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'session-select' && (
          <SessionScreen
            students={students}
            scores={scores}
            onSelectSession={sessionIdx => {
              setSelectedSessionIndex(sessionIdx);
              setCurrentScreen('student-select');
            }}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'student-select' && (
          <StudentSelectScreen
            sessionIndex={selectedSessionIndex}
            students={students}
            scores={scores}
            onSelectStudent={startQuizForStudent}
            onBack={() => setCurrentScreen('session-select')}
            onResetScore={handleResetStudent}
            onOpenMaterial={() => setCurrentScreen('material')}
          />
        )}

        {currentScreen === 'quiz' && (
          <QuizScreen
            studentName={activeStudentName}
            sessionNumber={selectedSessionIndex + 1}
            questions={activeQuizQuestions}
            settings={settings}
            onFinishQuiz={handleFinishQuiz}
          />
        )}

        {currentScreen === 'result' && lastQuizResult && (
          <ResultScreen
            record={lastQuizResult}
            passScore={settings.passScore}
            onFinishSession={() => setCurrentScreen('student-select')}
            onRetake={() => startQuizForStudent(lastQuizResult.studentName)}
            onGoHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'leaderboard' && (
          <LeaderboardScreen
            students={students}
            scores={scores}
            passScore={settings.passScore}
            onBack={() => setCurrentScreen('home')}
            onResetStudent={handleResetStudent}
            onClearAll={handleClearAllScores}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            students={students}
            onSaveSettings={handleSaveSettings}
            onSaveStudents={handleSaveStudents}
            onBack={() => setCurrentScreen('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 mt-12 text-center text-xs text-slate-500 border-t border-slate-900 pt-6">
        <p>
          Media Pembelajaran Interaktif Informatika SMP Kelas 7 &bull; Topik: Perangkat Keras Komputer (Hardware)
        </p>
      </footer>
    </div>
  );
}
