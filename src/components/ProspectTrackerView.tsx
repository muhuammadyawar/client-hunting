import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Globe,
  RotateCcw,
} from 'lucide-react';
import {
  BUSINESS_CATEGORIES,
  CLIENT_STATUSES,
  PROSPECT_CITIES,
} from '../constants';
import { ClientStatus, Prospect } from '../types';
import { formatUkDate } from '../utils/linkedin';

interface ProspectTrackerViewProps {
  prospects: Prospect[];
  onAddProspect: () => void;
  onEditProspect: (prospect: Prospect) => void;
  onDeleteProspect: (id: string) => void;
  onUpdateStatus: (id: string, status: ClientStatus) => void;
}

function getStatusColorClasses(status: ClientStatus): string {
  switch (status) {
    case 'Interested':
      return 'text-blue-700';
    case 'Converted':
      return 'text-emerald-700';
    case 'Follow-up Required':
      return 'text-amber-700';
    case 'Not Interested':
      return 'text-slate-400';
    case 'Connection Sent':
    case 'Message Sent':
      return 'text-slate-700';
    default:
      return 'text-slate-600';
  }
}

export const ProspectTrackerView: React.FC<ProspectTrackerViewProps> = ({
  prospects,
  onAddProspect,
  onEditProspect,
  onDeleteProspect,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredProspects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return prospects.filter((p) => {
      if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
      if (cityFilter !== 'ALL' && p.city !== cityFilter) return false;
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.websiteUrl.toLowerCase().includes(q)
      );
    });
  }, [prospects, searchQuery, categoryFilter, cityFilter, statusFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'ALL' ||
    cityFilter !== 'ALL' ||
    statusFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setCityFilter('ALL');
    setStatusFilter('ALL');
  };

  return (
    <div className="space-y-5">
      {/* Toolbar: Search & Filters */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, notes, website..."
              aria-label="Search prospects"
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by Category"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All Categories</option>
              {BUSINESS_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              aria-label="Filter by UK City"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All UK Cities</option>
              {PROSPECT_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3 flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Client Status"
              className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">All Statuses</option>
              {CLIENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                title="Reset filters"
                aria-label="Reset filters"
                className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="tabular-nums">
            Showing {filteredProspects.length} of {prospects.length} prospects
          </span>
          <button
            type="button"
            onClick={onAddProspect}
            className="inline-flex items-center gap-1.5 font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Prospect</span>
          </button>
        </div>
      </section>

      {/* Prospects Table / List */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filteredProspects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-base font-semibold text-slate-900">
              {prospects.length === 0
                ? 'No prospects added yet'
                : 'No prospects match your current filters'}
            </p>
            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              {prospects.length === 0
                ? 'Start logging UK business owners you find on LinkedIn to track outreach, follow-ups, and conversions.'
                : 'Try clearing one or more filters or adding a new UK prospect.'}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={onAddProspect}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
              >
                <Plus className="h-4 w-4" />
                <span>Add Prospect</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop High-Density Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                    <th className="py-3 px-4">Client / Business</th>
                    <th className="py-3 px-4">Category &amp; City</th>
                    <th className="py-3 px-4">Links</th>
                    <th className="py-3 px-4">Contact Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProspects.map((prospect) => (
                    <tr key={prospect.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-semibold text-slate-900 truncate">
                          {prospect.name}
                        </p>
                        {prospect.notes && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {prospect.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                        <span>{prospect.category}</span>
                        <span className="mx-1.5 text-slate-300" aria-hidden="true">·</span>
                        <span>{prospect.city}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3 text-xs">
                          {prospect.linkedinUrl ? (
                            <a
                              href={prospect.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline"
                            >
                              <span>LinkedIn</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-slate-300">No LinkedIn</span>
                          )}
                          {prospect.websiteUrl ? (
                            <a
                              href={prospect.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 hover:underline"
                            >
                              <Globe className="h-3 w-3" />
                              <span>Site</span>
                            </a>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono-tabular text-xs text-slate-600">
                        {formatUkDate(prospect.contactDate)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={prospect.status}
                          onChange={(e) =>
                            onUpdateStatus(prospect.id, e.target.value as ClientStatus)
                          }
                          aria-label={`Status for ${prospect.name}`}
                          className={`text-xs font-semibold bg-transparent border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 ${getStatusColorClasses(
                            prospect.status
                          )}`}
                        >
                          {CLIENT_STATUSES.map((s) => (
                            <option key={s} value={s} className="text-slate-900">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        {confirmDeleteId === prospect.id ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteProspect(prospect.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2.5 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onEditProspect(prospect)}
                              aria-label={`Edit ${prospect.name}`}
                              className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(prospect.id)}
                              aria-label={`Delete ${prospect.name}`}
                              className="p-1.5 rounded-md text-slate-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-slate-200">
              {filteredProspects.map((prospect) => (
                <div key={prospect.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">
                        {prospect.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {prospect.category} · {prospect.city} · {formatUkDate(prospect.contactDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditProspect(prospect)}
                        aria-label={`Edit ${prospect.name}`}
                        className="p-1.5 rounded text-slate-500 hover:bg-slate-100"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          confirmDeleteId === prospect.id
                            ? onDeleteProspect(prospect.id)
                            : setConfirmDeleteId(prospect.id)
                        }
                        aria-label={`Delete ${prospect.name}`}
                        className="p-1.5 rounded text-slate-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {confirmDeleteId === prospect.id && (
                    <div className="flex items-center justify-between gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs">
                      <span className="text-red-800">Confirm delete?</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteProspect(prospect.id);
                            setConfirmDeleteId(null);
                          }}
                          className="font-semibold text-red-700"
                        >
                          Yes, delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {prospect.notes && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {prospect.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <select
                      value={prospect.status}
                      onChange={(e) =>
                        onUpdateStatus(prospect.id, e.target.value as ClientStatus)
                      }
                      aria-label={`Status for ${prospect.name}`}
                      className={`text-xs font-semibold border border-slate-200 rounded-md px-2.5 py-1.5 bg-white ${getStatusColorClasses(
                        prospect.status
                      )}`}
                    >
                      {CLIENT_STATUSES.map((s) => (
                        <option key={s} value={s} className="text-slate-900">
                          {s}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-3 text-xs">
                      {prospect.linkedinUrl && (
                        <a
                          href={prospect.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-700 hover:underline inline-flex items-center gap-1"
                        >
                          <span>LinkedIn</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {prospect.websiteUrl && (
                        <a
                          href={prospect.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-slate-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};
