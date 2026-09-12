export const INITIAL_STUDENTS: string[] = [
  "ADITIA SANJAYA",
  "FEBRIAN HANDAYANA",
  "FILQHI NURALAMSYAH",
  "Ghea Fariza Ishak",
  "INDRA PERMANA",
  "KAILA PUSPITA SARI",
  "KANIA AMELIA",
  "KIRANA MAULANA",
  "M. Hamzah Syaiful Ikhsan",
  "M. RIFA'I",
  "Mey Kaila Azahra",
  "MUHAMAD SYAHLIZAL ADHA",
  "MUHAMMAD DAFA ALHAIDAR",
  "MUHAMMAD SYABIQ AL PAQIH",
  "MUHAMMAD SYAKIR ABDUL HAQ",
  "NETA DESWITA WIJAYA",
  "NUR ASSYIFA MUDZAKIROH",
  "Rahma Yulia Nurzakiyah",
  "RAHMAT HIDAYAT SAEPULOH",
  "RAI RIZQI DINATA",
  "Raina Julianti",
  "RAISHA ZAHWA AMELIA PUTRI",
  "RAKA ANDES SAPUTRA",
  "RAMLAN ADIS SAPUTRA",
  "RATU KAMILA RAHAYU",
  "RAYA ASYIFA NURJAMAN",
  "RENATA NADRAH RAHWANI",
  "Resti Nur Khotijah",
  "RIPA RESDIAN",
  "RIZAL FADLULOH",
  "SALWA SRI NURAENI",
  "Sani Aryanti",
  "Silka Juliyan",
  "SILVIYA",
  "Sita Mafitroh Nur Khoirul Awaliya",
  "SITI MARWAH NURUL UQBATUL J",
  "SITI SARAH ROUDZOTUL MUTMA",
  "WULAN WIDIYA GUNAWAN"
];

export const TOTAL_SESSIONS = 8;

export function getSessionStudents(students: string[], sessionIndex: number): string[] {
  const studentsPerSession = Math.ceil(students.length / TOTAL_SESSIONS);
  const start = sessionIndex * studentsPerSession;
  const end = Math.min(start + studentsPerSession, students.length);
  return students.slice(start, end);
}

export function findStudentSession(students: string[], studentName: string): number {
  const studentsPerSession = Math.ceil(students.length / TOTAL_SESSIONS);
  const index = students.findIndex(s => s.toLowerCase() === studentName.toLowerCase());
  if (index === -1) return 1;
  return Math.floor(index / studentsPerSession) + 1;
}
