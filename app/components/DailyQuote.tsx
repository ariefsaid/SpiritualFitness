'use client';

import { useState, useEffect } from 'react';

interface Quote {
  id: number;
  text: string;
  author: string;
  source: string;
  category: string;
}

export default function DailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Mark as mounted to avoid hydration mismatch
    setIsMounted(true);
    
    async function fetchQuote() {
      try {
        // Simulate API call with a fixed response
        // In production, this would fetch from an actual API endpoint
        setTimeout(() => {
          setQuote({
            id: 1,
            text: "The believers in their mutual kindness, compassion and sympathy are just like one body. When one of the limbs suffers, the whole body responds to it with wakefulness and fever.",
            author: "Prophet Muhammad",
            source: "Sahih al-Bukhari",
            category: "compassion"
          });
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setIsLoading(false);
      }
    }
    
    fetchQuote();
  }, []);
  
  // Don't render anything during server-side rendering to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (!quote) return null;
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-poppins font-semibold mb-2">Daily Inspiration</h2>
      <p className="text-slate-700 dark:text-slate-300 text-lg mb-3 leading-relaxed">
        "{quote.text}"
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary font-medium">
            {quote.author}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {quote.source}
          </p>
        </div>
        <button className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 17L17 7M7 7H17V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}