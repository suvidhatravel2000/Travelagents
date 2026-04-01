import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { smartParse } from '../../utils/packageParser';
import { parseBulkPackageData, generatePreview } from '../../utils/bulkPackageParser';
import MediaGallery from './MediaGallery';
import SeoScoreWidget from './SeoScoreWidget';
import BulkImportTab from './package-tabs/BulkImportTab';
import BasicInfoTab from './package-tabs/BasicInfoTab';
import PricingTab from './package-tabs/PricingTab';
import HotelsTab from './package-tabs/HotelsTab';
import ItineraryTab from './package-tabs/ItineraryTab';
import ListEditorTab from './package-tabs/ListEditorTab';

const DEFAULT_FORM = {
  title: '', destination: '', category: '', region: 'india',
  image: '', rating: 0, duration: '', days: '',
  price: 0, originalPrice: 0, savings: 0,
  flightsIncluded: false, groupTour: false,
  overview: '', validityDates: '', vehicleInfo: '', additionalInfo: '',
  pricingTable: [], hotelDetails: [], itinerary: [],
  inclusions: [], exclusions: [], termsConditions: [],
  seo_title: '', seo_description: '', focus_keyword: ''
};

const EnhancedPackageModal = ({ package: pkg, destinations, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('bulk');
  const [pasteMode, setPasteMode] = useState({});
  const [pasteText, setPasteText] = useState({});
  const [bulkText, setBulkText] = useState('');
  const [bulkPreview, setBulkPreview] = useState('');
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [formData, setFormData] = useState(pkg || { ...DEFAULT_FORM });

  const contentText = [
    formData.title, formData.overview, formData.additionalInfo,
    ...(formData.inclusions || []), ...(formData.exclusions || []),
    ...(formData.itinerary || []).map(d => `${d.title} ${d.description}`)
  ].join(' ');

  // ─── Submit ───
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, savings: formData.originalPrice - formData.price });
  };

  // ─── Itinerary ───
  const addItineraryDay = () => {
    setFormData(f => ({ ...f, itinerary: [...f.itinerary, { day: f.itinerary.length + 1, title: '', description: '' }] }));
  };
  const updateItinerary = (i, field, val) => {
    const arr = [...formData.itinerary]; arr[i][field] = val;
    setFormData({ ...formData, itinerary: arr });
  };
  const removeItinerary = (i) => setFormData({ ...formData, itinerary: formData.itinerary.filter((_, j) => j !== i) });

  // ─── List (inclusions/exclusions/terms) ───
  const addListItem = (name) => setFormData({ ...formData, [name]: [...formData[name], ''] });
  const updateListItem = (name, i, val) => {
    const arr = [...formData[name]]; arr[i] = val;
    setFormData({ ...formData, [name]: arr });
  };
  const removeListItem = (name, i) => setFormData({ ...formData, [name]: formData[name].filter((_, j) => j !== i) });

  // ─── Pricing ───
  const addPricingRow = () => setFormData(f => ({ ...f, pricingTable: [...f.pricingTable, { category: '', columns: {} }] }));
  const updatePricing = (i, field, val) => {
    const arr = [...formData.pricingTable];
    if (field === 'category') arr[i].category = val;
    else if (field.startsWith('column_')) { if (!arr[i].columns) arr[i].columns = {}; arr[i].columns[field.replace('column_', '')] = val; }
    else arr[i][field] = parseInt(val) || 0;
    setFormData({ ...formData, pricingTable: arr });
  };
  const removePricingRow = (i) => setFormData({ ...formData, pricingTable: formData.pricingTable.filter((_, j) => j !== i) });
  const addPricingColumn = (i) => {
    const name = prompt('Enter column name (e.g., "2 Pax", "Extra Bed"):');
    if (!name?.trim()) return;
    const arr = [...formData.pricingTable]; if (!arr[i].columns) arr[i].columns = {};
    arr[i].columns[name.trim()] = '';
    setFormData({ ...formData, pricingTable: arr });
  };
  const removePricingColumn = (i, col) => {
    const arr = [...formData.pricingTable]; if (arr[i].columns) delete arr[i].columns[col];
    setFormData({ ...formData, pricingTable: arr });
  };

  // ─── Hotels ───
  const addHotelRow = () => setFormData(f => ({ ...f, hotelDetails: [...f.hotelDetails, { category: '', locations: {} }] }));
  const updateHotel = (i, field, val) => {
    const arr = [...formData.hotelDetails];
    if (field === 'category') arr[i].category = val;
    else if (field.startsWith('location_')) { if (!arr[i].locations) arr[i].locations = {}; arr[i].locations[field.replace('location_', '')] = val; }
    else arr[i][field] = val;
    setFormData({ ...formData, hotelDetails: arr });
  };
  const removeHotelRow = (i) => setFormData({ ...formData, hotelDetails: formData.hotelDetails.filter((_, j) => j !== i) });
  const addLocationColumn = (i) => {
    const name = prompt('Enter location name (e.g., Nainital, Jim Corbett):');
    if (!name?.trim()) return;
    const arr = [...formData.hotelDetails]; if (!arr[i].locations) arr[i].locations = {};
    arr[i].locations[name.trim()] = '';
    setFormData({ ...formData, hotelDetails: arr });
  };
  const removeLocationColumn = (i, loc) => {
    const arr = [...formData.hotelDetails]; if (arr[i].locations) delete arr[i].locations[loc];
    setFormData({ ...formData, hotelDetails: arr });
  };

  // ─── Bulk Import ───
  const handleBulkParse = () => {
    if (!bulkText?.trim()) { alert('Please paste content first!'); return; }
    try {
      const parsed = parseBulkPackageData(bulkText);
      if (!parsed || Object.keys(parsed).length === 0) { alert('Could not parse. Ensure you copied the complete page.'); return; }
      setBulkPreview(generatePreview(parsed));
      alert('Content parsed! Review preview and click "Import All Data".');
    } catch { alert('Failed to parse. Please check format.'); }
  };
  const handleBulkImport = () => {
    if (!bulkText?.trim()) { alert('Please paste and parse first!'); return; }
    try {
      setFormData({ ...formData, ...parseBulkPackageData(bulkText) });
      setActiveTab('basic'); setBulkText(''); setBulkPreview('');
      alert('All data imported! Review each tab.');
    } catch { alert('Failed to import.'); }
  };

  // ─── Smart Paste ───
  const togglePasteMode = (section) => {
    setPasteMode(p => ({ ...p, [section]: !p[section] }));
    if (!pasteMode[section]) setPasteText(t => ({ ...t, [section]: '' }));
  };
  const updatePasteText = (section, val) => setPasteText(t => ({ ...t, [section]: val }));
  const handleSmartParse = (section, type) => {
    const text = pasteText[section];
    if (!text?.trim()) { alert('Please paste content first!'); return; }
    try {
      const parsed = smartParse(text, type);
      if (parsed.length === 0) { alert('Could not parse. Check format.'); return; }
      setFormData({ ...formData, [section]: parsed });
      setPasteMode(p => ({ ...p, [section]: false }));
      setPasteText(t => ({ ...t, [section]: '' }));
      alert(`Parsed ${parsed.length} items!`);
    } catch { alert('Failed to parse.'); }
  };

  const TABS = ['bulk', 'basic', 'pricing', 'hotels', 'itinerary', 'includes', 'excludes', 'terms', 'seo'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header + Tabs */}
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{pkg ? 'Edit Package' : 'Add New Package'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === tab
                    ? tab === 'bulk' ? 'bg-purple-600 text-white' : tab === 'seo' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid={`pkg-tab-${tab}`}
              >
                {tab === 'bulk' ? 'Bulk Import' : tab === 'seo' ? 'SEO' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'bulk' && (
            <BulkImportTab bulkText={bulkText} setBulkText={setBulkText} bulkPreview={bulkPreview} onParse={handleBulkParse} onImport={handleBulkImport} />
          )}

          {activeTab === 'basic' && (
            <BasicInfoTab formData={formData} setFormData={setFormData} destinations={destinations} onOpenGallery={() => setShowMediaGallery(true)} />
          )}

          {activeTab === 'pricing' && (
            <PricingTab
              formData={formData} pasteMode={pasteMode.pricingTable} pasteText={pasteText.pricingTable}
              onTogglePaste={togglePasteMode} onUpdatePasteText={updatePasteText} onSmartParse={handleSmartParse}
              onAddRow={addPricingRow} onUpdateRow={updatePricing} onRemoveRow={removePricingRow}
              onAddColumn={addPricingColumn} onRemoveColumn={removePricingColumn}
            />
          )}

          {activeTab === 'hotels' && (
            <HotelsTab
              formData={formData} pasteMode={pasteMode.hotelDetails} pasteText={pasteText.hotelDetails}
              onTogglePaste={togglePasteMode} onUpdatePasteText={updatePasteText} onSmartParse={handleSmartParse}
              onAddRow={addHotelRow} onUpdateRow={updateHotel} onRemoveRow={removeHotelRow}
              onAddLocation={addLocationColumn} onRemoveLocation={removeLocationColumn}
            />
          )}

          {activeTab === 'itinerary' && (
            <ItineraryTab
              formData={formData} pasteMode={pasteMode.itinerary} pasteText={pasteText.itinerary}
              onTogglePaste={togglePasteMode} onUpdatePasteText={updatePasteText} onSmartParse={handleSmartParse}
              onAddDay={addItineraryDay} onUpdateDay={updateItinerary} onRemoveDay={removeItinerary}
            />
          )}

          {activeTab === 'includes' && (
            <ListEditorTab
              title="Package Includes" listName="inclusions" placeholder="Inclusion item" items={formData.inclusions}
              pasteMode={pasteMode.inclusions} pasteText={pasteText.inclusions}
              pastePlaceholder={"- 2 tickets for Delhi – Manali transfer\n- 04 Nights Stay\n- Welcome Drink"}
              onTogglePaste={togglePasteMode} onUpdatePasteText={updatePasteText} onSmartParse={handleSmartParse}
              onAddItem={addListItem} onUpdateItem={updateListItem} onRemoveItem={removeListItem}
            />
          )}

          {activeTab === 'excludes' && (
            <ListEditorTab
              title="Package Does Not Include" listName="exclusions" placeholder="Exclusion item" items={formData.exclusions}
              pasteMode={pasteMode.exclusions} pasteText={pasteText.exclusions}
              pastePlaceholder={"- Personal Expenses\n- Lunch\n- Adventure activities"}
              onTogglePaste={togglePasteMode} onUpdatePasteText={updatePasteText} onSmartParse={handleSmartParse}
              onAddItem={addListItem} onUpdateItem={updateListItem} onRemoveItem={removeListItem}
            />
          )}

          {activeTab === 'terms' && (
            <ListEditorTab
              title="Terms & Conditions" listName="termsConditions" placeholder="Term or condition" items={formData.termsConditions}
              pasteMode={pasteMode.termsConditions} pasteText={pasteText.termsConditions}
              pastePlaceholder={"- Room Heater Charges Extra\n- A/c will not work on Hills"}
              onTogglePaste={togglePasteMode} onUpdatePasteText={updatePasteText} onSmartParse={handleSmartParse}
              onAddItem={addListItem} onUpdateItem={updateListItem} onRemoveItem={removeListItem}
            />
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4" data-testid="package-seo-tab">
              <h3 className="font-semibold text-lg">Search Engine Optimization</h3>
              <p className="text-sm text-gray-500">Optimize this package for search engines.</p>
              <SeoScoreWidget
                seoTitle={formData.seo_title} seoDescription={formData.seo_description}
                focusKeyword={formData.focus_keyword} contentText={contentText}
                onChange={(field, value) => setFormData({ ...formData, [field]: value })}
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            {showMediaGallery && (
              <MediaGallery
                onSelect={(url) => { setFormData({ ...formData, image: url }); setShowMediaGallery(false); }}
                onClose={() => setShowMediaGallery(false)}
              />
            )}
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
              <Save className="h-5 w-5" /><span>Save Package</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedPackageModal;
