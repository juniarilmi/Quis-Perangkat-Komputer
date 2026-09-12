import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  User,
  Zap
} from 'lucide-react';
import { QuizQuestion, QuizSettings } from '../types';
import { HardwareVisual } from './HardwareVisual';
import { sounds } from '../utils/audio';

interface QuizScreenProps {
  studentName: string;
  sessionNumber: number;
  questions: QuizQuestion[];
  settings: QuizSettings;
  onFinishQuiz: (results: {
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
  }) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  studentName,
  sessionNumber,
  questions,
  settings,
  onFinishQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion);
  const [timeSpentTotal, setTimeSpentTotal] = useState(0);

  // Store user answers for the final review
  const [userAnswers, setUserAnswers] = useState<
    {
      questionId: string;
      question: string;
      selectedOption: number;
      correctOption: number;
      isCorrect: boolean;
      explanation: string;
      options: string[];
    }[]
  >([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isTimed = settings.timePerQuestion > 0;

  // Handle timeout
  const handleTimeOut = useCallback(() => {
    if (hasAnswered) return;
    setHasAnswered(true);
    setSelectedOption(-1); // -1 indicates timed out
    setStreak(0);
    sounds.playWrong();

    if (currentQuestion) {
      setUserAnswers(prev => [
        ...prev,
        {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          selectedOption: -1,
          correctOption: currentQuestion.answer,
          isCorrect: false,
          explanation: currentQuestion.explanation,
          options: currentQuestion.options,
        },
      ]);
    }
  }, [hasAnswered, currentQuestion]);

  // Start timer for current question
  useEffect(() => {
    if (!isTimed || hasAnswered) return;

    setTimeLeft(settings.timePerQuestion);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        if (prev <= 5 && prev > 1) {
          sounds.playTick();
        }
        return prev - 1;
      });
      setTimeSpentTotal(t => t + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, hasAnswered, isTimed, settings.timePerQuestion, handleTimeOut]);

  // Handle option click
  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;

    if (timerRef.current) clearInterval(timerRef.current);

    setHasAnswered(true);
    setSelectedOption(index);

    const isCorrect = index === currentQuestion.answer;

    if (isCorrect) {
      sounds.playCorrect();
      const pointsPerQuestion = Math.round(100 / totalQuestions);
      setScore(prev => prev + pointsPerQuestion);
      setStreak(prev => {
        const nextStreak = prev + 1;
        if (nextStreak > maxStreak) setMaxStreak(nextStreak);
        return nextStreak;
      });
    } else {
      sounds.playWrong();
      setStreak(0);
    }

    setUserAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        selectedOption: index,
        correctOption: currentQuestion.answer,
        isCorrect,
        explanation: currentQuestion.explanation,
        options: currentQuestion.options,
      },
    ]);
  };

  // Next Question
  const handleNext = () => {
    sounds.playClick();
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(prev => prev + 1);
      setHasAnswered(false);
      setSelectedOption(null);
    } else {
      // Finished all questions
      const correctCount = userAnswers.filter(a => a.isCorrect).length;
      onFinishQuiz({
        score: Math.min(100, Math.round((correctCount / totalQuestions) * 100)),
        correctCount,
        totalQuestions,
        timeSpentSeconds: timeSpentTotal,
        userAnswers,
      });
    }
  };

  // Keyboard navigation support (A, B, C, D or 1, 2, 3, 4, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasAnswered) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') handleSelectOption(0);
        if (e.key === '2' || e.key.toLowerCase() === 'b') handleSelectOption(1);
        if (e.key === '3' || e.key.toLowerCase() === 'c') handleSelectOption(2);
        if (e.key === '4' || e.key.toLowerCase() === 'd') handleSelectOption(3);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, handleNext]);

  // Timer bar styling
  const timerPercentage = isTimed ? (timeLeft / settings.timePerQuestion) * 100 : 100;
  const isTimerCritical = timeLeft <= 5 && isTimed;
  const isTimerWarning = timeLeft <= 10 && timeLeft > 5 && isTimed;

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-2 space-y-5">
      {/* Top Status Bar: Player Name, Score, Streak, Question Counter */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">{studentName}</span>
              <span className="text-[11px] font-semibold bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                Sesi {sessionNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Soal {currentIndex + 1} dari {totalQuestions}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Streak indicator */}
          {streak > 1 && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak}x Streak!</span>
            </div>
          )}

          {/* Current Score Display */}
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Skor Sementara
            </span>
            <span className="text-xl font-extrabold text-blue-400">{score}</span>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      {isTimed && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock
                className={`w-3.5 h-3.5 ${
                  isTimerCritical ? 'text-red-400 animate-pulse' : 'text-blue-400'
                }`}
              />
              Sisa Waktu
            </span>
            <span
              className={`font-mono text-sm ${
                isTimerCritical
                  ? 'text-red-400 font-bold animate-pulse'
                  : isTimerWarning
                  ? 'text-amber-400 font-bold'
                  : 'text-blue-300'
              }`}
            >
              {timeLeft} detik
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                isTimerCritical
                  ? 'bg-red-500 shadow-lg shadow-red-500/50'
                  : isTimerWarning
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-700/80 p-5 md:p-7 shadow-xl space-y-5">
        {/* Hardware Visual Card */}
        <HardwareVisual
          iconName={currentQuestion.iconName}
          category={currentQuestion.category}
          categoryLabel={currentQuestion.categoryLabel}
          accentColor={currentQuestion.accentColor}
        />

        {/* Question Text */}
        <div className="text-center md:text-left">
          <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Timeout Alert Message */}
        {hasAnswered && selectedOption === -1 && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Waktu habis! Kunci jawaban yang benar ditandai dengan warna hijau di bawah.</span>
          </div>
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {currentQuestion.options.map((opt, optIndex) => {
            const isCorrectAnswer = optIndex === currentQuestion.answer;
            const isSelected = selectedOption === optIndex;

            let optionStyle =
              'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-blue-500/50';

            if (hasAnswered) {
              if (isCorrectAnswer) {
                optionStyle =
                  'bg-emerald-950/50 border-emerald-500 text-emerald-100 font-semibold shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrectAnswer) {
                optionStyle =
                  'bg-red-950/50 border-red-500 text-red-200 font-semibold ring-1 ring-red-500';
              } else {
                optionStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={optIndex}
                id={`btn-option-${optIndex}`}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(optIndex)}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all duration-200 text-sm md:text-base leading-snug group ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      hasAnswered && isCorrectAnswer
                        ? 'bg-emerald-500 text-slate-950'
                        : hasAnswered && isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-700/80 text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors'
                    }`}
                  >
                    {optionLetters[optIndex]}
                  </span>
                  <span>{opt}</span>
                </div>

                {hasAnswered && isCorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {hasAnswered && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Educational Explanation */}
        {hasAnswered && (
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 space-y-2 mt-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Pembahasan &amp; Fakta Informatika:</span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
            {currentQuestion.fact && (
              <p className="text-xs text-blue-400 font-medium italic pt-1 border-t border-blue-900/50">
                &bull; {currentQuestion.fact}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Next Question / Finish Action Button */}
      {hasAnswered && (
        <div className="flex justify-end pt-2">
          <button
            id="btn-next-question"
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm md:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>
              {currentIndex + 1 < totalQuestions ? 'Lanjut Soal Berikutnya' : 'Selesai & Lihat Skor Akhir'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Keyboard Helper hint */}
      <p className="text-center text-[11px] text-slate-500">
        Tips: Kamu juga dapat menekan tombol keyboard <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">1</kbd>–<kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">4</kbd> atau <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">A</kbd>–<kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">D</kbd>, lalu <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Enter</kbd> untuk lanjut.
      </p>
    </div>
  );
};
