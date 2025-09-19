import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Activity, Heart, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-red-50 via-white to-red-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Hero Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full text-red-800 text-sm font-medium mb-6">
              <Activity className="w-4 h-4 mr-2" />
              বিশ্বস্ত স্বাস্থ্যসেবার সঙ্গী
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              আপনার স্বাস্থ্যই আমাদের
              <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                {" "}
                অগ্রাধিকার
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              সন্ধানী ShSMC ইউনিট—স্বেচ্ছায় রক্তদান, ভ্যাকসিন সহায়তা আর
              স্বাস্থ্যসচেতনতা নিয়ে কাজ করি। কারণ, এক ফোঁটা রক্তও কারও জীবন
              বাঁচাতে পারে।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/services" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="medical-gradient text-white hover:opacity-90 px-8 py-3 w-full sm:w-auto transition-all duration-200 hover:scale-105"
                >
                  আমাদের সেবা
                </Button>
              </Link>
              <Link to="/blood-inventory" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3 w-full sm:w-auto transition-all duration-200 hover:scale-105"
                >
                  রক্ত সেবা
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="animate-slide-in-left">
            <div className="relative">
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1615461066159-fea0960485d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="রক্তদান ও চিকিৎসাসেবা"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl"
                />

                {/* Floating cards */}
                <div
                  className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 bg-white p-2 sm:p-4 rounded-xl shadow-lg animate-fade-in-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mb-1 sm:mb-2 mx-auto" />
                  <div className="text-xs sm:text-sm font-semibold text-center">
                    ২৪/৭ সেবা
                  </div>
                </div>

                <div
                  className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-white p-2 sm:p-4 rounded-xl shadow-lg animate-fade-in-up"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mb-1 sm:mb-2 mx-auto" />
                  <div className="text-xs sm:text-sm font-semibold text-center">
                    দক্ষ জনবল
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
