import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { cmsAPI } from '../../api/cms';
import { useToast } from '../../hooks/use-toast';

const FooterEditor = () => {
  const { toast } = useToast();
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const data = await cmsAPI.getFooter();
      setFooter(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await cmsAPI.updateFooter(footer);
      toast({ title: "Success", description: "Footer updated successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const updateColumn = (index, field, value) => {
    const newColumns = [...footer.columns];
    newColumns[index].content[field] = value;
    setFooter({...footer, columns: newColumns});
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Footer Editor</h2>
        <button onClick={handleSave} className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg">
          <Save className="h-5 w-5" />
          <span>Save</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {footer.columns.map((column, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">{column.title}</h3>
            {column.type === 'about' && (
              <textarea
                value={column.content.text || ''}
                onChange={(e) => updateColumn(idx, 'text', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            {column.type === 'contact' && (
              <div className="space-y-2">
                <input
                  value={column.content.phones?.[0] || ''}
                  onChange={(e) => updateColumn(idx, 'phones', [e.target.value])}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  value={column.content.emails?.[0] || ''}
                  onChange={(e) => updateColumn(idx, 'emails', [e.target.value])}
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Copyright Text</label>
        <input
          value={footer.copyrightText}
          onChange={(e) => setFooter({...footer, copyrightText: e.target.value})}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
};

export default FooterEditor;
