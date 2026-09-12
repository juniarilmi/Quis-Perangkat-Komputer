import React, { useState } from 'react';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Sliders,
  Volume2,
  Clock,
  HelpCircle,
  Users,
  Check,
  Award
} from 'lucide-react';
import { QuizSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/storage';
import { sounds } from '../utils/audio';

interface SettingsScreenProps {
  settings: QuizSettings;
  students: string[];
  onSaveSettings: (newSettings: QuizSettings) => void;
  onSaveStudents: (newStudents: string[]) => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  students,
  onSaveSettings,
  onSaveStudents,
  onBack,
}) => {
  const [localSettings, setLocalSettings] = useState<QuizSettings>({ ...settings });
  const [studentText, setStudentText] = useState<string>(students.join('\n'));
  const [isSaved, setIsSaved] = useState(false);
  const [showResetDefaultsModal, setShowResetDefaultsModal] = useState(false);

  const handleSave = () => {
    sounds.playClick();
    onSaveSettings(localSettings);

    const parsedStudents = studentText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (parsedStudents.length > 0) {
      onSaveStudents(parsedStudents);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetDefaults = () => {
    sounds.playClick();
    setShowResetDefaultsModal(true);
  };

  const confirmResetDefaults = () => {
    sounds.playClick();
    setLocalSettings(DEFAULT_SETTINGS);
    setShowResetDefaultsModal(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-settings"
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
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 justify-end">
            <SettingsIcon className="w-5 h-5 text-blue-400" />
            <span>Pengaturan Kuis</span>
          </h2>
          <p className="text-xs text-slate-400">Konfigurasi Pembelajaran Guru Informatika</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        {/* Rules & Durations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Parameter Pelaksanaan Kuis
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Jumlah Soal per Siswa */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Jumlah Soal Tiap Siswa</span>
                <span className="text-blue-400 font-bold">{localSettings.questionsPerQuiz} Soal</span>
              </label>
              <select
                id="select-questions-count"
                value={localSettings.questionsPerQuiz}
                onChange={e =>
                  setLocalSettings({ ...localSettings, questionsPerQuiz: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value={5}>5 Soal (Bawaan)</option>
                <option value={8}>8 Soal</option>
                <option value={10}>10 Soal (Lengkap)</option>
                <option value={15}>15 Soal (Ujian Harian)</option>
              </select>
              <p className="text-[11px] text-slate-500">Soal diambil secara acak dari bank soal.</p>
            </div>

            {/* Waktu Menjawab per Soal */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Batas Waktu per Soal</span>
                <span className="text-blue-400 font-bold">
                  {localSettings.timePerQuestion > 0
                    ? `${localSettings.timePerQuestion} Detik`
                    : 'Tanpa Batas'}
                </span>
              </label>
              <select
                id="select-time-limit"
                value={localSettings.timePerQuestion}
                onChange={e =>
                  setLocalSettings({ ...localSettings, timePerQuestion: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value={15}>15 Detik (Cepat)</option>
                <option value={20}>20 Detik (Bawaan Sesuai Rencana)</option>
                <option value={30}>30 Detik (Santai)</option>
                <option value={45}>45 Detik</option>
                <option value={0}>0 (Tanpa Batas Waktu / Mode Latihan)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Peringatan visual &amp; audio berbunyi 5 detik sebelum habis.
              </p>
            </div>

            {/* KKM Nilai Kelulusan */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>KKM (Kriteria Ketuntasan)</span>
                <span className="text-emerald-400 font-bold">Skor {localSettings.passScore}</span>
              </label>
              <select
                id="select-pass-score"
                value={localSettings.passScore}
                onChange={e =>
                  setLocalSettings({ ...localSettings, passScore: Number(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value={60}>Skor 60</option>
                <option value={70}>Skor 70</option>
                <option value={75}>Skor 75 (Bawaan SMP)</option>
                <option value={80}>Skor 80</option>
              </select>
              <p className="text-[11px] text-slate-500">Siswa di bawah KKM berstatus Remedial.</p>
            </div>

            {/* Suara & Pengacakan */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Efek Suara Audio</span>
              <label className="flex items-center gap-3 cursor-pointer py-1.5">
                <input
                  id="checkbox-sound-enabled"
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={e =>
                    setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })
                  }
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <span className="text-xs text-slate-200">
                  Aktifkan Efek Suara (Chime, Bel Salah, Tik Timer, Fanfare)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Student Roster Editor */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Daftar Siswa Kelas (1 Baris = 1 Nama)
            </h3>
            <span className="text-xs text-slate-400">
              {studentText.split('\n').filter(s => s.trim().length > 0).length} Siswa Terdaftar
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Guru dapat menambah, mengoreksi ejaan nama siswa, atau menyalin dari daftar absensi.
          </p>
          <textarea
            id="textarea-students-roster"
            rows={7}
            value={studentText}
            onChange={e => setStudentText(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            id="btn-reset-defaults"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Setelan Awal</span>
          </button>

          <button
            id="btn-save-settings"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reset Defaults Confirmation Modal */}
      {showResetDefaultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Kembalikan ke Setelan Bawaan?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Semua pengaturan waktu kuis (20 detik), jumlah soal (5 soal), dan KKM (70) akan dikembalikan ke konfigurasi awal.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                id="btn-cancel-reset-defaults"
                onClick={() => {
                  sounds.playClick();
                  setShowResetDefaultsModal(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                id="btn-confirm-reset-defaults"
                onClick={confirmResetDefaults}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ya, Terapkan Setelan Awal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
