import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Clock, Search, ArrowRight, X } from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { engineeringNotesData, type EngineeringNote, personalInfo } from '@/constants/portfolio';
import { Reveal } from '@/components/common/Reveal';

export const Notes: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNote, setActiveNote] = useState<EngineeringNote | null>(null);

  const categories = ['All', 'Java & Spring', 'React & Frontend', 'Database Architecture', 'Software Engineering'];

  const filteredNotes = engineeringNotesData.filter((note) => {
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Seo
        title="Engineering Notes & Technical Articles"
        description={`Read technical notes, Spring Boot guides, and web development learnings written by ${personalInfo.name}.`}
      />

      <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <SectionHeader
          badge="Technical Writing & Notes"
          badgeIcon={<BookOpen className="w-4 h-4" />}
          title="Engineering Notes & Knowledge Sharing"
          subtitle="Articles, architectural patterns, and practical guides written while mastering Java Spring Boot, React, and MySQL."
        />

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl glass-card">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px] md:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes or tags..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotes.map((note) => (
                <motion.article
                  key={note.id}
                  whileHover={{ y: -2 }}
                  className="p-5 rounded-2xl glass-card space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                        {note.category}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{note.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {note.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {note.summary}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {note.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {note.date}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveNote(note)}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Read Note</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </Reveal>
        ) : (
          <EmptyState
            title="No matching engineering notes"
            description="Try searching with a different keyword or category filter."
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        )}
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {activeNote && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeNote.title}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveNote(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      {activeNote.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{activeNote.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {activeNote.title}
                  </h2>
                  <span className="text-xs font-mono text-slate-500 block pt-0.5">
                    Published: {activeNote.date} • By {personalInfo.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveNote(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Close note"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="prose dark:prose-invert text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3">
                {activeNote.content}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1">
                  {activeNote.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-400">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNote(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm"
                >
                  Close Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Notes;
