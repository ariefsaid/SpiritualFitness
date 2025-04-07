import { useState } from "react";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { useFasting } from "@/hooks/use-fasting";
import { useQuran } from "@/hooks/use-quran";
import { format, isSameDay } from "date-fns";

export default function TodaysWorkout() {
  const today = new Date();
  const { prayers, isLoading: prayersLoading } = usePrayerTimes(today);
  const { fastings, isLoading: fastingLoading } = useFasting();
  const { readings, streak, isLoading: quranLoading } = useQuran();
  
  // Calculate prayer completion
  const completedPrayers = prayers.filter(p => p.status === "completed").length;
  const totalPrayers = prayers.length;
  const prayerProgress = totalPrayers > 0 ? Math.round((completedPrayers / totalPrayers) * 100) : 0;
  
  // Check if fasting today
  const isFastingToday = fastings.some(f => 
    isSameDay(new Date(f.date), today) && f.isCompleted
  );
  
  // Check if read Quran today
  const hasReadQuranToday = readings.some(r => 
    isSameDay(new Date(r.date), today)
  );
  
  // Calculate overall progress
  const totalActivities = 3; // Prayer, Fasting, Quran
  let completedActivities = 0;
  
  if (prayerProgress >= 20) completedActivities += 1; // At least one prayer
  if (isFastingToday) completedActivities += 1;
  if (hasReadQuranToday) completedActivities += 1;
  
  const overallProgress = Math.round((completedActivities / totalActivities) * 100);
  
  const isLoading = prayersLoading || fastingLoading || quranLoading;
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-6 border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-6 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-poppins font-semibold text-lg">Today's Spiritual Workout</h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">{format(today, "EEEE, MMMM d")}</span>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-medium">{overallProgress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Prayer Workout */}
        <div className={`workout-card ${prayerProgress > 0 ? 'workout-card-active' : ''}`}>
          <div className="workout-card-header">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V9L12 14L22 9V7L12 2Z" fill="currentColor" />
              <path d="M5 10.5V15.5L12 19.5L19 15.5V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 14V19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Prayer</span>
          </div>
          <div className="workout-card-progress">
            <div className="circular-progress" style={{ '--value': prayerProgress } as React.CSSProperties}>
              <div className="circular-progress-inner">
                <span>{completedPrayers}/{totalPrayers}</span>
              </div>
            </div>
          </div>
          <div className="workout-card-footer">
            {prayerProgress === 100 ? (
              <span className="workout-complete">Complete!</span>
            ) : (
              <span className="workout-remaining">{totalPrayers - completedPrayers} remaining</span>
            )}
          </div>
        </div>
        
        {/* Fasting Workout */}
        <div className={`workout-card ${isFastingToday ? 'workout-card-active' : ''}`}>
          <div className="workout-card-header">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5.5C10.8954 5.5 10 6.39543 10 7.5C10 8.60457 9.10457 9.5 8 9.5M12 5.5C13.1046 5.5 14 6.39543 14 7.5C14 8.60457 14.8954 9.5 16 9.5M12 5.5L12 14M12 14C10.8954 14 10 14.8954 10 16M12 14C13.1046 14 14 14.8954 14 16M8 19H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Fasting</span>
          </div>
          <div className="workout-card-progress">
            <div className="circular-progress" style={{ '--value': isFastingToday ? 100 : 0 } as React.CSSProperties}>
              <div className="circular-progress-inner">
                <span>{isFastingToday ? '1/1' : '0/1'}</span>
              </div>
            </div>
          </div>
          <div className="workout-card-footer">
            {isFastingToday ? (
              <span className="workout-complete">Fasting today!</span>
            ) : (
              <span className="workout-remaining">Not fasting</span>
            )}
          </div>
        </div>
        
        {/* Quran Workout */}
        <div className={`workout-card ${hasReadQuranToday ? 'workout-card-active' : ''}`}>
          <div className="workout-card-header">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Quran</span>
          </div>
          <div className="workout-card-progress">
            <div className="circular-progress" style={{ '--value': hasReadQuranToday ? 100 : 0 } as React.CSSProperties}>
              <div className="circular-progress-inner">
                <span>{hasReadQuranToday ? '1/1' : '0/1'}</span>
              </div>
            </div>
          </div>
          <div className="workout-card-footer">
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-1 text-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{streak} day streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
