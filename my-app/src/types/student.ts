export interface Student {
  id: number;
  name: string;
  age: number;
  course: string;
  grade: string;
  email: string;
  phone: string;
}

export interface StudentFormData {
  name: string;
  age: number;
  course: string;
  grade: string;
  email: string;
  phone: string;
}

export type StorageMode = 'mysql' | 'c_structures';