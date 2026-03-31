import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Places to Visit in Ladakh',
      excerpt: 'Discover the breathtaking landscapes and cultural treasures of Ladakh...',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      date: 'March 15, 2026'
    },
    {
      id: 2,
      title: 'Thailand Travel Guide: Best Time to Visit',
      excerpt: 'Plan your perfect Thailand vacation with our comprehensive guide...',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
      date: 'March 10, 2026'
    },
    {
      id: 3,
      title: 'Bali: A Paradise for Beach Lovers',
      excerpt: 'Explore the stunning beaches and vibrant culture of Bali...',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      date: 'March 5, 2026'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Travel Blog</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button className="text-orange-500 hover:text-orange-600 font-medium">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
