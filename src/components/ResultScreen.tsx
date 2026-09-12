import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { StudentScoreRecord } from '../types';
import { sounds } from '../utils/audio';

interface ResultScreenProps {
  record: StudentScoreRecord;
  passScore: number;
  onFinishSession: () => void;
  onRetake: () => void;
  onGoHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  record,
  passScore,
  onFinishSession,
  onRetake,
  onGoHome,
}) => {
  const [showReview, setShowReview] = useState(false);

  const isPass = record.score >= passScore;
  const isPerfect = record.score === 100;

  useEffect(() => {
    // Sound & Confetti celebration
    if (isPass) {
      sounds.playFanfare();
      try {
        confetti({
          particleCount: isPerfect ? 120 : 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isPass, isPerfect]);

  // Predicate calculation
  let gradeBadge = {
    title: 'Perlu Remedial',
    color: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    desc: 'Tetap semangat! Pelajari kembali materi perangkat keras dan coba lagi kuis ini.',
  };

  if (record.score === 100) {
    gradeBadge = {
      title: 'Sempurna! Master Perangkat Keras',
      color: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
      desc: 'Luar biasa! Kamu menguasai seluruh konsep perangkat keras komputer dengan sempurna!',
    };
  } else if (record.score >= 80) {
    gradeBadge = {
      title: 'Sangat Baik (Teknisi Handal)',
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
      desc: 'Pemahamanmu tentang perangkat keras komputer sudah sangat matang dan siap diterapkan.',
    };
  } else if (record.score >= passScore) {
    gradeBadge = {
      title: 'Tuntas (Lulus KKM)',
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/40',
      desc: 'Bagus! Nilaimu telah melampaui batas Kriteria Ketuntasan Minimal (KKM).',
    };
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 space-y-6">
      {/* Result Card Hero */}
      <div
        id="result-summary-card"
        className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 p-6 md:p-8 text-center shadow-2xl space-y-6"
      >
        {/* Glow effect */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl pointer-events-none ${
            isPerfect ? 'bg-amber-500/20' : isPass ? 'bg-emerald-500/20' : 'bg-rose-500/15'
          }`}
        />

        {/* Big Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${
              isPass
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-tr from-rose-600 to-red-400 text-white shadow-rose-500/20'
            }`}
          >
            {isPass ? <Trophy className="w-10 h-10" /> : <Award className="w-10 h-10" />}
          </div>
          {isPerfect && (
            <span className="absolute -top-2 -right-2 p-1.5 rounded-full bg-amber-400 text-slate-950 animate-bounce">
              <Sparkles className="w-4 h-4" />
            </span>
          )}
        </div>

        {/* Student Name and Congratulations */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Hasil Ujian Sesi {record.session}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            {record.studentName}
          </h2>
          <div className="mt-3 inline-block">
            <span
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold border ${gradeBadge.color}`}
            >
              {gradeBadge.title}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto mt-2">
            {gradeBadge.desc}
          </p>
        </div>

        {/* Score & Statistics Matrix */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Nilai Akhir
            </span>
            <span
              className={`text-3xl md:text-4xl font-black mt-1 ${
                isPass ? 'text-blue-400' : 'text-rose-400'
              }`}
            >
              {record.score}
            </span>
            <span className="text-[10px] text-slate-400">KKM: {passScore}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Jawaban Benar
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl md:text-4xl font-black text-emerald-400">
                {record.correctCount}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ {record.totalQuestions}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {Math.round((record.correctCount / record.totalQuestions) * 100)}% Akurat
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Waktu Selesai
            </span>
            <div className="flex items-center gap-1 text-slate-200 mt-2 font-mono font-bold text-lg md:text-xl">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{record.timeSpentSeconds}s</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">Total Pengerjaan</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="btn-finish-and-next"
            onClick={() => {
              sounds.playClick();
              onFinishSession();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
          >
            <span>Lanjut Siswa Berikutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-retake-quiz"
            onClick={() => {
              sounds.playClick();
              onRetake();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Remedial / Coba Lagi</span>
          </button>

          <button
            id="btn-go-home"
            onClick={() => {
              sounds.playClick();
              onGoHome();
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </button>
        </div>

        {/* Toggle Review Button */}
        <div className="pt-2 border-t border-slate-800">
          <button
            id="btn-toggle-answer-review"
            onClick={() => setShowReview(prev => !prev)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {showReview ? 'Sembunyikan Pembahasan Soal' : 'Buka Pembahasan Soal & Kunci Jawaban'}
            </span>
            {showReview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Answer Review Section */}
      {showReview && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Detail Pembahasan Tiap Soal</span>
            </h3>
            <span className="text-xs text-slate-400">
              {record.userAnswers.length} Soal Dianalisis
            </span>
          </div>

          <div className="space-y-3">
            {record.userAnswers.map((ans, idx) => {
              const selectedText =
                ans.selectedOption >= 0 ? ans.options[ans.selectedOption] : 'Waktu Habis (Tidak Menjawab)';
              const correctText = ans.options[ans.correctOption];

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    ans.isCorrect
                      ? 'bg-slate-900/80 border-emerald-500/30'
                      : 'bg-slate-900/80 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{ans.question}</h4>
                    </div>

                    {ans.isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Benar
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Salah
                      </span>
                    )}
                  </div>

                  {/* Options status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs my-2">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        ans.isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <span className="font-bold block text-[10px] uppercase opacity-70">
                        Pilihan Siswa:
                      </span>
                      {selectedText}
                    </div>

                    {!ans.isCorrect && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                        <span className="font-bold block text-[10px] uppercase opacity-70">
                          Kunci Jawaban yang Benar:
                        </span>
                        {correctText}
                      </div>
                    )}
                  </div>

                  {/* Explanation text */}
                  <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 leading-relaxed mt-2">
                    <span className="font-semibold text-blue-300 mr-1">Penjelasan:</span>
                    {ans.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
