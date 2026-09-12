import React, { useState } from 'react';
import {
  BookOpen,
  Keyboard,
  Cpu,
  Monitor,
  HardDrive,
  Mouse,
  Printer,
  Volume2,
  Mic,
  Tv,
  Scan,
  Usb,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Play,
  Lightbulb
} from 'lucide-react';
import { AppScreen } from '../types';
import { sounds } from '../utils/audio';

interface MaterialScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const MaterialScreen: React.FC<MaterialScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'input' | 'process' | 'output' | 'storage' | 'tips'>('all');

  const handleStartQuiz = () => {
    sounds.playClick();
    onNavigate('session-select');
  };

  const handleBack = () => {
    sounds.playClick();
    onNavigate('home');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="btn-material-back"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-sm font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <button
          id="btn-material-start-quiz-top"
          onClick={handleStartQuiz}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Lanjut ke Kuis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 border border-indigo-500/30 p-6 md:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          Rangkuman Materi Singkat &bull; Informatika Kelas 7
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
          Perangkat Keras Komputer (Hardware)
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          <strong className="text-white">Hardware</strong> adalah semua bagian fisik komputer yang dapat kita lihat secara langsung dengan mata dan dapat kita sentuh dengan tangan.
        </p>

        {/* 4 Steps Simple Diagram */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30">
            <span className="text-[10px] uppercase font-bold text-blue-400 block mb-0.5">Langkah 1</span>
            <span className="text-sm font-bold text-white">Input (Masukan)</span>
            <p className="text-xs text-slate-400 mt-1">Memasukkan data</p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-0.5">Langkah 2</span>
            <span className="text-sm font-bold text-white">Proses (Otak)</span>
            <p className="text-xs text-slate-400 mt-1">Mengolah data</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Langkah 3</span>
            <span className="text-sm font-bold text-white">Output (Keluaran)</span>
            <p className="text-xs text-slate-400 mt-1">Menampilkan hasil</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
            <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">Pendukung</span>
            <span className="text-sm font-bold text-white">Storage (Simpan)</span>
            <p className="text-xs text-slate-400 mt-1">Menyimpan file</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
          }`}
        >
          Semua Materi
        </button>
        <button
          onClick={() => setActiveTab('input')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'input'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
          }`}
        >
          1. Input (Masukan)
        </button>
        <button
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'process'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
          }`}
        >
          2. Proses (Pemroses)
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'output'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
          }`}
        >
          3. Output (Keluaran)
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'storage'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
          }`}
        >
          4. Storage (Penyimpan)
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
            activeTab === 'tips'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30'
          }`}
        >
          Trik Cepat Hafal
        </button>
      </div>

      {/* 1. INPUT DEVICES */}
      {(activeTab === 'all' || activeTab === 'input') && (
        <section className="p-5 md:p-6 rounded-2xl bg-slate-900 border border-blue-500/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Bagian 1</span>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md">Input Device</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Perangkat Masukan (Input)</h2>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Fungsi: <strong className="text-blue-300">Memasukkan data atau perintah</strong> dari luar ke dalam komputer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2.5 font-bold text-white text-sm mb-1.5">
                <Keyboard className="w-4 h-4 text-blue-400" />
                <span>Keyboard</span>
              </div>
              <p className="text-xs text-slate-300">Untuk mengetik huruf, angka, tanda baca, dan perintah ke komputer.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2.5 font-bold text-white text-sm mb-1.5">
                <Mouse className="w-4 h-4 text-blue-400" />
                <span>Mouse</span>
              </div>
              <p className="text-xs text-slate-300">Untuk menggerakkan kursor (tanda panah di layar) serta memilih dan mengklik menu.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2.5 font-bold text-white text-sm mb-1.5">
                <Mic className="w-4 h-4 text-blue-400" />
                <span>Mikrofon (Mic)</span>
              </div>
              <p className="text-xs text-slate-300">Untuk memasukkan suara kita ke dalam komputer saat bernyanyi atau video call.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2.5 font-bold text-white text-sm mb-1.5">
                <Scan className="w-4 h-4 text-blue-400" />
                <span>Scanner (Pemindai)</span>
              </div>
              <p className="text-xs text-slate-300">Untuk menyalin/memindai foto atau kertas fisik menjadi file di komputer.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2.5 font-bold text-white text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Webcam</span>
              </div>
              <p className="text-xs text-slate-300">Kamera video untuk merekam dan memasukkan wajah saat belajar online (Google Meet).</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2.5 font-bold text-white text-sm mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Barcode Scanner</span>
              </div>
              <p className="text-xs text-slate-300">Alat kasir minimarket berlampu merah untuk membaca kode garis barang belanjaan.</p>
            </div>
          </div>
        </section>
      )}

      {/* 2. PROCESS DEVICES */}
      {(activeTab === 'all' || activeTab === 'process') && (
        <section className="p-5 md:p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Bagian 2</span>
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md">Process Device</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Perangkat Pemroses (Process)</h2>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Fungsi: <strong className="text-cyan-300">Mengolah, menghitung, dan mengeksekusi</strong> semua perintah dari perangkat input.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-cyan-500/20">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>CPU / Processor (Otak Komputer)</span>
              </div>
              <p className="text-xs text-slate-300">
                Pusat pengendali dan otak utama komputer yang memproses semua perhitungan dan instruksi program.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>RAM (Memori Sementara)</span>
              </div>
              <p className="text-xs text-slate-300">
                Menyimpan data aplikasi yang sedang berjalan. Datanya akan hilang jika komputer dimatikan.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Power Supply (PSU)</span>
              </div>
              <p className="text-xs text-slate-300">
                Mengubah aliran listrik dari colokan rumah menjadi daya listrik bagi semua bagian komputer.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Motherboard (Papan Induk)</span>
              </div>
              <p className="text-xs text-slate-300">
                Papan sirkuit elektronik besar tempat semua komponen (CPU, RAM, Harddisk) saling terhubung.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 3. OUTPUT DEVICES */}
      {(activeTab === 'all' || activeTab === 'output') && (
        <section className="p-5 md:p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Bagian 3</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">Output Device</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Perangkat Keluaran (Output)</h2>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Fungsi: <strong className="text-emerald-300">Menampilkan dan mengeluarkan hasil olahan</strong> komputer kepada manusia (bisa berupa gambar, suara, atau cetakan kertas).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span>Monitor</span>
              </div>
              <p className="text-xs text-slate-300">Menampilkan gambar, tulisan, dan video di layar kaca.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Printer</span>
              </div>
              <p className="text-xs text-slate-300">Mencetak dokumen atau gambar dari komputer ke atas kertas.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Speaker</span>
              </div>
              <p className="text-xs text-slate-300">Mengeluarkan suara dan musik dari komputer agar bisa didengar telinga.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                <Tv className="w-4 h-4 text-emerald-400" />
                <span>LCD Proyektor</span>
              </div>
              <p className="text-xs text-slate-300">Menyorotkan gambar layar ke dinding atau kain putih lebar di kelas.</p>
            </div>
          </div>
        </section>
      )}

      {/* 4. STORAGE DEVICES */}
      {(activeTab === 'all' || activeTab === 'storage') && (
        <section className="p-5 md:p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Bagian 4</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">Storage Device</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Media Penyimpanan (Storage)</h2>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Fungsi: <strong className="text-amber-300">Menyimpan data dan file</strong> (seperti foto, tugas, video, game) secara permanen agar tidak hilang saat komputer dimatikan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span>Harddisk (HDD) &amp; SSD</span>
              </div>
              <p className="text-xs text-slate-300">
                Penyimpanan utama di dalam komputer berkapasitas besar untuk menampung Windows, game, dan semua file kamu.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                <Usb className="w-4 h-4 text-amber-400" />
                <span>Flashdisk (USB Drive)</span>
              </div>
              <p className="text-xs text-slate-300">
                Penyimpan kecil portabel yang praktis dimasukkan ke kantong untuk mengopi tugas sekolah antar-komputer.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 5. QUICK TIPS (TRIK CEPAT HAFAL) */}
      {(activeTab === 'all' || activeTab === 'tips') && (
        <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/40 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Kiat Sukses Ujian</span>
              <h2 className="text-lg md:text-xl font-bold text-white">Trik Cepat Hafal &amp; Bedakan Alat</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
            <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span className="font-bold text-blue-400 block mb-1">👉 INPUT = Ada yang dimasukkan</span>
              <p className="text-slate-300">
                Tangan ngetik tombol (Keyboard), tangan geser panah (Mouse), mulut bersuara (Mic), kamera merekam (Webcam).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span className="font-bold text-cyan-400 block mb-1">👉 PROSES = Otak yang berpikir</span>
              <p className="text-slate-300">
                CPU itu otak pemikirnya, RAM itu ingatan sementaranya, Motherboard itu tempat nempelnya.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span className="font-bold text-emerald-400 block mb-1">👉 OUTPUT = Hasil yang keluar</span>
              <p className="text-slate-300">
                Keluar gambar ke mata (Monitor &amp; Proyektor), keluar suara ke telinga (Speaker), keluar kertas (Printer).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700">
              <span className="font-bold text-amber-400 block mb-1">👉 STORAGE = Gudang simpanan</span>
              <p className="text-slate-300">
                Tempat nyimpan file selamanya biar nggak hilang: Harddisk, SSD, dan Flashdisk.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA to Quiz */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/40 text-center space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-white">Sudah Paham Materinya?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Yuk buktikan pemahamanmu! Soal-soalnya sangat mudah dan sesuai dengan apa yang baru saja kamu baca.
        </p>
        <button
          id="btn-material-start-quiz-bottom"
          onClick={handleStartQuiz}
          className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 inline-flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Mulai Kuis Sekarang</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
