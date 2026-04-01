import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { destinationsAPI } from '../../api/client';

const SortableDestination = ({ destination, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: destination.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-4 mb-3 flex items-center space-x-4"
    >
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      {/* Icon Preview */}
      <div className="w-12 h-12 flex items-center justify-center text-2xl border rounded">
        {destination.icon}
      </div>

      {/* Name Input */}
      <input
        type="text"
        value={destination.name}
        onChange={(e) => onUpdate(destination.id, 'name', e.target.value)}
        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Destination name"
      />

      {/* Icon Input */}
      <input
        type="text"
        value={destination.icon}
        onChange={(e) => onUpdate(destination.id, 'icon', e.target.value)}
        className="w-20 px-3 py-2 border rounded font-mono text-center"
        placeholder="🏔️"
      />

      {/* Trending Toggle */}
      <button
        onClick={() => onUpdate(destination.id, 'trending', !destination.trending)}
        className={`px-3 py-2 rounded ${
          destination.trending
            ? 'bg-orange-500 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
        title="Trending"
      >
        🔥
      </button>

      {/* Visibility Toggle */}
      <button
        onClick={() => onUpdate(destination.id, 'visible', !destination.visible)}
        className="text-gray-600 hover:text-gray-800"
        title={destination.visible ? 'Visible' : 'Hidden'}
      >
        {destination.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(destination.id)}
        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded"
        title="Delete destination"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
};

const DestinationsEditor = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const data = await destinationsAPI.getAll();
      setDestinations(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setDestinations((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpdate = (id, field, value) => {
    setDestinations((prev) =>
      prev.map((dest) =>
        dest.id === id ? { ...dest, [field]: value } : dest
      )
    );
  };

  const handleDelete = async (id) => {
    const dest = destinations.find(d => d.id === id);
    if (!window.confirm(`Are you sure you want to delete "${dest.name}"?`)) {
      return;
    }

    // If it's a temp destination (not saved), just remove from state
    if (id.startsWith('temp-dest-')) {
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      return;
    }

    // Otherwise, delete from backend
    try {
      setDeleting(true);
      await destinationsAPI.delete(id);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      alert(`✅ "${dest.name}" deleted successfully!`);
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete "${dest.name}": ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddDestination = () => {
    const timestamp = Date.now();
    const newDest = {
      id: `temp-dest-${timestamp}`, // Use timestamp for unique temp ID
      name: 'New Destination',
      icon: '🌍',
      trending: false,
      visible: true,
      order: destinations.length
    };
    setDestinations((prev) => [...prev, newDest]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update order based on current positions
      const updatedDestinations = destinations.map((dest, index) => ({
        ...dest,
        order: index
      }));

      // Separate new, existing, and deleted destinations
      const newDests = updatedDestinations.filter(d => d.id.startsWith('temp-dest-'));
      const existingDests = updatedDestinations.filter(d => !d.id.startsWith('temp-dest-'));

      // Update existing destinations
      for (const dest of existingDests) {
        try {
          await destinationsAPI.update(dest.id, dest);
        } catch (err) {
          console.error(`Failed to update ${dest.name}:`, err);
        }
      }

      // Create new destinations with proper IDs
      for (const dest of newDests) {
        try {
          const { id, ...destData } = dest; // Remove temp ID
          // Generate clean ID from name
          const cleanId = destData.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Remove duplicate hyphens
          
          await destinationsAPI.create({ ...destData, id: cleanId });
        } catch (err) {
          console.error(`Failed to create ${dest.name}:`, err);
          alert(`Failed to create ${dest.name}: ${err.message}`);
        }
      }

      alert('✅ Destinations saved successfully!');
      await fetchDestinations(); // Refresh
    } catch (err) {
      console.error('Error saving destinations:', err);
      alert('Failed to save destinations: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Destination Tabs Manager</h2>
          <p className="text-sm text-gray-600 mt-1">
            Drag to reorder • Click icon/trending to toggle • Changes are visible immediately on homepage
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAddDestination}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Destination</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Saving...' : 'Save Order'}</span>
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={destinations.map(d => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {destinations.map((destination) => (
            <SortableDestination
              key={destination.id}
              destination={destination}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      {destinations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No destinations yet</p>
          <button
            onClick={handleAddDestination}
            className="text-blue-600 hover:text-blue-800"
          >
            Add your first destination
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tips:</strong>
          <br />
          • Use emojis as icons (🏔️, 🏖️, 🏙️, etc.)
          <br />
          • Toggle 🔥 for trending destinations
          <br />
          • Eye icon controls visibility
          <br />
          • Drag and drop to reorder tabs
        </p>
      </div>
    </div>
  );
};

export default DestinationsEditor;
