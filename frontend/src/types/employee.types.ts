export interface Employee {
  id: string;
  userId: string;
  companyId: string;
  bio: string | null;
  specialties: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatar: string | null;
  };
  workingHours?: WorkingHours[];
  vacationDays?: VacationDay[];
}

export interface WorkingHours {
  id: string;
  employeeId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface VacationDay {
  id: string;
  employeeId: string;
  date: string;
  reason: string | null;
}
