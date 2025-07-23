import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogAPI, Blog, adminAPI } from "@/utils/api";
import {
  Calendar,
  ArrowLeft,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;

      try {
        console.log("Fetching blog:", slug);
        const blogData = await blogAPI.getBlog(slug);
        setBlog(blogData);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleDeleteBlog = async () => {
    if (!blog || !confirm("Are you sure you want to delete this blog?")) return;
    try {
      await adminAPI.blogs.delete(blog.slug);
      toast({ title: "Success", description: "Blog deleted successfully" });
      navigate("/blogs");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  const handleEditBlog = () => {
    if (blog) {
      navigate("/blogs", { state: { blog } });
    }
  };

  const handlePrevImage = () => {
    if (blog && blog.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? blog.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (blog && blog.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === blog.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Blog Not Found
            </h1>
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
          <Link
            to="/blogs"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Admin Actions
              </h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleEditBlog}>
                  <Edit className="w-3 h-3 mr-2" />
                  Edit Blog
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteBlog}
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete Blog
                </Button>
              </div>
            </div>
          )}

          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* Blog Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {blog.title}
                </h1>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Blog Images Slider */}
              {blog.images && blog.images.length > 0 && (
                <div className="mb-8 relative">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    {blog.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.image}
                        alt={`Blog image ${index + 1}`}
                        className={`w-full h-64 object-cover absolute top-0 left-0 transition-opacity duration-500 ${
                          index === currentImageIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>
                  {blog.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="flex justify-center mt-4 space-x-2">
                        {blog.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Blog Content */}
              <div className="prose max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: blog.content.replace(/\n/g, "<br />"),
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
