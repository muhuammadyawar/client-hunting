import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  Copy,
  Check,
  UserPlus,
  MapPin,
  Briefcase,
} from 'lucide-react';
import {
  BUSINESS_CATEGORIES,
  CATEGORY_SEARCH_STEMS,
  UK_CITIES,
} from '../constants';
import { BusinessCategory, UKCity } from '../types';
import {
  buildLinkedInKeyword,
  buildLinkedInPeopleSearchUrl,
} from '../utils/linkedin';

interface LinkedInSearchViewProps {
  copiedKey: string | null;
  onCopyText: (text: string, key: string, label: string) => void;
  onLogProspectFromSearch: (
    category: BusinessCategory,
    city: Exclude<UKCity, 'All UK Cities'> | 'Other UK'
  ) => void;
}

const ROLE_OPTIONS = [
  { id: 'default', label: 'Primary Decision Maker (Default)', modifier: '' },
  { id: 'founder', label: 'Founder', modifier: 'Founder' },
  { id: 'director', label: 'Managing Director', modifier: 'Managing Director' },
  { id: 'owner', label: 'Owner', modifier: 'Owner' },
];

export const LinkedInSearchView: React.FC<LinkedInSearchViewProps> = ({
  copiedKey,
  onCopyText,
  onLogProspectFromSearch,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<BusinessCategory>('Cleaning Companies');
  const [selectedCity, setSelectedCity] = useState<UKCity>('London');
  const [selectedRole, setSelectedRole] = useState<string>('default');

  const roleModifier =
    ROLE_OPTIONS.find((r) => r.id === selectedRole)?.modifier || '';
  const generatedKeyword = buildLinkedInKeyword(
    selectedCategory,
    selectedCity,
    roleModifier
  );
  const searchUrl = buildLinkedInPeopleSearchUrl(generatedKeyword);

  const quickPresets = BUSINESS_CATEGORIES.map((category) => {
    const kw = buildLinkedInKeyword(category, selectedCity);
    return {
      category,
      keyword: kw,
      url: buildLinkedInPeopleSearchUrl(kw),
    };
  });

  const mappedCityForModal: Exclude<UKCity, 'All UK Cities'> | 'Other UK' =
    selectedCity === 'All UK Cities' ? 'London' : selectedCity;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Search Builder */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              UK LinkedIn People Search Builder
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a target UK industry and city to generate an exact LinkedIn People search query.
            </p>
          </div>

          {/* Business Category */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2.5">
              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
              <span>Business Category</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUSINESS_CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-2.5 text-sm font-medium rounded-lg border text-left transition-colors whitespace-nowrap truncate ${
                      active
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* UK City */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>UK City</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {UK_CITIES.map((city) => {
                const active = selectedCity === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg border text-left transition-colors whitespace-nowrap truncate ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Variation */}
          <div>
            <label htmlFor="role-select" className="block text-xs font-semibold text-slate-700 mb-2">
              Title / Role Variation
            </label>
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full sm:w-80 px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Generated Query & Launcher */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Generated LinkedIn Query
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold text-slate-900 break-words">
              {generatedKeyword}
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              Target: {selectedCategory} · {selectedCity}
            </p>

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                <Search className="h-4 w-4" />
                <span>Open LinkedIn People Search</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    onCopyText(generatedKeyword, 'li-query', 'Search keyword')
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  {copiedKey === 'li-query' ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Query</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onLogProspectFromSearch(selectedCategory, mappedCityForModal)
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Log Prospect</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-700">Search Tip</p>
            <p className="leading-relaxed">
              On LinkedIn, filter by <span className="font-medium text-slate-700">2nd &amp; 3rd+ connections</span> and <span className="font-medium text-slate-700">Location: United Kingdom</span> to surface active business owners.
            </p>
          </div>
        </section>
      </div>

      {/* Quick Launch Matrix for Selected City */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              All Categories for {selectedCity}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              One-click LinkedIn People searches across your core UK niches
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 mt-1">
          {quickPresets.map((item) => (
            <div
              key={item.category}
              className="py-3.5 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {item.category}
                </p>
                <p className="text-xs font-mono-tabular text-slate-500 mt-0.5">
                  {item.keyword} · Base stem: {CATEGORY_SEARCH_STEMS[item.category]}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onCopyText(
                      item.keyword,
                      `preset-${item.category}`,
                      'Search keyword'
                    )
                  }
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 whitespace-nowrap"
                >
                  {copiedKey === `preset-${item.category}` ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 border border-blue-200 bg-blue-50/60 rounded-md hover:bg-blue-100/70 whitespace-nowrap"
                >
                  <span>Search</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
