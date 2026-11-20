import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  BUSINESS_CATEGORIES,
  CLIENT_STATUSES,
  PROSPECT_CITIES,
} from '../constants';
import {
  BusinessCategory,
  ClientStatus,
  Prospect,
  UKCity,
} from '../types';
import { getOffsetIsoDate, getTodayIsoDate } from '../utils/linkedin';

interface ProspectModalProps {
  isOpen: boolean;
  editingProspect: Prospect | null;
  initialCategory?: BusinessCategory;
  initialCity?: Exclude<UKCity, 'All UK Cities'> | 'Other UK';
  onClose: () => void;
  onSave: (prospectData: Omit<Prospect, 'id' | 'createdAt'>, existingId?: string) => void;
}

export const ProspectModal: React.FC<ProspectModalProps> = ({
  isOpen,
  editingProspect,
  initialCategory,
  initialCity,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('Cleaning Companies');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [city, setCity] = useState<Exclude<UKCity, 'All UK Cities'> | 'Other UK'>('London');
  const [contactDate, setContactDate] = useState(getTodayIsoDate());
  const [followUpDate, setFollowUpDate] = useState(getOffsetIsoDate(3));
  const [followUpCompleted, setFollowUpCompleted] = useState(false);
  const [status, setStatus] = useState<ClientStatus>('New Prospect');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (editingProspect) {
      setName(editingProspect.name);
      setCategory(editingProspect.category);
      setLinkedinUrl(editingProspect.linkedinUrl);
      setWebsiteUrl(editingProspect.websiteUrl);
      setCity(editingProspect.city);
      setContactDate(editingProspect.contactDate);
      setFollowUpDate(editingProspect.followUpDate);
      setFollowUpCompleted(editingProspect.followUpCompleted);
      setStatus(editingProspect.status);
      setNotes(editingProspect.notes);
    } else {
      setName('');
      setCategory(initialCategory || 'Cleaning Companies');
      setLinkedinUrl('');
      setWebsiteUrl('');
      setCity(initialCity || 'London');
      setContactDate(getTodayIsoDate());
      setFollowUpDate(getOffsetIsoDate(3));
      setFollowUpCompleted(false);
      setStatus('New Prospect');
      setNotes('');
    }
  }, [isOpen, editingProspect, initialCategory, initialCity]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a client or business name.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        category,
        linkedinUrl: linkedinUrl.trim(),
        websiteUrl: websiteUrl.trim(),
        city,
        contactDate,
        followUpDate,
        followUpCompleted,
        status,
        notes: notes.trim(),
      },
      editingProspect?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prospect-modal-title"
    >
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 id="prospect-modal-title" className="font-display text-lg font-semibold text-slate-900">
            {editingProspect ? 'Edit Prospect' : 'Add New UK Prospect'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="prospect-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Client / Business Name *
              </label>
              <input
                id="prospect-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. James Whitfield · Apex Commercial Cleaning"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="prospect-category" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Business Category
              </label>
              <select
                id="prospect-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prospect-city" className="block text-xs font-semibold text-slate-700 mb-1.5">
                UK City
              </label>
              <select
                id="prospect-city"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value as Exclude<UKCity, 'All UK Cities'> | 'Other UK')
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                {PROSPECT_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prospect-linkedin" className="block text-xs font-semibold text-slate-700 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                id="prospect-linkedin"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="prospect-website" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Website URL
              </label>
              <input
                id="prospect-website"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://business-domain.co.uk"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="prospect-contact-date" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact Date
              </label>
              <input
                id="prospect-contact-date"
                type="date"
                value={contactDate}
                onChange={(e) => setContactDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="prospect-followup-date" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Follow-up Date
              </label>
              <input
                id="prospect-followup-date"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="prospect-status" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Client Status
              </label>
              <select
                id="prospect-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ClientStatus)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                {CLIENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={followUpCompleted}
                  onChange={(e) => setFollowUpCompleted(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                />
                <span>Mark follow-up as completed</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="prospect-notes" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Notes &amp; Opportunity Observations
              </label>
              <textarea
                id="prospect-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Website issues noticed, Local SEO opportunities, WooCommerce needs..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
            >
              {editingProspect ? 'Save Changes' : 'Save Prospect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
