import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogAPI } from '../api/client';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogAPI.getById(slug);
        setPost(data);
      } catch (err) {
        console.error('Failed to load blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.slice(2)}</h1>;
      if (line.startsWith('> ')) return <blockquote key={idx} className="border-l-4 border-orange-500 pl-4 italic text-gray-600 my-4">{line.slice(2)}</blockquote>;
      if (line.startsWith('- ')) return <li key={idx} className="ml-4 text-gray-700 leading-relaxed">{line.slice(2)}</li>;
      if (line.trim() === '') return <br key={idx} />;

      let html = line;
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
      html = html.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
      html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-orange-500 underline" target="_blank" rel="noopener noreferrer">$1</a>');

      return <p key={idx} className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-orange-500 hover:text-orange-600 font-medium">
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{`${post.seo_title || post.title || 'Blog Post'} — Suvidha Travel`}</title>
        {(post.seo_description || post.excerpt) && <meta name="description" content={post.seo_description || post.excerpt} />}
        {post.focus_keyword && <meta name="keywords" content={post.focus_keyword} />}
      </Helmet>
      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 text-sm mb-6 transition-colors" data-testid="blog-back-link">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {post.category && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium" data-testid="blogpost-category">{post.category}</span>
            )}
            {post.tags && post.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <Tag className="h-3 w-3" />{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="blogpost-title">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />{post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-[400px] object-cover" data-testid="blogpost-image" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none" data-testid="blogpost-content">
          {renderContent(post.content)}
        </div>

        {/* Share */}
        <div className="mt-12 pt-6 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">Published by <span className="font-medium text-gray-700">{post.author}</span></p>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            data-testid="blogpost-share-btn"
          >
            <Share2 className="h-4 w-4" /> Copy Link
          </button>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
