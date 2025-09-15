import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import {
  Dialog as ShadDialog,
  DialogContent as ShadDialogContent,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type PastEvent = {
  title: string;
  description: string;
  images: string[];
};

const ImageLightbox: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  src: string;
  alt?: string;
}> = ({ open, onOpenChange, src, alt }) => {
  return (
    <ShadDialog open={open} onOpenChange={onOpenChange}>
      <ShadDialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
        <div className="relative w-full">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute -top-10 right-0 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={src}
            alt={alt || "Preview"}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
        </div>
      </ShadDialogContent>
    </ShadDialog>
  );
};

const PastEventCard: React.FC<PastEvent> = ({ title, description, images }) => {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prevImage = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden h-full flex flex-col">
      {/* Image Slider */}
      <div className="relative w-full h-48 sm:h-56 md:h-64">
        <img
          src={images[current]}
          alt={`${title} - ${current + 1}`}
          className="w-full h-full object-cover"
          onClick={() => setLightboxOpen(true)}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  idx === current ? "bg-white" : "bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Lightbox trigger icon */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded-md hover:bg-black/60"
          aria-label="Open image in lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Text */}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-900">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex-1" />

      {/* Lightbox */}
      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        src={images[current]}
        alt={`${title} - ${current + 1}`}
      />
    </Card>
  );
};

const PastEventsSection: React.FC = () => {
  const pastEvents: PastEvent[] = [
    {
      title: "বৃক্ষরোপণ কর্মসূচি 🌱",
      description:
        "পরিবেশ রক্ষায় কলেজ প্রাঙ্গণ ও পার্শ্ববর্তী এলাকায় বৃক্ষরোপণ।",
      images: [
        "/gallery/WhatsApp Image 2025-09-11 at 12.50.57 PM.jpeg",
        "/gallery/WhatsApp Image 2025-09-11 at 12.50.57 PM.jpeg (1)",
      ],
    },
    {
      title: "বার্ষিক সভা 📝",
      description:
        "এক বছরের কার্যক্রমের মূল্যায়ন ও ভবিষ্যৎ পরিকল্পনা নির্ধারণ।",
      images: ["/gallery/past/meeting1.jpg", "/gallery/past/meeting2.jpg"],
    },
    {
      title: "অসহায় মানুষের পাশে 🤝",
      description: "গরীব ও অসহায়দের মাঝে শীতবস্ত্র, ঔষধ ও খাদ্য বিতরণ।",
      images: [
        "/gallery/past/help1.jpg",
        "/gallery/past/help2.jpg",
        "/gallery/past/help3.jpg",
      ],
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            আমাদের পূর্ববর্তী কার্যক্রম
          </h2>
          <div className="w-24 h-1 medical-gradient mx-auto rounded-full mt-4"></div>
          <p className="text-gray-600 mt-4">
            অতীতের কিছু স্মরণীয় উদ্যোগ যা আমাদের অঙ্গীকারের প্রমাণ বহন করে।
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((e) => (
            <PastEventCard
              key={e.title}
              title={e.title}
              description={e.description}
              images={e.images}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
