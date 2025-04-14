'use client';

import { useQuran } from '@/hooks/use-quran';

export default function QuranProgress() {
  const { readings, currentReading, isLoading } = useQuran();
  
  // Calculate the overall progress based on all readings
  const calculateOverallProgress = () => {
    if (!readings.length) return 0;
    
    // Sum up all progress values and divide by total number of surahs (114)
    const totalProgress = readings.reduce((acc, reading) => {
      return acc + reading.progress;
    }, 0);
    
    return Math.min(Math.round(totalProgress * 100) / 100, 1);
  };
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full"></div>
      </div>
    );
  }
  
  const overallProgress = calculateOverallProgress();
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-poppins font-semibold mb-1">Quran Progress</h2>
          <p className="text-slate-600 dark:text-slate-300">
            {currentReading ? (
              <>Currently reading: Surah {currentReading.surah}, Ayah {currentReading.ayah}</>
            ) : (
              <>Start your journey with the Quran today</>
            )}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <span className="text-2xl font-semibold">
            {Math.round(overallProgress * 100)}%
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
            complete
          </span>
        </div>
      </div>
      
      <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full">
        <div 
          className="bg-primary h-3 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${overallProgress * 100}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between mt-2 text-sm text-slate-500 dark:text-slate-400">
        <span>0 Surahs</span>
        <span>114 Surahs</span>
      </div>
      
      {currentReading && (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                <span className="font-medium">{currentReading.surah}</span>
              </div>
              <span className="font-medium">
                Surah {currentReading.surah === 1 ? 'Al-Fatihah' : 
                      currentReading.surah === 2 ? 'Al-Baqarah' : 
                      currentReading.surah === 3 ? 'Al-Imran' : `${currentReading.surah}`}
              </span>
            </div>
            
            <div className="mt-3 md:mt-0 flex items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400 mr-2">
                Last read: {new Date(currentReading.date).toLocaleDateString()}
              </span>
              {currentReading.bookmark && (
                <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Bookmarked
                </span>
              )}
            </div>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${currentReading.progress * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-4">
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Continue Reading
            </button>
            
            <button className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {currentReading.bookmark ? 'Remove Bookmark' : 'Add Bookmark'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}