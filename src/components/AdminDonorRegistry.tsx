import React, { useEffect, useState, useMemo } from "react";
import { adminAPI, BloodDonor } from "../utils/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Edit, Trash2, Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const AdminDonorRegistry = () => {
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<BloodDonor | null>(null);
  const { toast } = useToast();

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const initialFormState: Omit<BloodDonor, "id"> = {
    name: "",
    batch: "",
    blood_group: "A+",
    phone: "",
    last_donated_date: null,
    gender: "Male",
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchDonors = async () => {
    try {
      const data = await adminAPI.donors.getAll();
      setDonors(data);
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "রক্তদাতাদের তথ্য আনতে ব্যর্থ হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingDonor(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDonor) {
        await adminAPI.donors.update(editingDonor.id, formData);
        toast({
          title: "সফল",
          description: "রক্তদাতার তথ্য সফলভাবে হালনাগাদ হয়েছে।",
        });
      } else {
        await adminAPI.donors.create(formData);
        toast({ title: "সফল", description: "রক্তদাতা সফলভাবে যোগ হয়েছে।" });
      }
      resetForm();
      fetchDonors();
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "রক্তদাতার তথ্য সংরক্ষণ ব্যর্থ হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (donor: BloodDonor) => {
    setEditingDonor(donor);
    setFormData({
      name: donor.name,
      batch: donor.batch,
      blood_group: donor.blood_group,
      phone: donor.phone,
      last_donated_date: donor.last_donated_date
        ? donor.last_donated_date.slice(0, 10)
        : null,
      gender: donor.gender,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই রক্তদাতাকে মুছে ফেলতে চান?")) return;
    try {
      await adminAPI.donors.delete(id);
      toast({
        title: "সফল",
        description: "রক্তদাতা সফলভাবে মুছে ফেলা হয়েছে।",
      });
      fetchDonors();
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "রক্তদাতা মুছতে ব্যর্থ হয়েছে।",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 lg:flex-row items-center justify-between">
        <CardTitle>রক্তদাতার তালিকা</CardTitle>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (!isOpen) {
              setEditingDonor(null);
              setFormData(initialFormState);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> নতুন রক্তদাতা যোগ করুন
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDonor ? "রক্তদাতা সম্পাদনা" : "নতুন রক্তদাতা যোগ করুন"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">পূর্ণ নাম</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="batch">ব্যাচ/সেশন (ঐচ্ছিক)</Label>
                <Input
                  id="batch"
                  value={formData.batch}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">ফোন নম্বর</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="blood_group">রক্তের গ্রুপ</Label>
                  <Select
                    value={formData.blood_group}
                    onValueChange={(v) => handleSelectChange("blood_group", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gender">লিঙ্গ</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(v) => handleSelectChange("gender", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">পুরুষ</SelectItem>
                      <SelectItem value="Female">নারী</SelectItem>
                      <SelectItem value="Other">অন্যান্য</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="last_donated_date">
                  সর্বশেষ রক্তদান তারিখ (ঐচ্ছিক)
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.last_donated_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.last_donated_date
                        ? formData.last_donated_date
                        : "তারিখ নির্বাচন করুন"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.last_donated_date
                          ? new Date(formData.last_donated_date)
                          : undefined
                      }
                      onSelect={(date) => {
                        const value = date
                          ? new Date(
                              date.getTime() -
                                date.getTimezoneOffset() * 60 * 1000
                            )
                              .toISOString()
                              .slice(0, 10)
                          : null;
                        setFormData((prev) => ({
                          ...prev,
                          last_donated_date: value,
                        }));
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  বাতিল
                </Button>
                <Button type="submit">
                  {editingDonor
                    ? "রক্তদাতা হালনাগাদ করুন"
                    : "রক্তদাতা যোগ করুন"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>রক্তদাতাদের লোড করা হচ্ছে...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>নাম</TableHead>
                <TableHead>রক্তের গ্রুপ</TableHead>
                <TableHead>ফোন</TableHead>
                <TableHead>সর্বশেষ রক্তদান</TableHead>
                <TableHead>ক্রিয়া</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell className="font-medium">{donor.name}</TableCell>
                  <TableCell>{donor.blood_group}</TableCell>
                  <TableCell>{donor.phone}</TableCell>
                  <TableCell>
                    {donor.last_donated_date || "প্রযোজ্য নয়"}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(donor)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(donor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDonorRegistry;
