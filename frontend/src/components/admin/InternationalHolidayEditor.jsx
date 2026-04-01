import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  Image as ImageIcon,
  Search,
  Star,
  GripVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { holidayPagesAPI, packagesAPI } from '../../api/client';

const SortableTab = ({ tab, onUpdate, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border rounded-lg p-4 mb-3">
      <div className="flex items-center space-x-3">
        <button {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </button>
        
        <input
          type="text"
          value={tab.icon}
          onChange={(e) => onUpdate(tab.id, 'icon', e.target.value)}
          placeholder="🏔️"
          className="w-16 px-2 py-1 border rounded text-center"
        />
        
        <input
          type="text"
          value={tab.name}
          onChange={(e) => onUpdate(tab.id, 'name', e.target.value)}
          placeholder="Tab Name (e.g., Himachal)"
          className="flex-1 px-3 py-2 border rounded"
        />
        
        <button
          onClick={() => onUpdate(tab.id, 'visible', !tab.visible)}
          className={`p-2 rounded ${tab.visible ? 'text-green-600' : 'text-gray-400'}`}
        >
          {tab.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
        
        <button
          onClick={() => onDelete(tab.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const InternationalHolidayEditor = () => {
  const [config, setConfig] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    banner: true,
    tabs: true,
    search: true,
    trending: true
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pageConfig, allPackages] = await Promise.all([
        holidayPagesAPI.get('international'),
        packagesAPI.getAll()
      ]);
      setConfig(pageConfig);
      setPackages(allPackages.filter(pkg => pkg.region === 'international' || pkg.region === 'both'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await holidayPagesAPI.update('international', config);
      alert('International Holiday Page configuration saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Banner handlers
  const updateBanner = (field, value) => {
    setConfig(prev => ({
      ...prev,
      banner: { ...prev.banner, [field]: value }
    }));
  };

  // Tab handlers
  const addTab = () => {
    const newTab = {
      id: `tab-${Date.now()}`,
      name: '',
      icon: '🏔️',
      visible: true,
      order: config.tabs.length
    };
    setConfig(prev => ({ ...prev, tabs: [...prev.tabs, newTab] }));
  };

  const updateTab = (tabId, field, value) => {
    setConfig(prev => ({
      ...prev,
      tabs: prev.tabs.map(tab => 
        tab.id === tabId ? { ...tab, [field]: value } : tab
      )
    }));
  };

  const deleteTab = (tabId) => {
    setConfig(prev => ({
      ...prev,
      tabs: prev.tabs.filter(tab => tab.id !== tabId)
    }));
  };

  const handleTabDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setConfig(prev => {
        const oldIndex = prev.tabs.findIndex(tab => tab.id === active.id);
        const newIndex = prev.tabs.findIndex(tab => tab.id === over.id);
        const newTabs = arrayMove(prev.tabs, oldIndex, newIndex);
        return { ...prev, tabs: newTabs.map((tab, idx) => ({ ...tab, order: idx })) };
      });
    }
  };

  // Search handlers
  const updateSearch = (field, value) => {
    setConfig(prev => ({
      ...prev,
      search: { ...prev.search, [field]: value }
    }));
  };

  // Trending handlers
  const updateTrending = (field, value) => {
    setConfig(prev => ({
      ...prev,
      trending: { ...prev.trending, [field]: value }
    }));
  };

  const togglePackageSelection = (packageId) => {
    setConfig(prev => {
      const currentIds = prev.trending.packageIds || [];
      const newIds = currentIds.includes(packageId)
        ? currentIds.filter(id => id !== packageId)
        : [...currentIds, packageId];
      return {
        ...prev,
        trending: { ...prev.trending, packageIds: newIds }
      };
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading India Holiday Page configuration...</div>;
  }

  if (!config) {
    return <div className="p-8 text-center">Failed to load configuration</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🌍 International Holiday Page</h2>
          <p className="text-sm text-gray-600 mt-1">Configure banner, tabs, search, and trending packages</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Banner Section */}
        <div className="bg-white rounded-lg border">
          <button
            onClick={() => toggleSection('banner')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <ImageIcon className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Banner Configuration</h3>
            </div>
            {expandedSections.banner ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.banner && (
            <div className="p-4 border-t space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Desktop Banner Image URL</label>
                  <input
                    type="url"
                    value={config.banner.desktopImage}
                    onChange={(e) => updateBanner('desktopImage', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Banner Image URL</label>
                  <input
                    type="url"
                    value={config.banner.mobileImage || ''}
                    onChange={(e) => updateBanner('mobileImage', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Banner Title</label>
                <input
                  type="text"
                  value={config.banner.title}
                  onChange={(e) => updateBanner('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Explore India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Banner Subtitle</label>
                <input
                  type="text"
                  value={config.banner.subtitle || ''}
                  onChange={(e) => updateBanner('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Discover amazing Indian destinations"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button Text</label>
                  <input
                    type="text"
                    value={config.banner.buttonText}
                    onChange={(e) => updateBanner('buttonText', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Button Link</label>
                  <input
                    type="text"
                    value={config.banner.buttonLink}
                    onChange={(e) => updateBanner('buttonLink', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Text Alignment</label>
                  <select
                    value={config.banner.textAlign}
                    onChange={(e) => updateBanner('textAlign', e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <input
                    type="color"
                    value={config.banner.textColor}
                    onChange={(e) => updateBanner('textColor', e.target.value)}
                    className="w-full h-10 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Overlay Opacity (0-1)</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.banner.overlayOpacity}
                    onChange={(e) => updateBanner('overlayOpacity', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Destination Tabs Section */}
        <div className="bg-white rounded-lg border">
          <button
            onClick={() => toggleSection('tabs')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">📍</span>
              <h3 className="text-lg font-semibold">Destination Tabs ({config.tabs.length})</h3>
            </div>
            {expandedSections.tabs ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.tabs && (
            <div className="p-4 border-t">
              <button
                onClick={addTab}
                className="mb-4 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
                <span>Add Tab</span>
              </button>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleTabDragEnd}>
                <SortableContext items={config.tabs.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {config.tabs.map(tab => (
                    <SortableTab
                      key={tab.id}
                      tab={tab}
                      onUpdate={updateTab}
                      onDelete={deleteTab}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {config.tabs.length === 0 && (
                <p className="text-center text-gray-500 py-8">No tabs added yet. Click "Add Tab" to get started.</p>
              )}
            </div>
          )}
        </div>

        {/* Search Configuration */}
        <div className="bg-white rounded-lg border">
          <button
            onClick={() => toggleSection('search')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <Search className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Search Bar</h3>
            </div>
            {expandedSections.search ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.search && (
            <div className="p-4 border-t space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.search.enabled}
                  onChange={(e) => updateSearch('enabled', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-medium">Enable Search Bar</span>
              </label>

              {config.search.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Placeholder Text</label>
                    <input
                      type="text"
                      value={config.search.placeholder}
                      onChange={(e) => updateSearch('placeholder', e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.search.searchDestinations}
                        onChange={(e) => updateSearch('searchDestinations', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span>Search Destinations</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.search.searchPackages}
                        onChange={(e) => updateSearch('searchPackages', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span>Search Packages</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Trending Packages Section */}
        <div className="bg-white rounded-lg border">
          <button
            onClick={() => toggleSection('trending')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Trending Packages ({config.trending.packageIds.length} selected)</h3>
            </div>
            {expandedSections.trending ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.trending && (
            <div className="p-4 border-t space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.trending.enabled}
                  onChange={(e) => updateTrending('enabled', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-medium">Show Trending Packages Section</span>
              </label>

              {config.trending.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Section Title</label>
                      <input
                        type="text"
                        value={config.trending.title}
                        onChange={(e) => updateTrending('title', e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={config.trending.subtitle || ''}
                        onChange={(e) => updateTrending('subtitle', e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Display Count</label>
                    <select
                      value={config.trending.displayCount}
                      onChange={(e) => updateTrending('displayCount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value={4}>4 Packages</option>
                      <option value={6}>6 Packages</option>
                      <option value={8}>8 Packages</option>
                      <option value={12}>12 Packages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Select Packages</label>
                    <div className="max-h-96 overflow-y-auto border rounded p-4 space-y-2">
                      {packages.map(pkg => (
                        <label key={pkg.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={config.trending.packageIds.includes(pkg.id)}
                            onChange={() => togglePackageSelection(pkg.id)}
                            className="mt-1 w-4 h-4"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{pkg.title}</p>
                            <p className="text-sm text-gray-600">{pkg.category} • {pkg.duration}</p>
                          </div>
                        </label>
                      ))}
                      {packages.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No International packages available</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternationalHolidayEditor;
