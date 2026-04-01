import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

const BulkImportTab = ({ bulkText, setBulkText, bulkPreview, onParse, onImport }) => (
  <div className="space-y-4">
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Zap className="h-8 w-8 text-purple-600" />
        <div>
          <h3 className="text-xl font-bold text-purple-900">Bulk Import - Paste Once, Import Everything!</h3>
          <p className="text-sm text-purple-700">Copy the ENTIRE package page from suvidhatravel.com and paste it here</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-purple-900 mb-2">
            Paste Complete Package Page Content
          </label>
          <p className="text-xs text-purple-700 mb-3">
            <strong>Instructions:</strong>
            <br />1. Go to suvidhatravel.com package page
            <br />2. Press <kbd className="px-2 py-1 bg-purple-200 rounded">Ctrl+A</kbd> to select all
            <br />3. Press <kbd className="px-2 py-1 bg-purple-200 rounded">Ctrl+C</kbd> to copy
            <br />4. Paste here using <kbd className="px-2 py-1 bg-purple-200 rounded">Ctrl+V</kbd>
          </p>
          <textarea
            rows={15}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"Paste the complete package page content here...\n\nExample:\nManali Volvo Package – 4 Nights\nDuration: 4N/5D\n\nOverview\nBELOW RATES ARE PER PERSON..."}
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            data-testid="bulk-import-textarea"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onParse}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
            data-testid="bulk-parse-btn"
          >
            <Sparkles className="h-5 w-5" />
            <span>Parse Complete Package</span>
          </button>

          {bulkPreview && (
            <button
              type="button"
              onClick={onImport}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
              data-testid="bulk-import-btn"
            >
              <Zap className="h-5 w-5" />
              <span>Import All Data</span>
            </button>
          )}
        </div>

        {bulkPreview && (
          <div className="bg-white border-2 border-green-300 rounded-lg p-4">
            <h4 className="font-bold text-green-900 mb-2">Preview - Data Extracted Successfully!</h4>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{bulkPreview}</pre>
            <p className="text-xs text-green-700 mt-3">
              Click <strong>"Import All Data"</strong> above to populate all form fields.
            </p>
          </div>
        )}

        {!bulkPreview && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800"><strong>Pro Tip:</strong> This will automatically extract:</p>
            <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4">
              <li>- Package Title & Duration</li>
              <li>- Overview & Validity Dates</li>
              <li>- Pricing Table (all categories)</li>
              <li>- Hotel Details (all hotels)</li>
              <li>- Day-wise Itinerary (complete)</li>
              <li>- Inclusions, Exclusions, Terms & Conditions</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default BulkImportTab;
