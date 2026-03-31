import React, { useState } from 'react';
import { X, Save, Plus, Trash2, FileText, Sparkles, Zap } from 'lucide-react';
import { smartParse } from '../../utils/packageParser';
import { parseBulkPackageData, generatePreview } from '../../utils/bulkPackageParser';

const EnhancedPackageModal = ({ package: pkg, destinations, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('bulk');
  const [pasteMode, setPasteMode] = useState({}); // Track which sections are in paste mode
  const [pasteText, setPasteText] = useState({}); // Store paste text for each section
  const [bulkText, setBulkText] = useState(''); // Store full page text for bulk import
  const [bulkPreview, setBulkPreview] = useState(''); // Preview of parsed data
  const [formData, setFormData] = useState(pkg || {
    title: '',
    destination: '',
    category: '',
    image: '',
    rating: 0,
    duration: '',
    days: '',
    price: 0,
    originalPrice: 0,
    savings: 0,
    flightsIncluded: false,
    groupTour: false,
    overview: '',
    validityDates: '',
    vehicleInfo: '',
    additionalInfo: '',
    pricingTable: [],
    hotelDetails: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    termsConditions: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const savings = formData.originalPrice - formData.price;
    onSave({ ...formData, savings });
  };

  // Itinerary handlers
  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: '', description: '' }]
    });
  };

  const updateItinerary = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index][field] = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const removeItinerary = (index) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index);
    setFormData({ ...formData, itinerary: newItinerary });
  };

  // List handlers (inclusions, exclusions, terms)
  const addListItem = (listName) => {
    setFormData({
      ...formData,
      [listName]: [...formData[listName], '']
    });
  };

  const updateListItem = (listName, index, value) => {
    const newList = [...formData[listName]];
    newList[index] = value;
    setFormData({ ...formData, [listName]: newList });
  };

  const removeListItem = (listName, index) => {
    const newList = formData[listName].filter((_, i) => i !== index);
    setFormData({ ...formData, [listName]: newList });
  };

  // Pricing table handlers
  const addPricingRow = () => {
    setFormData({
      ...formData,
      pricingTable: [...formData.pricingTable, { category: '', price2Pax: 0, price4Pax: 0, price6Pax: 0, extraBed: 0 }]
    });
  };

  const updatePricing = (index, field, value) => {
    const newPricing = [...formData.pricingTable];
    newPricing[index][field] = field === 'category' ? value : parseInt(value) || 0;
    setFormData({ ...formData, pricingTable: newPricing });
  };

  const removePricingRow = (index) => {
    const newPricing = formData.pricingTable.filter((_, i) => i !== index);
    setFormData({ ...formData, pricingTable: newPricing });
  };

  // Hotel details handlers
  const addHotelRow = () => {
    setFormData({
      ...formData,
      hotelDetails: [...formData.hotelDetails, { category: '', hotelName: '', roomType: '' }]
    });
  };

  const updateHotel = (index, field, value) => {
    const newHotels = [...formData.hotelDetails];
    newHotels[index][field] = value;
    setFormData({ ...formData, hotelDetails: newHotels });
  };

  const removeHotelRow = (index) => {
    const newHotels = formData.hotelDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, hotelDetails: newHotels });
  };

  // Bulk Import Handler
  const handleBulkParse = () => {
    if (!bulkText || !bulkText.trim()) {
      alert('Please paste the complete package page content first!');
      return;
    }

    try {
      const parsed = parseBulkPackageData(bulkText);
      
      if (!parsed || Object.keys(parsed).length === 0) {
        alert('Could not parse the content. Please ensure you copied the complete package page.');
        return;
      }

      // Generate preview
      const preview = generatePreview(parsed);
      setBulkPreview(preview);
      
      alert('✅ Content parsed! Review the preview below and click "Import All Data" to populate the form.');
    } catch (error) {
      console.error('Bulk parse error:', error);
      alert('Failed to parse content. Please check the format and try again.');
    }
  };

  const handleBulkImport = () => {
    if (!bulkText || !bulkText.trim()) {
      alert('Please paste and parse content first!');
      return;
    }

    try {
      const parsed = parseBulkPackageData(bulkText);
      
      // Merge parsed data with existing form data
      setFormData({
        ...formData,
        ...parsed
      });
      
      // Switch to Basic tab to review
      setActiveTab('basic');
      setBulkText('');
      setBulkPreview('');
      
      alert('✅ All data imported! Please review each tab and fill in any missing fields (Destination, Image URL, Price).');
    } catch (error) {
      console.error('Bulk import error:', error);
      alert('Failed to import data. Please try again.');
    }
  };

  // Smart Paste Handlers
  const togglePasteMode = (section) => {
    setPasteMode({ ...pasteMode, [section]: !pasteMode[section] });
    if (!pasteMode[section]) {
      setPasteText({ ...pasteText, [section]: '' });
    }
  };

  const handleSmartParse = (section, parserType) => {
    const text = pasteText[section];
    if (!text || !text.trim()) {
      alert('Please paste some content first!');
      return;
    }

    try {
      const parsed = smartParse(text, parserType);
      
      if (parsed.length === 0) {
        alert('Could not parse the content. Please check the format and try again.');
        return;
      }

      // Update form data with parsed content
      setFormData({ ...formData, [section]: parsed });
      
      // Reset paste mode
      setPasteMode({ ...pasteMode, [section]: false });
      setPasteText({ ...pasteText, [section]: '' });
      
      alert(`✅ Successfully parsed ${parsed.length} items!`);
    } catch (error) {
      console.error('Parse error:', error);
      alert('Failed to parse content. Please check the format.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {pkg ? 'Edit Package' : 'Add New Package'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 overflow-x-auto">
            {['bulk', 'basic', 'pricing', 'hotels', 'itinerary', 'includes', 'excludes', 'terms'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === tab
                    ? tab === 'bulk' ? 'bg-purple-600 text-white' : 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'bulk' ? '⚡ Bulk Import' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Bulk Import Tab */}
          {activeTab === 'bulk' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">⚡ Bulk Import - Paste Once, Import Everything!</h3>
                    <p className="text-sm text-purple-700">Copy the ENTIRE package page from suvidhatravel.com and paste it here</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-900 mb-2">
                      📋 Paste Complete Package Page Content
                    </label>
                    <p className="text-xs text-purple-700 mb-3">
                      <strong>Instructions:</strong>
                      <br />
                      1. Go to suvidhatravel.com package page (e.g., Manali Volvo Package)
                      <br />
                      2. Press <kbd className="px-2 py-1 bg-purple-200 rounded">Ctrl+A</kbd> (or <kbd className="px-2 py-1 bg-purple-200 rounded">Cmd+A</kbd>) to select all
                      <br />
                      3. Press <kbd className="px-2 py-1 bg-purple-200 rounded">Ctrl+C</kbd> (or <kbd className="px-2 py-1 bg-purple-200 rounded">Cmd+C</kbd>) to copy
                      <br />
                      4. Paste here using <kbd className="px-2 py-1 bg-purple-200 rounded">Ctrl+V</kbd>
                    </p>
                    <textarea
                      rows={15}
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder="Paste the complete package page content here...&#10;&#10;Example:&#10;Manali Volvo Package – 4 Nights&#10;Duration: 4N/5D&#10;&#10;Overview&#10;BELOW RATES ARE PER PERSON...&#10;&#10;Hotel Details&#10;Standard | Hotel President...&#10;&#10;Day 01: Delhi – Manali&#10;Evening board the Volvo..."
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleBulkParse}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
                    >
                      <Sparkles className="h-5 w-5" />
                      <span>Parse Complete Package</span>
                    </button>

                    {bulkPreview && (
                      <button
                        type="button"
                        onClick={handleBulkImport}
                        className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                      >
                        <Zap className="h-5 w-5" />
                        <span>Import All Data</span>
                      </button>
                    )}
                  </div>

                  {bulkPreview && (
                    <div className="bg-white border-2 border-green-300 rounded-lg p-4">
                      <h4 className="font-bold text-green-900 mb-2">✅ Preview - Data Extracted Successfully!</h4>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{bulkPreview}</pre>
                      <p className="text-xs text-green-700 mt-3">
                        Click <strong>"Import All Data"</strong> above to populate all form fields with this data.
                      </p>
                    </div>
                  )}

                  {!bulkPreview && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>💡 Pro Tip:</strong> This will automatically extract:
                      </p>
                      <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4">
                        <li>✓ Package Title & Duration</li>
                        <li>✓ Overview & Validity Dates</li>
                        <li>✓ Pricing Table (all categories)</li>
                        <li>✓ Hotel Details (all hotels)</li>
                        <li>✓ Day-wise Itinerary (complete)</li>
                        <li>✓ Package Inclusions</li>
                        <li>✓ Package Exclusions</li>
                        <li>✓ Terms & Conditions</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                  <select
                    required
                    value={formData.destination}
                    onChange={(e) => {
                      const dest = destinations.find(d => d.id === e.target.value);
                      setFormData({ ...formData, destination: e.target.value, category: dest?.name || '' });
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="4N/5D"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                  <input
                    type="text"
                    value={formData.days}
                    onChange={(e) => setFormData({...formData, days: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price *</label>
                  <input
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.flightsIncluded}
                    onChange={(e) => setFormData({...formData, flightsIncluded: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <span className="ml-2 text-sm">Flights Included</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.groupTour}
                    onChange={(e) => setFormData({...formData, groupTour: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <span className="ml-2 text-sm">Group Tour</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                <textarea
                  rows={4}
                  value={formData.overview}
                  onChange={(e) => setFormData({...formData, overview: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Validity Dates</label>
                <input
                  type="text"
                  placeholder="Valid till 01st July 2025 – 30th March 2026"
                  value={formData.validityDates}
                  onChange={(e) => setFormData({...formData, validityDates: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Info</label>
                <input
                  type="text"
                  placeholder="For 2-3 Pax: Alto || For 4-6 Pax: Ertiga"
                  value={formData.vehicleInfo}
                  onChange={(e) => setFormData({...formData, vehicleInfo: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Info</label>
                <textarea
                  rows={2}
                  placeholder="Honeymoon packages, special notes..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Pricing Table Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Pricing Table</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => togglePasteMode('pricingTable')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                      pasteMode.pricingTable 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>{pasteMode.pricingTable ? 'Manual Entry' : '📋 Smart Paste'}</span>
                  </button>
                  {!pasteMode.pricingTable && (
                    <button
                      type="button"
                      onClick={addPricingRow}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Row</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Smart Paste Mode */}
              {pasteMode.pricingTable && (
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      📋 Paste Pricing Table (from suvidhatravel.com)
                    </label>
                    <p className="text-xs text-blue-700 mb-2">
                      Paste the pricing table here. Supports plain text, HTML, or JSON format.
                      <br />
                      <strong>Example:</strong> Standard | 7452 | 7047 | 6282 | 5700
                    </p>
                    <textarea
                      rows={8}
                      value={pasteText.pricingTable || ''}
                      onChange={(e) => setPasteText({ ...pasteText, pricingTable: e.target.value })}
                      placeholder="Standard | 7452 | 7047 | 6282 | 5700&#10;Deluxe | 8748 | 8343 | 7578 | 6500&#10;Deluxe Plus | 9612 | 9207 | 8442 | 7800"
                      className="w-full px-3 py-2 border border-blue-300 rounded font-mono text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSmartParse('pricingTable', 'pricing')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Parse & Import</span>
                  </button>
                </div>
              )}

              {/* Manual Entry / Parsed Data Display */}
              {!pasteMode.pricingTable && formData.pricingTable.map((row, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Row {idx + 1}</span>
                    <button type="button" onClick={() => removePricingRow(idx)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <input
                      type="text"
                      placeholder="Category"
                      value={row.category}
                      onChange={(e) => updatePricing(idx, 'category', e.target.value)}
                      className="px-3 py-2 border rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="2 Pax"
                      value={row.price2Pax}
                      onChange={(e) => updatePricing(idx, 'price2Pax', e.target.value)}
                      className="px-3 py-2 border rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="4 Pax"
                      value={row.price4Pax}
                      onChange={(e) => updatePricing(idx, 'price4Pax', e.target.value)}
                      className="px-3 py-2 border rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="6 Pax"
                      value={row.price6Pax}
                      onChange={(e) => updatePricing(idx, 'price6Pax', e.target.value)}
                      className="px-3 py-2 border rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Extra Bed"
                      value={row.extraBed}
                      onChange={(e) => updatePricing(idx, 'extraBed', e.target.value)}
                      className="px-3 py-2 border rounded text-sm"
                    />
                  </div>
                </div>
              ))}

              {!pasteMode.pricingTable && formData.pricingTable.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No pricing data yet. Use "Smart Paste" or "Add Row" to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Hotel Details Tab */}
          {activeTab === 'hotels' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Hotel Details</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => togglePasteMode('hotelDetails')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                      pasteMode.hotelDetails 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>{pasteMode.hotelDetails ? 'Manual Entry' : '📋 Smart Paste'}</span>
                  </button>
                  {!pasteMode.hotelDetails && (
                    <button
                      type="button"
                      onClick={addHotelRow}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Hotel</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Smart Paste Mode */}
              {pasteMode.hotelDetails && (
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      📋 Paste Hotel Details (from suvidhatravel.com)
                    </label>
                    <p className="text-xs text-blue-700 mb-2">
                      Paste hotel information here. Each line should contain category and hotel name.
                      <br />
                      <strong>Example:</strong> Standard | Hotel President ( Deluxe )
                    </p>
                    <textarea
                      rows={8}
                      value={pasteText.hotelDetails || ''}
                      onChange={(e) => setPasteText({ ...pasteText, hotelDetails: e.target.value })}
                      placeholder="Standard | Hotel President ( Deluxe )&#10;Deluxe | Hotel Park Paradise ( Luxury Room with Balcony )"
                      className="w-full px-3 py-2 border border-blue-300 rounded font-mono text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSmartParse('hotelDetails', 'hotels')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Parse & Import</span>
                  </button>
                </div>
              )}

              {/* Manual Entry / Parsed Data Display */}
              {!pasteMode.hotelDetails && formData.hotelDetails.map((hotel, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Hotel {idx + 1}</span>
                    <button type="button" onClick={() => removeHotelRow(idx)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Category"
                      value={hotel.category}
                      onChange={(e) => updateHotel(idx, 'category', e.target.value)}
                      className="px-3 py-2 border rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Hotel Name with (Room Type)"
                      value={hotel.hotelName}
                      onChange={(e) => updateHotel(idx, 'hotelName', e.target.value)}
                      className="px-3 py-2 border rounded text-sm"
                    />
                  </div>
                </div>
              ))}

              {!pasteMode.hotelDetails && formData.hotelDetails.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hotel data yet. Use "Smart Paste" or "Add Hotel" to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Day-wise Itinerary</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => togglePasteMode('itinerary')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                      pasteMode.itinerary 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>{pasteMode.itinerary ? 'Manual Entry' : '📋 Smart Paste'}</span>
                  </button>
                  {!pasteMode.itinerary && (
                    <button
                      type="button"
                      onClick={addItineraryDay}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Day</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Smart Paste Mode */}
              {pasteMode.itinerary && (
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      📋 Paste Day-Wise Itinerary (from suvidhatravel.com)
                    </label>
                    <p className="text-xs text-blue-700 mb-2">
                      Paste the complete itinerary here. The parser will automatically detect days.
                      <br />
                      <strong>Example:</strong> Day 01: Delhi – Manali [newline] Description text...
                    </p>
                    <textarea
                      rows={12}
                      value={pasteText.itinerary || ''}
                      onChange={(e) => setPasteText({ ...pasteText, itinerary: e.target.value })}
                      placeholder="Day 01: Delhi – Manali&#10;Evening board the Volvo from Delhi...&#10;&#10;Day 02: Manali Arrival&#10;Early morning arrival in Manali..."
                      className="w-full px-3 py-2 border border-blue-300 rounded font-mono text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSmartParse('itinerary', 'itinerary')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Parse & Import</span>
                  </button>
                </div>
              )}

              {/* Manual Entry / Parsed Data Display */}
              {!pasteMode.itinerary && formData.itinerary.map((day, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Day {day.day}</span>
                    <button type="button" onClick={() => removeItinerary(idx)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Day Title"
                    value={day.title}
                    onChange={(e) => updateItinerary(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <textarea
                    rows={3}
                    placeholder="Day Description"
                    value={day.description}
                    onChange={(e) => updateItinerary(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              ))}

              {!pasteMode.itinerary && formData.itinerary.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No itinerary yet. Use "Smart Paste" or "Add Day" to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Package Includes Tab */}
          {activeTab === 'includes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Package Includes</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => togglePasteMode('inclusions')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                      pasteMode.inclusions 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>{pasteMode.inclusions ? 'Manual Entry' : '📋 Smart Paste'}</span>
                  </button>
                  {!pasteMode.inclusions && (
                    <button
                      type="button"
                      onClick={() => addListItem('inclusions')}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Item</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Smart Paste Mode */}
              {pasteMode.inclusions && (
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      📋 Paste Package Inclusions
                    </label>
                    <p className="text-xs text-blue-700 mb-2">
                      Paste inclusion items (one per line, with or without bullet points).
                    </p>
                    <textarea
                      rows={8}
                      value={pasteText.inclusions || ''}
                      onChange={(e) => setPasteText({ ...pasteText, inclusions: e.target.value })}
                      placeholder="- 2 tickets for Delhi – Manali –Delhi Transfer by Volvo&#10;- 04 Nights & 05 Days Stay In Respective Room&#10;- Welcome Drink (Non Alcoholic) On Arrival"
                      className="w-full px-3 py-2 border border-blue-300 rounded font-mono text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSmartParse('inclusions', 'list')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Parse & Import</span>
                  </button>
                </div>
              )}

              {/* Manual Entry / Parsed Data Display */}
              {!pasteMode.inclusions && formData.inclusions.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Inclusion item"
                    value={item}
                    onChange={(e) => updateListItem('inclusions', idx, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <button type="button" onClick={() => removeListItem('inclusions', idx)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {!pasteMode.inclusions && formData.inclusions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No inclusions yet. Use "Smart Paste" or "Add Item" to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Package Excludes Tab */}
          {activeTab === 'excludes' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Package Does Not Include</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => togglePasteMode('exclusions')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                      pasteMode.exclusions 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>{pasteMode.exclusions ? 'Manual Entry' : '📋 Smart Paste'}</span>
                  </button>
                  {!pasteMode.exclusions && (
                    <button
                      type="button"
                      onClick={() => addListItem('exclusions')}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Item</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Smart Paste Mode */}
              {pasteMode.exclusions && (
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      📋 Paste Package Exclusions
                    </label>
                    <p className="text-xs text-blue-700 mb-2">
                      Paste exclusion items (one per line, with or without bullet points).
                    </p>
                    <textarea
                      rows={8}
                      value={pasteText.exclusions || ''}
                      onChange={(e) => setPasteText({ ...pasteText, exclusions: e.target.value })}
                      placeholder="- Any Kind of Personal Expenses&#10;- Lunch&#10;- Adventure activities"
                      className="w-full px-3 py-2 border border-blue-300 rounded font-mono text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSmartParse('exclusions', 'list')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Parse & Import</span>
                  </button>
                </div>
              )}

              {/* Manual Entry / Parsed Data Display */}
              {!pasteMode.exclusions && formData.exclusions.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Exclusion item"
                    value={item}
                    onChange={(e) => updateListItem('exclusions', idx, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <button type="button" onClick={() => removeListItem('exclusions', idx)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {!pasteMode.exclusions && formData.exclusions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No exclusions yet. Use "Smart Paste" or "Add Item" to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Terms & Conditions Tab */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Terms & Conditions</h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => togglePasteMode('termsConditions')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                      pasteMode.termsConditions 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>{pasteMode.termsConditions ? 'Manual Entry' : '📋 Smart Paste'}</span>
                  </button>
                  {!pasteMode.termsConditions && (
                    <button
                      type="button"
                      onClick={() => addListItem('termsConditions')}
                      className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Term</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Smart Paste Mode */}
              {pasteMode.termsConditions && (
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                      📋 Paste Terms & Conditions
                    </label>
                    <p className="text-xs text-blue-700 mb-2">
                      Paste terms (one per line, with or without bullet points).
                    </p>
                    <textarea
                      rows={6}
                      value={pasteText.termsConditions || ''}
                      onChange={(e) => setPasteText({ ...pasteText, termsConditions: e.target.value })}
                      placeholder="- Room Heater Charges Extra&#10;- In Vehicle, A/c will not work on Hills"
                      className="w-full px-3 py-2 border border-blue-300 rounded font-mono text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSmartParse('termsConditions', 'list')}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Parse & Import</span>
                  </button>
                </div>
              )}

              {/* Manual Entry / Parsed Data Display */}
              {!pasteMode.termsConditions && formData.termsConditions.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Term or condition"
                    value={item}
                    onChange={(e) => updateListItem('termsConditions', idx, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <button type="button" onClick={() => removeListItem('termsConditions', idx)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {!pasteMode.termsConditions && formData.termsConditions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No terms yet. Use "Smart Paste" or "Add Term" to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              <Save className="h-5 w-5" />
              <span>Save Package</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedPackageModal;
