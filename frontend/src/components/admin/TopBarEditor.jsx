import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { cmsAPI } from '../../api/cms';
import { useToast } from '../../hooks/use-toast';

const TopBarEditor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [topbar, setTopbar] = useState({
    text: '',
    backgroundColor: '#ea580c',
    textColor: '#ffffff',
    fontSize: '14px',
    visible: true
  });

  useEffect(() => {
    fetchTopBar();
  }, []);

  const fetchTopBar = async () => {
    try {
      const data = await cmsAPI.getTopBar();
      setTopbar(data);
    } catch (err) {
      console.error('Error fetching top bar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await cmsAPI.updateTopBar(topbar);
      toast({
        title: "Success",
        description: "Top bar updated successfully"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update top bar",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Top Bar Settings</h2>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="h-5 w-5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Live Preview</label>
          {topbar.visible && (
            <div 
              className="rounded-lg text-center py-2 px-4"
              style={{
                backgroundColor: topbar.backgroundColor,
                color: topbar.textColor,
                fontSize: topbar.fontSize
              }}
            >
              {topbar.text}
            </div>
          )}
          {!topbar.visible && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg text-center py-2 px-4 text-gray-400">
              Top bar is hidden
            </div>
          )}
        </div>

        {/* Text Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Top Bar Text</label>
          <textarea
            value={topbar.text}
            onChange={(e) => setTopbar({...topbar, text: e.target.value})}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Contact No: +91 XXXXX | Email: info@example.com"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={topbar.backgroundColor}
                onChange={(e) => setTopbar({...topbar, backgroundColor: e.target.value})}
                className="h-10 w-20 rounded border border-gray-300"
              />
              <input
                type="text"
                value={topbar.backgroundColor}
                onChange={(e) => setTopbar({...topbar, backgroundColor: e.target.value})}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={topbar.textColor}
                onChange={(e) => setTopbar({...topbar, textColor: e.target.value})}
                className="h-10 w-20 rounded border border-gray-300"
              />
              <input
                type="text"
                value={topbar.textColor}
                onChange={(e) => setTopbar({...topbar, textColor: e.target.value})}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
          <select
            value={topbar.fontSize}
            onChange={(e) => setTopbar({...topbar, fontSize: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="12px">Small (12px)</option>
            <option value="14px">Medium (14px)</option>
            <option value="16px">Large (16px)</option>
            <option value="18px">Extra Large (18px)</option>
          </select>
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {topbar.visible ? (
              <Eye className="h-5 w-5 text-green-600" />
            ) : (
              <EyeOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium text-gray-900">Show Top Bar</p>
              <p className="text-sm text-gray-500">Display the top bar on the website</p>
            </div>
          </div>
          <button
            onClick={() => setTopbar({...topbar, visible: !topbar.visible})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              topbar.visible ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                topbar.visible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBarEditor;
