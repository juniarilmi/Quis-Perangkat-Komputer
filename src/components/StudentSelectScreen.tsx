import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  CheckCircle2,
  Play,
  RotateCcw,
  Search,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { getSessionStudents } from '../data/students';
import { StudentScoreRecord } from '../types';
import { sounds } from '../utils/audio';

interface StudentSelectScreenProps {
  sessionIndex: number;
  students: string[];
  scores: Record<string, StudentScoreRecord>;
  onSelectStudent: (studentName: string) => void;
  onBack: () => void;
  onResetScore: (studentName: string) => void;
  onOpenMaterial?: () => void;
}

export const StudentSelectScreen: React.FC<StudentSelectScreenProps> = ({
  sessionIndex,
  students,
  scores,
  onSelectStudent,
  onBack,
  onResetScore,
  onOpenMaterial,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentToRetake, setStudentToRetake] = useState<{ name: string; score: number } | null>(null);
  const sessionStudents = getSessionStudents(students, sessionIndex);

  const confirmRetake = () => {
    if (studentToRetake) {
      sounds.playClick();
      onResetScore(studentToRetake.name);
      onSelectStudent(studentToRetake.name);
      setStudentToRetake(null);
    }
  };

  const filteredStudents = sessionStudents.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-sessions"
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-sm font-medium flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Pilih Sesi Lain</span>
        </button>

        <div className="text-right">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-1">
            Sesi {sessionIndex + 1}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Pilih Nama Siswa
          </h2>
        </div>
      </div>

      {/* Quick Material Review Banner */}
      {onOpenMaterial && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <p className="text-xs text-indigo-200 font-medium">
              Belum yakin atau ingin mengulang materi sebentar?
            </p>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenMaterial();
            }}
            className="text-xs font-bold text-indigo-300 hover:text-white bg-indigo-600/60 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            Baca Rangkuman &rarr;
          </button>
        </div>
      )}

      {/* Search within session */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        <input
          id="input-search-student-session"
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Cari nama pada Sesi ini..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* List of Students */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredStudents.map(studentName => {
          const record = scores[studentName];
          const isDone = !!record;

          return (
            <div
              key={studentName}
              id={`student-card-${studentName.replace(/\s+/g, '-').toLowerCase()}`}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                isDone
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-slate-800/70 border-slate-700 hover:border-blue-500/50 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{studentName}</h4>
                    <span className="text-[11px] text-slate-400">Kelompok Sesi {sessionIndex + 1}</span>
                  </div>
                </div>

                {isDone && (
                  <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Skor: {record.score}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                {isDone ? (
                  <div className="flex items-center gap-2 w-full justify-between">
                    <span className="text-xs text-slate-400">
                      Benar {record.correctCount}/{record.totalQuestions} soal
                    </span>
                    <button
                      id={`btn-retake-${studentName.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => {
                        sounds.playClick();
                        setStudentToRetake({ name: studentName, score: record.score });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
                      title="Mengerjakan Ulang (Remedial)"
                    >
                      <RotateCcw className="w-3 h-3 text-amber-400" />
                      <span>Ulangi Kuis</span>
                    </button>
                  </div>
                ) : (
                  <button
                    id={`btn-start-student-${studentName.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => {
                      sounds.playClick();
                      onSelectStudent(studentName);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Mulai Kuis</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="p-8 rounded-2xl bg-slate-800/40 border border-slate-800 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">
            Tidak ada nama yang cocok dengan &ldquo;{searchTerm}&rdquo;
          </p>
          <p className="text-xs text-slate-500">Periksa ejaan nama atau cari di sesi lain.</p>
        </div>
      )}

      {/* Retake Quiz Confirmation Modal */}
      {studentToRetake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Ulangi Kuis (Remedial)?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Siswa <strong className="text-white">{studentToRetake.name}</strong> sebelumnya memperoleh nilai{' '}
                  <span className="font-bold text-amber-400">{studentToRetake.score}</span>. Nilai ini akan digantikan dengan hasil kuis yang baru.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                id="btn-cancel-retake"
                onClick={() => {
                  sounds.playClick();
                  setStudentToRetake(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                id="btn-confirm-retake"
                onClick={confirmRetake}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Mulai Kuis Ulang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
