
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { blogAPI, Blog } from '@/utils/api';
import { Calendar, User } from 'lucide-react';

const BlogsSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Default blogs for demo purposes
  const defaultBlogs = [
    {
      id: 1,
      title: "The Importance of Regular Health Checkups",
      slug: "importance-regular-health-checkups",
      content: "Regular health checkups are essential for maintaining good health and preventing diseases. Early detection can save lives...",
      created_at: "2024-01-15T10:00:00Z",
      published: true,
      images: [{ image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }]
    },
    {
      id: 2,
      title: "Understanding Blood Donation: Benefits and Process",
      slug: "understanding-blood-donation",
      content: "Blood donation is a noble act that can save lives. Learn about the benefits, process, and eligibility criteria...",
      created_at: "2024-01-10T14:30:00Z",
      published: true,
      images: [{ image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }]
    },
    {
      id: 3,
      title: "Vaccination Schedule: Protecting Your Family",
      slug: "vaccination-schedule-family",
      content: "Staying up-to-date with vaccinations is crucial for protecting yourself and your loved ones from preventable diseases...",
      created_at: "2024-01-05T09:15:00Z",
      published: true,
      images: [{ image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }]
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching blogs...');
        const data = await blogAPI.getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        // Use default blogs if API fails
        setBlogs(defaultBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Health Insights</h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Health Insights</h2>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest healthcare news, tips, and insights from our medical experts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.slice(0, 3).map((blog) => (
            <Card key={blog.id} className="medical-card-hover border-0 shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={blog.images[0]?.image || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="medical-gradient text-white">Health Tips</Badge>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(blog.created_at)}
                </div>
                <CardTitle className="text-xl text-gray-900 leading-tight hover:text-blue-600 transition-colors">
                  <Link to={`/blogs/${blog.slug}`}>
                    {blog.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed mb-4">
                  {truncateContent(blog.content)}
                </CardDescription>
                <Link 
                  to={`/blogs/${blog.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                  Read More →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blogs">
            <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
