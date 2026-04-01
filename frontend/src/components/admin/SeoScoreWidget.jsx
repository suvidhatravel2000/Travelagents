import React, { useMemo } from 'react';
import { Search, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const SeoScoreWidget = ({ seoTitle, seoDescription, focusKeyword, contentText, onChange }) => {

  const score = useMemo(() => {
    let total = 0;
    const title = (seoTitle || '').toLowerCase();
    const desc = (seoDescription || '').toLowerCase();
    const keyword = (focusKeyword || '').toLowerCase().trim();
    const content = (contentText || '').toLowerCase();

    if (title.length >= 50 && title.length <= 60) total += 20;
    if (desc.length >= 140 && desc.length <= 160) total += 20;
    if (keyword && title.includes(keyword)) total += 20;
    if (keyword && desc.includes(keyword)) total += 20;
    if (keyword && content.includes(keyword)) total += 20;

    return total;
  }, [seoTitle, seoDescription, focusKeyword, contentText]);

  const suggestions = useMemo(() => {
    const items = [];
    const title = seoTitle || '';
    const desc = seoDescription || '';
    const keyword = (focusKeyword || '').toLowerCase().trim();
    const content = (contentText || '').toLowerCase();

    if (!keyword) {
      items.push({ type: 'error', text: 'Add a focus keyword to begin optimization' });
    } else {
      if (!title.toLowerCase().includes(keyword)) {
        items.push({ type: 'warning', text: 'Add focus keyword in the SEO title' });
      } else {
        items.push({ type: 'success', text: 'Keyword found in title' });
      }
      if (!desc.toLowerCase().includes(keyword)) {
        items.push({ type: 'warning', text: 'Add focus keyword in the meta description' });
      } else {
        items.push({ type: 'success', text: 'Keyword found in description' });
      }
      if (!content.includes(keyword)) {
        items.push({ type: 'warning', text: 'Add focus keyword in page content (overview/body)' });
      } else {
        items.push({ type: 'success', text: 'Keyword found in content' });
      }
    }

    if (title.length < 50) {
      items.push({ type: 'warning', text: `Title too short (${title.length}/50-60 chars)` });
    } else if (title.length > 60) {
      items.push({ type: 'warning', text: `Title too long (${title.length}/50-60 chars)` });
    } else {
      items.push({ type: 'success', text: `Title length is optimal (${title.length} chars)` });
    }

    if (desc.length < 140) {
      items.push({ type: 'warning', text: `Description too short (${desc.length}/140-160 chars)` });
    } else if (desc.length > 160) {
      items.push({ type: 'warning', text: `Description too long (${desc.length}/140-160 chars)` });
    } else {
      items.push({ type: 'success', text: `Description length is optimal (${desc.length} chars)` });
    }

    return items;
  }, [seoTitle, seoDescription, focusKeyword, contentText]);

  const scoreColor = score < 40 ? 'text-red-500' : score <= 70 ? 'text-orange-500' : 'text-green-500';
  const scoreBg = score < 40 ? 'bg-red-50 border-red-200' : score <= 70 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200';
  const scoreRingColor = score < 40 ? '#ef4444' : score <= 70 ? '#f97316' : '#22c55e';

  return (
    <div className="space-y-5" data-testid="seo-score-widget">
      {/* SEO Score Ring */}
      <div className={`flex items-center gap-5 p-4 rounded-lg border ${scoreBg}`} data-testid="seo-score-display">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke={scoreRingColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 213.6} 213.6`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${scoreColor}`} data-testid="seo-score-value">{score}%</span>
          </div>
        </div>
        <div>
          <p className={`text-lg font-semibold ${scoreColor}`}>
            {score < 40 ? 'Needs Work' : score <= 70 ? 'Getting Better' : 'Great SEO!'}
          </p>
          <p className="text-sm text-gray-500">
            {score < 40 ? 'Fill in all SEO fields and use your keyword.' : score <= 70 ? 'Almost there! Check suggestions below.' : 'Your content is well optimized.'}
          </p>
        </div>
      </div>

      {/* SEO Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Focus Keyword
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={focusKeyword || ''}
              onChange={(e) => onChange('focus_keyword', e.target.value)}
              placeholder="e.g. manali honeymoon package"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              data-testid="seo-focus-keyword-input"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
            <span>SEO Title</span>
            <span className={`text-xs ${(seoTitle || '').length >= 50 && (seoTitle || '').length <= 60 ? 'text-green-500' : 'text-gray-400'}`}>
              {(seoTitle || '').length}/60
            </span>
          </label>
          <input
            type="text"
            value={seoTitle || ''}
            onChange={(e) => onChange('seo_title', e.target.value)}
            placeholder="Compelling title for search results (50-60 characters)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            data-testid="seo-title-input"
          />
        </div>

        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Meta Description</span>
            <span className={`text-xs ${(seoDescription || '').length >= 140 && (seoDescription || '').length <= 160 ? 'text-green-500' : 'text-gray-400'}`}>
              {(seoDescription || '').length}/160
            </span>
          </label>
          <textarea
            rows={3}
            value={seoDescription || ''}
            onChange={(e) => onChange('seo_description', e.target.value)}
            placeholder="Brief, keyword-rich summary for search results (140-160 characters)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            data-testid="seo-description-input"
          />
        </div>
      </div>

      {/* Live Google Preview */}
      <div className="border rounded-lg p-4 bg-white" data-testid="seo-google-preview">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wider">Google Preview</p>
        <div className="space-y-0.5">
          <p className="text-blue-700 text-lg leading-tight truncate" data-testid="seo-preview-title">
            {seoTitle || 'Page Title — Suvidha Travel'}
          </p>
          <p className="text-green-700 text-sm truncate">
            suvidhatravel.com
          </p>
          <p className="text-sm text-gray-600 line-clamp-2" data-testid="seo-preview-desc">
            {seoDescription || 'Add a meta description to see how your page will appear in search results.'}
          </p>
        </div>
      </div>

      {/* SEO Suggestions */}
      <div className="space-y-2" data-testid="seo-suggestions">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggestions</p>
        {suggestions.map((item, idx) => (
          <div key={idx} className={`flex items-start gap-2 text-sm px-3 py-2 rounded-lg ${
            item.type === 'success' ? 'bg-green-50 text-green-700' :
            item.type === 'warning' ? 'bg-amber-50 text-amber-700' :
            'bg-red-50 text-red-700'
          }`} data-testid={`seo-suggestion-${idx}`}>
            {item.type === 'success' ? <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> :
             item.type === 'warning' ? <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" /> :
             <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeoScoreWidget;
