/**
 * Types declarations for FocusKid AI Landing Page
 */

export interface Message {
  id: string;
  sender: "user" | "foli";
  text: string;
  timestamp: Date;
  suggestedTasks?: string[];
  generating?: boolean;
  subject?: Subject;
}

export type AgeGroup = "5-7" | "8-10" | "11-13";

export type Subject = "science" | "math" | "history" | "art" | "languages";

export interface ParentRegisterData {
  email: string;
  contactPhone: string;
  schoolName: string;
  hasTdah: boolean;
  childName: string;
  childAge: AgeGroup;
  childGrade: string;
  difficultSubject: string;
  childTheme: string;
}

export interface DemoConfig {
  childName: string;
  ageGroup: AgeGroup;
  theme: string; // "dinosaurios", "espacio", "videojuegos", "magia"
  schoolName?: string;
  hasTdah?: boolean;
  childGrade?: string;
  difficultSubject?: string;
  contactPhone?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    icon: string;
    scoreType: "explorador" | "cientifico" | "creador" | "lider";
  }[];
}

export interface ParentSettingsMock {
  notificationsEnabled: boolean;
  studyTimeLimitMinutes: number;
  weeklyReportEmail: string;
}
