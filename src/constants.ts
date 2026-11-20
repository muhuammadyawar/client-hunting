import {
  BusinessCategory,
  ClientStatus,
  DailyGoalItem,
  DayPlan,
  Prospect,
  UKCity,
} from './types';

export const PORTFOLIO_NAME = 'Muhammad Yawar';
export const PORTFOLIO_URL = 'https://muhammad-yawar-portfolio.ai.studio/';

export const FREELANCER_SERVICES: string[] = [
  'WordPress Website Development',
  'Elementor Website Design',
  'Local SEO',
  'Business Website Redesign',
  'WooCommerce Website Development',
];

export const DEFAULT_OUTREACH_MESSAGE = `Hi,

I came across your business and wanted to connect.

I specialize in building professional WordPress websites using Elementor and improving local search rankings through Local SEO.

I would love to help your business build a stronger online presence.

You can view my portfolio here:

https://muhammad-yawar-portfolio.ai.studio/

If you're interested, I'd be happy to discuss how I can help your business.

Best regards,
Muhammad Yawar`;

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  'Cleaning Companies',
  'Restaurants',
  'Real Estate',
  'Digital Agencies',
  'Gyms',
  'E-commerce',
];

export const UK_CITIES: UKCity[] = [
  'London',
  'Manchester',
  'Birmingham',
  'Leeds',
  'Bristol',
  'Liverpool',
  'All UK Cities',
];

export const PROSPECT_CITIES: Array<Exclude<UKCity, 'All UK Cities'> | 'Other UK'> = [
  'London',
  'Manchester',
  'Birmingham',
  'Leeds',
  'Bristol',
  'Liverpool',
  'Other UK',
];

export const CLIENT_STATUSES: ClientStatus[] = [
  'New Prospect',
  'Connection Sent',
  'Message Sent',
  'Interested',
  'Follow-up Required',
  'Converted',
  'Not Interested',
];

export const CATEGORY_SEARCH_STEMS: Record<BusinessCategory, string> = {
  'Cleaning Companies': 'Cleaning Company Owner',
  Restaurants: 'Restaurant Owner',
  'Real Estate': 'Estate Agent',
  'Digital Agencies': 'Digital Marketing Agency Owner',
  Gyms: 'Gym Owner',
  'E-commerce': 'Ecommerce Business Owner',
};

export const DAILY_CONNECTION_TARGET = 5;
export const DAILY_BUSINESSES_TARGET = 10;

export const DAILY_GOALS: DailyGoalItem[] = [
  { id: 'find-10', label: 'Find 10 relevant businesses', targetCount: 10 },
  { id: 'connect-5', label: 'Send 5 personalized connection requests', targetCount: 5 },
  { id: 'outreach-msg', label: 'Send appropriate outreach messages' },
  { id: 'review-prev', label: 'Review previous prospects' },
  { id: 'follow-up-int', label: 'Follow up with interested businesses' },
];

