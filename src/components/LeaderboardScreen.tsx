import React, { useState, useMemo } from 'react';
import {
  Trophy,
  ArrowLeft,
  Download,
  Printer,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Users,
  Award,
  ArrowUpDown,
  AlertTriangle,
  X
} from 'lucide-react';
import { StudentScoreRecord } from '../types';
import { TOTAL_SESSIONS, findStudentSession } from '../data/students';
import { exportToCSV } from '../utils/storage';
import { sounds } from '../utils/audio';

interface LeaderboardScreenProps {
  students: string[];
  scores: Record<string, StudentScoreRecord>;
  passScore: number;
  onBack: () => void;
  onResetStudent: (studentName: string) => void;
  onClearAll: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  students,
  scores,
  passScore,
  onBack,
  onResetStudent,
  onClearAll,
}) => {
  const [sessionFilter, setSessionFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'done' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'score' | 'session'>('score');
  const [sortAsc, setSortAsc] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [studentToReset, setStudentToReset] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Statistics calculation
  const stats = useMemo(() => {
    const records = Object.values(scores) as StudentScoreRecord[];
    const completedCount = records.length;
    const totalStudentsCount = students.length;
    const passedCount = records.filter(r => r.score >= passScore).length;
    const remedialCount = completedCount - passedCount;

    const scoresList = records.map(r => r.score);
    const highestScore = scoresList.length > 0 ? Math.max(...scoresList) : 0;
    const lowestScore = scoresList.length > 0 ? Math.min(...scoresList) : 0;
    const averageScore =
      completedCount > 0
        ? Math.round(scoresList.reduce((acc, v) => acc + v, 0) / completedCount)
        : 0;

    return {
      completedCount,
      totalStudentsCount,
      passedCount,
      remedialCount,
      highestScore,
      lowestScore,
      averageScore,
    };
  }, [scores, students, passScore]);

  // Filtered & sorted student rows
  const studentRows = useMemo(() => {
    let list = students.map((name, originalIdx) => {
      const record = scores[name];
      const sessionNum = findStudentSession(students, name);
      return {
        originalIdx: originalIdx + 1,
        name,
        session: sessionNum,
        score: record ? record.score : null,
        correct: record ? record.correctCount : null,
        total: record ? record.totalQuestions : null,
        isCompleted: !!record,
        isPassed: record ? record.score >= passScore : false,
        time: record ? record.timeSpentSeconds : null,
        completedAt: record ? record.completedAt : null,
      };
    });

    // Session filter
    if (sessionFilter !== 'all') {
      list = list.filter(item => item.session === sessionFilter);
    }

    // Status filter
    if (statusFilter === 'done') {
      list = list.filter(item => item.isCompleted);
    } else if (statusFilter === 'pending') {
      list = list.filter(item => !item.isCompleted);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => item.name.toLowerCase().includes(q));
    }

    // Sorting
    list.sort((a, b) => {
      if (sortField === 'score') {
        if (a.score !== null && b.score !== null) {
          return sortAsc ? a.score - b.score : b.score - a.score;
        }
        if (a.score !== null && b.score === null) return -1;
        if (a.score === null && b.score !== null) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortField === 'name') {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortField === 'session') {
        if (a.session !== b.session) {
          return sortAsc ? a.session - b.session : b.session - a.session;
        }
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list;
  }, [students, scores, passScore, sessionFilter, statusFilter, searchQuery, sortField, sortAsc]);

  const handleToggleSort = (field: 'name' | 'score' | 'session') => {
    sounds.playClick();
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'name');
    }
  };

  const handleExportCSV = () => {
    sounds.playClick();
    exportToCSV(students, scores, findStudentSession, passScore);
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const handleClearAll = () => {
    sounds.playClick();
    setShowClearAllModal(true);
  };

  const confirmClearAll = () => {
    sounds.playClick();
    onClearAll();
    setShowClearAllModal(false);
    triggerToast('Seluruh data rekap nilai siswa berhasil direset.');
  };

  const handleResetStudentClick = (studentName: string) => {
    sounds.playClick();
    setStudentToReset(studentName);
  };

  const confirmResetStudent = () => {
    if (studentToReset) {
      sounds.playClick();
      onResetStudent(studentToReset);
      triggerToast(`Nilai ${studentToReset} berhasil direset.`);
      setStudentToReset(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-leaderboard"
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda</span>
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Rekap Nilai Siswa (Guru)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Mata Pelajaran Informatika &bull; Perangkat Keras Komputer
            </p>
          </div>
        </div>

        {/* Action buttons: Export CSV, Print, Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-semibold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            title="Download file Excel / CSV"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV (Excel)</span>
          </button>

          <button
            id="btn-print-table"
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs md:text-sm font-semibold flex items-center gap-2 transition-all"
            title="Cetak Rekap Nilai"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak</span>
          </button>

          <button
            id="btn-reset-all-scores"
            onClick={handleClearAll}
            className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all"
            title="Reset Seluruh Nilai Siswa"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards for Teacher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Siswa</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-white">{stats.totalStudentsCount}</span>
            <span className="text-[11px] text-slate-400">Anak</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Sudah Selesai</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-blue-400">{stats.completedCount}</span>
            <span className="text-[11px] text-slate-400">
              ({Math.round((stats.completedCount / stats.totalStudentsCount) * 100)}%)
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Tuntas (&ge;{passScore})</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-emerald-400">{stats.passedCount}</span>
            <span className="text-[11px] text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Remedial</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-rose-400">{stats.remedialCount}</span>
            <span className="text-[11px] text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Rata-Rata</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-amber-400">{stats.averageScore}</span>
            <span className="text-[11px] text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Tertinggi</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-emerald-300">{stats.highestScore}</span>
            <span className="text-[11px] text-slate-400">/ 100</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/70 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            id="input-search-leaderboard"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Session Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Sesi:</span>
          <select
            id="select-session-filter"
            value={sessionFilter}
            onChange={e =>
              setSessionFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Sesi (1-8)</option>
            {Array.from({ length: TOTAL_SESSIONS }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Sesi {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            id="select-status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'done' | 'pending')}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="done">Sudah Selesai</option>
            <option value="pending">Belum Mengerjakan</option>
          </select>
        </div>
      </div>

      {/* Grade Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-xl">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-800/90 text-slate-300 uppercase text-[11px] font-bold tracking-wider sticky top-0 z-10 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No</th>
                <th
                  onClick={() => handleToggleSort('name')}
                  className="px-4 py-3.5 cursor-pointer hover:text-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Nama Siswa</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('session')}
                  className="px-4 py-3.5 cursor-pointer hover:text-blue-400 transition-colors w-28 text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Sesi</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleToggleSort('score')}
                  className="px-4 py-3.5 cursor-pointer hover:text-blue-400 transition-colors w-28 text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Skor</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5 w-32 text-center">Ketuntasan</th>
                <th className="px-4 py-3.5 w-24 text-center">Aksi Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {studentRows.length > 0 ? (
                studentRows.map((item, index) => {
                  return (
                    <tr
                      key={item.name}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'
                      }`}
                    >
                      <td className="px-4 py-3 text-center text-slate-500 font-mono text-xs">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.score === 100 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                              100 🔥
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                          Sesi {item.session}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        {item.score !== null ? (
                          <span
                            className={`text-base font-black ${
                              item.score >= passScore ? 'text-blue-400' : 'text-rose-400'
                            }`}
                          >
                            {item.score}
                          </span>
                        ) : (
                          <span className="text-slate-600 font-normal">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.isCompleted ? (
                          item.isPassed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Tuntas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <AlertCircle className="w-3 h-3" /> Remedial
                            </span>
                          )
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            Belum
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.isCompleted ? (
                          <button
                            id={`btn-reset-row-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                            onClick={() => handleResetStudentClick(item.name)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Reset nilai siswa ini agar bisa mengulang"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-slate-700 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-300">Tidak ada data yang sesuai filter</p>
                    <p className="text-xs text-slate-500 mt-1">Coba ubah kata kunci pencarian atau filter sesi.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-medium text-sm shadow-2xl animate-fade-in border border-emerald-400/40">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal: Reset All Data */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Reset Seluruh Data Nilai?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Apakah Anda yakin ingin menghapus <strong className="text-white">seluruh rekap nilai kuis siswa kelas 7</strong>? Data yang dihapus tidak dapat dipulihkan kembali.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                id="btn-cancel-clear-all"
                onClick={() => {
                  sounds.playClick();
                  setShowClearAllModal(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                id="btn-confirm-clear-all"
                onClick={confirmClearAll}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Semua Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Reset Single Student */}
      {studentToReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Reset Nilai Siswa?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Hapus riwayat nilai untuk <strong className="text-white">{studentToReset}</strong>? Siswa dapat mengerjakan ulang kuisnya dari awal.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                id="btn-cancel-reset-student"
                onClick={() => {
                  sounds.playClick();
                  setStudentToReset(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                id="btn-confirm-reset-student"
                onClick={confirmResetStudent}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ya, Reset Nilai Siswa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
