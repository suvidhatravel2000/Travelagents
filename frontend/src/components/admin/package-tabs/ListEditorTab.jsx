import React from 'react';
import { Plus, Trash2, FileText, Sparkles } from 'lucide-react';

const ListEditorTab = ({
  title, listName, placeholder, items,
  pasteMode, pasteText, pastePlaceholder,
  onTogglePaste, onUpdatePasteText, onSmartParse,
  onAddItem, onUpdateItem, onRemoveItem
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => onTogglePaste(listName)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
            pasteMode ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 border border-blue-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>{pasteMode ? 'Manual Entry' : 'Smart Paste'}</span>
        </button>
        {!pasteMode && (
          <button type="button" onClick={() => onAddItem(listName)} className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm">
            <Plus className="h-4 w-4" /><span>Add Item</span>
          </button>
        )}
      </div>
    </div>

    {pasteMode && (
      <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
        <label className="block text-sm font-semibold text-blue-900 mb-2">Paste {title}</label>
        <p className="text-xs text-blue-700 mb-2">Paste items (one per line, with or without bullet points).</p>
        <textarea
          rows={8}
          value={pasteText || ''}
          onChange={(e) => onUpdatePasteText(listName, e.target.value)}
          placeholder={pastePlaceholder}
          className="w-full px-3 py-2 border border-blue-300 rounded font-mono text-sm mb-3"
        />
        <button type="button" onClick={() => onSmartParse(listName, 'list')} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Sparkles className="h-4 w-4" /><span>Parse & Import</span>
        </button>
      </div>
    )}

    {!pasteMode && items.map((item, idx) => (
      <div key={idx} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder={placeholder}
          value={item}
          onChange={(e) => onUpdateItem(listName, idx, e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button type="button" onClick={() => onRemoveItem(listName, idx)} className="text-red-600">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ))}

    {!pasteMode && items.length === 0 && (
      <div className="text-center py-8 text-gray-500">No items yet. Use "Smart Paste" or "Add Item" to get started.</div>
    )}
  </div>
);

export default ListEditorTab;
