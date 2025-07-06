
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { blogAPI, Blog } from '@/utils/api';
import { Calendar, Search, User } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Extended default blogs for demo
  const defaultBlogs = [
    {
      id: 1,
      title: "The Importance of Regular Health Checkups",
      slug: "importance-regular-health-checkups",
      content: "Regular health checkups are essential for maintaining good health and preventing diseases. Early detection can save lives and reduce healthcare costs significantly. During routine checkups, healthcare providers can identify risk factors and provide preventive care recommendations.",
      created_at: "2024-01-15T10:00:00Z",
      published: true,
      images: [{ image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }]
    },
    {
      id: 2,
      title: "Understanding Blood Donation: Benefits and Process",
      slug: "understanding-blood-donation",
      content: "Blood donation is a noble act that can save lives. Learn about the benefits, process, and eligibility criteria for blood donation. One donation can help save up to three lives, making it one of the most impactful ways to contribute to your community's health.",
      created_at: "2024-01-10T14:30:00Z",
      published: true,
      images: [{ image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }]
    },
    {
      id: 3,
      title: "Vaccination Schedule: Protecting Your Family",
      slug: "vaccination-schedule-family",
      content: "Staying up-to-date with vaccinations is crucial for protecting yourself and your loved ones from preventable diseases. Vaccines have been one of the greatest public health achievements, dramatically reducing the incidence of serious diseases.",
      created_at: "2024-01-05T09:15:00Z",
      published: true,
      images: [{ image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }]
    },
    {
      id: 4,
      title: "Mental Health Awareness: Breaking the Stigma",
      slug: "mental-health-awareness",
      content: "Mental health is just as important as physical health. Understanding common mental health conditions and knowing when to seek help can make a significant difference in overall well-being and quality of life.",
      created_at: "2024-01-01T16:45:00Z",
      published: true,
      images: [{ image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }]
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching blogs...');
        const data = await blogAPI.getBlogs();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        setBlogs(defaultBlogs);
        setFilteredBlogs(defaultBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Health Blog</h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Health Blog</h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Stay informed with the latest healthcare news, tips, and insights from our medical experts.
            Your health journey starts with knowledge.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-full border-gray-200 focus:border-blue-300"
            />
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No articles found matching your search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <Card key={blog.id} className="medical-card-hover border-0 shadow-lg overflow-hidden h-full">
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
                      {blog.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription className="text-gray-600 leading-relaxed mb-4 flex-1">
                      {truncateContent(blog.content)}
                    </CardDescription>
                    <Link 
                      to={`/blogs/${blog.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors inline-flex items-center mt-auto"
                    >
                      Read Full Article →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
