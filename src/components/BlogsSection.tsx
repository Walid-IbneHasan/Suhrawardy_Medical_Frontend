// src/components/BlogsSection.tsx
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { blogAPI, Blog } from "@/utils/api";
import { Calendar } from "lucide-react";

const BlogsSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // ডিফল্ট ব্লগ (API ব্যর্থ হলে দেখাবে)
  const defaultBlogs: Blog[] = [
    {
      id: 1,
      title: "নিয়মিত স্বাস্থ্য পরীক্ষা কেন জরুরি",
      slug: "importance-regular-health-checkups",
      content:
        "<p>শরীর ঠিক আছে মনে হলেও <strong>নিয়মিত স্বাস্থ্য পরীক্ষা</strong> করলে অনেক রোগ প্রাথমিক অবস্থায় ধরা পড়ে। সময়মতো চিকিৎসা নিলে ঝুঁকি কমে যায়…</p>",
      created_at: "2024-01-15T10:00:00Z",
      published: true,
      images: [
        {
          image:
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 2,
      title: "স্বেচ্ছায় রক্তদান: উপকারিতা ও প্রক্রিয়া",
      slug: "understanding-blood-donation",
      content:
        "<p>রক্তদান একটি মানবিক কাজ। <em>কে, কিভাবে, কখন</em> রক্ত দেবেন—সবকিছু জানুন একসাথে। নিয়ম মানলে রক্তদান সম্পূর্ণ নিরাপদ…</p>",
      created_at: "2024-01-10T14:30:00Z",
      published: true,
      images: [
        {
          image:
            "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 3,
      title: "ভ্যাকসিন সূচি: পরিবারকে সুরক্ষিত রাখুন",
      slug: "vaccination-schedule-family",
      content:
        "<p>বাচ্চা ও বড়দের জন্য <strong>ভ্যাকসিন</strong> খুবই গুরুত্বপূর্ণ। কোন বয়সে কোন ভ্যাকসিন দরকার—সহজ তালিকা দেখে নিন…</p>",
      created_at: "2024-01-05T09:15:00Z",
      published: true,
      images: [
        {
          image:
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogAPI.getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs(defaultBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // HTML → plain text, তারপর ট্রাঙ্কেট
  const truncateContent = (html: string, maxLength: number = 150) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "…";
  };

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              সাম্প্রতিক স্বাস্থ্য লেখা
            </h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl overflow-hidden animate-pulse"
              >
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            সাম্প্রতিক স্বাস্থ্য লেখা
          </h2>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            স্বাস্থ্য বিষয়ক খবর, টিপস আর অভিজ্ঞতার সহজ ব্যাখ্যা—আমাদের
            বিশেষজ্ঞদের কাছ থেকে।
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 ">
          {blogs.slice(0, 3).map((blog) => (
            <Link
              key={blog.id}
              to={`/blogs/${blog.slug}`}
              className="group block cursor-pointer"
              aria-label={`${blog.title} ব্লগটি পড়ুন`}
            >
              <Card className="medical-card-hover border-0 shadow-lg overflow-hidden transition-transform duration-200 group-hover:scale-[1.01] group-active:scale-[0.99] h-full">
                <div className="relative">
                  <img
                    src={
                      blog.images[0]?.image ||
                      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    }
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="medical-gradient text-white">
                      স্বাস্থ্য টিপস
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(blog.created_at)}
                  </div>
                  <CardTitle className="text-xl text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                    {blog.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4">
                    {truncateContent(blog.content)}
                  </CardDescription>
                  <div className="text-red-600 group-hover:text-red-800 font-medium text-sm transition-colors">
                    আরও পড়ুন →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blogs">
            <Button
              size="lg"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3"
            >
              সব আর্টিকেল দেখুন
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
