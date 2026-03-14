import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

const CourtesySection = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Courtesy banner */}
        <Card className="border-0 shadow-xl overflow-hidden mb-8">
          <div className="h-1 w-full medical-gradient" />
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl md:text-3xl text-gray-900 font-bold">
              সৌজন্যে
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-gray-600">
              সন্ধানী শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ ইউনিট কার্যকরী
              পরিষদ-২০২৪-২৫
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>

        {/* Acknowledgement grid */}
        <div className="mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            কৃতজ্ঞতা
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Person 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl text-gray-900">
                      সাদিকুর রহমান ইফাত
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      কেন্দ্রীয় সাধারণ সম্পাদক <br />
                      সন্ধানী কেন্দ্রীয় কার্যকরী পরিষদ-২০২৪-২৫ <br />
                      ব্যাচ: sh-15
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Person 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl text-gray-900">
                      সাইদ মোরশেদ
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      সভাপতি <br />
                      সন্ধানী শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ ইউনিট কার্যকরী
                      পরিষদ-২০২৪-২৫ <br />
                      ব্যাচ: sh-16
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Person 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl text-gray-900">
                      মো. জিহাদ হোসেন
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      সাধারণ সম্পাদক <br />
                      সন্ধানী শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ ইউনিট কার্যকরী
                      পরিষদ-২০২৪-২৫ <br />
                      ব্যাচ: shD-10
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourtesySection;
