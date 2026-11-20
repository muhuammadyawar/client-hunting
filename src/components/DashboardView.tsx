import React from 'react';
import {
  Users,
  UserPlus,
  CheckCircle2,
  CalendarCheck,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Plus,
  Minus,
} from 'lucide-react';
import {
  DAILY_BUSINESSES_TARGET,
  DAILY_CONNECTION_TARGET,
  DAILY_GOALS,
  PORTFOLIO_NAME,
  PORTFOLIO_URL,
} from '../constants';
import {
  DailyGoalLog,
  DayPlan,
  NavView,
  Prospect,
} from '../types';
import {
  buildLinkedInPeopleSearchUrl,
  formatUkDate,
  getCurrentWeekdayName,
  getFollowUpUrgency,
  getTodayIsoDate,
} from '../utils/linkedin';

interface DashboardViewProps {
  prospects: Prospect[];
  weeklyPlan: DayPlan[];
  todayGoalLog: DailyGoalLog;
  weeklyGoalsCompletedPercent: number;
  outreachMessage: string;
  copiedKey: string | null;
  onCopyText: (text: string, key: string, label: string) => void;
  onToggleDailyGoal: (goalId: string) => void;
  onAdjustCounter: (field: 'businessesFound' | 'connectionsSent', delta: number) => void;
  onTogglePlannerTask: (day: DayPlan['day'], taskId: string) => void;
  onNavigate: (view: NavView) => void;
  onOpenAddProspect: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  prospects,
  weeklyPlan,
  todayGoalLog,
  weeklyGoalsCompletedPercent,
  outreachMessage,
  copiedKey,
  onCopyText,
  onToggleDailyGoal,
  onAdjustCounter,
  onTogglePlannerTask,
  onNavigate,
  onOpenAddProspect,
}) => {
  const todayStr = getTodayIsoDate();
  const currentWeekday = getCurrentWeekdayName();
  const todayPlan = weeklyPlan.find((d) => d.day === currentWeekday) || weeklyPlan[0];

  const totalProspects = prospects.length;
  const interestedClients = prospects.filter((p) => p.status === 'Interested');
  const pendingFollowUps = prospects.filter(
    (p) =>
      !p.followUpCompleted &&
      (Boolean(p.followUpDate) || p.status === 'Follow-up Required')
  );

  // Daily goals completion
  const completedDailyGoalsCount = todayGoalLog.completedIds.length;
  const totalDailyGoalsCount = DAILY_GOALS.length;
  const dailyGoalsPercent = Math.round(
    (completedDailyGoalsCount / totalDailyGoalsCount) * 100
  );

  // Connection target
  const connectionsSent = todayGoalLog.connectionsSent;
  const connectionTargetPercent = Math.min(
    100,
    Math.round((connectionsSent / DAILY_CONNECTION_TARGET) * 100)
  );

  // Weekly planner progress
  const totalWeeklyTasks = weeklyPlan.reduce((sum, day) => sum + day.tasks.length, 0);
  const completedWeeklyTasks = weeklyPlan.reduce(
    (sum, day) => sum + day.tasks.filter((t) => t.completed).length,
    0
  );
  const weeklyPlannerPercent =
    totalWeeklyTasks > 0
      ? Math.round((completedWeeklyTasks / totalWeeklyTasks) * 100)
      : 0;

  const todayPlanCompleted = todayPlan.tasks.filter((t) => t.completed).length;
  const todayPlanPercent = Math.round(
    (todayPlanCompleted / todayPlan.tasks.length) * 100
  );

  const sortedPendingFollowUps = [...pendingFollowUps].sort((a, b) => {
    if (!a.followUpDate) return 1;
    if (!b.followUpDate) return -1;
    return a.followUpDate.localeCompare(b.followUpDate);
  });

  return (
    <div className="space-y-6">
      {/* 6 Primary KPI Cards */}
      <section aria-label="Key Metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* 1. Total Prospects Added */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Prospects Added</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                {totalProspects}
              </p>
            </div>
            <span className="p-2.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
              <Users className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>UK pipeline directory</span>
            <button
              type="button"
              onClick={() => onNavigate('prospects')}
              className="font-medium text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>View tracker</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Daily Connection Request Target */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Daily Connection Target</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                  {connectionsSent}
                </span>
                <span className="text-sm font-medium text-slate-400 tabular-nums">
                  / {DAILY_CONNECTION_TARGET} today
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onAdjustCounter('connectionsSent', -1)}
                aria-label="Decrease connections sent today"
                className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onAdjustCounter('connectionsSent', 1)}
                aria-label="Increase connections sent today"
                className="p-1.5 rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <span className="ml-1 p-2 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                <UserPlus className="h-5 w-5" />
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>{connectionsSent >= DAILY_CONNECTION_TARGET ? 'Target reached' : 'Personalized requests'}</span>
              <span className="font-mono-tabular font-medium text-slate-700">{connectionTargetPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  connectionsSent >= DAILY_CONNECTION_TARGET ? 'bg-emerald-600' : 'bg-blue-700'
                }`}
                style={{ width: `${connectionTargetPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Completed Daily Tasks */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Completed Daily Tasks</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                  {completedDailyGoalsCount}
                </span>
                <span className="text-sm font-medium text-slate-400 tabular-nums">
                  / {totalDailyGoalsCount} goals
                </span>
              </div>
            </div>
            <span className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Today&apos;s checklist</span>
              <span className="font-mono-tabular font-medium text-slate-700">{dailyGoalsPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-200"
                style={{ width: `${dailyGoalsPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4. Weekly Progress */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Weekly Progress</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                  {weeklyPlannerPercent}%
                </span>
                <span className="text-xs text-slate-500 tabular-nums">
                  ({completedWeeklyTasks}/{totalWeeklyTasks} planner tasks)
                </span>
              </div>
            </div>
            <span className="p-2.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
              <CalendarCheck className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Daily goals week avg: {weeklyGoalsCompletedPercent}%</span>
              <button
                type="button"
                onClick={() => onNavigate('planner')}
                className="font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap"
              >
                Open planner
              </button>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-700 rounded-full transition-all duration-200"
                style={{ width: `${weeklyPlannerPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5. Follow-ups Pending */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Follow-ups Pending</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                {pendingFollowUps.length}
              </p>
            </div>
            <span
              className={`p-2.5 rounded-lg shrink-0 ${
                pendingFollowUps.length > 0
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Clock className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {
                pendingFollowUps.filter(
                  (p) => getFollowUpUrgency(p.followUpDate, todayStr) === 'overdue'
                ).length
              }{' '}
              overdue
            </span>
            <button
              type="button"
              onClick={() => onNavigate('follow-ups')}
              className="font-medium text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>Manage follow-ups</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 6. Interested Clients */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">Interested Clients</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-900 tabular-nums">
                {interestedClients.length}
              </p>
            </div>
            <span className="p-2.5 rounded-lg bg-blue-50 text-blue-700 shrink-0">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Warm UK leads ready to close</span>
            <button
              type="button"
              onClick={() => onNavigate('follow-ups')}
              className="font-medium text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>View warm leads</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Hunting Schedule + Daily Goals */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Focus Card */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Today&apos;s Focus · {todayPlan.day}
                </p>
                <h2 className="mt-1 font-display text-xl font-bold text-slate-900">
                  {todayPlan.niche}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{todayPlan.focusSummary}</p>
              </div>
              {todayPlan.searchKeyword ? (
                <a
                  href={buildLinkedInPeopleSearchUrl(todayPlan.searchKeyword)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Search LinkedIn</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('follow-ups')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Review Follow-ups</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {todayPlan.searchKeyword && (
              <div className="py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  LinkedIn Keyword:{' '}
                  <span className="font-mono-tabular font-medium text-slate-900">
                    {todayPlan.searchKeyword}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onCopyText(
                      todayPlan.searchKeyword,
                      'today-keyword',
                      'LinkedIn keyword'
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
                >
                  {copiedKey === 'today-keyword' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy keyword</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="pt-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span>Daily workflow tasks</span>
                <span className="font-mono-tabular font-semibold text-slate-800">
                  {todayPlanCompleted}/{todayPlan.tasks.length} ({todayPlanPercent}%)
                </span>
              </div>
              <ul className="divide-y divide-slate-100">
                {todayPlan.tasks.map((task) => (
                  <li key={task.id} className="py-2.5">
                    <label className="flex items-start gap-3 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onTogglePlannerTask(todayPlan.day, task.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                      />
                      <span
                        className={`text-sm leading-relaxed transition-colors ${
                          task.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-700 group-hover:text-slate-950'
                        }`}
                      >
                        {task.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Daily Goals Section */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Daily Client Hunting Goals
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daily targets · Weekly goal consistency: {weeklyGoalsCompletedPercent}%
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Businesses:</span>
                  <button
                    type="button"
                    onClick={() => onAdjustCounter('businessesFound', -1)}
                    aria-label="Decrease businesses found"
                    className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-mono-tabular font-semibold text-slate-900 min-w-[3ch] text-center">
                    {todayGoalLog.businessesFound}/{DAILY_BUSINESSES_TARGET}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAdjustCounter('businessesFound', 1)}
                    aria-label="Increase businesses found"
                    className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <ul className="divide-y divide-slate-100 mt-2">
              {DAILY_GOALS.map((goal) => {
                const isDone = todayGoalLog.completedIds.includes(goal.id);
                return (
                  <li key={goal.id} className="py-3 flex items-center justify-between gap-4">
                    <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => onToggleDailyGoal(goal.id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                      />
                      <span
                        className={`text-sm ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {goal.label}
                      </span>
                    </label>
                    <span
                      className={`text-xs font-medium shrink-0 ${
                        isDone ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {isDone ? 'Done' : 'Pending'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Right Column: Outreach Message Quick Copy + Portfolio + Pending Follow-ups */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Outreach & Portfolio Card */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  My Outreach Message
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Permanent LinkedIn template · Portfolio link verified
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('outreach')}
                className="text-xs font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap"
              >
                Edit template
              </button>
            </div>

            <div className="mt-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto pr-1">
              {outreachMessage}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() =>
                  onCopyText(outreachMessage, 'dash-outreach', 'Outreach message')
                }
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                {copiedKey === 'dash-outreach' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Message Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <span>{PORTFOLIO_NAME}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>

          {/* Pending Follow-ups Queue */}
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Upcoming Follow-ups
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {pendingFollowUps.length} active · {interestedClients.length} interested
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('follow-ups')}
                className="text-xs font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap"
              >
                View all
              </button>
            </div>

            {sortedPendingFollowUps.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">No pending follow-ups right now.</p>
                <button
                  type="button"
                  onClick={onOpenAddProspect}
                  className="mt-3 px-4 py-2 text-xs font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Add Prospect
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 mt-1">
                {sortedPendingFollowUps.slice(0, 4).map((prospect) => {
                  const urgency = getFollowUpUrgency(prospect.followUpDate, todayStr);
                  return (
                    <li key={prospect.id} className="py-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {prospect.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {prospect.category} · {prospect.city} · {prospect.status}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-medium ${
                            urgency === 'overdue'
                              ? 'text-red-700'
                              : urgency === 'today'
                              ? 'text-amber-700'
                              : 'text-slate-600'
                          }`}
                        >
                          {urgency === 'overdue'
                            ? 'Overdue'
                            : urgency === 'today'
                            ? 'Due Today'
                            : formatUkDate(prospect.followUpDate)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
