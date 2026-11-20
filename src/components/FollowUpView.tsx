import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Clock,
} from 'lucide-react';
import { Prospect } from '../types';
import {
  formatUkDate,
  getFollowUpUrgency,
  getOffsetIsoDate,
  getTodayIsoDate,
} from '../utils/linkedin';

interface FollowUpViewProps {
  prospects: Prospect[];
  outreachMessage: string;
  copiedKey: string | null;
  onCopyText: (text: string, key: string, label: string) => void;
  onUpdateFollowUpDetails: (
    id: string,
    updates: Partial<
      Pick<Prospect, 'contactDate' | 'followUpDate' | 'followUpCompleted' | 'status'>
    >
  ) => void;
  onEditProspect: (prospect: Prospect) => void;
}

export const FollowUpView: React.FC<FollowUpViewProps> = ({
  prospects,
  outreachMessage,
  copiedKey,
  onCopyText,
  onUpdateFollowUpDetails,
  onEditProspect,
}) => {
  const todayStr = getTodayIsoDate();
  const [selectedProspectId, setSelectedProspectId] = useState<string>('');
  const [logContactDate, setLogContactDate] = useState<string>(todayStr);
  const [logFollowUpDate, setLogFollowUpDate] = useState<string>(
    getOffsetIsoDate(3)
  );

  const pendingFollowUps = prospects
    .filter(
      (p) =>
        !p.followUpCompleted &&
        (Boolean(p.followUpDate) || p.status === 'Follow-up Required')
    )
    .sort((a, b) => {
      if (!a.followUpDate) return 1;
      if (!b.followUpDate) return -1;
      return a.followUpDate.localeCompare(b.followUpDate);
    });

  const completedFollowUps = prospects.filter((p) => p.followUpCompleted);
  const interestedClients = prospects.filter((p) => p.status === 'Interested');

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProspectId) return;
    onUpdateFollowUpDetails(selectedProspectId, {
      contactDate: logContactDate,
      followUpDate: logFollowUpDate,
      followUpCompleted: false,
      status: 'Follow-up Required',
    });
    setSelectedProspectId('');
  };

  return (
    <div className="space-y-6">
      {/* Record Contact & Schedule Follow-up Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="pb-4 border-b border-slate-200">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Record Contact &amp; Schedule Follow-up
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Log when you contacted a prospect and set their next follow-up date.
          </p>
        </div>

        <form
          onSubmit={handleScheduleFollowUp}
          className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end"
        >
          <div className="lg:col-span-5">
            <label
              htmlFor="followup-prospect"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Select Prospect
            </label>
            <select
              id="followup-prospect"
              value={selectedProspectId}
              onChange={(e) => setSelectedProspectId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Choose a prospect...</option>
              {prospects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="log-contact-date"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Contact Date
            </label>
            <input
              id="log-contact-date"
              type="date"
              value={logContactDate}
              onChange={(e) => setLogContactDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm font-mono-tabular bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="log-followup-date"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Follow-up Date
            </label>
            <input
              id="log-followup-date"
              type="date"
              value={logFollowUpDate}
              onChange={(e) => setLogFollowUpDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm font-mono-tabular bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="lg:col-span-3">
            <button
              type="submit"
              disabled={!selectedProspectId}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 transition-colors whitespace-nowrap"
            >
              Save Follow-up Schedule
            </button>
          </div>
        </form>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pending Follow-ups Queue */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-amber-700" />
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Pending Follow-ups ({pendingFollowUps.length})
              </h2>
            </div>
            <span className="text-xs text-slate-500 tabular-nums">
              {completedFollowUps.length} completed
            </span>
          </div>

          {pendingFollowUps.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              All scheduled follow-ups are completed. Use the form above to schedule new check-ins.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 mt-1">
              {pendingFollowUps.map((prospect) => {
                const urgency = getFollowUpUrgency(prospect.followUpDate, todayStr);
                return (
                  <li key={prospect.id} className="py-4 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`font-semibold ${
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
                              : 'Upcoming'}
                          </span>
                          <span className="text-slate-300" aria-hidden="true">·</span>
                          <span className="font-mono-tabular text-slate-500">
                            Follow-up: {formatUkDate(prospect.followUpDate)}
                          </span>
                          <span className="text-slate-300" aria-hidden="true">·</span>
                          <span className="text-slate-500">
                            Contacted: {formatUkDate(prospect.contactDate)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {prospect.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {prospect.category} · {prospect.city} · {prospect.status}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateFollowUpDetails(prospect.id, {
                              followUpCompleted: true,
                              status:
                                prospect.status === 'Follow-up Required'
                                  ? 'Message Sent'
                                  : prospect.status,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      </div>
                    </div>

                    {prospect.notes && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {prospect.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="inline-flex items-center gap-1.5 text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Reschedule:</span>
                        <input
                          type="date"
                          value={prospect.followUpDate}
                          onChange={(e) =>
                            onUpdateFollowUpDetails(prospect.id, {
                              followUpDate: e.target.value,
                              followUpCompleted: false,
                            })
                          }
                          aria-label={`Reschedule follow-up for ${prospect.name}`}
                          className="font-mono-tabular text-xs border border-slate-200 rounded px-2 py-1 text-slate-700"
                        />
                      </div>

                      {prospect.linkedinUrl && (
                        <a
                          href={prospect.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline"
                        >
                          <span>Open LinkedIn</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => onEditProspect(prospect)}
                        className="font-medium text-slate-600 hover:text-slate-900"
                      >
                        Edit details
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Interested Clients Directory */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-700" />
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Interested Clients ({interestedClients.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                onCopyText(outreachMessage, 'followup-msg', 'Outreach message')
              }
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap"
            >
              {copiedKey === 'followup-msg' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Message Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Outreach</span>
                </>
              )}
            </button>
          </div>

          {interestedClients.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No clients marked as Interested yet. Update a prospect&apos;s status when they reply positively.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 mt-1">
              {interestedClients.map((client) => (
                <li key={client.id} className="py-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {client.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {client.category} · {client.city}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateFollowUpDetails(client.id, { status: 'Converted' })
                      }
                      className="px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-md hover:bg-emerald-100 whitespace-nowrap shrink-0"
                    >
                      Mark Converted
                    </button>
                  </div>

                  {client.notes && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {client.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                    {client.linkedinUrl && (
                      <a
                        href={client.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {client.websiteUrl && (
                      <a
                        href={client.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 hover:underline"
                      >
                        <span>Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <span className="text-slate-400 font-mono-tabular">
                      Next follow-up: {formatUkDate(client.followUpDate)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
