import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save, Star, TrendingUp } from 'lucide-react';
import { packagesAPI } from '../../api/client';

const SortablePackage = ({ pkg }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: pkg.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-4 mb-3 flex items-center space-x-4 hover:shadow-md transition-shadow"
    >
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-6 w-6 text-gray-400" />
      </div>

      {/* Package Image */}
      <img
        src={pkg.image}
        alt={pkg.title}
        className="w-20 h-20 object-cover rounded"
      />

      {/* Package Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{pkg.title}</h3>
        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{pkg.rating || 'N/A'}</span>
          </span>
          <span>{pkg.duration}</span>
          <span className="font-semibold text-orange-600">₹{pkg.price.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Trending Badge */}
      <div className="flex items-center space-x-2 text-orange-600">
        <TrendingUp className="h-5 w-5" />
        <span className="text-sm font-medium">Trending</span>
      </div>
    </div>
  );
};

const TrendingPackagesEditor = () => {
  const [allPackages, setAllPackages] = useState([]);
  const [trendingPackages, setTrendingPackages] = useState([]);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await packagesAPI.getAll();
      setAllPackages(data);
      
      // Get packages marked as trending
      const trending = data.filter(pkg => pkg.isTrending).sort((a, b) => (a.trendingOrder || 0) - (b.trendingOrder || 0));
      const available = data.filter(pkg => !pkg.isTrending);
      
      setTrendingPackages(trending);
      setAvailablePackages(available);
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTrendingPackages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddToTrending = (pkg) => {
    setTrendingPackages((prev) => [...prev, pkg]);
    setAvailablePackages((prev) => prev.filter(p => p.id !== pkg.id));
  };

  const handleRemoveFromTrending = (pkg) => {
    setAvailablePackages((prev) => [...prev, pkg]);
    setTrendingPackages((prev) => prev.filter(p => p.id !== pkg.id));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update all packages - mark trending and set order
      const allUpdates = allPackages.map(async (pkg) => {
        const isTrending = trendingPackages.some(tp => tp.id === pkg.id);
        const trendingOrder = isTrending 
          ? trendingPackages.findIndex(tp => tp.id === pkg.id) 
          : null;

        try {
          await packagesAPI.update(pkg.id, {
            ...pkg,
            isTrending,
            trendingOrder
          });
        } catch (err) {
          console.error(`Failed to update package ${pkg.id}:`, err);
          throw err;
        }
      });

      await Promise.all(allUpdates);
      alert('✅ Trending packages order saved!');
      await fetchPackages(); // Refresh
    } catch (err) {
      console.error('Error saving trending packages:', err);
      alert('Failed to save trending packages: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-gray-50 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trending Destinations Manager</h2>
          <p className="text-sm text-gray-600 mt-1">
            Drag to manually sort trending packages • Add/remove packages from trending section
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          <span>{saving ? 'Saving...' : 'Save Order'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Trending Packages (Sortable) */}
        <div className="bg-white rounded-lg p-5">
          <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <span>Trending Packages ({trendingPackages.length})</span>
          </h3>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={trendingPackages.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="max-h-[600px] overflow-y-auto pr-2">
                {trendingPackages.map((pkg) => (
                  <div key={pkg.id} className="relative group">
                    <SortablePackage pkg={pkg} />
                    <button
                      onClick={() => handleRemoveFromTrending(pkg)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {trendingPackages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No trending packages yet</p>
              <p className="text-sm mt-2">Add packages from the right panel</p>
            </div>
          )}
        </div>

        {/* Available Packages */}
        <div className="bg-white rounded-lg p-5">
          <h3 className="font-semibold text-lg mb-4">
            Available Packages ({availablePackages.length})
          </h3>
          
          <div className="max-h-[600px] overflow-y-auto pr-2">
            {availablePackages.map((pkg) => (
              <div key={pkg.id} className="relative group mb-3">
                <div className="bg-gray-50 border rounded-lg p-4 flex items-center space-x-4">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{pkg.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{pkg.duration} • ₹{pkg.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToTrending(pkg)}
                  className="absolute top-2 right-2 bg-orange-600 text-white px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Add to Trending
                </button>
              </div>
            ))}
          </div>

          {availablePackages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>All packages are trending!</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 How it works:</strong>
          <br />
          • Left panel shows packages that appear in "Trending Destinations" section
          <br />
          • Drag & drop in left panel to change display order
          <br />
          • Click "Add to Trending" on right panel to feature a package
          <br />
          • Click "Remove" on left panel to remove from trending
          <br />
          • Changes are saved when you click "Save Order"
        </p>
      </div>
    </div>
  );
};

export default TrendingPackagesEditor;
