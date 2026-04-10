import React, { useState } from 'react';
import { ArrowLeft, Search, FileText, ChevronRight, HelpCircle } from 'lucide-react';

const MANUAL_TOPICS = [
  { id: '1', title: 'Starting a Decontamination Cycle', category: 'Operations' },
  { id: '2', title: 'Loading Instruments Correctly', category: 'Operations' },
  { id: '3', title: 'Understanding Error Codes', category: 'Troubleshooting' },
  { id: '4', title: 'Cleaning the UV-C Chamber', category: 'Maintenance' },
  { id: '5', title: 'Replacing the UV-C Bulbs', category: 'Maintenance' },
  { id: '6', title: 'Emergency Stop Procedures', category: 'Safety' },
  { id: '7', title: 'Exporting Compliance Reports', category: 'Administration' },
];

const FAQS = [
  "How do I load the MINIBOX-HD2?",
  "What does Error E04 mean?",
  "How long does a cycle take?",
  "How to clean the chamber?",
  "When to replace UV-C bulbs?"
];

export function DigitalManual({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = MANUAL_TOPICS.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 px-6 py-4 flex items-center border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
        <button onClick={onBack} className="mr-4 p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <img 
            src="/mackwell logo.png" 
            alt="Mackewell Health" 
            className="h-5 w-auto object-contain dark:invert opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col overflow-y-auto pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Digital Manual</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Approved documentation and operating procedures for the MINIBOX-HD2.
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manual..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Horizontal Scrolling FAQs */}
        <div className="mb-8 -mx-6 px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 pb-2 w-max">
            {FAQS.map((faq, index) => (
              <button 
                key={index}
                onClick={() => setSearchQuery(faq.split(' ')[0])} // Simple search trigger
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap shadow-sm active:scale-95"
              >
                <HelpCircle size={14} className="text-blue-500" />
                {faq}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredTopics.map(topic => (
            <button key={topic.id} className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-blue-200 dark:hover:border-blue-800 transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileText size={18} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{topic.title}</div>
                  <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{topic.category}</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </button>
          ))}
          {filteredTopics.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 font-medium">No topics found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
