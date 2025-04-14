'use client';

import { useState, useEffect } from 'react';

export default function DailyQuote() {
  const [quote, setQuote] = useState({
    text: '',
    author: '',
    isLoading: true,
    error: false
  });

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('/api/quotes/random');
        if (!response.ok) {
          throw new Error('Failed to fetch quote');
        }
        const data = await response.json();
        setQuote({
          text: data.text,
          author: data.author,
          isLoading: false,
          error: false
        });
      } catch (error) {
        // Fallback to example quote if API fails
        setQuote({
          text: '"The strong person is not the one who can wrestle someone else down. The strong person is the one who can control themselves when they are angry."',
          author: 'Prophet Muhammad (peace be upon him)',
          isLoading: false,
          error: true
        });
      }
    };

    fetchQuote();
  }, []);

  if (quote.isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
        <div className="h-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md mb-3"></div>
        <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
      <blockquote className="relative">
        <svg className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-primary/10" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.7662 12.86C3.84036 12.86 3.05992 12.5533 2.42488 11.94C1.81452 11.3266 1.50934 10.4467 1.50934 9.29999C1.50934 8.07332 1.97328 6.87332 2.90116 5.69999C3.8548 4.49999 5.1496 3.55332 6.78556 2.85999L7.64764 4.25999C6.59056 4.73999 5.77044 5.27332 5.18728 5.85999C4.60412 6.44666 4.24392 7.12666 4.10668 7.89999C4.18212 7.79332 4.31668 7.68666 4.51036 7.57999C4.7296 7.47332 4.9672 7.41999 5.23316 7.41999C5.88868 7.41999 6.4388 7.64666 6.88352 8.09999C7.32824 8.55332 7.5506 9.16666 7.5506 9.93999C7.5506 10.12 7.49688 10.3 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0669 12.86 10.2865 12.5533 9.65146 11.94C9.0411 11.3266 8.73592 10.4467 8.73592 9.29999C8.73592 8.07332 9.19986 6.87332 10.1277 5.69999C11.0814 4.49999 12.3762 3.55332 14.0122 2.85999L14.8742 4.25999C13.8172 4.73999 12.997 5.27332 12.4139 5.85999C11.8307 6.44666 11.4705 7.12666 11.3333 7.89999C11.4087 7.79332 11.5432 7.68666 11.7369 7.57999C11.9562 7.47332 12.1938 7.41999 12.4598 7.41999C13.1153 7.41999 13.6654 7.64666 14.1101 8.09999C14.5548 8.55332 14.7772 9.16666 14.7772 9.93999C14.7772 10.12 14.7235 10.3 14.6242 10.3Z" fill="currentColor" />
        </svg>
        <div className="relative z-10">
          <p className="text-xl text-slate-800 dark:text-slate-200 mb-4">{quote.text}</p>
          <footer className="text-sm text-slate-500 dark:text-slate-400 italic">
            — {quote.author}
          </footer>
        </div>
      </blockquote>
    </div>
  );
}