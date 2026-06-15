/* Shared domain types for SiteWatch. */

export type SiteStatus = 'active' | 'disabled';
export type CheckStatus = 'success' | 'failed';

export interface Website {
  id: number;
  name: string;
  url: string;
  status: SiteStatus;
  lastStatus: CheckStatus | null;
  lastCapture: string | null;
  error: string | null;
  lastCaptureImage: string | null;
}

export interface ReportDetail {
  id: number; // websiteId
  name: string;
  url: string;
  status: CheckStatus;
  loadTime: number | null;
  error: string | null;
  screenshot: string | null;
}

export interface Report {
  id: number;
  date: string;
  time: string;
  total: number;
  success: number;
  failed: number;
  file: string;
  details: ReportDetail[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Viewer' | 'Editor' | 'Admin' | string;
  status: 'active' | 'inactive' | string;
  created: string;
}

export interface Schedule {
  id: number;
  time: string; // "HH:MM"
  enabled: boolean;
}

export interface Recipient {
  id: number;
  email: string;
}

export interface SmtpSettings {
  host: string;
  port: string;
  user: string;
  pass: string;
}

export interface Settings {
  schedules: Schedule[];
  recipients: Recipient[];
  smtp: SmtpSettings;
}

export interface CaptureProgress {
  active: boolean;
  status: string;
  current: number;
  total: number;
}

/** Result of pinging a single URL (Excel verification). */
export interface UrlCheckResult {
  status: CheckStatus;
  statusCode: number | null;
  responseTime: number;
  pageTitle: string | null;
  error: string | null;
}

/** A verified row produced by the Excel import flow. */
export interface ExcelResultItem extends UrlCheckResult {
  id: string;
  name: string;
  url: string;
}

export interface ParsedRow {
  name: string;
  url: string;
}
