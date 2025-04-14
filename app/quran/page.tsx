import React from 'react';
import QuranProgress from '@/components/QuranProgress';

/**
 * Quran Reading Page
 */
export default function QuranPage() {
  return (
    <div className="animate-fade-in">
      <QuranProgress />
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-poppins font-semibold mb-6">Continue Reading</h2>
        
        <div className="mb-6 quran-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Surah Al-Baqarah</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Last read: Verse 45</p>
            </div>
            <button className="mt-3 md:mt-0 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Continue Reading
            </button>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
            <p className="text-lg mb-2 arabic-text leading-loose">
              وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى ٱلْخَـٰشِعِينَ
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive [to Allah]
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Recently Read Surahs</h3>
          <div className="space-y-3">
            {['Al-Fatihah', 'Al-Imran', 'An-Nisa'].map((surah, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                    <span className="font-medium">{index + 1}</span>
                  </div>
                  <span className="font-medium">Surah {surah}</span>
                </div>
                <button className="text-primary hover:text-primary-dark text-sm font-medium">
                  Read
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Bookmarks</h3>
          <div className="space-y-3">
            {['Ar-Rahman (55:26)', 'Ya-Sin (36:12)'].map((bookmark, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-medium">{bookmark}</span>
                </div>
                <button className="text-primary hover:text-primary-dark text-sm font-medium">
                  Go to
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}