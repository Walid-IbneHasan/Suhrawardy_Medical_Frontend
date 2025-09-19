import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Activity, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const navItems = [
    { name: "হোম", path: "/" },
    { name: "সার্ভিস", path: "/services" },
    { name: "ব্লগ", path: "/blogs" },
    { name: "ইভেন্টস", path: "/events" },
    { name: "রক্ত", path: "/blood-inventory" },
    { name: "টিকা", path: "/vaccine-inventory" },
    { name: "আমাদের সম্পর্কে", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Get the first letter of email (uppercase); fallback to "U"
  const userInitial = useMemo(
    () => user?.email?.[0]?.toUpperCase() ?? "U",
    [user?.email]
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/public/logo.png" alt="logo" className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              সন্ধানী
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                  isActive(item.path)
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin/users/"
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    ব্যবহারকারীরা
                  </Link>
                )}

                {/* Avatar-only user menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 h-9 w-9 rounded-full"
                      aria-label="অ্যাকাউন্ট মেনু"
                    >
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center font-semibold">
                        {userInitial}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      প্রোফাইল
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      লগআউট
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Dialog
                  open={isEmergencyModalOpen}
                  onOpenChange={setIsEmergencyModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="medical-gradient text-white hover:opacity-90">
                      জরুরি যোগাযোগ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>জরুরি যোগাযোগ</DialogTitle>
                      <DialogDescription>
                        <p className="text-red-600 font-semibold mb-4">
                          শুধুমাত্র প্রকৃত জরুরি চিকিৎসা সহায়তার ক্ষেত্রে এই
                          নম্বরে কল করুন।
                        </p>
                        <p className="text-lg">
                          📞{" "}
                          <a
                            href="tel:+8801867483631"
                            className="text-red-600 hover:underline"
                          >
                            ০১৮৬৭৪৮৩৬৩১
                          </a>
                        </p>
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      variant="outline"
                      onClick={() => setIsEmergencyModalOpen(false)}
                      className="mt-4"
                    >
                      বন্ধ করুন
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">লগইন</Button>
                </Link>
                <Link to="/register">
                  <Button className="medical-gradient text-white hover:opacity-90">
                    রেজিস্টার
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="মেনু টগল করুন"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md ${
                    isActive(item.path)
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-3 space-y-3">
                {isAuthenticated ? (
                  <>
                    {/* Small avatar row instead of showing the full email */}
                    <div className="flex items-center gap-3 px-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center font-semibold">
                        {userInitial}
                      </div>
                      <span className="text-sm text-gray-700">অ্যাকাউন্ট</span>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/users/"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      >
                        ব্যবহারকারীরা
                      </Link>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="w-full text-left justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      লগআউট
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        লগইন
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="medical-gradient text-white w-full">
                        রেজিস্টার
                      </Button>
                    </Link>
                  </div>
                )}

                <Dialog
                  open={isEmergencyModalOpen}
                  onOpenChange={setIsEmergencyModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="medical-gradient text-white w-full">
                      জরুরি যোগাযোগ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>জরুরি যোগাযোগ</DialogTitle>
                      <DialogDescription>
                        <p className="text-red-600 font-semibold mb-4">
                          শুধুমাত্র প্রকৃত জরুরি চিকিৎসা সহায়তার ক্ষেত্রে এই
                          নম্বরে কল করুন।
                        </p>
                        <p className="text-lg">
                          📞{" "}
                          <a
                            href="tel:+8801867483631"
                            className="text-red-600 hover:underline"
                          >
                            ০১৮৬৭৪৮৩৬৩১
                          </a>
                        </p>
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      variant="outline"
                      onClick={() => setIsEmergencyModalOpen(false)}
                      className="mt-4"
                    >
                      বন্ধ করুন
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
