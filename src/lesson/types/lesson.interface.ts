export interface Lesson {
  student: string;
  teacher: string;
  isFirstLesson: boolean;
  dateTime: string;
  subjects: string[];
  grades: number[];
  goals: string[];
  miroBoardUrl: string | null;
}