import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blogAPI, Blog } from '@/utils/api';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      
      try {
        console.log('Fetching blog:', slug);
        const blogData = await blogAPI.getBlog(slug);
        setBlog(blogData);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
            <Link to="/blogs">
              <Button>Back to Blogs</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/blogs" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Admin Actions</h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Edit Blog</Button>
                <Button size="sm" variant="destructive">Delete Blog</Button>
              </div>
            </div>
          )}

          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* Blog Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Blog Images */}
              {blog.images && blog.images.length > 0 && (
                <div className="mb-8">
                  <div className="grid md:grid-cols-2 gap-4">
                    {blog.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.image}
                        alt={`Blog image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Content */}
              <div className="prose max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: blog.content.replace(/\n/g, '<br />')
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;