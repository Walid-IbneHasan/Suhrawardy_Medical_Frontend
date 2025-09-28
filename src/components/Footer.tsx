import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">সন্ধানী </h3>
            <p className="text-gray-400 leading-relaxed">
              আপনার বিশ্বস্ত স্বাস্থ্যসেবা অংশীদার, যা করুণা এবং উৎকর্ষতার সাথে
              ব্যতিক্রমী চিকিৎসা সেবা প্রদানে প্রতিশ্রুতিবদ্ধ।
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
              <p>✉️ jihadhossain98@gmail.com</p>
              <p>📍 শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ, ঢাকা</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} সন্ধানী। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
