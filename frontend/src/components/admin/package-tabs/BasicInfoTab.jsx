import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const BasicInfoTab = ({ formData, setFormData, destinations, onOpenGallery }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
      <input
        type="text"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        data-testid="pkg-title-input"
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
          data-testid="pkg-destination-select"
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
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Region *</label>
        <select
          value={formData.region || 'india'}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          data-testid="pkg-region-select"
        >
          <option value="india">India</option>
          <option value="international">International</option>
          <option value="both">Both</option>
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
        <span>Image URL *</span>
        <button
          type="button"
          onClick={onOpenGallery}
          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-xs"
          data-testid="pkg-browse-gallery-btn"
        >
          <ImageIcon className="h-4 w-4" />
          <span>Browse Gallery</span>
        </button>
      </label>
      <input
        type="url"
        required
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="https://example.com/image.jpg or select from gallery"
        data-testid="pkg-image-input"
      />
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
        <input
          type="text"
          placeholder="4N/5D"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
        <input
          type="text"
          value={formData.days}
          onChange={(e) => setFormData({ ...formData, days: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <input
          type="number"
          step="0.1"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
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
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Original Price *</label>
        <input
          type="number"
          required
          value={formData.originalPrice}
          onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) })}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>

    <div className="flex items-center space-x-6">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.flightsIncluded}
          onChange={(e) => setFormData({ ...formData, flightsIncluded: e.target.checked })}
          className="w-4 h-4 rounded"
        />
        <span className="ml-2 text-sm">Flights Included</span>
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.groupTour}
          onChange={(e) => setFormData({ ...formData, groupTour: e.target.checked })}
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
        onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Validity Dates</label>
      <input
        type="text"
        placeholder="Valid till 01st July 2025 – 30th March 2026"
        value={formData.validityDates}
        onChange={(e) => setFormData({ ...formData, validityDates: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Info</label>
      <input
        type="text"
        placeholder="For 2-3 Pax: Alto || For 4-6 Pax: Ertiga"
        value={formData.vehicleInfo}
        onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Info</label>
      <textarea
        rows={2}
        placeholder="Honeymoon packages, special notes..."
        value={formData.additionalInfo}
        onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
      />
    </div>
  </div>
);

export default BasicInfoTab;
