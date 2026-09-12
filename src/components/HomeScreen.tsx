import React, { useState } from 'react';
import {
  Play,
  Trophy,
  Users,
  Timer,
  CheckCircle2,
  Sparkles,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Keyboard,
  Monitor,
  HardDrive
} from 'lucide-react';
import { AppScreen, QuizSettings, StudentScoreRecord } from '../types';
import { sounds } from '../utils/audio';

interface HomeScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onSelectStudent: (studentName: string) => void;
  students: string[];
  scores: Record<string, StudentScoreRecord>;
  settings: QuizSettings;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectStudent,
  students,
  scores,
  settings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const completedStudents = students.filter(name => !!scores[name]);
  const completedCount = completedStudents.length;
  const progressPercent = Math.round((completedCount / students.length) * 100);

  const averageScore =
    completedCount > 0
      ? Math.round(
          completedStudents.reduce((acc, name) => acc + (scores[name]?.score || 0), 0) /
            completedCount
        )
      : 0;

  // Search filtered students
  const filteredStudents = searchQuery.trim()
    ? students.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleStartSession = () => {
    sounds.playClick();
    onNavigate('session-select');
  };

  const handleOpenLeaderboard = () => {
    sounds.playClick();
    onNavigate('leaderboard');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Hero Welcome Banner */}
      <div
        id="hero-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/20 p-6 md:p-10 shadow-2xl text-center"
      >
        {/* Glow ambient background lights */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Mini Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Mata Pelajaran Informatika &bull; Kurikulum Merdeka
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
          Petualangan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">Komputer</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal leading-relaxed">
          Kuis interaktif uji pemahaman perangkat keras (hardware) komputer untuk siswa Kelas 7. Jelajahi peran input, proses, output, dan penyimpanan!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6">
          <button
            id="btn-read-material"
            onClick={() => {
              sounds.playClick();
              onNavigate('material');
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-sm sm:text-base border border-indigo-400/40 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <BookOpen className="w-5 h-5 text-indigo-200" />
            <span>Pelajari Rangkuman Materi</span>
          </button>

          <button
            id="btn-start-game"
            onClick={handleStartSession}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Pilih Sesi &amp; Mulai Kuis</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-view-leaderboard"
            onClick={handleOpenLeaderboard}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-500/50 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Papan Rekap Guru</span>
          </button>
        </div>

        {/* Quick Search Student Jump */}
        <div className="max-w-md mx-auto relative mt-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="input-quick-search-student"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari langsung namamu di sini..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-white"
              >
                Batal
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchQuery.trim() && (
            <div className="absolute z-20 top-full mt-2 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800 text-left">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(name => {
                  const hasDone = !!scores[name];
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        sounds.playClick();
                        onSelectStudent(name);
                      }}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-800 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-200">{name}</span>
                      {hasDone ? (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Skor: {scores[name].score}
                        </span>
                      ) : (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          Mulai &rarr;
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Nama &ldquo;{searchQuery}&rdquo; tidak ditemukan dalam daftar 38 siswa.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Classroom Status & Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Siswa</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{students.length}</span>
            <span className="text-xs text-slate-400">Anak (8 Sesi)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Kemajuan</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-bold text-emerald-400">{completedCount}</span>
              <span className="text-xs text-slate-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Rata-Rata</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-amber-400">{averageScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Aturan Kuis</span>
            <Timer className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xs text-slate-300 font-medium space-y-0.5">
            <p>{settings.questionsPerQuiz} Soal Acak</p>
            <p>{settings.timePerQuestion > 0 ? `${settings.timePerQuestion} Detik/Soal` : 'Tanpa Batas Waktu'}</p>
          </div>
        </div>
      </div>

      {/* Hardware Learning Pillars Overview */}
      <div className="p-5 md:p-6 rounded-2xl bg-slate-800/40 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Cakupan Materi Perangkat Keras
          </h3>
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('material');
            }}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 transition-colors"
          >
            <span>Baca Rangkuman Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-blue-500/20 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Input Device</p>
              <p className="text-[11px] text-slate-400">Keyboard, Mouse, Scanner</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-cyan-500/20 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Process Device</p>
              <p className="text-[11px] text-slate-400">CPU, GPU, RAM, PSU</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-emerald-500/20 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Output Device</p>
              <p className="text-[11px] text-slate-400">Monitor, Printer, Speaker</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-amber-500/20 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Storage Device</p>
              <p className="text-[11px] text-slate-400">HDD, SSD, Flashdisk, ROM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Classroom Quick Instructions */}
      <div className="rounded-2xl bg-blue-950/30 border border-blue-800/30 p-4 text-xs text-blue-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-200">Petunjuk Pengerjaan di Lab / Kelas:</span>
          <p className="text-slate-300 mt-1">
            1. Masuk sesuai nomor sesi yang ditentukan Bapak/Ibu Guru &bull; 
            2. Pilih nama lengkapmu &bull; 
            3. Jawab 5 soal pilihan ganda sebelum waktu habis &bull; 
            4. Nilai akan otomatis terekam ke papan rekap guru setelah kuis selesai.
          </p>
        </div>
      </div>
    </div>
  );
};
