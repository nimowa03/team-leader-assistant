export type MemberStatus = 'ALIVE' | 'ELIMINATED';

export interface Member {
  id: string;
  name: string;
  status: MemberStatus;
  // Track counts for quick status updates
  absentCount: number;
  missedAssignmentCount: number;
}

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED';

export interface AttendanceRecord {
  memberId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface Meeting {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  records: AttendanceRecord[];
  minutes?: string; // Generated minutes
}

export type AssignmentStatus = 'SUBMITTED' | 'NOT_SUBMITTED';

export interface AssignmentRecord {
  memberId: string;
  status: AssignmentStatus;
}

export interface Assignment {
  id: string;
  weekLabel: string; // e.g., "1주차", "2주차" or Date range
  deadline: string; // ISO string
  records: AssignmentRecord[];
}

export interface AppSettings {
  discordWebhookUrl?: string;
  teamName: string;
}
