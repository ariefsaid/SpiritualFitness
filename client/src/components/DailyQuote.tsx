import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "@shared/schema";

export default function DailyQuote() {
  const { data: quote, isLoading, error } = useQuery<Quote>({
    queryKey: ['/api/quotes/random'],
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm mb-6 border-l-4 border-accent animate-pulse">
        <div className="flex items-start">
          <div className="text-accent text-3xl mr-4 mt-1">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 11H13V14H10V11Z" fill="currentColor" />
              <path d="M8 9V15H16V9H8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 19.0003C5.33333 17.6667 3 14.0003 3 10.0003C3 5.8333 5.6 3.6 7 3C7.33333 6.73333 9.33333 8.40033 11 9.00033M17 3C17.8 4.6 19.3333 6.67033 21 9.00033C21 12.6703 19.6667 16.3367 17 19.0003M8 19.0003H16M12 9.00033V19.0003" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm mb-6 border-l-4 border-red-500">
        <div className="flex items-start">
          <div className="text-red-500 text-3xl mr-4 mt-1">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">
              Unable to load daily quote. Please check your connection and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm mb-6 border-l-4 border-accent">
      <div className="flex items-start">
        <div className="text-accent text-3xl mr-4 mt-1">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 11H13V14H10V11Z" fill="currentColor" />
            <path d="M8 9V15H16V9H8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 19.0003C5.33333 17.6667 3 14.0003 3 10.0003C3 5.8333 5.6 3.6 7 3C7.33333 6.73333 9.33333 8.40033 11 9.00033M17 3C17.8 4.6 19.3333 6.67033 21 9.00033C21 12.6703 19.6667 16.3367 17 19.0003M8 19.0003H16M12 9.00033V19.0003" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-lg italic text-slate-600 dark:text-slate-300 mb-2">
            "{quote.english}"
          </p>
          <p className="arabic-text text-lg mb-2">{quote.arabic}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">— {quote.source}</p>
        </div>
      </div>
    </div>
  );
}
