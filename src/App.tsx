import { useState, useMemo, useCallback } from 'react';
import { Menu, Plus, Check } from 'lucide-react';
import {
  DAILY_BUSINESSES_TARGET,
  DAILY_CONNECTION_TARGET,
  DAILY_GOALS,
  DEFAULT_OUTREACH_MESSAGE,
  INITIAL_WEEKLY_PLAN,
  createStarterProspects,
} from './constants';
import {
  BusinessCategory,
  ClientStatus,
  DailyGoalLog,
  DayPlan,
  NavView,
  Prospect,
  UKCity,
  WeekdayName,
} from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  ensurePortfolioLinkIncluded,
  getCurrentWeekDates,
  getOffsetIsoDate,
  getTodayIsoDate,
} from './utils/linkedin';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { WeeklyPlannerView } from './components/WeeklyPlannerView';
import { LinkedInSearchView } from './components/LinkedInSearchView';
import { OutreachPortfolioView } from './components/OutreachPortfolioView';
import { ProspectTrackerView } from './components/ProspectTrackerView';
import { FollowUpView } from './components/FollowUpView';
import { ProspectModal } from './components/ProspectModal';

const VIEW_HEADERS: Record<NavView, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'UK LinkedIn client acquisition overview and daily targets',
  },
  planner: {
    title: '7-Day Client Hunting Planner',
    subtitle: 'Structured weekly UK niche prospecting schedule',
  },
  'linkedin-search': {
    title: 'LinkedIn Client Search',
    subtitle: 'Generate targeted UK People Search queries by sector and city',
  },
  outreach: {
    title: 'My Outreach Message & Portfolio',
    subtitle: 'Permanent LinkedIn outreach script and Muhammad Yawar portfolio',
  },
  prospects: {
    title: 'Client Prospect Tracker',
    subtitle: 'Manage saved UK leads, notes, and outreach pipeline status',
  },
  'follow-ups': {
    title: 'Follow-up Management',
    subtitle: 'Track scheduled check-ins and interested UK prospects',
  },
};

