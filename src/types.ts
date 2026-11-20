export type NavView =
  | 'dashboard'
  | 'planner'
  | 'linkedin-search'
  | 'outreach'
  | 'prospects'
  | 'follow-ups';

export type BusinessCategory =
  | 'Cleaning Companies'
  | 'Restaurants'
  | 'Real Estate'
  | 'Digital Agencies'
  | 'Gyms'
  | 'E-commerce';

export type UKCity =
  | 'London'
  | 'Manchester'
  | 'Birmingham'
  | 'Leeds'
  | 'Bristol'
  | 'Liverpool'
  | 'All UK Cities';

export type ClientStatus =
  | 'New Prospect'
  | 'Connection Sent'
  | 'Message Sent'
  | 'Interested'
  | 'Follow-up Required'
  | 'Converted'
  | 'Not Interested';

export interface Prospect {
  id: string;
  name: string;
  category: BusinessCategory;
  linkedinUrl: string;
  websiteUrl: string;
  city: Exclude<UKCity, 'All UK Cities'> | 'Other UK';
  contactDate: string; // YYYY-MM-DD
  followUpDate: string; // YYYY-MM-DD or empty
  followUpCompleted: boolean;
  notes: string;
  status: ClientStatus;
  createdAt: string;
}

export interface PlannerTask {
  id: string;
  label: string;
  completed: boolean;
}

export type WeekdayName =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface DayPlan {
  day: WeekdayName;
  niche: string;
  category?: BusinessCategory;
  searchKeyword: string;
  focusSummary: string;
  tasks: PlannerTask[];
}

export interface DailyGoalItem {
  id: string;
  label: string;
  targetCount?: number;
}

export interface DailyGoalLog {
  date: string; // YYYY-MM-DD
  completedIds: string[];
  businessesFound: number;
  connectionsSent: number;
}
