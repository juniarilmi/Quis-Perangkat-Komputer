import React from 'react';
import {
  Volume2,
  VolumeX,
  Trophy,
  Settings as SettingsIcon,
  Home,
  MonitorCheck,
  BookOpen
} from 'lucide-react';
import { AppScreen } from '../types';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  completedCount: number;
  totalStudents: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  soundEnabled,
  onToggleSound,
  completedCount,
  totalStudents,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between border-b border-slate-800/80 mb-4 md:mb-6">
      <button
        id="btn-brand-home"
        onClick={() => onNavigate('home')}
        className="flex items-center gap-3 text-left group transition-all"
        title="Kembali ke Beranda"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <MonitorCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold text-white tracking-tight leading-none">
              Petualangan Komputer
            </h1>
            <span className="text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">
              Kelas 7
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal">Kuis Interaktif Informatika</p>
        </div>
      </button>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Sound Toggle */}
        <button
          id="btn-toggle-sound"
          onClick={onToggleSound}
          className={`p-2.5 rounded-xl border transition-all text-sm flex items-center justify-center ${
            soundEnabled
              ? 'bg-slate-800/90 text-blue-400 border-slate-700 hover:border-blue-500/50'
              : 'bg-slate-800/40 text-slate-500 border-slate-800 hover:text-slate-300'
          }`}
          title={soundEnabled ? 'Matikan Suara Efek' : 'Aktifkan Suara Efek'}
          aria-label="Sound Toggle"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Quick Home if not on home */}
        {currentScreen !== 'home' && (
          <button
            id="btn-nav-home"
            onClick={() => onNavigate('home')}
            className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all text-sm hidden sm:flex items-center gap-1.5"
            title="Beranda"
          >
            <Home className="w-4 h-4" />
            <span className="text-xs font-medium">Beranda</span>
          </button>
        )}

        {/* Rangkuman Materi Button */}
        <button
          id="btn-nav-material"
          onClick={() => onNavigate('material')}
          className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs md:text-sm font-semibold ${
            currentScreen === 'material'
              ? 'bg-blue-600/30 text-blue-300 border-blue-500 shadow-sm'
              : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-blue-500/50 hover:text-white'
          }`}
          title="Pelajari Rangkuman Materi"
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">Rangkuman Materi</span>
        </button>

        {/* Leaderboard / Teacher Button */}
        <button
          id="btn-nav-leaderboard"
          onClick={() => onNavigate('leaderboard')}
          className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-2 text-xs md:text-sm font-semibold ${
            currentScreen === 'leaderboard'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
              : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-amber-500/40 hover:text-amber-300'
          }`}
          title="Rekap Nilai Siswa (Guru)"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Rekap Nilai</span>
          <span className="px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            {completedCount}/{totalStudents}
          </span>
        </button>

        {/* Settings button */}
        <button
          id="btn-nav-settings"
          onClick={() => onNavigate('settings')}
          className={`p-2.5 rounded-xl border transition-all text-sm flex items-center justify-center ${
            currentScreen === 'settings'
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-slate-800/90 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
          title="Pengaturan Kuis"
          aria-label="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