export const INITIAL_WEEKLY_PLAN: DayPlan[] = [
  {
    day: 'Monday',
    niche: 'Cleaning Companies',
    category: 'Cleaning Companies',
    searchKeyword: 'Cleaning Company Owner UK',
    focusSummary: 'Commercial & domestic cleaning directors needing stronger Local SEO and booking-ready WordPress sites.',
    tasks: [
      { id: 'mon-1', label: 'Search "Cleaning Company Owner UK" on LinkedIn People', completed: false },
      { id: 'mon-2', label: 'Identify 10 UK cleaning businesses with outdated or slow websites', completed: false },
      { id: 'mon-3', label: 'Send 5 personalized connection requests to owners or directors', completed: false },
      { id: 'mon-4', label: 'Log newly discovered prospects in Client Prospect Tracker', completed: false },
      { id: 'mon-5', label: 'Send portfolio outreach message to accepted connections', completed: false },
    ],
  },
  {
    day: 'Tuesday',
    niche: 'Restaurants',
    category: 'Restaurants',
    searchKeyword: 'Restaurant Owner UK',
    focusSummary: 'Independent restaurants & hospitality groups seeking modern Elementor menus and local map pack visibility.',
    tasks: [
      { id: 'tue-1', label: 'Search "Restaurant Owner UK" on LinkedIn People', completed: false },
      { id: 'tue-2', label: 'Audit 10 UK restaurant websites for mobile speed & online table booking UX', completed: false },
      { id: 'tue-3', label: 'Send 5 connection requests to hospitality founders & owners', completed: false },
      { id: 'tue-4', label: 'Save qualified restaurant leads with city & website notes', completed: false },
      { id: 'tue-5', label: 'Send tailored Local SEO & redesign outreach message', completed: false },
    ],
  },
  {
    day: 'Wednesday',
    niche: 'Real Estate',
    category: 'Real Estate',
    searchKeyword: 'Estate Agent UK',
    focusSummary: 'Independent UK estate & letting agents needing fast WordPress property showcases and local search authority.',
    tasks: [
      { id: 'wed-1', label: 'Search "Estate Agent UK" on LinkedIn People', completed: false },
      { id: 'wed-2', label: 'Shortlist 10 regional UK estate agencies with dated websites', completed: false },
      { id: 'wed-3', label: 'Send 5 personalized connection requests to agency principals', completed: false },
      { id: 'wed-4', label: 'Record agency website URLs and contact dates in Tracker', completed: false },
      { id: 'wed-5', label: 'Follow up with Monday & Tuesday connections who accepted', completed: false },
    ],
  },
  {
    day: 'Thursday',
    niche: 'Digital Marketing Agencies',
    category: 'Digital Agencies',
    searchKeyword: 'Digital Marketing Agency Owner UK',
    focusSummary: 'UK boutique agencies looking for reliable white-label WordPress, Elementor & WooCommerce development partners.',
    tasks: [
      { id: 'thu-1', label: 'Search "Digital Marketing Agency Owner UK" on LinkedIn People', completed: false },
      { id: 'thu-2', label: 'Find 10 UK agencies without dedicated in-house WordPress developers', completed: false },
      { id: 'thu-3', label: 'Send 5 connection requests positioning Elementor & WooCommerce expertise', completed: false },
      { id: 'thu-4', label: 'Log agency founders and partnership notes in Tracker', completed: false },
      { id: 'thu-5', label: 'Share portfolio URL with interested agency connections', completed: false },
    ],
  },
  {
    day: 'Friday',
    niche: 'Gyms',
    category: 'Gyms',
    searchKeyword: 'Gym Owner UK',
    focusSummary: 'Independent UK gyms & fitness studios requiring membership conversion redesigns and local Google visibility.',
    tasks: [
      { id: 'fri-1', label: 'Search "Gym Owner UK" on LinkedIn People', completed: false },
      { id: 'fri-2', label: 'Review 10 UK gym websites for mobile UX and Local SEO gaps', completed: false },
      { id: 'fri-3', label: 'Send 5 personalized connection requests to gym owners', completed: false },
      { id: 'fri-4', label: 'Update prospect statuses and schedule next week follow-ups', completed: false },
      { id: 'fri-5', label: 'Message accepted connections with Muhammad Yawar portfolio', completed: false },
    ],
  },
  {
    day: 'Saturday',
    niche: 'E-commerce Businesses',
    category: 'E-commerce',
    searchKeyword: 'Ecommerce Business Owner UK',
    focusSummary: 'UK online retailers ready for custom WooCommerce storefronts, speed optimization, and checkout redesigns.',
    tasks: [
      { id: 'sat-1', label: 'Search "Ecommerce Business Owner UK" on LinkedIn People', completed: false },
      { id: 'sat-2', label: 'Identify 10 UK e-commerce brands needing WooCommerce upgrades', completed: false },
      { id: 'sat-3', label: 'Send 5 connection requests to UK e-commerce founders', completed: false },
      { id: 'sat-4', label: 'Log store URLs and conversion observations in Prospect Tracker', completed: false },
      { id: 'sat-5', label: 'Send outreach messages highlighting WooCommerce work', completed: false },
    ],
  },
  {
    day: 'Sunday',
    niche: 'Follow-ups and Prospect Review',
    searchKeyword: '',
    focusSummary: 'Dedicated weekly pipeline audit: clear overdue follow-ups, nurture interested leads, and prepare Monday outreach.',
    tasks: [
      { id: 'sun-1', label: 'Review all prospects added during the week', completed: false },
      { id: 'sun-2', label: 'Check pending follow-ups and send polite check-in messages', completed: false },
      { id: 'sun-3', label: 'Prioritize Interested clients with custom WordPress/SEO notes', completed: false },
      { id: 'sun-4', label: 'Update statuses for unresponsive or converted leads', completed: false },
      { id: 'sun-5', label: 'Verify outreach message template and prepare Monday targets', completed: false },
    ],
  },
];

export function createStarterProspects(todayStr: string, yesterdayStr: string, twoDaysAgoStr: string, tomorrowStr: string): Prospect[] {
  return [
    {
      id: 'starter-1',
      name: 'Oliver Bennett · Thames Commercial Cleaning',
      category: 'Cleaning Companies',
      linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Cleaning%20Company%20Owner%20London%20UK',
      websiteUrl: 'https://example-cleaning-uk.co.uk',
      city: 'London',
      contactDate: twoDaysAgoStr,
      followUpDate: todayStr,
      followUpCompleted: false,
      notes: 'Outdated non-responsive site; strong candidate for Elementor redesign + Local SEO in Greater London.',
      status: 'Follow-up Required',
      createdAt: twoDaysAgoStr,
    },
    {
      id: 'starter-2',
      name: 'Hannah Patel · Saffron Courtyard Kitchen',
      category: 'Restaurants',
      linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Restaurant%20Owner%20Manchester%20UK',
      websiteUrl: 'https://example-saffron-manchester.co.uk',
      city: 'Manchester',
      contactDate: yesterdayStr,
      followUpDate: tomorrowStr,
      followUpCompleted: false,
      notes: 'Replied positively to portfolio link; asked about online reservation & WordPress menu redesign.',
      status: 'Interested',
      createdAt: yesterdayStr,
    },
    {
      id: 'starter-3',
      name: 'Liam Carter · Northern Iron Fitness',
      category: 'Gyms',
      linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Gym%20Owner%20Leeds%20UK',
      websiteUrl: 'https://example-northern-iron.co.uk',
      city: 'Leeds',
      contactDate: todayStr,
      followUpDate: tomorrowStr,
      followUpCompleted: false,
      notes: 'Sent personalized connection request referencing Leeds local search rankings.',
      status: 'Connection Sent',
      createdAt: todayStr,
    },
    {
      id: 'starter-4',
      name: 'Charlotte Davies · Clifton Botanicals',
      category: 'E-commerce',
      linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Ecommerce%20Business%20Owner%20Bristol%20UK',
      websiteUrl: 'https://example-clifton-botanicals.co.uk',
      city: 'Bristol',
      contactDate: twoDaysAgoStr,
      followUpDate: todayStr,
      followUpCompleted: false,
      notes: 'Growing skincare store interested in migrating checkout to optimized WooCommerce build.',
      status: 'Interested',
      createdAt: twoDaysAgoStr,
    },
  ];
}
