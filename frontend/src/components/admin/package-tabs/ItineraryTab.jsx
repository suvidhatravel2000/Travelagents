import React from 'react';
import { Plus, Trash2, FileText, Sparkles } from 'lucide-react';

const ItineraryTab = ({
  formData, pasteMode, pasteText,
  onTogglePaste, onUpdatePasteText, onSmartParse,
  onAddDay, onUpdateDay, onRemoveDay
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold">Day-wise Itinerary</h3>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => onTogglePaste('itinerary')}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
            pasteMode ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 border border-blue-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>{pasteMode ? 'Manual Entry' : 'Smart Paste'}</span>
        </button>
        {!pasteMode && (
          <button type="button" onClick={onAddDay} className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm">
            <Plus className="h-4 w-4" /><span>Add Day</span>
          </button>
        )}
      </div>
    </div>

    {pasteMode && (
      <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
        <label className="block text-sm font-semibold text-blue-900 mb-2">Paste Day-Wise Itinerary</label>
        <p className="text-xs text-blue-700 mb-2">
          <strong>Example:</strong> Day 01: Delhi – Manali [newline] Description text...
        </p>
        <textarea
          rows={12}
          value={pasteText || ''}
          onChange={(e) => onUpdatePasteText('itinerary', e.target.value)}
          placeholder={"Day 01: Delhi – Manali\nEvening board the Volvo from Delhi...\n\nDay 02: Manali Arrival\nEarly morning arrival in Manali..."}
          className="w-full px-3 py-2 border border-blue-300 rounded font-mono text-sm mb-3"
        />
        <button type="button" onClick={() => onSmartParse('itinerary', 'itinerary')} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Sparkles className="h-4 w-4" /><span>Parse & Import</span>
        </button>
      </div>
    )}

    {!pasteMode && formData.itinerary.map((day, idx) => (
      <div key={idx} className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">Day {day.day}</span>
          <button type="button" onClick={() => onRemoveDay(idx)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
        <input type="text" placeholder="Day Title" value={day.title} onChange={(e) => onUpdateDay(idx, 'title', e.target.value)} className="w-full px-3 py-2 border rounded" />
        <textarea rows={3} placeholder="Day Description" value={day.description} onChange={(e) => onUpdateDay(idx, 'description', e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>
    ))}

    {!pasteMode && formData.itinerary.length === 0 && (
      <div className="text-center py-8 text-gray-500">No itinerary yet. Use "Smart Paste" or "Add Day" to get started.</div>
    )}
  </div>
);

export default ItineraryTab;
