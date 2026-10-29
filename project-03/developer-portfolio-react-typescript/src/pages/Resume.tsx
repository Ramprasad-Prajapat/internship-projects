import React, { useState } from 'react';
import { Download, Printer, Maximize2, Minimize2, FileText, CheckCircle2 } from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { SectionHeader } from '@/components/common/SectionHeader';
import { personalInfo, educationData, experienceData } from '@/constants/portfolio';

export const Resume: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrint = () => {
    const pdfWindow = window.open('/resume.pdf', '_blank');
    pdfWindow?.focus();
    setTimeout(() => pdfWindow?.print(), 500);
  };

  return (
    <>
      <Seo
        title="Professional Resume"
        description={`View and download the verified software engineering resume of ${personalInfo.name}, Java Full Stack Developer.`}
      />

      <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <SectionHeader
          badge="Curriculum Vitae"
          badgeIcon={<FileText className="w-4 h-4" />}
          title="Professional Resume"
          subtitle="Recruiter-ready resume highlighting Java backend engineering, Spring Boot microservices, React frontends, and academic background."
        />

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{personalInfo.name} — Resume</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Target Position: {personalInfo.title}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/resume.pdf"
              download="Ramprasad_Prajapat_Resume.pdf"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors hidden sm:flex"
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Education</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{educationData.degree}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{educationData.institution} (CGPA: {educationData.cgpa})</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Current Role</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{experienceData[0]?.role}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{experienceData[0]?.organization} (On-site)</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Core Tech Stack</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Java, Spring Boot, React</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">REST APIs & MySQL Relational DB</p>
          </div>
        </div>

        {/* PDF Embedded Container */}
        <div
          className={`border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm transition-all duration-200 ${
            isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[700px] w-full'
          }`}
        >
          <object
            data="/resume.pdf"
            type="application/pdf"
            className="w-full h-full"
          >
            {/* Fallback View */}
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
              <FileText className="w-12 h-12 text-slate-400" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">PDF Viewer</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Click below to view or download the complete resume document directly.
                </p>
              </div>
              <a
                href="/resume.pdf"
                download="Ramprasad_Prajapat_Resume.pdf"
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm"
              >
                Download PDF Resume
              </a>
            </div>
          </object>
        </div>
      </div>
    </>
  );
};

export default Resume;
