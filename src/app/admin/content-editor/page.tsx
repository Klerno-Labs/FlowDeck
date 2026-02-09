import Link from 'next/link';
import { FileText, BookOpen, Info } from 'lucide-react';
import { AdminFlowDeckPage } from '@/components/layout/AdminFlowDeckPage';

export default function ContentEditorPage() {
  return (
    <AdminFlowDeckPage
      title="Content Editor"
      subtitle="Edit presentation content displayed to users. Layout and structure are fixed."
      showHome={true}
      showBack={true}
      backTo="/admin"
    >
      <div className="max-w-6xl mx-auto">

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Intro Slides Card */}
        <Link
          href="/admin/content-editor/intro"
          className="group rounded-2xl shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-blue-300 transition-all p-8 active:scale-95 touch-manipulation"
        >
          <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8 text-cyan-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Intro Slides</h3>
          <p className="text-gray-600 mb-4">
            Edit Company Overview and What We Guarantee slides
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">2 slides</span>
            <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
              Edit Content →
            </span>
          </div>
        </Link>

        {/* Knowledge Base Card */}
        <Link
          href="/admin/content-editor/knowledge-base"
          className="group rounded-2xl shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-blue-300 transition-all p-8 active:scale-95 touch-manipulation"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Base</h3>
          <p className="text-gray-600 mb-4">
            Edit Total Cost of Filtration and Why Do We Filter slides
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">2 slides</span>
            <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
              Edit Content →
            </span>
          </div>
        </Link>
      </div>

      {/* Info Box */}
      <div className="rounded-2xl bg-blue-50 border-2 border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Note: Layout is Fixed</h4>
            <p className="text-gray-700">
              You can only edit text content, bullet points, and images. Navigation and positioning are
              controlled by the FlowDeckPage component system to ensure consistency across all sections.
            </p>
          </div>
        </div>
      </div>
      </div>
    </AdminFlowDeckPage>
  );
}
