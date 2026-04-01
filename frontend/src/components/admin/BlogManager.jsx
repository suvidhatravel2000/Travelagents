import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Trash2, Edit, Search, Filter, Eye, EyeOff,
  Save, X, Star, StarOff, Tag, Calendar, User,
  ChevronDown, Image as ImageIcon, FileText, Bold,
  Italic, List, Link, Heading1, Heading2, Quote, Code
} from 'lucide-react';
import { blogAPI } from '../../api/client';
import MediaGallery from './MediaGallery';
import SeoScoreWidget from './SeoScoreWidget';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// ─── Rich Text Toolbar ───
const ToolbarButton = ({ icon: Icon, label, onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`p-1.5 rounded transition-colors ${active ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
    data-testid={`toolbar-${label.toLowerCase().replace(/\s/g, '-')}`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

// ─── Blog Editor Modal ───
const BlogEditorModal = ({ post, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    author: 'Admin',
    category: '',
    tags: [],
    status: 'draft',
    featured: false,
    seo_title: '',
    seo_description: '',
    focus_keyword: '',
    ...post
  });
  const [tagInput, setTagInput] = useState('');
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [activeSection, setActiveSection] = useState('content');
  const [saving, setSaving] = useState(false);
  const contentRef = React.useRef(null);

  const isEditing = !!post?.id;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      handleChange('tags', [...form.tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    handleChange('tags', form.tags.filter(t => t !== tag));
  };

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newContent = form.content.substring(0, start) + replacement + form.content.substring(end);
    handleChange('content', newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 0);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const contentText = [form.title, form.excerpt, form.content].join(' ');

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto py-6" data-testid="blog-editor-modal">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-gray-900" data-testid="blog-editor-title">
            {isEditing ? 'Edit Blog Post' : 'Create Blog Post'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4">
              <span className="text-sm text-gray-500">Status:</span>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className={`text-sm font-medium px-3 py-1.5 rounded-full border ${
                  form.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
                data-testid="blog-status-select"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors font-medium"
              data-testid="blog-save-btn"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" data-testid="blog-editor-close">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b px-5 pt-2">
          {[
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'media', label: 'Media & Details', icon: ImageIcon },
            { id: 'seo', label: 'SEO', icon: Search },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              data-testid={`blog-tab-${tab.id}`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {/* ─── Content Tab ─── */}
          {activeSection === 'content' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter blog post title"
                  className="w-full px-4 py-2.5 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  data-testid="blog-title-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="w-full px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  data-testid="blog-slug-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="Brief summary shown on blog listing cards"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  data-testid="blog-excerpt-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border border-b-0 rounded-t-lg bg-gray-50 flex-wrap">
                  <ToolbarButton icon={Bold} label="Bold" onClick={() => insertMarkdown('**', '**')} />
                  <ToolbarButton icon={Italic} label="Italic" onClick={() => insertMarkdown('*', '*')} />
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <ToolbarButton icon={Heading1} label="Heading 1" onClick={() => insertMarkdown('# ')} />
                  <ToolbarButton icon={Heading2} label="Heading 2" onClick={() => insertMarkdown('## ')} />
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <ToolbarButton icon={List} label="List" onClick={() => insertMarkdown('- ')} />
                  <ToolbarButton icon={Quote} label="Quote" onClick={() => insertMarkdown('> ')} />
                  <ToolbarButton icon={Code} label="Code" onClick={() => insertMarkdown('`', '`')} />
                  <ToolbarButton icon={Link} label="Link" onClick={() => insertMarkdown('[', '](url)')} />
                </div>
                <textarea
                  ref={contentRef}
                  rows={16}
                  value={form.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Write your blog content here... Supports Markdown formatting."
                  className="w-full px-4 py-3 border border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm leading-relaxed"
                  data-testid="blog-content-input"
                />
              </div>
            </div>
          )}

          {/* ─── Media & Details Tab ─── */}
          {activeSection === 'media' && (
            <div className="space-y-5">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={form.image}
                        onChange={(e) => handleChange('image', e.target.value)}
                        placeholder="Image URL"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        data-testid="blog-image-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMediaGallery(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        data-testid="blog-browse-gallery-btn"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Browse Gallery
                      </button>
                    </div>
                    {form.image && (
                      <img
                        src={form.image}
                        alt="Preview"
                        className="mt-3 rounded-lg h-48 w-full object-cover border"
                        data-testid="blog-image-preview"
                      />
                    )}
                  </div>
                </div>
              </div>

              {showMediaGallery && (
                <MediaGallery
                  onSelect={(url) => {
                    handleChange('image', url);
                    setShowMediaGallery(false);
                  }}
                  onClose={() => setShowMediaGallery(false)}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={form.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      data-testid="blog-author-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder="e.g. Travel Tips, Destinations"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    data-testid="blog-category-input"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm" data-testid={`blog-tag-${idx}`}>
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500 ml-1" data-testid={`blog-tag-remove-${idx}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag and press Enter"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    data-testid="blog-tag-input"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium" data-testid="blog-add-tag-btn">
                    Add
                  </button>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <button
                  type="button"
                  onClick={() => handleChange('featured', !form.featured)}
                  className={`p-2 rounded-lg transition-colors ${form.featured ? 'bg-amber-500 text-white' : 'bg-white text-gray-400 border'}`}
                  data-testid="blog-featured-toggle"
                >
                  {form.featured ? <Star className="h-5 w-5" /> : <StarOff className="h-5 w-5" />}
                </button>
                <div>
                  <p className="font-medium text-sm">{form.featured ? 'Featured Post' : 'Not Featured'}</p>
                  <p className="text-xs text-gray-500">Featured posts appear prominently on the blog page</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── SEO Tab ─── */}
          {activeSection === 'seo' && (
            <div className="space-y-4" data-testid="blog-seo-tab">
              <SeoScoreWidget
                seoTitle={form.seo_title}
                seoDescription={form.seo_description}
                focusKeyword={form.focus_keyword}
                contentText={contentText}
                onChange={(field, value) => handleChange(field, value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirmation ───
const DeleteModal = ({ post, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" data-testid="blog-delete-modal">
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Blog Post?</h3>
      <p className="text-gray-600 mb-1">You're about to delete:</p>
      <p className="font-medium text-gray-900 mb-4">"{post.title}"</p>
      <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50" data-testid="blog-delete-cancel">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" data-testid="blog-delete-confirm">Delete</button>
      </div>
    </div>
  </div>
);

// ─── Main Blog Manager ───
const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, categoryFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      const [data, cats] = await Promise.all([
        blogAPI.getAll(params),
        blogAPI.getCategories()
      ]);
      setPosts(data);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to fetch blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingPost?.id) {
        await blogAPI.update(editingPost.id, formData);
      } else {
        await blogAPI.create(formData);
      }
      setEditorOpen(false);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save blog post. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await blogAPI.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchPosts();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    const term = searchTerm.toLowerCase();
    return posts.filter(p =>
      p.title.toLowerCase().includes(term) ||
      (p.category || '').toLowerCase().includes(term) ||
      (p.author || '').toLowerCase().includes(term)
    );
  }, [posts, searchTerm]);

  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="space-y-6" data-testid="blog-manager">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Posts</p>
          <p className="text-2xl font-bold text-gray-900" data-testid="blog-total-count">{posts.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold text-green-600" data-testid="blog-published-count">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="text-2xl font-bold text-amber-600" data-testid="blog-draft-count">{draftCount}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              data-testid="blog-search-input"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            data-testid="blog-status-filter"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              data-testid="blog-category-filter"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
        <button
          onClick={() => { setEditingPost(null); setEditorOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          data-testid="blog-create-btn"
        >
          <Plus className="h-5 w-5" />
          New Post
        </button>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No blog posts yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first blog post</p>
          <button
            onClick={() => { setEditingPost(null); setEditorOpen(true); }}
            className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            data-testid="blog-empty-create-btn"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow" data-testid={`blog-post-${post.id}`}>
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate" data-testid={`blog-post-title-${post.id}`}>{post.title}</h3>
                    {post.featured && <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`} data-testid={`blog-post-status-${post.id}`}>
                      {post.status === 'published' ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    {post.category && (
                      <span className="flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        {post.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditingPost(post); setEditorOpen(true); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                    data-testid={`blog-edit-${post.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(post)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                    data-testid={`blog-delete-${post.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <BlogEditorModal
          post={editingPost}
          onSave={handleSave}
          onClose={() => { setEditorOpen(false); setEditingPost(null); }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteModal
          post={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default BlogManager;