export default function App() {
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistent State
  const [prospects, setProspects] = useLocalStorage<Prospect[]>(
    'ukch_prospects_v1',
    () =>
      createStarterProspects(
        getTodayIsoDate(),
        getOffsetIsoDate(-1),
        getOffsetIsoDate(-2),
        getOffsetIsoDate(2)
      )
  );

  const [weeklyPlan, setWeeklyPlan] = useLocalStorage<DayPlan[]>(
    'ukch_weekly_plan_v1',
    INITIAL_WEEKLY_PLAN
  );

  const [dailyGoalLogs, setDailyGoalLogs] = useLocalStorage<
    Record<string, DailyGoalLog>
  >('ukch_daily_goals_v1', {});

  const [rawOutreachMessage, setRawOutreachMessage] = useLocalStorage<string>(
    'ukch_outreach_message_v1',
    DEFAULT_OUTREACH_MESSAGE
  );

  const outreachMessage = useMemo(
    () => ensurePortfolioLinkIncluded(rawOutreachMessage).text,
    [rawOutreachMessage]
  );

  // Modal & UI feedback state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [modalPrefillCategory, setModalPrefillCategory] = useState<
    BusinessCategory | undefined
  >(undefined);
  const [modalPrefillCity, setModalPrefillCity] = useState<
    Exclude<UKCity, 'All UK Cities'> | 'Other UK' | undefined
  >(undefined);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  }, []);

  const handleCopyText = useCallback(
    async (text: string, key: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        showToast(`${label} copied to clipboard`);
        window.setTimeout(() => {
          setCopiedKey((prev) => (prev === key ? null : prev));
        }, 2000);
      } catch {
        showToast('Unable to copy automatically — please select and copy manually.');
      }
    },
    [showToast]
  );

  // Daily goals for today
  const todayStr = getTodayIsoDate();
  const todayGoalLog: DailyGoalLog = useMemo(() => {
    return (
      dailyGoalLogs[todayStr] || {
        date: todayStr,
        completedIds: [],
        businessesFound: 0,
        connectionsSent: 0,
      }
    );
  }, [dailyGoalLogs, todayStr]);

  const weeklyGoalsCompletedPercent = useMemo(() => {
    const weekDates = getCurrentWeekDates();
    const totalPossible = weekDates.length * DAILY_GOALS.length;
    const totalDone = weekDates.reduce((sum, dateStr) => {
      const log = dailyGoalLogs[dateStr];
      return sum + (log ? log.completedIds.length : 0);
    }, 0);
    return totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
  }, [dailyGoalLogs]);

  const handleToggleDailyGoal = useCallback(
    (goalId: string) => {
      setDailyGoalLogs((prev) => {
        const current = prev[todayStr] || {
          date: todayStr,
          completedIds: [],
          businessesFound: 0,
          connectionsSent: 0,
        };
        const exists = current.completedIds.includes(goalId);
        const nextIds = exists
          ? current.completedIds.filter((id) => id !== goalId)
          : [...current.completedIds, goalId];

        let businessesFound = current.businessesFound;
        let connectionsSent = current.connectionsSent;

        if (!exists && goalId === 'find-10' && businessesFound < DAILY_BUSINESSES_TARGET) {
          businessesFound = DAILY_BUSINESSES_TARGET;
        }
        if (!exists && goalId === 'connect-5' && connectionsSent < DAILY_CONNECTION_TARGET) {
          connectionsSent = DAILY_CONNECTION_TARGET;
        }

        return {
          ...prev,
          [todayStr]: {
            ...current,
            completedIds: nextIds,
            businessesFound,
            connectionsSent,
          },
        };
      });
    },
    [setDailyGoalLogs, todayStr]
  );

  const handleAdjustCounter = useCallback(
    (field: 'businessesFound' | 'connectionsSent', delta: number) => {
      setDailyGoalLogs((prev) => {
        const current = prev[todayStr] || {
          date: todayStr,
          completedIds: [],
          businessesFound: 0,
          connectionsSent: 0,
        };
        const nextVal = Math.max(0, current[field] + delta);
        const goalId = field === 'businessesFound' ? 'find-10' : 'connect-5';
        const target =
          field === 'businessesFound'
            ? DAILY_BUSINESSES_TARGET
            : DAILY_CONNECTION_TARGET;

        let nextIds = [...current.completedIds];
        if (nextVal >= target && !nextIds.includes(goalId)) {
          nextIds.push(goalId);
        } else if (nextVal < target && nextIds.includes(goalId)) {
          nextIds = nextIds.filter((id) => id !== goalId);
        }

        return {
          ...prev,
          [todayStr]: {
            ...current,
            [field]: nextVal,
            completedIds: nextIds,
          },
        };
      });
    },
    [setDailyGoalLogs, todayStr]
  );

  // Weekly Planner handlers
  const handleTogglePlannerTask = useCallback(
    (day: WeekdayName, taskId: string) => {
      setWeeklyPlan((prev) =>
        prev.map((d) =>
          d.day === day
            ? {
                ...d,
                tasks: d.tasks.map((t) =>
                  t.id === taskId ? { ...t, completed: !t.completed } : t
                ),
              }
            : d
        )
      );
    },
    [setWeeklyPlan]
  );

  const handleAddCustomTask = useCallback(
    (day: WeekdayName, label: string) => {
      setWeeklyPlan((prev) =>
        prev.map((d) =>
          d.day === day
            ? {
                ...d,
                tasks: [
                  ...d.tasks,
                  {
                    id: `${day.toLowerCase()}-${Date.now()}`,
                    label,
                    completed: false,
                  },
                ],
              }
            : d
        )
      );
      showToast(`Task added to ${day}`);
    },
    [setWeeklyPlan, showToast]
  );

  const handleResetWeek = useCallback(() => {
    setWeeklyPlan((prev) =>
      prev.map((d) => ({
        ...d,
        tasks: d.tasks.map((t) => ({ ...t, completed: false })),
      }))
    );
    showToast('Weekly planner checkboxes reset');
  }, [setWeeklyPlan, showToast]);

  // Outreach Message handlers
  const handleSaveOutreachMessage = useCallback(
    (nextMessage: string) => {
      const { text } = ensurePortfolioLinkIncluded(nextMessage);
      setRawOutreachMessage(text);
      showToast('Outreach message saved permanently');
    },
    [setRawOutreachMessage, showToast]
  );

  const handleResetOutreachMessage = useCallback(() => {
    setRawOutreachMessage(DEFAULT_OUTREACH_MESSAGE);
    showToast('Restored default outreach message');
  }, [setRawOutreachMessage, showToast]);

  // Prospect CRUD handlers
  const handleOpenAddModal = useCallback(
    (
      category?: BusinessCategory,
      city?: Exclude<UKCity, 'All UK Cities'> | 'Other UK'
    ) => {
      setEditingProspect(null);
      setModalPrefillCategory(category);
      setModalPrefillCity(city);
      setModalOpen(true);
    },
    []
  );

  const handleOpenEditModal = useCallback((prospect: Prospect) => {
    setEditingProspect(prospect);
    setModalPrefillCategory(undefined);
    setModalPrefillCity(undefined);
    setModalOpen(true);
  }, []);

  const handleSaveProspect = useCallback(
    (data: Omit<Prospect, 'id' | 'createdAt'>, existingId?: string) => {
      if (existingId) {
        setProspects((prev) =>
          prev.map((p) => (p.id === existingId ? { ...p, ...data } : p))
        );
        showToast('Prospect updated');
      } else {
        const newProspect: Prospect = {
          ...data,
          id: `prospect-${Date.now()}`,
          createdAt: getTodayIsoDate(),
        };
        setProspects((prev) => [newProspect, ...prev]);
        showToast('Prospect added to tracker');
      }
    },
    [setProspects, showToast]
  );

  const handleDeleteProspect = useCallback(
    (id: string) => {
      setProspects((prev) => prev.filter((p) => p.id !== id));
      showToast('Prospect removed');
    },
    [setProspects, showToast]
  );

  const handleUpdateProspectStatus = useCallback(
    (id: string, status: ClientStatus) => {
      setProspects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
      showToast(`Status updated to ${status}`);
    },
    [setProspects, showToast]
  );

  const handleUpdateFollowUpDetails = useCallback(
    (
      id: string,
      updates: Partial<
        Pick<
          Prospect,
          'contactDate' | 'followUpDate' | 'followUpCompleted' | 'status'
        >
      >
    ) => {
      setProspects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      showToast(
        updates.followUpCompleted
          ? 'Follow-up marked completed'
          : 'Follow-up schedule updated'
      );
    },
    [setProspects, showToast]
  );

  const pendingFollowUpsCount = useMemo(
    () =>
      prospects.filter(
        (p) =>
          !p.followUpCompleted &&
          (Boolean(p.followUpDate) || p.status === 'Follow-up Required')
      ).length,
    [prospects]
  );

  const currentHeader = VIEW_HEADERS[activeView];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        pendingFollowUpsCount={pendingFollowUpsCount}
        prospectsCount={prospects.length}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Workspace Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-display text-base sm:text-lg font-bold text-slate-900 truncate">
                {currentHeader.title}
              </h1>
              <p className="hidden sm:block text-xs text-slate-500 truncate">
                {currentHeader.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenAddModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Prospect</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              prospects={prospects}
              weeklyPlan={weeklyPlan}
              todayGoalLog={todayGoalLog}
              weeklyGoalsCompletedPercent={weeklyGoalsCompletedPercent}
              outreachMessage={outreachMessage}
              copiedKey={copiedKey}
              onCopyText={handleCopyText}
              onToggleDailyGoal={handleToggleDailyGoal}
              onAdjustCounter={handleAdjustCounter}
              onTogglePlannerTask={handleTogglePlannerTask}
              onNavigate={setActiveView}
              onOpenAddProspect={() => handleOpenAddModal()}
            />
          )}

          {activeView === 'planner' && (
            <WeeklyPlannerView
              weeklyPlan={weeklyPlan}
              copiedKey={copiedKey}
              onToggleTask={handleTogglePlannerTask}
              onAddCustomTask={handleAddCustomTask}
              onResetWeek={handleResetWeek}
              onCopyText={handleCopyText}
              onGoToFollowUps={() => setActiveView('follow-ups')}
            />
          )}

          {activeView === 'linkedin-search' && (
            <LinkedInSearchView
              copiedKey={copiedKey}
              onCopyText={handleCopyText}
              onLogProspectFromSearch={(category, city) =>
                handleOpenAddModal(category, city)
              }
            />
          )}

          {activeView === 'outreach' && (
            <OutreachPortfolioView
              outreachMessage={outreachMessage}
              onSaveMessage={handleSaveOutreachMessage}
              onResetMessage={handleResetOutreachMessage}
              copiedKey={copiedKey}
              onCopyText={handleCopyText}
            />
          )}

          {activeView === 'prospects' && (
            <ProspectTrackerView
              prospects={prospects}
              onAddProspect={() => handleOpenAddModal()}
              onEditProspect={handleOpenEditModal}
              onDeleteProspect={handleDeleteProspect}
              onUpdateStatus={handleUpdateProspectStatus}
            />
          )}

          {activeView === 'follow-ups' && (
            <FollowUpView
              prospects={prospects}
              outreachMessage={outreachMessage}
              copiedKey={copiedKey}
              onCopyText={handleCopyText}
              onUpdateFollowUpDetails={handleUpdateFollowUpDetails}
              onEditProspect={handleOpenEditModal}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Prospect Modal */}
      <ProspectModal
        isOpen={modalOpen}
        editingProspect={editingProspect}
        initialCategory={modalPrefillCategory}
        initialCity={modalPrefillCity}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProspect}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium shadow-lg"
        >
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
