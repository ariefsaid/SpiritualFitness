'use client';

import { useState } from 'react';
import { useQuran } from '@/hooks/use-quran';
import Link from 'next/link';

export default function QuranProgress() {
  const { currentReading, streak, isLoading } = useQuran();
  
  // Will be replaced with actual data from the API
  const lastReadSurah = currentReading?.surah || 'Al-Fatiha';
  const lastReadAyah = currentReading?.ayah || 1;
  const totalCompletions = currentReading?.completions || 0;
  const progress = currentReading?.progress || 0;
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mb-5"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mb-4"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-full w-full mb-1"></div>
            <div className="flex justify-between">
              <div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md"></div>
              <div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md"></div>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-full mb-2"></div>
              <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-full mb-2"></div>
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-poppins font-semibold mb-5">Quran Reading</h2>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="font-medium mb-1">Last Read: Surah {lastReadSurah} - Ayah {lastReadAyah}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Continue your reading journey</p>
          
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-1">
            <div className="bg-primary rounded-full h-2.5" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-1">
              <span className="text-xl font-semibold">{streak}</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Day Streak</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-1">
              <span className="text-xl font-semibold">{totalCompletions}</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Completions</span>
          </div>
          
          <Link 
            href="/quran" 
            className="flex md:hidden xl:flex items-center justify-center bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Read Now
          </Link>
        </div>
      </div>
    </div>
  );
}