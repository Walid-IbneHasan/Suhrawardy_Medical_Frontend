// src/pages/Blogs.tsx
import { useEffect, useState, useCallback, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import { blogAPI, Blog, adminAPI } from "@/utils/api";
import { Calendar, Search, Plus, Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Editor } from "@tinymce/tinymce-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const editorRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    published: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // ✅ ADDED: paste fallback state (works on mobile reliably)
  const [pasteDialogOpen, setPasteDialogOpen] = useState(false);
  const [pasteBuffer, setPasteBuffer] = useState("");

  // ✅ ADDED: helper to safely insert pasted plain text into TinyMCE
  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // ✅ ADDED: insert pasted text as paragraphs/line breaks
  const insertPastedTextIntoEditor = () => {
    const ed = editorRef.current;
    if (!ed) {
      toast({
        title: "Error",
        description: "Editor is not ready yet. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const safe = escapeHtml(pasteBuffer).replace(/\r\n|\r|\n/g, "<br/>");
    ed.insertContent(safe);
    setPasteBuffer("");
    setPasteDialogOpen(false);
  };

  const defaultBlogs: Blog[] = [
    {
      id: 1,
      title: "The Importance of Regular Health Checkups",
      slug: "importance-regular-health-checkups",
      content:
        "<p><strong>Regular health checkups</strong> are essential for maintaining good health and preventing diseases.</p><p>Early detection can <em>save lives</em> and reduce healthcare costs significantly. During routine checkups, healthcare providers can identify risk factors and provide preventive care recommendations.</p>",
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
      title: "Understanding Blood Donation: Benefits and Process",
      slug: "understanding-blood-donation",
      content:
        "<p><strong>Blood donation</strong> is a noble act that can save lives.</p><p>Learn about the <em>benefits</em>, process, and eligibility criteria for blood donation. One donation can help save up to <strong>three lives</strong>, making it one of the most impactful ways to contribute to your community's health.</p>",
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
      title: "Vaccination Schedule: Protecting Your Family",
      slug: "vaccination-schedule-family",
      content:
        "<p>Staying up-to-date with <strong>vaccinations</strong> is crucial for protecting yourself and your loved ones from preventable diseases.</p><p>Vaccines have been one of the <em>greatest public health achievements</em>, dramatically reducing the incidence of serious diseases.</p>",
      created_at: "2024-01-05T09:15:00Z",
      published: true,
      images: [
        {
          image:
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      id: 4,
      title: "Mental Health Awareness: Breaking the Stigma",
      slug: "mental-health-awareness",
      content:
        "<p><strong>Mental health</strong> is just as important as physical health.</p><p>Understanding common mental health conditions and knowing when to seek help can make a <em>significant difference</em> in overall well-being and quality of life.</p>",
      created_at: "2024-01-01T16:45:00Z",
      published: true,
      images: [
        {
          image:
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
  ];

  // Reset form when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      setEditingBlog(null);
      setFormData({ title: "", content: "", published: false });
      setImageFiles([]);
    }
  }, [dialogOpen]);

  // ✅ ADDED: also reset paste dialog when main dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      setPasteDialogOpen(false);
      setPasteBuffer("");
    }
  }, [dialogOpen]);

  // If navigated from BlogDetail → edit
  useEffect(() => {
    const state = location.state as { blog?: Blog };
    if (state?.blog) {
      setEditingBlog(state.blog);
      setFormData({
        title: state.blog.title,
        content: state.blog.content,
        published: state.blog.published,
      });
      setImageFiles([]);
      setDialogOpen(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogAPI.getBlogs();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs(defaultBlogs);
        setFilteredBlogs(defaultBlogs);
        toast({
          title: "Error",
          description: "Failed to load blogs. Showing default blogs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [toast]);

  const handleCreateBlog = async () => {
    try {
      const content = editorRef.current
        ? editorRef.current.getContent()
        : formData.content;

      const formDataPayload = new FormData();
      formDataPayload.append("title", formData.title);
      formDataPayload.append("content", content);
      formDataPayload.append("published", String(formData.published));
      imageFiles.forEach((file) => formDataPayload.append("image_files", file));

      await adminAPI.blogs.create(formDataPayload);
      toast({ title: "Success", description: "Blog created successfully" });
      setDialogOpen(false);
      const data = await blogAPI.getBlogs();
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (error) {
      console.error("Error creating blog:", error);
      toast({
        title: "Error",
        description: "Failed to create blog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditBlog = async () => {
    if (!editingBlog) return;
    try {
      const content = editorRef.current
        ? editorRef.current.getContent()
        : formData.content;

      const formDataPayload = new FormData();
      formDataPayload.append("title", formData.title);
      formDataPayload.append("content", content);
      formDataPayload.append("published", String(formData.published));
      imageFiles.forEach((file) => formDataPayload.append("image_files", file));

      await adminAPI.blogs.update(editingBlog.slug, formDataPayload);
      toast({ title: "Success", description: "Blog updated successfully" });
      setDialogOpen(false);
      const data = await blogAPI.getBlogs();
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (error) {
      console.error("Error updating blog:", error);
      toast({
        title: "Error",
        description: "Failed to update blog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await adminAPI.blogs.delete(slug);
      toast({ title: "Success", description: "Blog deleted successfully" });
      const data = await blogAPI.getBlogs();
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = useCallback(() => {
    setEditingBlog(null);
    setFormData({ title: "", content: "", published: false });
    setImageFiles([]);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      published: blog.published,
    });
    setImageFiles([]);
    setDialogOpen(true);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setImageFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    const text = div.textContent || div.innerText || "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                স্বাস্থ্য কথা
              </h1>
              <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse"
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
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            স্বাস্থ্য কথা
          </h1>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            আমাদের মেডিকেল বিশেষজ্ঞদের কাছ থেকে স্বাস্থ্য বিষয়ক সর্বশেষ খবর,
            টিপস এবং পরামর্শ সম্পর্কে জেনে নিন। জ্ঞান দিয়েই আপনার সুস্থ থাকার
            যাত্রা শুরু হয়।
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
          {/* Admin Actions */}
          {isAdmin && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-blue-800">
                  Admin Panel
                </h3>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={openCreateDialog}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Blog</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingBlog ? "Edit Blog" : "Create New Blog"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingBlog
                          ? "Update the blog details below."
                          : "Fill in the details to create a new blog post."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Blog Title
                        </label>
                        <Input
                          placeholder="Enter blog title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Blog Content
                        </label>
                        <div id="tinymce-ui">
                        <div id="tinymce-toolbar" />

                        <Editor
                          apiKey="s1y89frcr4sbgbj6kt5pb5apm9fcoeih0ru2u0tyx5dzfcpq"
                          onInit={(_, editor) => (editorRef.current = editor)}
                          value={formData.content}
                          onEditorChange={(content) => setFormData((p) => ({ ...p, content }))}
                          // ✅ ADDED: key forces reliable remount inside Dialog (fixes “editor not appearing” cases on mobile)
                          key={(editingBlog?.slug ?? "new") + (dialogOpen ? "-open" : "-closed")}
                          init={{
                            height: 400,
                            menubar: false,
                            ui_mode: "split",
                            fixed_toolbar_container: "#tinymce-toolbar",
                            ui_container: "#tinymce-ui",
                            zindex: 20000,
                            // IMPORTANT: keep it simple; remove stuff you don’t need
                            plugins: [
                              "lists",
                              "link",
                              "table",
                              "code",
                              "wordcount",
                              "paste",
                            ],
                            toolbar:
                              "undo redo | blocks | bold italic | bullist numlist  | table | code",
                            branding: false,

                            // These help with paste cleanup, without needing paste buttons
                            paste_merge_formats: true,
                            paste_as_text: false,

                            // Optional: stop Tiny turning URLs into links automatically
                            autolink_pattern: /$^/, // disables autolink (aggressive but effective)

                            // ✅ ADDED: small mobile quality-of-life
                            // (does not magically force OS paste menu, but reduces some weirdness)
                            browser_spellcheck: true,
                            contextmenu: false,
                          }}
                        />
                        </div>

                        {/* ✅ ADDED: Bulletproof mobile paste fallback */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-gray-500">
                            {isMobile ? "Mobile detected: use Paste button if long-press doesn’t show Paste." : ""}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPasteDialogOpen(true)}
                          >
                            Paste
                          </Button>
                        </div>

                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="published"
                          checked={formData.published}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, published: !!checked })
                          }
                        />
                        <label
                          htmlFor="published"
                          className="text-sm font-medium"
                        >
                          Published
                        </label>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium block">
                          Blog Images
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="border-dashed border-2 border-gray-300 p-2"
                        />
                        {imageFiles.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {imageFiles.map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <p className="text-xs truncate mt-1">
                                  {file.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={
                          editingBlog ? handleEditBlog : handleCreateBlog
                        }
                        className="w-full"
                      >
                        {editingBlog ? "Update Blog" : "Create Blog"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                No articles found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="medical-card-hover border-0 shadow-lg overflow-hidden h-full"
                >
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
                        Health
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(blog.created_at)}
                    </div>
                    <CardTitle className="text-xl text-gray-900 leading-tight hover:text-red-600 transition-colors">
                      {blog.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription className="text-gray-600 leading-relaxed mb-4 flex-1">
                      {truncateContent(blog.content)}
                    </CardDescription>
                    <div className="flex justify-between items-center mt-auto">
                      <Link
                        to={`/blogs/${blog.slug}`}
                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors inline-flex items-center"
                      >
                        পুরো লেখাটি পড়ুন →
                      </Link>

                      {isAdmin && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(blog)}
                            className="flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteBlog(blog.slug)}
                            className="flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ✅ ADDED: Paste fallback Dialog (native paste works here on mobile) */}
      <Dialog open={pasteDialogOpen} onOpenChange={setPasteDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Paste content</DialogTitle>
            <DialogDescription>
              On mobile, long-press inside the box below to paste. Then click Insert.
            </DialogDescription>
          </DialogHeader>

          <textarea
            className="w-full min-h-[180px] border rounded p-2"
            value={pasteBuffer}
            onChange={(e) => setPasteBuffer(e.target.value)}
            placeholder="Long-press here → Paste"
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPasteBuffer("");
                setPasteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={insertPastedTextIntoEditor}
              disabled={!pasteBuffer.trim()}
            >
              Insert
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Blogs;
