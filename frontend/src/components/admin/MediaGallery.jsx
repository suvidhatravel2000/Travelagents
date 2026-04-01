import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Check } from 'lucide-react';

const MediaGallery = ({ onSelect, onClose }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/media/list`);
      const data = await response.json();
      setImages(data.items || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch(`${BACKEND_URL}/api/media/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        await loadImages();
        alert(`${data.items.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId, filename) => {
    if (!confirm(`Delete ${filename}?`)) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/media/${imageId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await loadImages();
        alert('Image deleted');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Delete failed');
    }
  };

  const handleSelect = (image) => {
    setSelectedImage(image.url);
    if (onSelect) {
      onSelect(image.url);
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold">📸 Media Gallery</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Upload Section */}
        <div className="p-4 border-b bg-gray-50">
          <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer">
            <Upload className="h-5 w-5" />
            <span>{uploading ? 'Uploading...' : 'Upload Images (JPG, PNG, WEBP)'}</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Upload className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No images uploaded yet. Upload your first image!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Error';
                      }}
                    />
                  </div>

                  {/* Overlay with Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    {/* Select Button */}
                    <button
                      onClick={() => handleSelect(image)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
                    >
                      <Check className="h-4 w-4" />
                      <span>Select</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(image.id, image.filename)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Filename */}
                  <div className="p-2 bg-white text-xs text-gray-600 truncate">
                    {image.filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-sm text-gray-600">
          <p>Total Images: <strong>{images.length}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
