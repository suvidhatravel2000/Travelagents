import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag, Star, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogAPI } from '../api/client';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, catsData] = await Promise.all([
          blogAPI.getAll({ status: 'published' }),
          blogAPI.getCategories()
        ]);
        setPosts(postsData);
        setCategories(catsData);
      } catch (err) {
        console.error('Failed to load blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || post.title.toLowerCase().includes(searchTerm.toLowerCase()) || (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Travel Blog — Suvidha Travel</title>
        <meta name="description" content="Read the latest travel tips, destination guides, and holiday inspiration from Suvidha Travel." />
      </Helmet>
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="blog-page-title">Travel Blog</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Tips, guides, and inspiration for your next adventure
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              data-testid="blog-public-search"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
              data-testid="blog-cat-all"
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
                }`}
                data-testid={`blog-cat-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No blog posts found</p>
            <p className="text-gray-400 mt-2">Check back soon for new content!</p>
          </div>
        ) : (
          <>
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-amber-500" />
                  Featured
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map(post => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug || post.id}`}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                      data-testid={`featured-post-${post.id}`}
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={post.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">Featured</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                          {post.category && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{post.category}</span>}
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">{post.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug || post.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                  data-testid={`blog-card-${post.id}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      {post.category && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{post.category}</span>}
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <span className="text-orange-500 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
