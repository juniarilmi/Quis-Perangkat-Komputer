import React from 'react';
import { ArrowLeft, Users, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { TOTAL_SESSIONS, getSessionStudents } from '../data/students';
import { StudentScoreRecord } from '../types';
import { sounds } from '../utils/audio';

interface SessionScreenProps {
  students: string[];
  scores: Record<string, StudentScoreRecord>;
  onSelectSession: (sessionIndex: number) => void;
  onBack: () => void;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({
  students,
  scores,
  onSelectSession,
  onBack,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-home"
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-sm font-medium flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-right">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Pilih Sesi Ujian</h2>
          <p className="text-xs text-slate-400">Total {TOTAL_SESSIONS} Sesi Pembagian Kelompok</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/30 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Silakan klik sesi giliranmu untuk memilih nama dan memulai kuis.</span>
        </div>
        <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
          37 Siswa Terdaftar
        </span>
      </div>

      {/* Grid of 8 Sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: TOTAL_SESSIONS }).map((_, idx) => {
          const sessionStudents = getSessionStudents(students, idx);
          const completedStudents = sessionStudents.filter(name => !!scores[name]);
          const isAllCompleted =
            sessionStudents.length > 0 && completedStudents.length === sessionStudents.length;
          const hasSomeCompleted = completedStudents.length > 0;
          const completionRatio = `${completedStudents.length}/${sessionStudents.length}`;
          const progressPercent =
            sessionStudents.length > 0
              ? Math.round((completedStudents.length / sessionStudents.length) * 100)
              : 0;

          return (
            <button
              key={idx}
              id={`btn-session-${idx + 1}`}
              onClick={() => {
                sounds.playClick();
                onSelectSession(idx);
              }}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 group hover:scale-[1.02] active:scale-[0.98] ${
                isAllCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
                  : hasSomeCompleted
                  ? 'bg-blue-950/20 border-blue-500/30 hover:border-blue-500/60'
                  : 'bg-slate-800/50 border-slate-700/70 hover:border-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Kelompok
                  </span>
                  {isAllCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Tuntas
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400">
                      {sessionStudents.length} Siswa
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                  <span>Sesi {idx + 1}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
                </h3>

                {/* Mini student names preview */}
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {sessionStudents.join(', ')}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Selesai:
                  </span>
                  <span
                    className={
                      isAllCompleted
                        ? 'text-emerald-400 font-bold'
                        : hasSomeCompleted
                        ? 'text-blue-400 font-bold'
                        : 'text-slate-400'
                    }
                  >
                    {completionRatio}
                  </span>
                </div>
                <div className="w-full bg-slate-700/40 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isAllCompleted
                        ? 'bg-emerald-500'
                        : hasSomeCompleted
                        ? 'bg-blue-500'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
