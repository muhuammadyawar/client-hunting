import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Search,
  MessageSquareText,
  Users,
  ClockAlert,
  ExternalLink,
  X,
  Compass,
} from 'lucide-react';
import { NavView } from '../types';
import { PORTFOLIO_NAME, PORTFOLIO_URL } from '../constants';

interface SidebarProps {
  activeView: NavView;
  onSelectView: (view: NavView) => void;
  pendingFollowUpsCount: number;
  prospectsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: Array<{
  id: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'planner', label: '7-Day Planner', icon: CalendarDays },
  { id: 'linkedin-search', label: 'LinkedIn Search', icon: Search },
  { id: 'outreach', label: 'Outreach & Portfolio', icon: MessageSquareText },
  { id: 'prospects', label: 'Prospect Tracker', icon: Users },
  { id: 'follow-ups', label: 'Follow-ups', icon: ClockAlert },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  pendingFollowUpsCount,
  prospectsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const handleSelect = (view: NavView) => {
    onSelectView(view);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200">
        <button
          type="button"
          onClick={() => handleSelect('dashboard')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white shrink-0">
            <Compass className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            UK Client Hunter
          </span>
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const count =
            item.id === 'prospects'
              ? prospectsCount
              : item.id === 'follow-ups'
              ? pendingFollowUpsCount
              : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isActive
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-blue-700' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </span>
              {count !== null && (
                <span
                  className={`font-mono-tabular text-xs ml-2 shrink-0 ${
                    isActive ? 'text-blue-700 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-display text-xs font-bold shrink-0">
            MY
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {PORTFOLIO_NAME}
            </p>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-800 hover:underline truncate"
            >
              <span>View Portfolio</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
