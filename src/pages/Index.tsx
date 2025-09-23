import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogsSection from "@/components/BlogsSection";
import AboutSection from "@/components/AboutSection";
import CourtesySection from "@/components/CourtesySection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <CourtesySection />
      <ServicesSection />
      <BlogsSection />

      {/* Our Anthem */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto grid gap-6 md:gap-8 lg:grid-cols-3 items-start">
          {/* Left: Song card (spans 2 cols on large screens) */}
          <Card className="shadow-xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                সন্ধানী সংগীত 🎶
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-gray-700 leading-relaxed font-noto-sans-bengali whitespace-pre-wrap sm:text-base md:text-lg">
                মানুষের জন্য ভালোবাসা নিয়ে শুরু হয়েছিল পথ চলা, <br />
                দুঃখ-দুর্দশার্তের কল্যাণে রক্তের আখরে কথা বলা। <br />
                সন্ধানী, সন্ধানী — আত্মত্যাগের পরিণাম, <br />
                সহস্র আলোকে উজ্জ্বল মহিমার নাম। <br />
                চোখ বেঁচে থাক ঐ চোখের আলোয়, <br />
                ধমনীতে রক্তের ঋণ প্রেমময় সেবাতে। <br />
                দুঃখ ঘোচাতে আমরা ক্লান্তিহীন, <br />
                জীবনের প্রয়োজনে দিয়ে যাব নতুন জীবনের দাম। <br />
                নিঃস্ব যারা এই সোনার দেশে, <br />
                বিচ্ছিন্ন যত দুঃখীজন, <br />
                স্নেহময় দু’হাতে অশ্রু মোছাবো — <br />
                এই তো করেছি পণ। <br />
                মানুষের কল্যাণে করে যাবো <br />
                আমাদের এই সংগ্রাম। <br />
                ভেঙে যাক ঘর ঐ ঝড়-ঝঞ্ঝায়, <br />
                দুর্যোগে আসুক কালো রাত। <br />
                গৃহহারা মানুষের পাশে দাঁড়াতে <br />
                বাড়িয়ে রাখবো দু’টি হাত। <br />
                আঁধারের পথে শুধু জ্বালিয়ে যাবো <br />
                প্রদীপ শিখা অবিরাম। <br />
              </pre>
            </CardContent>
          </Card>

          {/* Right: stacked cards */}
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  সন্ধানীর লক্ষ্য ও উদ্দেশ্য
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-gray-700 leading-relaxed font-noto-sans-bengali whitespace-pre-wrap sm:text-base md:text-lg">
                  বিভিন্ন সেবামূলক কাজের মাধ্যমে আর্তমানবতার সেবার মানসিকতা গড়ে
                  তোলা।
                </pre>
              </CardContent>
            </Card>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  সন্ধানীর শপথনামা
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-gray-700 leading-relaxed font-noto-sans-bengali whitespace-pre-wrap sm:text-base md:text-lg">
                  আমি সৃষ্টিকর্তার নামে শপথ করছি যে— <br />
                  আমি সন্ধানীর লক্ষ্য ও উদ্দেশ্য বাস্তবায়নের জন্য পরিশ্রম করবো.{" "}
                  <br />
                  ব্যক্তিস্বার্থ ও সকল প্রকার রাজনীতির ঊর্ধ্বে থেকে মানবতার
                  সেবার ব্রতে আমার জীবন উৎসর্গ করবো। <br />
                  স্রষ্টা আমার সহায় হোন। <br />
                  আমিন
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <AboutSection />

      {/* Footer (left as-is) */}
      {/* Footer (Bangla version) */}
      <footer className="bg-gray-900 text-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">সন্ধানী </h3>
              <p className="text-gray-400 leading-relaxed">
                আপনার বিশ্বস্ত স্বাস্থ্যসেবা অংশীদার, যা করুণা এবং উৎকর্ষতার
                সাথে ব্যতিক্রমী চিকিৎসা সেবা প্রদানে প্রতিশ্রুতিবদ্ধ।
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">সেবাসমূহ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>জরুরি সেবা</li>
                <li>সাধারণ চিকিৎসা</li>
                <li>বিশেষজ্ঞ পরামর্শ</li>
                <li>রোগ নির্ণয় সেবা</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">দ্রুত লিংক</h4>
              <ul className="space-y-2 text-gray-400">
                <Link to="/about">
                  <li>আমাদের সম্পর্কে</li>
                </Link>
                <Link to="/services">
                  <li>আমাদের সেবা</li>
                </Link>
                <Link to="/blood-inventory">
                  <li>রক্ত সেবা</li>
                </Link>
                <Link to="/vaccine-inventory">
                  <li>টিকার তালিকা</li>
                </Link>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">যোগাযোগের তথ্য</h4>
              <div className="space-y-2 text-gray-400">
                <p>📞 ০১৮৬৭৪৮৩৬৩১</p>
                <p>✉️ info@sandhani.org</p>
                <p>📍 শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ, ঢাকা</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} সন্ধানী। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
