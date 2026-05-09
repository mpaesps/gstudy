export type Role = 'STUDENT' | 'TUTOR' | 'COORDINATOR' | 'ADMIN';

export type Metric = {
  label: string;
  value: string;
  change: string;
  tone: 'blue' | 'green' | 'orange' | 'red';
};

export type SessionRow = {
  student: string;
  tutor: string;
  type: string;
  status: string;
  date: string;
};
