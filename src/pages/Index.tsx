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
import Footer from "@/components/Footer";
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
      <Footer />
    </div>
  );
};

export default Index;
