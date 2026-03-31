import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { cmsAPI } from '../../api/cms';
import { useToast } from '../../hooks/use-toast';

const SectionVisibilityControl = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await cmsAPI.getHomePageSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await cmsAPI.updateHomePageSettings(settings);
      toast({ title: "Success", description: "Settings updated" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const toggleSection = (section) => {
    setSettings({
      ...settings,
      visibility: {
        ...settings.visibility,
        [section]: !settings.visibility[section]
      }
    });
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  const sections = [
    { key: 'topBar', label: 'Top Bar' },
    { key: 'destinationTabs', label: 'Destination Tabs' },
    { key: 'searchBar', label: 'Search Bar' },
    { key: 'heroBanner', label: 'Hero Banner' },
    { key: 'trendingSection', label: 'Trending Section' },
    { key: 'secondaryBanner', label: 'Secondary Banner' },
    { key: 'footer', label: 'Footer' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Section Visibility</h2>
        <button onClick={handleSave} className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg">
          <Save className="h-5 w-5" />
          <span>Save</span>
        </button>
      </div>

      <div className="space-y-4">
        {sections.map(section => (
          <div key={section.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {settings.visibility[section.key] ? (
                <Eye className="h-5 w-5 text-green-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400" />
              )}
              <span className="font-medium">{section.label}</span>
            </div>
            <button
              onClick={() => toggleSection(section.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.visibility[section.key] ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.visibility[section.key] ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionVisibilityControl;
