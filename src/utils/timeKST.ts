/**
 * 한국 시간(KST, UTC+9) 기준 시간 처리.
 * DB 및 API가 한국 시간 기준이므로, 입력/표시를 모두 KST로 통일합니다.
 */

const KST_OFFSET_HOURS = 9;

/**
 * 시·분을 한국 시간으로 해석한 Date를 만듭니다.
 * 내부적으로 UTC 기준 시각으로 저장해, 어느 타임존에서든 formatTimeKST로 동일한 "HH:mm"을 얻습니다.
 */
export function createTimeKST(hours: number, minutes = 0): Date {
  const h = Math.max(0, Math.min(23, Math.floor(hours)));
  const m = Math.max(0, Math.min(59, Math.floor(minutes)));
  const utcHours = (h - KST_OFFSET_HOURS + 24) % 24;
  return new Date(Date.UTC(1970, 0, 1, utcHours, m, 0, 0));
}

/**
 * Date를 한국 시간 기준 "HH:mm" 문자열로 포맷합니다.
 */
export function formatTimeKST(date: Date): string {
  const utcH = date.getUTCHours();
  const utcM = date.getUTCMinutes();
  const kstH = (utcH + KST_OFFSET_HOURS) % 24;
  return `${kstH.toString().padStart(2, '0')}:${utcM.toString().padStart(2, '0')}`;
}

/**
 * API/DB에서 오는 시간 문자열을 파싱해 한국 시간 Date로 반환합니다.
 * - "HH:mm", "HH:mm:ss" → KST 시·분으로 해석
 * - ISO 8601 (예: ...Z) → UTC로 파싱 후 KST로 변환해 시·분만 사용
 */
export function parseTimeToKST(timeStr: string): Date {
  if (!timeStr || typeof timeStr !== 'string') {
    return createTimeKST(10, 0);
  }
  const trimmed = timeStr.trim();
  const timeOnlyMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (timeOnlyMatch) {
    const h = parseInt(timeOnlyMatch[1], 10);
    const m = parseInt(timeOnlyMatch[2], 10);
    return createTimeKST(h, m);
  }
  const isoMatch = trimmed.match(/T(\d{1,2}):(\d{2})/);
  if (isoMatch) {
    const h = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    return createTimeKST(h, m);
  }
  const asDate = new Date(trimmed);
  if (!Number.isNaN(asDate.getTime())) {
    const utcH = asDate.getUTCHours();
    const utcM = asDate.getUTCMinutes();
    const kstH = (utcH + KST_OFFSET_HOURS) % 24;
    return createTimeKST(kstH, utcM);
  }
  return createTimeKST(10, 0);
}

/**
 * DateTimePicker에서 선택한 Date(로컬 시각)를 한국 시간 시·분으로 해석해 KST Date로 변환합니다.
 * 기기 로컬이 이미 KST면 그대로 createTimeKST(h, m)과 동일합니다.
 */
export function pickerDateToKST(date: Date): Date {
  const h = date.getHours();
  const m = date.getMinutes();
  return createTimeKST(h, m);
}

/**
 * 오늘 날짜를 로컬(KST로 설정된 경우 한국 날짜) 기준 "yyyy-MM-dd"로 반환합니다.
 * toISOString()은 UTC라 자정 전후에 날짜가 어긋나므로, 인증 날짜·이번 주 기준일 등에 사용합니다.
 */
export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * 현재 시각(KST)이 주어진 "HH:mm" 시각을 이미 지났는지 여부.
 * 체크리스트 작성 마감(end_time) 이후에는 항목 추가 불가 판단에 사용.
 */
export function isAfterTimeInKST(timeStr: string): boolean {
  const match = (timeStr || '').trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return false;
  const deadlineMin = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  const now = new Date();
  const kstMin = ((now.getUTCHours() + KST_OFFSET_HOURS) % 24) * 60 + now.getUTCMinutes();
  return kstMin >= deadlineMin;
}

/** yyyy-MM-dd → 요일 인덱스 (월=0, 화=1, ..., 일=6) */
export function getDayIndexFromDate(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  return day === 0 ? 6 : day - 1;
}

/** 요일 인덱스(0~6) → 백엔드 요일 코드 (MON, TUE, ..., SUN) */
export const BACKEND_DAY_CODES_BY_INDEX = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
