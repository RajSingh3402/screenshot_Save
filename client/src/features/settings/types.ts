export interface SmtpConfig {
  id?: number;
  host: string;
  port: number;
  username: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailRecipient {
  id: number;
  email: string;
  createdAt: string;
}

export interface Schedule {
  id: number;
  time: string;
  enabled: boolean;
}

export interface ScanExecutionLog {
  id: number;
  scheduleTime: string;
  executedAt: string;
  status: string;
  message: string;
}
