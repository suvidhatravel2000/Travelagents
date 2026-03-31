import React, { useState } from 'react';
import { Upload, Link2, Image as ImageIcon, Copy, Check, X, Search } from 'lucide-react';

const MediaGallery = ({ onSelectImage, onClose }) => {
  const [activeTab, setActiveTab] = useState('unsplash'); // unsplash or upload
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');

  // Search Unsplash images
  const searchUnsplash = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/images/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setImages(data.results || []);
    } catch (err) {
      console.error('Error searching images:', err);
      alert('Failed to search images');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (imageUrl) => {
    if (onSelectImage) {
      onSelectImage(imageUrl);
    }
    setCopiedUrl(imageUrl);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const handleUploadUrl = () => {
    if (uploadUrl.trim() && onSelectImage) {
      onSelectImage(uploadUrl);
      setUploadUrl('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Media Gallery</h2>
          <button onClick={onClose} className="hover:bg-orange-600 p-2 rounded">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab('unsplash')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'unsplash'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Free Images (Unsplash)</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'upload'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Link2 className="h-5 w-5" />
              <span>Add Image URL</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Unsplash Search Tab */}
          {activeTab === 'unsplash' && (
            <div>
              <div className="mb-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchUnsplash()}
                    placeholder="Search for travel, beach, mountains, etc..."
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={searchUnsplash}
                    disabled={loading}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Free high-quality images from Unsplash • Click to select • Royalty-free
                </p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      onClick={() => handleSelectImage(img.urls.regular)}
                    >
                      <img
                        src={img.urls.small}
                        alt={img.alt_description}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                        <button className="opacity-0 group-hover:opacity-100 bg-orange-500 text-white px-4 py-2 rounded-lg">
                          {copiedUrl === img.urls.regular ? (
                            <>
                              <Check className="h-4 w-4 inline mr-2" />
                              Selected
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-4 w-4 inline mr-2" />
                              Select Image
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-xs text-gray-600 truncate">
                          by {img.user.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Search for images to get started</p>
                  <p className="text-sm mt-2">Try: "beach", "mountains", "city", "travel"</p>
                </div>
              )}
            </div>
          )}

          {/* Upload URL Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={handleUploadUrl}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Use URL
                  </button>
                </div>
              </div>

              {uploadUrl && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={uploadUrl}
                    alt="Preview"
                    className="w-full max-h-96 object-contain rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden text-center text-red-600 py-8">
                    Failed to load image. Please check the URL.
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tips:</strong>
                  <br />
                  • Use high-quality images (min 1920x1080 for banners)
                  • Supported formats: JPG, PNG, WebP
                  • Keep file size under 2MB for faster loading
                  <br /><br />
                  <strong>Free Image Sources:</strong>
                  <br />
                  • Unsplash: <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">unsplash.com</a>
                  <br />
                  • Pexels: <a href="https://pexels.com" target="_blank" rel="noopener noreferrer" className="underline">pexels.com</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
