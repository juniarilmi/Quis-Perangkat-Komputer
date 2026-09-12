import React from 'react';
import {
  Cpu,
  Keyboard,
  Monitor,
  HardDrive,
  Scan,
  CircuitBoard,
  Printer,
  Layers,
  Mouse,
  Zap,
  Volume2,
  Mic,
  Sliders,
  Usb,
  Tv,
  Lock,
  Barcode,
  Wifi,
  Wind,
  PenTool,
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { HardwareCategory } from '../types';

interface HardwareVisualProps {
  iconName: string;
  category: HardwareCategory;
  categoryLabel: string;
  accentColor?: string;
  title?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Cpu,
  Keyboard,
  Monitor,
  HardDrive,
  Scan,
  CircuitBoard,
  Printer,
  Layers,
  Mouse,
  Zap,
  Volume2,
  Mic,
  Sliders,
  Usb,
  Tv,
  Lock,
  Barcode,
  Wifi,
  Wind,
  PenTool,
};

const CATEGORY_THEMES: Record<
  HardwareCategory,
  { bg: string; border: string; text: string; badgeBg: string; badgeText: string }
> = {
  input: {
    bg: 'from-blue-900/40 to-indigo-900/40',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
  },
  process: {
    bg: 'from-cyan-900/40 to-blue-900/40',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
  },
  output: {
    bg: 'from-emerald-900/40 to-teal-900/40',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
  },
  storage: {
    bg: 'from-amber-900/40 to-orange-900/40',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
  },
  motherboard: {
    bg: 'from-purple-900/40 to-pink-900/40',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
  },
  network: {
    bg: 'from-sky-900/40 to-indigo-900/40',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-300',
  },
};

export const HardwareVisual: React.FC<HardwareVisualProps> = ({
  iconName,
  category,
  categoryLabel,
}) => {
  const IconComponent = ICON_MAP[iconName] || HelpCircle;
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.process;

  return (
    <div
      id="hardware-visual-card"
      className={`w-full py-6 px-4 rounded-2xl bg-gradient-to-br ${theme.bg} border ${theme.border} flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md shadow-lg shadow-black/20`}
    >
      {/* Subtle decorative background circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none blur-xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-black/20 pointer-events-none blur-xl" />

      {/* Category Tag Badge */}
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 ${theme.badgeBg} ${theme.badgeText} border border-white/10`}
      >
        {categoryLabel}
      </span>

      {/* Main Icon Container */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 shadow-inner flex items-center justify-center mb-1">
        <IconComponent className={`w-12 h-12 md:w-16 md:h-16 ${theme.text} transition-transform hover:scale-110 duration-300`} />
      </div>

      <p className="text-xs text-slate-400 font-medium mt-2">
        Materi Pokok: Sistem Komputer &amp; Perangkat Keras
      </p>
    </div>
  );
};
