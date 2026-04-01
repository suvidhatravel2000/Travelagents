import React, { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  FolderPlus,
  Search,
  Copy,
  Trash2,
  Edit2,
  X,
  Check,
  Image as ImageIcon,
  Folder,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const MediaGallery = ({ onSelectImage, onClose }) => {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Modals
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Form states
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [editImageName, setEditImageName] = useState('');
  
  const [copiedUrl, setCopiedUrl] = useState('');
  const [error, setError] = useState('');

  // Fetch folders
  const fetchFolders = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/media/folders/list`);
      const data = await response.json();
      setFolders(data);
    } catch (err) {
      console.error('Error fetching folders:', err);
      setError('Failed to load folders');
    }
  }, []);

  // Fetch images
  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedFolder !== 'all') params.append('folder', selectedFolder);
      if (searchQuery) params.append('search', searchQuery);
      params.append('sort', 'latest');
      params.append('limit', '100');

      const response = await fetch(`${API_URL}/api/media/?${params}`);
      const data = await response.json();
      setImages(data);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  }, [selectedFolder, searchQuery]);

  useEffect(() => {
    fetchFolders();
    fetchImages();
  }, [fetchFolders, fetchImages]);

  // Handle file upload
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      const targetFolder = selectedFolder === 'all' ? 'uncategorized' : selectedFolder;
      
      if (files.length === 1) {
        formData.append('file', files[0]);
        formData.append('folder', targetFolder);
        
        const response = await fetch(`${API_URL}/api/media/upload`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error('Upload failed');
      } else {
        // Bulk upload
        Array.from(files).forEach(file => formData.append('files', file));
        formData.append('folder', targetFolder);
        
        const response = await fetch(`${API_URL}/api/media/upload-bulk`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error('Bulk upload failed');
      }
      
      // Refresh data
      await fetchImages();
      await fetchFolders();
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please check file format (JPG, PNG, WebP only)');
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/api/media/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName,
          description: newFolderDesc,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create folder');
      
      setNewFolderName('');
      setNewFolderDesc('');
      setShowCreateFolder(false);
      await fetchFolders();
    } catch (err) {
      console.error('Create folder error:', err);
      setError('Failed to create folder. Name might already exist.');
    }
  };

  // Update image name
  const handleUpdateName = async () => {
    if (!selectedImage || !editImageName.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/api/media/${selectedImage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalName: editImageName }),
      });
      
      if (!response.ok) throw new Error('Failed to update name');
      
      setShowEditName(false);
      setSelectedImage(null);
      await fetchImages();
    } catch (err) {
      console.error('Update name error:', err);
      setError('Failed to update image name');
    }
  };

  // Delete image
  const handleDeleteImage = async () => {
    if (!selectedImage) return;
    
    try {
      const response = await fetch(`${API_URL}/api/media/${selectedImage.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete image');
      
      setShowDeleteConfirm(false);
      setSelectedImage(null);
      await fetchImages();
      await fetchFolders();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete image');
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = (url) => {
    const fullUrl = getImageUrl(url);
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  // Select image
  const handleSelectImage = (image) => {
    const fullUrl = image.url.startsWith('http') ? image.url : `${API_URL}${image.url}`;
    if (onSelectImage) {
      onSelectImage(fullUrl);
      onClose(); // Close modal after selection
    }
  };

  // Get full image URL
  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_URL}${url}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <ImageIcon className="h-6 w-6" />
              <span>Media Gallery</span>
            </h2>
            <p className="text-orange-100 text-sm mt-1">
              {images.length} images • {folders.length + 1} folders
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-orange-700 p-2 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-800">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Folders */}
          <div className="w-64 bg-gray-50 border-r overflow-y-auto p-4">
            <div className="mb-4">
              <button
                onClick={() => setShowCreateFolder(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FolderPlus className="h-4 w-4" />
                <span>New Folder</span>
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedFolder === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="font-medium">All Images</span>
                </div>
                <span className="text-xs">{images.length}</span>
              </button>

              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedFolder === folder.id
                      ? 'bg-orange-500 text-white'
                      : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4" />
                    <span className="text-sm truncate">{folder.name}</span>
                  </div>
                  <span className="text-xs">{folder.imageCount || 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar & Upload */}
            <div className="p-4 bg-white border-b">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search images by name or tags..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button
                  onClick={fetchImages}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <label className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Upload Zone (Drag & Drop) */}
            {uploading && (
              <div className="mx-4 mt-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg text-center">
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-pulse" />
                <p className="text-blue-700 font-medium">Uploading...</p>
              </div>
            )}

            {!uploading && images.length === 0 && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mx-4 mt-4 p-12 border-2 border-dashed rounded-lg text-center transition-colors ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-400'
                }`}
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  {isDragging ? 'Drop files here' : 'Drag & drop images here'}
                </p>
                <p className="text-sm text-gray-500">or click Upload button</p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports JPG, PNG, WebP • Max 10MB per file
                </p>
              </div>
            )}

            {/* Images Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <RefreshCw className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading images...</p>
                  </div>
                </div>
              ) : images.length > 0 ? (
                <div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Image Preview - Clickable */}
                      <div
                        className="aspect-square bg-gray-100 overflow-hidden cursor-pointer"
                        onClick={() => handleSelectImage(image)}
                      >
                        <img
                          src={getImageUrl(image.thumbnailUrl || image.url)}
                          alt={image.originalName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Image failed to load:', image.originalName);
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                          }}
                        />
                      </div>

                      {/* Image Info */}
                      <div className="p-2">
                        <p className="text-xs text-gray-700 font-medium truncate">
                          {image.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.round(image.fileSize / 1024)}KB • {image.width}x{image.height}
                        </p>
                      </div>

                      {/* Actions Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity opacity-0 group-hover:opacity-100">
                        {/* Select Button (Primary Action) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={() => handleSelectImage(image)}
                            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm flex items-center space-x-2"
                          >
                            <ImageIcon className="h-5 w-5" />
                            <span>Select Image</span>
                          </button>
                        </div>
                        
                        {/* Action Buttons (Bottom Right) */}
                        <div className="absolute bottom-2 right-2 flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyUrl(image.url);
                            }}
                            className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                            title="Copy URL"
                          >
                            {copiedUrl === image.url ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-700" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(image);
                              setEditImageName(image.originalName);
                              setShowEditName(true);
                            }}
                            className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                            title="Edit Name"
                          >
                            <Edit2 className="h-4 w-4 text-gray-700" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(image);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Create New Folder</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Folder Name *
                  </label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. Banners, Destinations, Hotels"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newFolderDesc}
                    onChange={(e) => setNewFolderDesc(e.target.value)}
                    placeholder="Brief description"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                    setNewFolderDesc('');
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  disabled={!newFolderName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Name Modal */}
        {showEditName && selectedImage && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Edit Image Name</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Name
                </label>
                <input
                  type="text"
                  value={editImageName}
                  onChange={(e) => setEditImageName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditName(false);
                    setSelectedImage(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateName}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedImage && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-red-600">Delete Image?</h3>
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete <strong>{selectedImage.originalName}</strong>?
              </p>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedImage(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteImage}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
