import React from 'react';
import { Plus, Trash2, X, FileText, Sparkles } from 'lucide-react';

const HotelsTab = ({
  formData, pasteMode, pasteText,
  onTogglePaste, onUpdatePasteText, onSmartParse,
  onAddRow, onUpdateRow, onRemoveRow, onAddLocation, onRemoveLocation
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold">Hotel Details</h3>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => onTogglePaste('hotelDetails')}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
            pasteMode ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 border border-blue-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>{pasteMode ? 'Manual Entry' : 'Smart Paste'}</span>
        </button>
        {!pasteMode && (
          <button type="button" onClick={onAddRow} className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm">
            <Plus className="h-4 w-4" /><span>Add Hotel</span>
          </button>
        )}
      </div>
    </div>

    {pasteMode && (
      <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
        <label className="block text-sm font-semibold text-blue-900 mb-2">Paste Hotel Details</label>
        <p className="text-xs text-blue-700 mb-2">
          <strong>Multi-column:</strong> Standard | Hotel A | Hotel B | Hotel C
        </p>
        <textarea
          rows={8}
          value={pasteText || ''}
          onChange={(e) => onUpdatePasteText('hotelDetails', e.target.value)}
          placeholder={"Category | Nainital | Jim Corbett\nStandard | Rio Grande | Maya The Forest\nDeluxe | Cedarwood Resort | Aroma Heaven"}
          className="w-full px-3 py-2 border border-blue-300 rounded font-mono text-sm mb-3"
        />
        <button type="button" onClick={() => onSmartParse('hotelDetails', 'hotels')} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Sparkles className="h-4 w-4" /><span>Parse & Import</span>
        </button>
      </div>
    )}

    {!pasteMode && formData.hotelDetails.map((hotel, idx) => (
      <div key={idx} className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-sm">Hotel {idx + 1}</span>
          <button type="button" onClick={() => onRemoveRow(idx)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Category</label>
          <input type="text" placeholder="e.g., Standard, Deluxe" value={hotel.category} onChange={(e) => onUpdateRow(idx, 'category', e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
        </div>
        {hotel.locations && Object.keys(hotel.locations).length > 0 && (
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Locations & Hotels</label>
            {Object.entries(hotel.locations).map(([loc, name]) => (
              <div key={loc} className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-700 w-32 flex-shrink-0">{loc}:</span>
                <input type="text" placeholder="Hotel name" value={name} onChange={(e) => onUpdateRow(idx, `location_${loc}`, e.target.value)} className="flex-1 px-3 py-2 border rounded text-sm" />
                <button type="button" onClick={() => onRemoveLocation(idx, loc)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}
        {hotel.hotelName && !hotel.locations && (
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Hotel Name</label>
            <input type="text" value={hotel.hotelName} onChange={(e) => onUpdateRow(idx, 'hotelName', e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
          </div>
        )}
        <button type="button" onClick={() => onAddLocation(idx)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
          <Plus className="h-3 w-3" /><span>Add Location Column</span>
        </button>
      </div>
    ))}

    {!pasteMode && formData.hotelDetails.length === 0 && (
      <div className="text-center py-8 text-gray-500">No hotel data yet. Use "Smart Paste" or "Add Hotel" to get started.</div>
    )}
  </div>
);

export default HotelsTab;
