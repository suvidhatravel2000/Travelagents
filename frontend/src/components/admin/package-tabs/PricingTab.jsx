import React from 'react';
import { Plus, Trash2, X, FileText, Sparkles } from 'lucide-react';

const PricingTab = ({
  formData, pasteMode, pasteText,
  onTogglePaste, onUpdatePasteText, onSmartParse,
  onAddRow, onUpdateRow, onRemoveRow, onAddColumn, onRemoveColumn
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold">Pricing Table</h3>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => onTogglePaste('pricingTable')}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
            pasteMode ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 border border-blue-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>{pasteMode ? 'Manual Entry' : 'Smart Paste'}</span>
        </button>
        {!pasteMode && (
          <button type="button" onClick={onAddRow} className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm">
            <Plus className="h-4 w-4" /><span>Add Row</span>
          </button>
        )}
      </div>
    </div>

    {pasteMode && (
      <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
        <label className="block text-sm font-semibold text-blue-900 mb-2">Paste Pricing Table</label>
        <p className="text-xs text-blue-700 mb-2">
          <strong>Example:</strong> Standard | 7452 | 7047 | 6282 | 5700
        </p>
        <textarea
          rows={8}
          value={pasteText || ''}
          onChange={(e) => onUpdatePasteText('pricingTable', e.target.value)}
          placeholder={"Standard | 7452 | 7047 | 6282 | 5700\nDeluxe | 8748 | 8343 | 7578 | 6500"}
          className="w-full px-3 py-2 border border-blue-300 rounded font-mono text-sm mb-3"
        />
        <button type="button" onClick={() => onSmartParse('pricingTable', 'pricing')} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Sparkles className="h-4 w-4" /><span>Parse & Import</span>
        </button>
      </div>
    )}

    {!pasteMode && formData.pricingTable.map((row, idx) => (
      <div key={idx} className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm">Row {idx + 1}</span>
          <button type="button" onClick={() => onRemoveRow(idx)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Category</label>
          <input type="text" placeholder="e.g., Standard, Deluxe" value={row.category} onChange={(e) => onUpdateRow(idx, 'category', e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
        </div>
        {row.columns && Object.keys(row.columns).length > 0 && (
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Pricing Columns</label>
            {Object.entries(row.columns).map(([col, val]) => (
              <div key={col} className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-700 w-32 flex-shrink-0">{col}:</span>
                <input type="text" placeholder="Price" value={val} onChange={(e) => onUpdateRow(idx, `column_${col}`, e.target.value)} className="flex-1 px-3 py-2 border rounded text-sm" />
                <button type="button" onClick={() => onRemoveColumn(idx, col)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}
        {row.price2Pax !== undefined && !row.columns && (
          <div className="grid grid-cols-4 gap-2">
            {['price2Pax', 'price4Pax', 'price6Pax', 'extraBed'].map(f => (
              <input key={f} type="number" placeholder={f.replace('price', '').replace('Pax', ' Pax')} value={row[f]} onChange={(e) => onUpdateRow(idx, f, e.target.value)} className="px-3 py-2 border rounded text-sm" />
            ))}
          </div>
        )}
        <button type="button" onClick={() => onAddColumn(idx)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
          <Plus className="h-3 w-3" /><span>Add Pricing Column</span>
        </button>
      </div>
    ))}

    {!pasteMode && formData.pricingTable.length === 0 && (
      <div className="text-center py-8 text-gray-500">No pricing data yet. Use "Smart Paste" or "Add Row" to get started.</div>
    )}
  </div>
);

export default PricingTab;
