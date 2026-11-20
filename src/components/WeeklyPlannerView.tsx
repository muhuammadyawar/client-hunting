import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { DayPlan, WeekdayName } from '../types';
import {
  buildLinkedInPeopleSearchUrl,
  getCurrentWeekdayName,
} from '../utils/linkedin';

interface WeeklyPlannerViewProps {
  weeklyPlan: DayPlan[];
  copiedKey: string | null;
  onToggleTask: (day: WeekdayName, taskId: string) => void;
  onAddCustomTask: (day: WeekdayName, label: string) => void;
  onResetWeek: () => void;
  onCopyText: (text: string, key: string, label: string) => void;
  onGoToFollowUps: () => void;
}

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
  weeklyPlan,
  copiedKey,
  onToggleTask,
  onAddCustomTask,
  onResetWeek,
  onCopyText,
  onGoToFollowUps,
}) => {
  const currentWeekday = getCurrentWeekdayName();
  const [selectedDay, setSelectedDay] = useState<WeekdayName>(currentWeekday);
  const [newTaskText, setNewTaskText] = useState('');

  const activeDayPlan =
    weeklyPlan.find((d) => d.day === selectedDay) || weeklyPlan[0];

  const totalTasks = weeklyPlan.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTasks = weeklyPlan.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.completed).length,
    0
  );
  const overallPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const activeCompleted = activeDayPlan.tasks.filter((t) => t.completed).length;
  const activePercent =
    activeDayPlan.tasks.length > 0
      ? Math.round((activeCompleted / activeDayPlan.tasks.length) * 100)
      : 0;

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    onAddCustomTask(activeDayPlan.day, newTaskText.trim());
    setNewTaskText('');
  };

  return (
    <div className="space-y-6">
      {/* Weekly Overall Progress Bar */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Seven-Day UK Client Hunting Schedule
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Dedicated UK industry focus each weekday with Sunday pipeline review
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500">Weekly Completion</p>
              <p className="font-mono-tabular text-lg font-bold text-slate-900">
                {completedTasks}/{totalTasks} ({overallPercent}%)
              </p>
            </div>
            <button
              type="button"
              onClick={onResetWeek}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Week</span>
            </button>
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-700 rounded-full transition-all duration-200"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </section>

      {/* 7-Day Schedule Grid + Active Day Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Day Selector List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70">
            <p className="text-xs font-semibold text-slate-600">
              Select Day to Manage Tasks
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {weeklyPlan.map((plan) => {
              const done = plan.tasks.filter((t) => t.completed).length;
              const total = plan.tasks.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const isSelected = plan.day === selectedDay;
              const isToday = plan.day === currentWeekday;

              return (
                <button
                  key={plan.day}
                  type="button"
                  onClick={() => setSelectedDay(plan.day)}
                  className={`w-full text-left px-5 py-4 transition-colors flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-blue-50/70'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span
                        className={`font-semibold ${
                          isSelected ? 'text-blue-800' : 'text-slate-700'
                        }`}
                      >
                        {plan.day}
                      </span>
                      {isToday && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-blue-700 font-medium">Today</span>
                        </>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900 truncate">
                      {plan.niche}
                    </p>
                    {plan.searchKeyword && (
                      <p className="mt-0.5 text-xs text-slate-500 font-mono-tabular truncate">
                        {plan.searchKeyword}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono-tabular text-xs font-semibold ${
                        pct === 100 ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      {pct}%
                    </span>
                    <div className="mt-1.5 w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct === 100 ? 'bg-emerald-600' : 'bg-blue-700'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Day Workspace */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {activeDayPlan.day}
                  {activeDayPlan.day === currentWeekday ? ' · Today' : ''}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-slate-900">
                  {activeDayPlan.niche}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600">
                  {activeDayPlan.focusSummary}
                </p>
              </div>
              {activeDayPlan.searchKeyword ? (
                <a
                  href={buildLinkedInPeopleSearchUrl(activeDayPlan.searchKeyword)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Search LinkedIn</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onGoToFollowUps}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Open Follow-ups</span>
                </button>
              )}
            </div>

            {activeDayPlan.searchKeyword && (
              <div className="py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  LinkedIn Search Keyword:{' '}
                  <span className="font-mono-tabular font-semibold text-slate-900">
                    {activeDayPlan.searchKeyword}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onCopyText(
                      activeDayPlan.searchKeyword,
                      `planner-${activeDayPlan.day}`,
                      'Search keyword'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 whitespace-nowrap"
                >
                  {copiedKey === `planner-${activeDayPlan.day}` ? (
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

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Daily Task Completion</span>
                <span className="font-mono-tabular font-semibold text-slate-900">
                  {activeCompleted}/{activeDayPlan.tasks.length} tasks ({activePercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${
                    activePercent === 100 ? 'bg-emerald-600' : 'bg-blue-700'
                  }`}
                  style={{ width: `${activePercent}%` }}
                />
              </div>

              <ul className="divide-y divide-slate-100">
                {activeDayPlan.tasks.map((task) => (
                  <li key={task.id} className="py-3">
                    <label className="flex items-start gap-3 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(activeDayPlan.day, task.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                      />
                      <span
                        className={`text-sm leading-relaxed ${
                          task.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-800 group-hover:text-slate-950'
                        }`}
                      >
                        {task.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <form
            onSubmit={handleAddTaskSubmit}
            className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder={`Add custom task for ${activeDayPlan.day}...`}
              className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
