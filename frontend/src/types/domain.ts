export type Role = 'STUDENT' | 'TUTOR' | 'COORDINATOR' | 'ADMIN';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  student: { id: string; registration: string; classGroup?: { name: string } } | null;
  tutor: { id: string; subject: string | null } | null;
};

export type Metric = {
  label: string;
  value: string;
  change: string;
  tone: 'blue' | 'green' | 'orange' | 'red';
  href?: string;
};

export type SessionRow = {
  id: string;
  student: string;
  tutor: string;
  type: string;
  status: string;
  date: string;
};

export type ApiSession = {
  id: string;
  type: 'INDIVIDUAL' | 'GROUP';
  title: string;
  description?: string | null;
  observations?: string | null;
  periodicity?: string | null;
  scheduledAt: string;
  status: string;
  calendarStatus?: string;
  tutor?: { user?: { name: string } };
  participants?: Array<{ student?: { user?: { name: string } } }>;
};

export type ApiStudent = {
  id: string;
  registration?: string;
  user?: { name: string; email?: string };
  classGroup?: { name: string };
};

export type ApiGoal = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  dueDate?: string | null;
  student?: ApiStudent;
};
