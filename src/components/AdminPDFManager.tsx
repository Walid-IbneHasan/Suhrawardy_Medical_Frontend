import React, { useEffect, useState } from "react";
import { adminAPI, PDFDocument } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Trash2, Upload, Eye } from "lucide-react";

const AdminPDFManager = () => {
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPDFs = async () => {
    try {
      const data = await adminAPI.pdfDocuments.getAll();
      setPdfs(data);
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "PDF নথি আনতে ব্যর্থ।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "কোনো ফাইল নির্বাচন করা হয়নি",
        description: "অনুগ্রহ করে আপলোডের জন্য একটি PDF ফাইল নির্বাচন করুন।",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    try {
      await adminAPI.pdfDocuments.create(formData);
      toast({
        title: "সফল",
        description: "PDF নথি সফলভাবে আপলোড হয়েছে।",
      });
      setDescription("");
      setFile(null);
      // Clear the file input visually
      const fileInput = document.getElementById(
        "pdf-file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      fetchPDFs(); // Refresh the list
    } catch (error) {
      toast({
        title: "আপলোড ব্যর্থ হয়েছে",
        description: "নথিটি আপলোড করা যায়নি।",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত এই নথিটি মুছে ফেলতে চান?")) return;
    try {
      await adminAPI.pdfDocuments.delete(id);
      toast({
        title: "সফল",
        description: "নথিটি সফলভাবে মুছে ফেলা হয়েছে।",
      });
      fetchPDFs();
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "নথি মুছে ফেলতে ব্যর্থ।",
        variant: "destructive",
      });
    }
  };

  const getFileName = (url: string) => {
    try {
      return url.substring(url.lastIndexOf("/") + 1);
    } catch {
      return "অবৈধ_ইউআরএল";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              নতুন নথি আপলোড
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="description">বিবরণ (ঐচ্ছিক)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="PDF-এর জন্য সংক্ষিপ্ত বিবরণ লিখুন"
                />
              </div>
              <div>
                <Label htmlFor="pdf-file-input">PDF ফাইল</Label>
                <Input
                  id="pdf-file-input"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                  required
                  className="file:text-gray-700 file:bg-gray-100 hover:file:bg-gray-200"
                />
              </div>
              <Button type="submit" className="w-full">
                নথি আপলোড করুন
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              আপলোডকৃত নথি
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>নথি লোড হচ্ছে...</p>
            ) : pdfs.length === 0 ? (
              <p className="text-center text-gray-500">
                এখনও কোনো নথি আপলোড করা হয়নি।
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>বিবরণ</TableHead>
                    <TableHead>ফাইলের নাম</TableHead>
                    <TableHead>অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pdfs.map((pdf) => (
                    <TableRow key={pdf.id}>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={pdf.description}
                      >
                        {pdf.description || "প্রযোজ্য নয়"}
                      </TableCell>
                      <TableCell
                        className="truncate"
                        title={getFileName(pdf.file)}
                      >
                        {getFileName(pdf.file)}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <a
                          href={pdf.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" /> দেখুন
                          </Button>
                        </a>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(pdf.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" /> মুছুন
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPDFManager;
