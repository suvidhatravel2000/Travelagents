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
import { GripVertical, Plus, Trash2, Save, Eye, EyeOff, Monitor, Smartphone, Image as ImageIcon, Plane, X } from 'lucide-react';
import { bannersAPI } from '../../api/client';
import MediaGallery from './MediaGallery';

const SortableBanner = ({ banner, onUpdate, onDelete }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null); // 'desktop' or 'mobile'

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border rounded-lg p-5 mb-4"
    >
      <div className="flex items-start space-x-4">
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing pt-2">
          <GripVertical className="h-6 w-6 text-gray-400" />
        </div>

        <div className="flex-1 space-y-4">
          {/* Title & Description */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={banner.title || ''}
                onChange={(e) => onUpdate(banner.id, 'title', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Banner title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={banner.subtitle || ''}
                onChange={(e) => onUpdate(banner.id, 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Subtitle"
              />
            </div>
          </div>

          {/* Desktop Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>Desktop Image URL</span>
                <span className="text-xs text-gray-500">(Recommended: 1920x1080px or 16:9 ratio)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMediaTarget('desktop');
                  setShowMediaGallery(true);
                }}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-xs"
              >
                <ImageIcon className="h-4 w-4" />
                <span>Browse Gallery</span>
              </button>
            </label>
            <input
              type="text"
              value={banner.imageDesktop || banner.image || ''}
              onChange={(e) => onUpdate(banner.id, 'imageDesktop', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="https://example.com/banner-desktop.jpg"
            />
          </div>

          {/* Mobile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>Mobile Image URL (Optional)</span>
                <span className="text-xs text-gray-500">(Recommended: 1080x1920px or 9:16 ratio)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMediaTarget('mobile');
                  setShowMediaGallery(true);
                }}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-xs"
              >
                <ImageIcon className="h-4 w-4" />
                <span>Browse Gallery</span>
              </button>
            </label>
            <input
              type="text"
              value={banner.imageMobile || ''}
              onChange={(e) => onUpdate(banner.id, 'imageMobile', e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="https://example.com/banner-mobile.jpg (optional - desktop used if empty)"
            />
          </div>

          {/* Media Gallery Modal */}
          {showMediaGallery && (
            <MediaGallery
              onSelect={(imageUrl) => {
                if (mediaTarget === 'desktop') {
                  onUpdate(banner.id, 'imageDesktop', imageUrl);
                } else {
                  onUpdate(banner.id, 'imageMobile', imageUrl);
                }
                setShowMediaGallery(false);
              }}
              onClose={() => setShowMediaGallery(false)}
            />
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={banner.description || ''}
              onChange={(e) => onUpdate(banner.id, 'description', e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Short description text"
              data-testid="banner-description-input"
            />
          </div>

          {/* Price, Original Price, Duration */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price (₹)</label>
              <input
                type="number"
                value={banner.price || ''}
                onChange={(e) => onUpdate(banner.id, 'price', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. 17999"
                data-testid="banner-price-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
              <input
                type="number"
                value={banner.originalPrice || ''}
                onChange={(e) => onUpdate(banner.id, 'originalPrice', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. 25999"
                data-testid="banner-original-price-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={banner.duration || ''}
                onChange={(e) => onUpdate(banner.id, 'duration', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. 5N/6D"
                data-testid="banner-duration-input"
              />
            </div>
          </div>

          {/* Features (e.g. Flights Included) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center space-x-1">
                <Plane className="h-4 w-4" />
                <span>Features / Tags</span>
                <span className="text-xs text-gray-400">(shown as badges on banner)</span>
              </div>
            </label>
            <div className="space-y-2">
              {(banner.features || []).map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...(banner.features || [])];
                      newFeatures[idx] = e.target.value;
                      onUpdate(banner.id, 'features', newFeatures);
                    }}
                    className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Flights Included"
                    data-testid={`banner-feature-${idx}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = (banner.features || []).filter((_, i) => i !== idx);
                      onUpdate(banner.id, 'features', newFeatures);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                    data-testid={`banner-feature-remove-${idx}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newFeatures = [...(banner.features || []), ''];
                  onUpdate(banner.id, 'features', newFeatures);
                }}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                data-testid="banner-add-feature-btn"
              >
                <Plus className="h-4 w-4" />
                <span>Add Feature</span>
              </button>
            </div>
          </div>

          {/* Advanced Styling Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showAdvanced ? '▼ Hide' : '▶ Show'} Advanced Styling
          </button>

          {/* Advanced Styling Controls */}
          {showAdvanced && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              {/* Font Size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title Font Size</label>
                <select
                  value={banner.titleFontSize || 'text-4xl'}
                  onChange={(e) => onUpdate(banner.id, 'titleFontSize', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="text-2xl">Small (2xl)</option>
                  <option value="text-3xl">Medium (3xl)</option>
                  <option value="text-4xl">Large (4xl)</option>
                  <option value="text-5xl">XL (5xl)</option>
                  <option value="text-6xl">2XL (6xl)</option>
                </select>
              </div>

              {/* Font Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title Color</label>
                <select
                  value={banner.titleColor || 'text-white'}
                  onChange={(e) => onUpdate(banner.id, 'titleColor', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="text-white">White</option>
                  <option value="text-black">Black</option>
                  <option value="text-yellow-400">Yellow</option>
                  <option value="text-orange-500">Orange</option>
                  <option value="text-blue-600">Blue</option>
                </select>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Text Alignment</label>
                <select
                  value={banner.textAlign || 'text-left'}
                  onChange={(e) => onUpdate(banner.id, 'textAlign', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="text-left">Left</option>
                  <option value="text-center">Center</option>
                  <option value="text-right">Right</option>
                </select>
              </div>

              {/* Subtitle Font Size */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle Font Size</label>
                <select
                  value={banner.subtitleFontSize || 'text-lg'}
                  onChange={(e) => onUpdate(banner.id, 'subtitleFontSize', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="text-sm">Small</option>
                  <option value="text-base">Base</option>
                  <option value="text-lg">Large</option>
                  <option value="text-xl">XL</option>
                </select>
              </div>

              {/* Subtitle Color */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle Color</label>
                <select
                  value={banner.subtitleColor || 'text-gray-200'}
                  onChange={(e) => onUpdate(banner.id, 'subtitleColor', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="text-white">White</option>
                  <option value="text-gray-200">Light Gray</option>
                  <option value="text-gray-800">Dark Gray</option>
                  <option value="text-yellow-300">Yellow</option>
                </select>
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={banner.buttonText || 'BOOK NOW'}
                  onChange={(e) => onUpdate(banner.id, 'buttonText', e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="BOOK NOW"
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onUpdate(banner.id, 'visible', !banner.visible)}
            className="text-gray-600 hover:text-gray-800"
            title={banner.visible ? 'Visible' : 'Hidden'}
          >
            {banner.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
          <button
            onClick={() => onDelete(banner.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const BannersEditor = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await bannersAPI.getAll();
      setBanners(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      console.error('Error fetching banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setBanners((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpdate = (id, field, value) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id ? { ...banner, [field]: value } : banner
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this banner?')) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleAddBanner = () => {
    const newBanner = {
      id: `banner-${Date.now()}`,
      title: 'New Banner',
      subtitle: 'Subtitle text',
      imageDesktop: '',
      imageMobile: '',
      visible: true,
      order: banners.length,
      titleFontSize: 'text-4xl',
      titleColor: 'text-white',
      subtitleFontSize: 'text-lg',
      subtitleColor: 'text-gray-200',
      textAlign: 'text-left',
      buttonText: 'BOOK NOW'
    };
    setBanners((prev) => [...prev, newBanner]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedBanners = banners.map((banner, index) => ({
        ...banner,
        order: index,
        image: banner.imageDesktop || banner.image, // Backward compatibility
        destination: banner.destination || 'general', // Required field
        ctaText: banner.buttonText || banner.ctaText || 'BOOK NOW'
      }));

      // Separate new and existing banners
      const newBanners = updatedBanners.filter(b => b.id.startsWith('banner-'));
      const existingBanners = updatedBanners.filter(b => !b.id.startsWith('banner-'));

      // Update existing banners
      for (const banner of existingBanners) {
        await bannersAPI.update(banner.id, banner);
      }

      // Create new banners
      for (const banner of newBanners) {
        const { id, ...bannerData } = banner; // Remove temp ID
        await bannersAPI.create(bannerData);
      }

      alert('✅ Banners saved!');
      fetchBanners();
    } catch (err) {
      console.error('Error saving banners:', err);
      alert('Failed to save banners: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="bg-gray-50 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Banners Editor</h2>
          <p className="text-sm text-gray-600 mt-1">
            Drag to reorder • Supports desktop + mobile images • Advanced styling controls
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAddBanner}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Banner</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Saving...' : 'Save All'}</span>
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={banners.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {banners.map((banner) => (
            <SortableBanner
              key={banner.id}
              banner={banner}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      {banners.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 mb-4">No banners yet</p>
          <button
            onClick={handleAddBanner}
            className="text-blue-600 hover:text-blue-800"
          >
            Create your first banner
          </button>
        </div>
      )}
    </div>
  );
};

export default BannersEditor;
