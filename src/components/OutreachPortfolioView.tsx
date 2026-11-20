import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Edit3,
  RotateCcw,
  ExternalLink,
  Save,
  X,
  Link2,
} from 'lucide-react';
import {
  DEFAULT_OUTREACH_MESSAGE,
  FREELANCER_SERVICES,
  PORTFOLIO_NAME,
  PORTFOLIO_URL,
} from '../constants';
import { ensurePortfolioLinkIncluded } from '../utils/linkedin';

interface OutreachPortfolioViewProps {
  outreachMessage: string;
  onSaveMessage: (nextMessage: string) => void;
  onResetMessage: () => void;
  copiedKey: string | null;
  onCopyText: (text: string, key: string, label: string) => void;
}

export const OutreachPortfolioView: React.FC<OutreachPortfolioViewProps> = ({
  outreachMessage,
  onSaveMessage,
  onResetMessage,
  copiedKey,
  onCopyText,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(outreachMessage);
  const [linkWarning, setLinkWarning] = useState(false);

  useEffect(() => {
    setDraft(outreachMessage);
  }, [outreachMessage]);

  const handleSave = () => {
    const { text, restored } = ensurePortfolioLinkIncluded(draft);
    onSaveMessage(text);
    setDraft(text);
    setIsEditing(false);
    setLinkWarning(restored);
  };

  const handleReset = () => {
    onResetMessage();
    setDraft(DEFAULT_OUTREACH_MESSAGE);
    setIsEditing(false);
    setLinkWarning(false);
  };

  // Render message with clickable portfolio URL
  const renderMessageWithClickableLink = (text: string) => {
    const parts = text.split(PORTFOLIO_URL);
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && (
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 font-medium underline underline-offset-2 hover:text-blue-900 break-all"
          >
            {PORTFOLIO_URL}
          </a>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: My Outreach Message Card */}
      <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              My Outreach Message
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Permanent LinkedIn outreach template · Portfolio link is always preserved
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setDraft(outreachMessage);
                  setLinkWarning(false);
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Message</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Default Message</span>
            </button>
          </div>
        </div>

        {linkWarning && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
            Your portfolio URL ({PORTFOLIO_URL}) was automatically preserved at the end of your message so it is never lost.
          </div>
        )}

        {isEditing ? (
          <div className="mt-5 space-y-4">
            <label htmlFor="outreach-editor" className="block text-xs font-semibold text-slate-700">
              Edit Outreach Template (Portfolio URL is protected and required)
            </label>
            <textarea
              id="outreach-editor"
              rows={14}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full p-4 text-sm text-slate-800 leading-relaxed bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500">
                Changes are saved permanently in your browser.
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setDraft(outreachMessage);
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 whitespace-nowrap"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 whitespace-nowrap"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-5 py-2 text-sm text-slate-800 whitespace-pre-wrap leading-7">
              {renderMessageWithClickableLink(outreachMessage)}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() =>
                  onCopyText(outreachMessage, 'full-outreach', 'Outreach message')
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                {copiedKey === 'full-outreach' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied Complete Message</span>
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
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:underline"
              >
                <Link2 className="h-3.5 w-3.5" />
                <span>Test Portfolio Link</span>
              </a>
            </div>
          </>
        )}
      </section>

      {/* Right: Dedicated Portfolio Card */}
      <aside className="lg:col-span-5 space-y-6">
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-4 pb-5 border-b border-slate-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-display text-base font-bold shrink-0">
              MY
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">Portfolio</p>
              <h2 className="font-display text-xl font-bold text-slate-900 truncate">
                {PORTFOLIO_NAME}
              </h2>
            </div>
          </div>

          <div className="py-5 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-1.5">
              Portfolio URL
            </p>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono-tabular font-medium text-blue-700 hover:text-blue-900 hover:underline break-all"
            >
              {PORTFOLIO_URL}
            </a>
          </div>

          <div className="py-5 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-2.5">
              UK Freelance Services Offered
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              {FREELANCER_SERVICES.map((service) => (
                <li key={service} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-700 shrink-0" aria-hidden="true" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              <span>Visit Portfolio</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() =>
                onCopyText(PORTFOLIO_URL, 'portfolio-url', 'Portfolio URL')
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              {copiedKey === 'portfolio-url' ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </section>
      </aside>
    </div>
  );
};
