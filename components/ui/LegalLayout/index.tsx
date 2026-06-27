import React from "react";
import { Shield, FileText, Cookie, Mail, ArrowLeft } from "lucide-react";

const LegalLayout = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    {}
    <a href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors">
      <ArrowLeft size={16} className="mr-1" /> Back to Home
    </a>
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="prose prose-blue max-w-none text-gray-700">
        {children}
      </div>
    </div>
  </div>
);
export default LegalLayout;