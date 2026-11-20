import { CATEGORY_SEARCH_STEMS, PORTFOLIO_URL } from '../constants';
import { BusinessCategory, UKCity } from '../types';

export function buildLinkedInKeyword(
  category: BusinessCategory,
  city: UKCity,
  roleModifier = ''
): string {
  const baseStem = roleModifier.trim()
    ? `${category.replace(/Companies|Businesses/i, '').trim()} ${roleModifier.trim()}`
    : CATEGORY_SEARCH_STEMS[category];

  if (city === 'All UK Cities') {
    return `${baseStem} UK`;
  }
  return `${baseStem} ${city} UK`;
}

export function buildLinkedInPeopleSearchUrl(keyword: string): string {
  const cleaned = keyword.trim();
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(cleaned)}`;
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetIsoDate(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentWeekdayName():
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday' {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ] as const;
  return days[new Date().getDay()];
}

export function formatUkDate(isoDate: string): string {
  if (!isoDate) return '—';
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getFollowUpUrgency(
  followUpDate: string,
  todayStr: string
): 'overdue' | 'today' | 'upcoming' | 'none' {
  if (!followUpDate) return 'none';
  if (followUpDate < todayStr) return 'overdue';
  if (followUpDate === todayStr) return 'today';
  return 'upcoming';
}

export function ensurePortfolioLinkIncluded(message: string): {
  text: string;
  restored: boolean;
} {
  const trimmed = message.trim();
  if (trimmed.includes(PORTFOLIO_URL)) {
    return { text: message, restored: false };
  }
  const appended = `${trimmed}\n\nYou can view my portfolio here:\n\n${PORTFOLIO_URL}`;
  return { text: appended, restored: true };
}

export function getCurrentWeekDates(): string[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 Sun .. 6 Sat
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(getOffsetIsoDate(mondayOffset + i));
  }
  return dates;
}
