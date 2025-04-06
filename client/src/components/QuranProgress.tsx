import { useState } from "react";
import { useQuran } from "@/hooks/use-quran";
import { Link } from "wouter";
import { format, differenceInDays, isSameDay, subDays } from "date-fns";

export default function QuranProgress() {
  const { currentReading, readings, streak, createReading, isLoading } = useQuran();
  
  // Calculate reading stats
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const lastWeekReadings = weekdays.map((day, index) => {
    const date = subDays(today, 6 - index);
    return {
      day,
      date,
      read: readings.some(r => isSameDay(new Date(r.date), date))
    };
  });
  
  const totalPages = readings.reduce((sum, reading) => sum + ((reading.timeSpent || 0) / 5), 0);
  const totalMinutes = readings.reduce((sum, reading) => sum + (reading.timeSpent || 0), 0);
  
  // Format surah name
  const getSurahName = (surahNumber: number) => {
    const surahNames = [
      "Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", 
      "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", 
      // ... add more surah names as needed
    ];
    return surahNames[surahNumber - 1] || `Surah ${surahNumber}`;
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-poppins font-semibold">Quran Reading</h2>
        <Link href="/quran">
          <a className="text-primary hover:text-primary/80 text-sm font-medium">
            View All 
            <svg className="h-4 w-4 inline-block ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-6 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
            <h3 className="font-poppins font-semibold text-lg mb-3">Current Surah</h3>
            {currentReading ? (
              <div className="quran-card mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{getSurahName(currentReading.surahNumber)}</span>
                  <span className="text-xs bg-white dark:bg-slate-700 px-2 py-1 rounded-full">
                    Juz {Math.ceil(currentReading.surahNumber / 6)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  You're on verse {currentReading.lastReadVerse} of {currentReading.totalVerses}
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ width: `${(currentReading.lastReadVerse / currentReading.totalVerses) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="quran-card mb-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  You haven't started reading Quran yet. Begin your journey today!
                </p>
              </div>
            )}
            <Link href="/quran">
              <a className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-3 font-medium transition flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {currentReading ? "Continue Reading" : "Start Reading"}
              </a>
            </Link>
          </div>
          <div className="md:w-2/3 md:pl-6 md:border-l border-slate-200 dark:border-slate-700">
            <h3 className="font-poppins font-semibold text-lg mb-3">Reading Streak</h3>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {lastWeekReadings.map((day, index) => (
                <div key={index} className="text-center">
                  <div className={`${day.read ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'} rounded-md py-2 mb-1`}>
                    {day.read ? (
                      <svg className="h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <div>
                <span className="font-medium text-2xl">{streak}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">day streak</span>
              </div>
              <div>
                <span className="font-medium text-2xl">{Math.round(totalPages)}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">pages read</span>
              </div>
              <div>
                <span className="font-medium text-2xl">{totalMinutes}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">minutes</span>
              </div>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <svg className="h-5 w-5 mr-2 text-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.2718 10.445L18 2L9.87879 6.5L5.46667 5.46667L2 14.5L11.4545 11.0833L14.2718 10.445Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Reading Challenge
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Complete the Quran in 30 days</p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                <div className="bg-accent rounded-full h-2" style={{ width: "40%" }}></div>
              </div>
              <p className="text-xs text-right text-slate-500 dark:text-slate-400">12/30 days completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
