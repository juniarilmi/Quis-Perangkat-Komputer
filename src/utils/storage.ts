import { QuizSettings, StudentScoreRecord } from '../types';
import { INITIAL_STUDENTS } from '../data/students';

const SCORES_KEY = 'informatikaScores_v2';
const SETTINGS_KEY = 'informatikaSettings_v2';
const STUDENTS_KEY = 'informatikaStudents_v2';

export const DEFAULT_SETTINGS: QuizSettings = {
  questionsPerQuiz: 5,
  timePerQuestion: 20,
  soundEnabled: true,
  shuffleQuestions: true,
  shuffleOptions: true,
  passScore: 75,
};

export function loadScores(): Record<string, StudentScoreRecord> {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load scores', e);
    return {};
  }
}

export function saveScore(record: StudentScoreRecord): void {
  try {
    const scores = loadScores();
    scores[record.studentName] = record;
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  } catch (e) {
    console.error('Failed to save score', e);
  }
}

export function resetStudentScore(studentName: string): void {
  try {
    const scores = loadScores();
    delete scores[studentName];
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  } catch (e) {
    console.error('Failed to reset student score', e);
  }
}

export function clearAllScores(): void {
  try {
    localStorage.removeItem(SCORES_KEY);
  } catch (e) {
    console.error('Failed to clear scores', e);
  }
}

export function loadSettings(): QuizSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: QuizSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadStudents(): string[] {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (!raw) return INITIAL_STUDENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENTS;
  } catch (e) {
    console.error('Failed to load students', e);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: string[]): void {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students', e);
  }
}

// Generate clean CSV with UTF-8 BOM for Microsoft Excel & Google Sheets
export function exportToCSV(
  students: string[],
  scores: Record<string, StudentScoreRecord>,
  findSessionFn: (students: string[], name: string) => number,
  passScore: number
): void {
  const headers = ['No', 'Nama Siswa', 'Sesi', 'Skor', 'Benar', 'Total Soal', 'Status Kelulusan', 'Waktu Pengerjaan'];
  
  const rows = students.map((name, idx) => {
    const record = scores[name];
    const sessionNum = findSessionFn(students, name);
    const scoreVal = record ? record.score : '-';
    const correctVal = record ? record.correctCount : '-';
    const totalVal = record ? record.totalQuestions : '-';
    const statusVal = record
      ? record.score >= passScore
        ? 'TUNTAS'
        : 'REMEDIAL'
      : 'BELUM MENGERJAKAN';
    const timeVal = record ? record.completedAt : '-';

    return [
      idx + 1,
      `"${name.replace(/"/g, '""')}"`,
      `"Sesi ${sessionNum}"`,
      scoreVal,
      correctVal,
      totalVal,
      `"${statusVal}"`,
      `"${timeVal}"`,
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Nilai_Kuis_Informatika_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
